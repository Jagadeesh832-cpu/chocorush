/**
 * Users Routes - Signup, Login (JWT), Profile
 * Passwords hashed with bcrypt in User model pre-save
 */
import express from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import User from '../models/User.js'
import { authenticate } from '../middleware/auth.js'

const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET || 'chocorush-secret-key'

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email and password required' })
    }
    const existing = await User.findOne({ email })
    if (existing) {
      return res.status(400).json({ error: 'Email already registered' })
    }
    const user = new User({ name, email, password })
    await user.save()
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' })
    res.status(201).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

/**
 * Login - Requires comparePassword on User schema.
 * Do NOT use .lean() - it returns plain objects without Mongoose methods.
 * Use .select('+password') if password has select: false.
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' })
    }
    // Must NOT use .lean() - schema methods like comparePassword are lost on plain objects
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }
    // comparePassword is a Mongoose instance method - use it if available
    // Fallback to bcrypt.compare if method missing (e.g. .lean() was used elsewhere)
    const match = typeof user.comparePassword === 'function'
      ? await user.comparePassword(password)
      : await bcrypt.compare(password, user.password)
    if (!match) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' })
    res.json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/me', authenticate, (req, res) => {
  res.json(req.user)
})

router.get('/orders', authenticate, async (req, res) => {
  try {
    const Order = (await import('../models/Order.js')).default
    const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 })
    res.json(orders)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
