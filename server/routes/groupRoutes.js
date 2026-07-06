const express = require('express');
const router = express.Router();
const {
  createGroup,
  joinGroup,
  getGroup,
  getMyGroups,
  setBook,
} = require('../controllers/groupController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createGroup);
router.post('/join', protect, joinGroup);
router.get('/my', protect, getMyGroups);
router.get('/:id', protect, getGroup);
router.patch('/:id/book', protect, setBook);

module.exports = router;
