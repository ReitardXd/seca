import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import GroupPage from './pages/GroupPage'
import BookSearch from './pages/BookSearch'
import QuizPage from './pages/QuizPage'
import Leaderboard from './pages/Leaderboard'
import Profile from './pages/Profile'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/group/:id" element={<GroupPage />} />
        <Route path="/books" element={<BookSearch />} />
        <Route path="/quiz/:groupId" element={<QuizPage />} />
        <Route path="/leaderboard/:groupId" element={<Leaderboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/auth/success" element={<Login />} />
      </Routes>
    </Router>
  )
}

export default App
