const mongoose = require('mongoose')

const quizSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  questions: [
    {
      question: String,
      options: [String],
      answer: String,
    },
  ],
  submitted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now, expires: 60 * 60 }, // TTL: auto-delete after 1 hour
})

module.exports = mongoose.model('Quiz', quizSchema)
