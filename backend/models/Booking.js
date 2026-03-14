import mongoose from 'mongoose'

const bookingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  guests: { type: Number, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  message: String,
  status: { type: String, default: 'pending' },
}, { timestamps: true })

export default mongoose.model('Booking', bookingSchema)
