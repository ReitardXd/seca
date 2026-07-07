import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Login = () => {
  const { login, user } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const token = searchParams.get('token')
    if (token) {
      login(token)
      navigate('/dashboard')
    } else if (user) {
      navigate('/dashboard')
    }
  }, [])

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google`
  }

  return (
    <div>
      <h1>Welcome to Seca</h1>
      <button onClick={handleGoogleLogin}>Login with Google</button>
    </div>
  )
}

export default Login
