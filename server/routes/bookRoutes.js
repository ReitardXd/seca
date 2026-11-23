const express = require('express');
const router = express.Router();
const { search, getBook, cacheBook } = require('../controllers/bookController');
const { protect } = require('../middleware/authMiddleware');

// GET /api/books/search?q=dune
router.get('/search', protect, search);

// POST /api/books
router.post('/', protect, cacheBook);

// GET /api/books/:id
router.get('/:id', protect, getBook);

module.exports = router;
