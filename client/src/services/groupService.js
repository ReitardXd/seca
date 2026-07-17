import axios from 'axios'

const API = import.meta.env.VITE_API_URL

export const createGroup = async (groupData) => {
  const { data } = await axios.post(`${API}/api/groups`, groupData)
  return data
}

export const joinGroup = async (inviteCode) => {
  const { data } = await axios.post(`${API}/api/groups/join`, { inviteCode })
  return data
}

export const getMyGroups = async () => {
  const { data } = await axios.get(`${API}/api/groups/my`)
  return data
}

export const getGroup = async (id) => {
  const { data } = await axios.get(`${API}/api/groups/${id}`)
  return data
}

export const setBook = async (groupId, bookId) => {
  const { data } = await axios.patch(`${API}/api/groups/${groupId}/book`, { bookId })
  return data
}
