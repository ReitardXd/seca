const mongoose = require('mongoose')
const { generateQuiz } = require('../services/claudeService')
const QuizResult = require('../models/QuizResult')
const Quiz = require('../models/Quiz')
const Group = require('../models/Group')

const isMember = (group, userId) =>
  group.members.some((m) => m.user.toString() === userId.toString())

const getQuiz = async (req, res) => {
  const { groupId } = req.params
  const { topic, count } = req.query

  const group = await Group.findById(groupId).populate('book')
  if (!group) return res.status(404).json({ message: 'Group not found' })
  if (!isMember(group, req.user._id)) {
    return res.status(403).json({ message: 'Not a member of this group' })
  }
  if (!group.book) {
    return res.status(400).json({ message: 'No book set for this group' })
  }

  const questionCount = Math.min(Math.max(parseInt(count) || 5, 3), 15)

  const questions = await generateQuiz(
    group.book.title,
    group.book.author || 'Unknown',
    topic || '',
    questionCount
  )

  const quiz = await Quiz.create({
    user: req.user._id,
    group: groupId,
    book: group.book._id,
    questions,
  })

  // Never send answers to the client
  res.json({
    quizId: quiz._id,
    book: group.book.title,
    questions: questions.map(({ question, options }) => ({ question, options })),
  })
}

const submitQuiz = async (req, res) => {
  const { quizId, answers } = req.body

  if (!mongoose.isValidObjectId(quizId) || !Array.isArray(answers)) {
    return res.status(400).json({ message: 'quizId and answers are required' })
  }

  // Atomic: a quiz can only be submitted once, only by the user who requested it
  const quiz = await Quiz.findOneAndUpdate(
    { _id: quizId, user: req.user._id, submitted: false },
    { submitted: true },
    { new: true }
  )

  if (!quiz) {
    return res
      .status(404)
      .json({ message: 'Quiz not found, expired, or already submitted' })
  }

  let score = 0
  const results = quiz.questions.map((q, i) => {
    const isCorrect = answers[i] === q.answer
    if (isCorrect) score++
    return {
      question: q.question,
      selected: answers[i] || null,
      correct: q.answer,
      isCorrect,
    }
  })

  const quizResult = await QuizResult.create({
    user: req.user._id,
    group: quiz.group,
    book: quiz.book,
    score,
    total: quiz.questions.length,
    answers: results,
  })

  res.json({
    score,
    total: quiz.questions.length,
    results,
    quizResultId: quizResult._id,
  })
}

const getLeaderboard = async (req, res) => {
  const { groupId } = req.params

  const group = await Group.findById(groupId)
  if (!group) return res.status(404).json({ message: 'Group not found' })
  if (!isMember(group, req.user._id)) {
    return res.status(403).json({ message: 'Not a member of this group' })
  }

  const results = await QuizResult.find({ group: groupId })
    .populate('user', 'name avatar')
    .sort({ score: -1 })

  res.json(results)
}

module.exports = { getQuiz, submitQuiz, getLeaderboard }
