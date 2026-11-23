import axios from 'axios'

const API = import.meta.env.VITE_API_URL

export const searchBooks = async (query) => {
  const { data } = await axios.get(`${API}/api/books/search?q=${query}`)
  return data
}

export const getBook = async (id) => {
  const { data } = await axios.get(`${API}/api/books/${id}`)
  return data
}

export const cacheBook = async (book) => {
  const { data } = await axios.post(`${API}/api/books`, book)
  return data
}
