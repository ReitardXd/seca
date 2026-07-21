import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getMyGroups, createGroup, joinGroup } from '../services/groupService'

const Dashboard = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [showJoin, setShowJoin] = useState(false)
  const [groupName, setGroupName] = useState('')
  const [targetDate, setTargetDate] = useState('')
  const [inviteCode, setInviteCode] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    fetchGroups()
  }, [])

  const fetchGroups = async () => {
    try {
      const data = await getMyGroups()
      setGroups(data)
    } catch (err) {
      setError('Failed to fetch groups')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateGroup = async () => {
    if (!groupName) return
    try {
      const newGroup = await createGroup({ name: groupName, targetDate })
      setGroups([...groups, newGroup])
      setShowCreate(false)
      setGroupName('')
      setTargetDate('')
    } catch (err) {
      setError('Failed to create group')
    }
  }

  const handleJoinGroup = async () => {
    if (!inviteCode) return
    try {
      const group = await joinGroup(inviteCode)
      setGroups([...groups, group])
      setShowJoin(false)
      setInviteCode('')
    } catch (err) {
      setError('Failed to join group')
    }
  }

  if (loading) return <div className="p-8 text-white">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold">Hey, {user?.name?.split(' ')[0]} 👋</h1>
          <p className="text-gray-400 mt-1">Your reading groups</p>
        </div>
        <div className="flex items-center gap-4">
    <button
      onClick={() => navigate('/profile')}
      className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition"
    >
      {user?.avatar && (
        <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
      )}
      Profile
    </button>
  </div>
      </div>

      {error && <p className="text-red-400 mb-4">{error}</p>}

      {/* Action Buttons */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => { setShowCreate(true); setShowJoin(false) }}
          className="bg-indigo-600 hover:bg-indigo-700 px-5 py-2 rounded-lg text-sm font-medium transition"
        >
          + Create Group
        </button>
        <button
          onClick={() => { setShowJoin(true); setShowCreate(false) }}
          className="bg-gray-800 hover:bg-gray-700 px-5 py-2 rounded-lg text-sm font-medium transition"
        >
          Join Group
        </button>
      </div>

      {/* Create Group Form */}
      {showCreate && (
        <div className="bg-gray-900 rounded-xl p-6 mb-6 max-w-md">
          <h2 className="text-lg font-semibold mb-4">Create a Group</h2>
          <input
            type="text"
            placeholder="Group name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="w-full bg-gray-800 rounded-lg px-4 py-2 mb-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            className="w-full bg-gray-800 rounded-lg px-4 py-2 mb-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <div className="flex gap-3">
            <button
              onClick={handleCreateGroup}
              className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg text-sm transition"
            >
              Create
            </button>
            <button
              onClick={() => setShowCreate(false)}
              className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Join Group Form */}
      {showJoin && (
        <div className="bg-gray-900 rounded-xl p-6 mb-6 max-w-md">
          <h2 className="text-lg font-semibold mb-4">Join a Group</h2>
          <input
            type="text"
            placeholder="Enter invite code"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value)}
            className="w-full bg-gray-800 rounded-lg px-4 py-2 mb-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <div className="flex gap-3">
            <button
              onClick={handleJoinGroup}
              className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg text-sm transition"
            >
              Join
            </button>
            <button
              onClick={() => setShowJoin(false)}
              className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Groups List */}
      {groups.length === 0 ? (
        <div className="text-gray-500 mt-10 text-center">
          <p className="text-lg">No groups yet</p>
          <p className="text-sm mt-1">Create one or join with an invite code</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {groups.map((group) => (
            <div
              key={group._id}
              onClick={() => navigate(`/group/${group._id}`)}
              className="bg-gray-900 hover:bg-gray-800 rounded-xl p-5 cursor-pointer transition"
            >
              <h3 className="font-semibold text-lg mb-1">{group.name}</h3>
              <p className="text-gray-400 text-sm">
                {group.members.length} member{group.members.length !== 1 ? 's' : ''}
              </p>
              {group.book && (
                <p className="text-indigo-400 text-sm mt-2">📖 {group.book.title}</p>
              )}
              {group.targetDate && (
                <p className="text-gray-500 text-xs mt-1">
                  Target: {new Date(group.targetDate).toLocaleDateString()}
                </p>
              )}
              <p className="text-gray-600 text-xs mt-3 font-mono">
                Invite: {group.inviteCode}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Dashboard
