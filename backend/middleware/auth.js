/**
 * Authentication & Authorization Middleware
 * - authenticate: Verifies JWT and attaches user to req
 * - adminOnly: Ensures user has admin role (must run after authenticate)
 */
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const JWT_SECRET = process.env.JWT_SECRET || 'chocorush-secret-key'

/** Verifies JWT token and loads user. Returns 401 if invalid or missing. */
export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' })
    }
    const decoded = jwt.verify(token, JWT_SECRET)
    const user = await User.findById(decoded.userId).select('-password')
    if (!user) return res.status(401).json({ error: 'User not found' })
    req.user = user
    next()
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token' })
  }
}

/** Restricts access to admin role only. Must be used after authenticate. */
export const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' })
  }
  next()
}
