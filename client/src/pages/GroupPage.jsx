import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getGroup, setBook } from '../services/groupService'
import { getGroupProgress, updateProgress } from '../services/progressService'
import { searchBooks } from '../services/bookService'

const GroupPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [group, setGroup] = useState(null)
  const [progress, setProgress] = useState([])
  const [loading, setLoading] = useState(true)
  const [showBookSearch, setShowBookSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [showProgressUpdate, setShowProgressUpdate] = useState(false)
  const [pagesRead, setPagesRead] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    fetchGroup()
    fetchProgress()
  }, [id])

  const fetchGroup = async () => {
    try {
      const data = await getGroup(id)
      setGroup(data)
    } catch (err) {
      setError('Failed to load group')
    } finally {
      setLoading(false)
    }
  }

  const fetchProgress = async () => {
    try {
      const data = await getGroupProgress(id)
      setProgress(data)
    } catch (err) {
      console.error('No progress yet')
    }
  }

  const handleBookSearch = async () => {
    if (!searchQuery) return
    setSearching(true)
    try {
      const results = await searchBooks(searchQuery)
      setSearchResults(results)
    } catch (err) {
      setError('Failed to search books')
    } finally {
      setSearching(false)
    }
  }

  const handleSetBook = async (book) => {
    try {
      // First cache the book in DB
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/books/${book.openLibraryId.replace('/works/', '')}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      )
      const cachedBook = await response.json()
      await setBook(id, cachedBook._id)
      setShowBookSearch(false)
      fetchGroup()
    } catch (err) {
      setError('Failed to set book')
    }
  }

  const handleUpdateProgress = async () => {
    if (!pagesRead || !group.book) return
    try {
      await updateProgress({
        groupId: id,
        bookId: group.book._id,
        pagesRead: parseInt(pagesRead),
      })
      setShowProgressUpdate(false)
      fetchProgress()
    } catch (err) {
      setError('Failed to update progress')
    }
  }

  const getProgressPercent = (pagesRead) => {
    if (!group?.book?.pages) return 0
    return Math.min(Math.round((pagesRead / group.book.pages) * 100), 100)
  }

  if (loading) return <div className="p-8 text-white">Loading...</div>
  if (!group) return <div className="p-8 text-white">Group not found</div>

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate('/dashboard')}
          className="text-gray-400 hover:text-white transition"
        >
          ← Back
        </button>
        <div>
          <h1 className="text-3xl font-bold">{group.name}</h1>
          <p className="text-gray-400 text-sm mt-1">
            Invite code: <span className="font-mono text-indigo-400">{group.inviteCode}</span>
          </p>
        </div>
      </div>

      {error && <p className="text-red-400 mb-4">{error}</p>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left — Book */}
        <div className="lg:col-span-1">
          <div className="bg-gray-900 rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">Current Book</h2>
            {group.book ? (
              <div>
                {group.book.cover && (
                  <img
                    src={group.book.cover}
                    alt={group.book.title}
                    className="w-32 rounded-lg mb-4"
                  />
                )}
                <p className="font-medium">{group.book.title}</p>
                <p className="text-gray-400 text-sm">{group.book.author}</p>
                {group.book.pages && (
                  <p className="text-gray-500 text-xs mt-1">{group.book.pages} pages</p>
                )}
                <button
                  onClick={() => setShowProgressUpdate(!showProgressUpdate)}
                  className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg text-sm transition"
                >
                  Update My Progress
                </button>
                {showProgressUpdate && (
                  <div className="mt-3">
                    <input
                      type="number"
                      placeholder="Pages read"
                      value={pagesRead}
                      onChange={(e) => setPagesRead(e.target.value)}
                      className="w-full bg-gray-800 rounded-lg px-4 py-2 mb-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      onClick={handleUpdateProgress}
                      className="w-full bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-sm transition"
                    >
                      Save
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <p className="text-gray-500 text-sm mb-4">No book selected yet</p>
                <button
                  onClick={() => setShowBookSearch(!showBookSearch)}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg text-sm transition"
                >
                  Select a Book
                </button>
              </div>
            )}

            {/* Book Search */}
            {showBookSearch && (
              <div className="mt-4">
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    placeholder="Search books..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleBookSearch()}
                    className="flex-1 bg-gray-800 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    onClick={handleBookSearch}
                    className="bg-indigo-600 hover:bg-indigo-700 px-3 py-2 rounded-lg text-sm transition"
                  >
                    {searching ? '...' : 'Go'}
                  </button>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {searchResults.map((book) => (
                    <div
                      key={book.openLibraryId}
                      onClick={() => handleSetBook(book)}
                      className="flex gap-3 bg-gray-800 hover:bg-gray-700 rounded-lg p-2 cursor-pointer transition"
                    >
                      {book.cover && (
                        <img src={book.cover} alt={book.title} className="w-10 rounded" />
                      )}
                      <div>
                        <p className="text-sm font-medium">{book.title}</p>
                        <p className="text-xs text-gray-400">{book.author}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right — Members + Progress */}
        <div className="lg:col-span-2">
          <div className="bg-gray-900 rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-6">Members</h2>
            <div className="space-y-5">
              {group.members.map((member) => {
                const memberProgress = progress.find(
                  (p) => p.user._id === member.user._id
                )
                const percent = memberProgress
                  ? getProgressPercent(memberProgress.pagesRead)
                  : 0

                return (
                  <div key={member.user._id}>
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center gap-3">
                        {member.user.avatar && (
                          <img
                            src={member.user.avatar}
                            alt={member.user.name}
                            className="w-8 h-8 rounded-full"
                          />
                        )}
                        <span className="text-sm font-medium">{member.user.name}</span>
                        {member.role === 'admin' && (
                          <span className="text-xs text-indigo-400 bg-indigo-900 px-2 py-0.5 rounded-full">
                            admin
                          </span>
                        )}
                      </div>
                      <span className="text-sm text-gray-400">
                        {memberProgress ? `${memberProgress.pagesRead} pages` : 'Not started'}
                      </span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div
                        className="bg-indigo-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{percent}% complete</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Quiz Button */}
          {group.book && (
            <div className="mt-4">
              <button
                onClick={() => navigate(`/quiz/${id}`)}
                className="w-full bg-purple-600 hover:bg-purple-700 px-4 py-3 rounded-xl text-sm font-medium transition"
              >
                🧠 Take a Quiz
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default GroupPage
