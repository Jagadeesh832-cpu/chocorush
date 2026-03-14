import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { authApi } from '../api/client'

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, signup } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (isSignUp) {
        const { token, user } = await authApi.signup(formData)
        signup(user, token)
        navigate('/')
      } else {
        const { token, user } = await authApi.login({ email: formData.email, password: formData.password })
        login(user, token)
        // Redirect admins to Admin Dashboard, others to home
        navigate(user?.role === 'admin' ? '/admin' : (location.state?.from?.pathname || '/'))
      }
    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-24 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="p-8 rounded-2xl bg-chocolate-800/50 border border-gold-500/20">
          <h1 className="font-playfair text-2xl font-bold text-white text-center mb-6">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h1>
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/20 text-red-400 text-sm">{error}</div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Name</label>
                <input
                  type="text"
                  required={isSignUp}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-chocolate-900 border border-gold-500/30 text-white placeholder-gray-500 focus:border-gold-500 outline-none"
                  placeholder="Your name"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-chocolate-900 border border-gold-500/30 text-white placeholder-gray-500 focus:border-gold-500 outline-none"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-chocolate-900 border border-gold-500/30 text-white placeholder-gray-500 focus:border-gold-500 outline-none"
                placeholder="••••••••"
              />
              {isSignUp && (
                <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
              )}
            </div>
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 bg-gold-500 text-chocolate-900 font-semibold rounded-lg hover:bg-gold-400 transition-all btn-ripple disabled:opacity-70"
            >
              {loading ? 'Please wait...' : isSignUp ? 'Sign Up' : 'Login'}
            </motion.button>
          </form>
          <p className="mt-4 text-center text-sm">
            <Link to="/admin" className="text-amber-400/80 hover:text-amber-400">Admin Panel →</Link>
            <span className="text-gray-500 mx-2">|</span>
            <span className="text-gray-400">{isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              type="button"
              onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
              className="text-gold-500 hover:underline"
            >
              {isSignUp ? 'Login' : 'Sign Up'}
            </button></span>
          </p>
        </div>
        <p className="mt-6 text-center">
          <Link to="/" className="text-gray-400 hover:text-gold-500 text-sm">
            ← Back to Home
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
