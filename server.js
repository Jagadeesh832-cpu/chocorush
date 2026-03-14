/**
 * ChocoRush Production Entry Point
 * Serves the frontend and routes API requests to the backend
 */
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import http from 'http'
import path from 'path'
import { fileURLToPath } from 'url'
import { Server as SocketIOServer } from 'socket.io'

// Routes
import orderRoutes from './backend/routes/orders.js'
import bookingRoutes from './backend/routes/bookings.js'
import userRoutes from './backend/routes/users.js'
import productRoutes from './backend/routes/products.js'
import adminRoutes from './backend/routes/admin.js'
import paymentRoutes from './backend/routes/payments.js'
import sectionsRoutes from './backend/routes/sections.js'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const server = http.createServer(app)
const PORT = process.env.PORT || 5000

// Socket.io
const io = new SocketIOServer(server, {
    cors: { origin: process.env.NODE_ENV === 'production' ? false : '*' },
})
app.set('io', io)

app.use(cors())
app.use(express.json())

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/chocorush'
mongoose.connect(MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.warn('MongoDB connection failed:', err.message))

// API Routes
app.use('/api/orders', orderRoutes)
app.use('/api/bookings', bookingRoutes)
app.use('/api/users', userRoutes)
app.use('/api/products', productRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/payments', paymentRoutes)
app.use('/api/sections', sectionsRoutes)

app.get('/api/health', (req, res) => res.json({ status: 'ok', environment: process.env.NODE_ENV }))

// --- SERVE FRONTEND IN PRODUCTION ---
const distPath = path.join(__dirname, 'frontend/dist')
app.use(express.static(distPath))

app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
        res.sendFile(path.join(distPath, 'index.html'))
    }
})

server.listen(PORT, () => {
    console.log(`ChocoRush Production Server running on port ${PORT}`)
})
