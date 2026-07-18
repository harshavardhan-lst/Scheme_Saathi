import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { register, login } from '../services/auth'
import ErrorBanner from '../components/ui/ErrorBanner'
import Spinner from '../components/ui/Spinner'
import Logo from '../components/ui/Logo'
import GovCard from '../components/ui/GovCard'

export default function RegisterPage() {
  const { login: setAuth } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await register(form)
      const res = await login({ email: form.email, password: form.password })
      setAuth(res.data.access_token)
      navigate('/profile')
    } catch (err) {
      setError(err.message || 'Registration failed')
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
            <h1 className="text-2xl font-bold text-gov-text">Create your account</h1>
            <p className="text-gov-muted text-sm mt-2">Start discovering government schemes you're eligible for</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <ErrorBanner message={error} />
            <div>
              <label className="form-label" htmlFor="register-name">Full Name</label>
              <input id="register-name" required value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="form-input" placeholder="Ravi Kumar" autoComplete="name" />
            </div>
            <div>
              <label className="form-label" htmlFor="register-email">Email</label>
              <input id="register-email" type="email" required value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="form-input" placeholder="you@example.com" autoComplete="email" />
            </div>
            <div>
              <label className="form-label" htmlFor="register-password">Password</label>
              <input id="register-password" type="password" required minLength={8} value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="form-input" placeholder="At least 8 characters" autoComplete="new-password" />
            </div>
            <button type="submit" id="register-submit-btn" className="btn-primary w-full justify-center py-3 mt-2 min-h-[48px]" disabled={loading}>
              {loading ? <Spinner size="sm" /> : 'Create Account & Continue'}
            </button>
          </form>

          <p className="text-center text-gov-muted text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-semibold">Sign in</Link>
          </p>
        </GovCard>
      </div>
    </div>
  )
}
