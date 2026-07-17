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
