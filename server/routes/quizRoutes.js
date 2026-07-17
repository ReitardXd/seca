const express = require('express')
const router = express.Router()
const { getQuiz, submitQuiz, getLeaderboard } = require('../controllers/quizController')
const { protect } = require('../middleware/authMiddleware')

router.get('/:groupId', protect, getQuiz)
router.post('/submit', protect, submitQuiz)
router.get('/:groupId/leaderboard', protect, getLeaderboard)

module.exports = router
