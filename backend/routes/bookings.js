import express from 'express'
import Booking from '../models/Booking.js'

const router = express.Router()

router.post('/', async (req, res) => {
  try {
    const { date, ...rest } = req.body
    const booking = new Booking({ ...rest, date: date ? new Date(date) : new Date() })
    await booking.save()
    res.status(201).json({ success: true, bookingId: booking._id })
  } catch (err) {
    if (err.name === 'MongoServerError' || err.message?.includes('MongoDB')) {
      return res.status(503).json({ success: false, error: 'Database unavailable' })
    }
    res.status(400).json({ success: false, error: err.message })
  }
})

router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ date: 1 })
    res.json(bookings)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
