const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    openLibraryId: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
    },
    cover: {
      type: String,
    },
    year: {
      type: Number,
    },
    pages: {
      type: Number,
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Book', bookSchema);
