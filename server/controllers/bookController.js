const Book = require('../models/Book');
const { searchBooks, getBookById } = require('../services/openLibraryService');

// Search books via Open Library
const search = async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ message: 'Query parameter q is required' });
  }

  const results = await searchBooks(q);
  res.json(results);
};

// Get single book detail and cache in DB
const getBook = async (req, res) => {
  const { id } = req.params;

  // Check if already cached in DB
  let book = await Book.findOne({ openLibraryId: `/works/${id}` });

  if (!book) {
    const data = await getBookById(id);
    book = await Book.create(data);
  }

  res.json(book);
};

module.exports = { search, getBook };
