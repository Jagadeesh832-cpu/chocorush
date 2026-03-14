/**
 * Admin Routes - All routes require authenticate + adminOnly
 * Stats, orders, bookings, products, sections, users
 */
import express from 'express'
import Product from '../models/Product.js'
import Order from '../models/Order.js'
import Booking from '../models/Booking.js'
import User from '../models/User.js'
import WebsiteSection from '../models/WebsiteSection.js'
import { authenticate, adminOnly } from '../middleware/auth.js'

const router = express.Router()

// All admin routes require JWT auth and admin role
router.use(authenticate)
router.use(adminOnly)

router.get('/stats', async (req, res) => {
  try {
    const [productCount, orderCount, bookingCount] = await Promise.all([
      Product.countDocuments({ isActive: { $ne: false } }),
      Order.countDocuments(),
      Booking.countDocuments(),
    ])
    res.json({ productCount, orderCount, bookingCount })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).populate('user', 'name email')
    res.json(orders)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ date: 1 })
    res.json(bookings)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Admin products - returns all products (including inactive) for manage list
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 })
    res.json(products)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// --- Website Sections (editable Hero, About, Contact content) ---
router.get('/sections', async (req, res) => {
  try {
    const sections = await WebsiteSection.find().sort({ key: 1 })
    res.json(sections)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.put('/sections/:key', async (req, res) => {
  try {
    const section = await WebsiteSection.findOneAndUpdate(
      { key: req.params.key },
      { $set: req.body },
      { new: true, upsert: true }
    )
    res.json(section)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

router.post('/sections', async (req, res) => {
  try {
    const section = new WebsiteSection(req.body)
    await section.save()
    res.status(201).json(section)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

router.delete('/sections/:key', async (req, res) => {
  try {
    await WebsiteSection.findOneAndDelete({ key: req.params.key })
    res.json({ message: 'Section deleted' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// --- User Management (Admin and User roles) ---
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 })
    res.json(users)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.patch('/users/:id/role', async (req, res) => {
  try {
    const { role } = req.body
    if (!['customer', 'admin', 'delivery'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' })
    }
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password')
    if (!user) return res.status(404).json({ error: 'User not found' })
    res.json(user)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

export default router
