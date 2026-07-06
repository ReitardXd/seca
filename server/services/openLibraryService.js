const axios = require('axios');

const OPEN_LIBRARY_URL = 'https://openlibrary.org';

const searchBooks = async (query) => {
  const response = await axios.get(`${OPEN_LIBRARY_URL}/search.json`, {
    params: {
      q: query,
      limit: 10,
      fields: 'key,title,author_name,cover_i,first_publish_year,number_of_pages_median',
    },
  });

  return response.data.docs.map((book) => ({
    openLibraryId: book.key,
    title: book.title,
    author: book.author_name?.[0] || 'Unknown',
    cover: book.cover_i
      ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
      : null,
    year: book.first_publish_year,
    pages: book.number_of_pages_median || null,
  }));
};

const getBookById = async (openLibraryId) => {
  const id = openLibraryId.replace('/works/', '');
  const response = await axios.get(`${OPEN_LIBRARY_URL}/works/${id}.json`);
  const data = response.data;

  return {
    openLibraryId: data.key,
    title: data.title,
    description:
      typeof data.description === 'string'
        ? data.description
        : data.description?.value || 'No description available',
    covers: data.covers?.map(
      (id) => `https://covers.openlibrary.org/b/id/${id}-M.jpg`
    ),
  };
};

module.exports = { searchBooks, getBookById };
