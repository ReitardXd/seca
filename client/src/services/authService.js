import axios from 'axios'

const API = import.meta.env.VITE_API_URL

export const getMe = async () => {
  const { data } = await axios.get(`${API}/api/auth/me`)
  return data
}
