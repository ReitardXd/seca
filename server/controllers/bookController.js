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

const cacheBook = async (req, res) => {
  const { openLibraryId, title, author, cover, year, pages } = req.body

  if (!openLibraryId || !title) {
    return res.status(400).json({ message: 'openLibraryId and title are required' })
  }

  let description
  try {
    const details = await getBookById(openLibraryId)
    description = details.description
  } catch (e) {
    // description is optional
  }

  const book = await Book.findOneAndUpdate(
    { openLibraryId },
    { $set: { title, author, cover, year, pages, ...(description && { description }) } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  )

  res.json(book)
}

module.exports = { search, getBook, cacheBook };
