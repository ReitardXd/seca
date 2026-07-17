const { generateQuiz } = require('../services/claudeService')
const QuizResult = require('../models/QuizResult')
const Group = require('../models/Group')

const getQuiz = async (req, res) => {
  const { groupId } = req.params
  const { topic } = req.query

  const group = await Group.findById(groupId).populate('book')

  if (!group) {
    return res.status(404).json({ message: 'Group not found' })
  }

  if (!group.book) {
    return res.status(400).json({ message: 'No book set for this group' })
  }

  const questions = await generateQuiz(
    group.book.title,
    group.book.author || 'Unknown',
    topic || ''
  )

  res.json({ questions, book: group.book.title })
}

const submitQuiz = async (req, res) => {
  const { groupId, answers, questions } = req.body

  const group = await Group.findById(groupId).populate('book')

  if (!group) {
    return res.status(404).json({ message: 'Group not found' })
  }

  let score = 0
  const results = questions.map((q, i) => {
    const correct = answers[i] === q.answer
    if (correct) score++
    return {
      question: q.question,
      selected: answers[i],
      correct: q.answer,
      isCorrect: correct,
    }
  })

  const quizResult = await QuizResult.create({
    user: req.user._id,
    group: groupId,
    book: group.book._id,
    score,
    total: questions.length,
    answers: results,
  })

  res.json({ score, total: questions.length, results, quizResultId: quizResult._id })
}

const getLeaderboard = async (req, res) => {
  const { groupId } = req.params

  const results = await QuizResult.find({ group: groupId })
    .populate('user', 'name avatar')
    .sort({ score: -1 })

  res.json(results)
}

module.exports = { getQuiz, submitQuiz, getLeaderboard }
