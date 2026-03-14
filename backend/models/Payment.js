/**
 * Payment model - stores payment records for orders
 * Supports Razorpay/Stripe/Paytm integration
 */
import mongoose from 'mongoose'

const paymentSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  status: { type: String, default: 'pending', enum: ['pending', 'success', 'failed', 'refunded'] },
  method: { type: String, enum: ['cod', 'razorpay', 'stripe', 'paytm', 'card', 'upi'] },
  razorpay_order_id: String,
  razorpay_payment_id: String,
}, { timestamps: true })

export default mongoose.model('Payment', paymentSchema)
