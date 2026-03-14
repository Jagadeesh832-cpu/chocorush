/**
 * Payment routes - Razorpay integration for orders
 * Set RZP_KEY_ID and RZP_KEY_SECRET in .env for live payments
 */
import express from 'express'
import crypto from 'crypto'
import Order from '../models/Order.js'
import Payment from '../models/Payment.js'

const router = express.Router()

let rzp = null
try {
  const R = (await import('razorpay')).default
  if (process.env.RZP_KEY_ID && process.env.RZP_KEY_SECRET) {
    rzp = new R({ key_id: process.env.RZP_KEY_ID, key_secret: process.env.RZP_KEY_SECRET })
  }
} catch (_) {}

// Create Razorpay order for payment
router.post('/create-order', async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt, orderId } = req.body
    const amountInPaise = Math.round((amount || 0) * 100)
    if (amountInPaise < 100) {
      return res.status(400).json({ error: 'Minimum amount is ₹1' })
    }
    if (rzp) {
      const order = await rzp.orders.create({
        amount: amountInPaise,
        currency,
        receipt: receipt || `chocorush_${Date.now()}`,
      })
      return res.json({ orderId: order.id, amount: order.amount, currency: order.currency })
    }
    // Demo mode - return mock order id
    res.json({
      orderId: `order_demo_${Date.now()}`,
      amount: amountInPaise,
      currency: 'INR',
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Verify Razorpay payment and update order
router.post('/verify', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body
    const secret = process.env.RZP_KEY_SECRET
    if (rzp && secret) {
      const body = razorpay_order_id + '|' + razorpay_payment_id
      const expected = crypto.createHmac('sha256', secret).update(body).digest('hex')
      if (expected !== razorpay_signature) {
        return res.status(400).json({ success: false, error: 'Payment verification failed' })
      }
    }
    if (orderId) {
      await Order.findByIdAndUpdate(orderId, { payment_status: 'paid' })
      await Payment.create({
        orderId,
        amount: req.body.amount / 100,
        status: 'success',
        method: 'razorpay',
        razorpay_order_id,
        razorpay_payment_id,
      })
    }
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

export default router
