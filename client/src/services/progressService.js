import axios from 'axios'

const API = import.meta.env.VITE_API_URL

export const updateProgress = async (progressData) => {
  const { data } = await axios.post(`${API}/api/progress`, progressData)
  return data
}

export const getGroupProgress = async (groupId) => {
  const { data } = await axios.get(`${API}/api/progress/group/${groupId}`)
  return data
}

export const getMyProgress = async (groupId) => {
  const { data } = await axios.get(`${API}/api/progress/me/${groupId}`)
  return data
}
