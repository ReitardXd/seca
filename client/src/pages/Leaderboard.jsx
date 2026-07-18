import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL

const Leaderboard = () => {
  const { groupId } = useParams()
  const navigate = useNavigate()
  const [results, setResults] = useState([])
  const [group, setGroup] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchData()
  }, [groupId])

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token')
      const headers = { Authorization: `Bearer ${token}` }

      const [leaderboardRes, groupRes] = await Promise.all([
        axios.get(`${API}/api/quiz/${groupId}/leaderboard`, { headers }),
        axios.get(`${API}/api/groups/${groupId}`, { headers }),
      ])

      setResults(leaderboardRes.data)
      setGroup(groupRes.data)
    } catch (err) {
      setError('Failed to load leaderboard')
    } finally {
      setLoading(false)
    }
  }

  const getMedal = (index) => {
    if (index === 0) return '🥇'
    if (index === 1) return '🥈'
    if (index === 2) return '🥉'
    return `#${index + 1}`
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
      <p>Loading leaderboard...</p>
    </div>
  )

  if (error) return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
      <p className="text-red-400">{error}</p>
    </div>
  )

  // Aggregate scores by user
  const aggregated = results.reduce((acc, result) => {
    const userId = result.user._id
    if (!acc[userId]) {
      acc[userId] = {
        user: result.user,
        totalScore: 0,
        totalQuizzes: 0,
        bestScore: 0,
      }
    }
    acc[userId].totalScore += result.score
    acc[userId].totalQuizzes += 1
    acc[userId].bestScore = Math.max(acc[userId].bestScore, result.score)
    return acc
  }, {})

  const ranked = Object.values(aggregated).sort(
    (a, b) => b.totalScore - a.totalScore
  )

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8 max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate(`/group/${groupId}`)}
          className="text-gray-400 hover:text-white transition"
        >
          ← Back
        </button>
        <div>
          <h1 className="text-3xl font-bold">Leaderboard</h1>
          {group && <p className="text-gray-400 text-sm mt-1">{group.name}</p>}
        </div>
      </div>

      {ranked.length === 0 ? (
        <div className="text-center text-gray-500 mt-20">
          <p className="text-lg">No quiz results yet</p>
          <p className="text-sm mt-1">Take a quiz to appear on the leaderboard</p>
          <button
            onClick={() => navigate(`/quiz/${groupId}`)}
            className="mt-6 bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-xl text-sm transition"
          >
            Take a Quiz
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {ranked.map((entry, index) => (
            <div
              key={entry.user._id}
              className={`flex items-center gap-4 rounded-xl p-4 ${
                index === 0
                  ? 'bg-yellow-900/20 border border-yellow-700/40'
                  : index === 1
                  ? 'bg-gray-700/20 border border-gray-600/40'
                  : index === 2
                  ? 'bg-orange-900/20 border border-orange-700/40'
                  : 'bg-gray-900'
              }`}
            >
              <span className="text-2xl w-8 text-center">{getMedal(index)}</span>
              {entry.user.avatar && (
                <img
                  src={entry.user.avatar}
                  alt={entry.user.name}
                  className="w-10 h-10 rounded-full"
                />
              )}
              <div className="flex-1">
                <p className="font-medium">{entry.user.name}</p>
                <p className="text-gray-400 text-xs">
                  {entry.totalQuizzes} quiz{entry.totalQuizzes !== 1 ? 'zes' : ''} taken · Best: {entry.bestScore}/5
                </p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-indigo-400">{entry.totalScore}</p>
                <p className="text-gray-500 text-xs">total pts</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Leaderboard
