import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { login } from '../services/auth'
import ErrorBanner from '../components/ui/ErrorBanner'
import Spinner from '../components/ui/Spinner'
import Logo from '../components/ui/Logo'
import GovCard from '../components/ui/GovCard'

export default function LoginPage() {
  const { login: setAuth } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await login(form)
      setAuth(res.data.access_token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-gov-bg">
      <div className="w-full max-w-md">
        <GovCard className="p-8 animate-slide-up">
          <div className="text-center mb-8">
            <Logo size="lg" className="justify-center mb-6" />
            <h1 className="text-2xl font-bold text-gov-text">Welcome back</h1>
            <p className="text-gov-muted text-sm mt-2">Sign in to access your scheme portal</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <ErrorBanner message={error} />
            <div>
              <label className="form-label" htmlFor="login-email">Email</label>
              <input id="login-email" type="email" required value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="form-input" placeholder="you@example.com" autoComplete="email" />
            </div>
            <div>
              <label className="form-label" htmlFor="login-password">Password</label>
              <input id="login-password" type="password" required value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="form-input" placeholder="Your password" autoComplete="current-password" />
            </div>
            <button type="submit" id="login-submit-btn" className="btn-primary w-full justify-center py-3 mt-2 min-h-[48px]" disabled={loading}>
              {loading ? <Spinner size="sm" /> : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-gov-muted text-sm mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-600 hover:text-primary-700 font-semibold">Create one</Link>
          </p>
        </GovCard>
      </div>
    </div>
  )
}
