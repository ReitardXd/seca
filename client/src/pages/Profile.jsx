import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Profile = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  if (!user) return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
      <p>Loading...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8 max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate('/dashboard')}
          className="text-gray-400 hover:text-white transition"
        >
          ← Back
        </button>
        <h1 className="text-3xl font-bold">Profile</h1>
      </div>

      <div className="bg-gray-900 rounded-xl p-8 flex flex-col items-center text-center">
        {user.avatar && (
          <img
            src={user.avatar}
            alt={user.name}
            className="w-24 h-24 rounded-full mb-4"
          />
        )}
        <h2 className="text-2xl font-bold mb-1">{user.name}</h2>
        <p className="text-gray-400 text-sm mb-6">{user.email}</p>

        <div className="flex gap-6 mb-8">
          <div className="text-center">
            <p className="text-2xl font-bold text-indigo-400">{user.streak || 0}</p>
            <p className="text-gray-500 text-xs mt-1">day streak</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-indigo-400">{user.friends?.length || 0}</p>
            <p className="text-gray-500 text-xs mt-1">friends</p>
          </div>
        </div>

        <button
          onClick={() => { logout(); navigate('/login') }}
          className="bg-red-900/40 hover:bg-red-900/60 border border-red-700/40 px-6 py-2 rounded-lg text-sm text-red-400 transition"
        >
          Logout
        </button>
      </div>
    </div>
  )
}

export default Profile
