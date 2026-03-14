/**
 * ChocoRush API Server
 * Node.js + Express + MongoDB + Socket.io
 */
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import http from 'http'
import path from 'path'
import { fileURLToPath } from 'url'
import { Server as SocketIOServer } from 'socket.io'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

import orderRoutes from './routes/orders.js'
import bookingRoutes from './routes/bookings.js'
import userRoutes from './routes/users.js'
import productRoutes from './routes/products.js'
import adminRoutes from './routes/admin.js'
import paymentRoutes from './routes/payments.js'
import sectionsRoutes from './routes/sections.js'

dotenv.config()

const app = express()
const server = http.createServer(app)
const PORT = process.env.PORT || 5000

// Socket.io for real-time order status updates
const io = new SocketIOServer(server, {
  cors: { origin: ['http://localhost:5173', 'http://127.0.0.1:5173'] },
})
app.set('io', io)

app.use(cors({ origin: ['http://localhost:5173', 'http://127.0.0.1:5173'] }))
app.use(express.json())

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/chocorush'
mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.warn('MongoDB connection failed:', err.message))

app.use('/api/orders', orderRoutes)
app.use('/api/bookings', bookingRoutes)
app.use('/api/users', userRoutes)
app.use('/api/products', productRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/payments', paymentRoutes)
app.use('/api/sections', sectionsRoutes)

// --- SERVE FRONTEND IN PRODUCTION ---
const distPath = path.join(__dirname, '../frontend/dist')
app.use(express.static(distPath))

app.get('*', (req, res) => {
  // Only serve index.html if the request doesn't start with /api
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(distPath, 'index.html'))
  }
})

app.get('/api/health', (req, res) => res.json({ status: 'ok' }))

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
