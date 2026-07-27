import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useEffect } from 'react'

const Home = () => {
  const navigate = useNavigate()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard')
    }
  }, [user, loading])

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center px-6">
      <div className="max-w-lg w-full text-center">
        <h1 className="text-5xl font-bold mb-4 tracking-tight">Seca</h1>
        <p className="text-gray-400 text-lg mb-2">
          Read together. Compete together.
        </p>
        <p className="text-gray-600 text-sm mb-10">
          Join a reading group, track your progress, and challenge your friends with AI-generated quizzes.
        </p>
        <button
          onClick={() => navigate('/login')}
          className="bg-indigo-600 hover:bg-indigo-700 px-8 py-3 rounded-xl text-sm font-medium transition"
        >
          Get Started
        </button>
      </div>
    </div>
  )
}

export default Home
