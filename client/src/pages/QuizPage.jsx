import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL

const QuizPage = () => {
  const { groupId } = useParams()
  const navigate = useNavigate()
  const [quiz, setQuiz] = useState(null)
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState([])
  const [selected, setSelected] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchQuiz()
  }, [groupId])

  const fetchQuiz = async () => {
    try {
      const token = localStorage.getItem('token')
      const { data } = await axios.get(`${API}/api/quiz/${groupId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setQuiz(data)
    } catch (err) {
      setError('Failed to load quiz')
    } finally {
      setLoading(false)
    }
  }

  const handleSelect = (option) => {
    setSelected(option)
  }

  const handleNext = () => {
    if (!selected) return
    const newAnswers = [...answers, selected]
    setAnswers(newAnswers)
    setSelected(null)

    if (current + 1 < quiz.questions.length) {
      setCurrent(current + 1)
    } else {
      handleSubmit(newAnswers)
    }
  }

  const handleSubmit = async (finalAnswers) => {
    setSubmitting(true)
    try {
      const token = localStorage.getItem('token')
      const { data } = await axios.post(
        `${API}/api/quiz/submit`,
        {
          groupId,
          answers: finalAnswers,
          questions: quiz.questions,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setResult(data)
    } catch (err) {
      setError('Failed to submit quiz')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
      <p>Generating quiz...</p>
    </div>
  )

  if (error) return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
      <p className="text-red-400">{error}</p>
    </div>
  )

  if (submitting) return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
      <p>Submitting...</p>
    </div>
  )

  // Results screen
  if (result) return (
    <div className="min-h-screen bg-gray-950 text-white p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Quiz Complete!</h1>
      <p className="text-gray-400 mb-8">{quiz.book}</p>

      <div className="bg-gray-900 rounded-xl p-6 mb-6 text-center">
        <p className="text-6xl font-bold text-indigo-400 mb-2">
          {result.score}/{result.total}
        </p>
        <p className="text-gray-400">
          {result.score === result.total
            ? '🎉 Perfect score!'
            : result.score >= result.total / 2
            ? '👍 Good job!'
            : '📖 Keep reading!'}
        </p>
      </div>

      <div className="space-y-4 mb-8">
        {result.results.map((r, i) => (
          <div
            key={i}
            className={`rounded-xl p-4 ${r.isCorrect ? 'bg-green-900/30 border border-green-700' : 'bg-red-900/30 border border-red-700'}`}
          >
            <p className="text-sm font-medium mb-2">{r.question}</p>
            <p className="text-xs text-gray-400">Your answer: <span className={r.isCorrect ? 'text-green-400' : 'text-red-400'}>{r.selected}</span></p>
            {!r.isCorrect && (
              <p className="text-xs text-gray-400">Correct: <span className="text-green-400">{r.correct}</span></p>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => navigate(`/group/${groupId}`)}
          className="flex-1 bg-gray-800 hover:bg-gray-700 px-4 py-3 rounded-xl text-sm transition"
        >
          Back to Group
        </button>
        <button
          onClick={() => {
            setQuiz(null)
            setResult(null)
            setAnswers([])
            setCurrent(0)
            setSelected(null)
            setLoading(true)
            fetchQuiz()
          }}
          className="flex-1 bg-indigo-600 hover:bg-indigo-700 px-4 py-3 rounded-xl text-sm transition"
        >
          Try Again
        </button>
      </div>
    </div>
  )

  const question = quiz.questions[current]

  // Quiz screen
  return (
    <div className="min-h-screen bg-gray-950 text-white p-8 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={() => navigate(`/group/${groupId}`)}
          className="text-gray-400 hover:text-white transition"
        >
          ← Back
        </button>
        <p className="text-gray-400 text-sm">{quiz.book}</p>
        <p className="text-gray-400 text-sm">{current + 1}/{quiz.questions.length}</p>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-800 rounded-full h-1.5 mb-8">
        <div
          className="bg-indigo-500 h-1.5 rounded-full transition-all duration-300"
          style={{ width: `${((current) / quiz.questions.length) * 100}%` }}
        />
      </div>

      <h2 className="text-xl font-semibold mb-6">{question.question}</h2>

      <div className="space-y-3 mb-8">
        {question.options.map((option) => (
          <button
            key={option}
            onClick={() => handleSelect(option)}
            className={`w-full text-left px-5 py-4 rounded-xl text-sm transition border ${
              selected === option
                ? 'bg-indigo-600 border-indigo-500 text-white'
                : 'bg-gray-900 border-gray-700 hover:border-indigo-500 hover:bg-gray-800'
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      <button
        onClick={handleNext}
        disabled={!selected}
        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed px-4 py-3 rounded-xl text-sm font-medium transition"
      >
        {current + 1 === quiz.questions.length ? 'Submit' : 'Next →'}
      </button>
    </div>
  )
}

export default QuizPage
