/**
 * AuthContext - JWT-based auth state
 * Stores user (with role) and token in localStorage
 * Admin users have role 'admin'; others are customer/delivery
 */
import { createContext, useContext, useState, useEffect } from 'react'
import { authApi } from '../api/client'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('chocorush-token')
    if (!token) {
      setLoading(false)
      return
    }
    authApi.me()
      .then((u) => setUser(u))
      .catch(() => {
        localStorage.removeItem('chocorush-token')
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [])

  const login = (userData, token) => {
    setUser(userData)
    if (token) localStorage.setItem('chocorush-token', token)
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('chocorush-token')
  }

  const signup = (userData, token) => {
    setUser(userData)
    if (token) localStorage.setItem('chocorush-token', token)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, signup, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
