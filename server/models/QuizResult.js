const mongoose = require('mongoose')

const quizResultSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Group',
      required: true,
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    answers: [
      {
        question: String,
        selected: String,
        correct: String,
        isCorrect: Boolean,
      },
    ],
  },
  { timestamps: true }
)

module.exports = mongoose.model('QuizResult', quizResultSchema)
