const express = require('express');
const router = express.Router();
const {
  updateProgress,
  getGroupProgress,
  getMyProgress,
} = require('../controllers/progressController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, updateProgress);
router.get('/group/:groupId', protect, getGroupProgress);
router.get('/me/:groupId', protect, getMyProgress);

module.exports = router;
