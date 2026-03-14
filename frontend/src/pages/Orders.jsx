/**
 * Order History page - displays user's past orders with status
 * Fetches from GET /api/users/orders (requires auth)
 * Real-time updates via Socket.io when admin changes order status
 */
import { useState, useEffect, useCallback } from 'react'
import { useOrderStatusSocket } from '../hooks/useOrderStatusSocket'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

const API_BASE = '/api'

export default function Orders() {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadOrders = useCallback(() => {
    const token = localStorage.getItem('chocorush-token')
    if (!token) {
      setLoading(false)
      setError('Please log in to view orders')
      return
    }
    fetch(`${API_BASE}/users/orders`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setOrders(Array.isArray(data) ? data : []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    loadOrders()
  }, [loadOrders])

  // Real-time: update order status when admin changes it
  useOrderStatusSocket(({ id, status }) => {
    setOrders((prev) =>
      prev.map((o) => (o._id === id ? { ...o, status } : o))
    )
  })

  if (!user) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h2 className="font-playfair text-2xl text-white mb-4">Sign in to view your orders</h2>
          <Link to="/login">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 bg-gold-500 text-chocolate-900 font-semibold rounded-lg"
            >
              Login
            </motion.button>
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-playfair text-3xl md:text-4xl font-bold text-white mb-8"
        >
          Your <span className="text-gold-500">Orders</span>
        </motion.h1>
        {error && <p className="text-red-400 mb-4">{error}</p>}
        {loading ? (
          <p className="text-gray-400">Loading orders...</p>
        ) : orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 rounded-2xl bg-chocolate-800/50 border border-gold-500/20"
          >
            <p className="text-gray-400 mb-6">You haven't placed any orders yet</p>
            <Link to="/menu">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 bg-gold-500 text-chocolate-900 font-semibold rounded-lg"
              >
                Browse Menu
              </motion.button>
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, i) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="p-6 rounded-2xl bg-chocolate-800/50 border border-gold-500/20 hover:border-gold-500/40 transition-colors"
              >
                <div className="flex flex-wrap justify-between items-start gap-4">
                  <div>
                    <p className="text-white font-medium">
                      Order #{order._id?.slice(-6).toUpperCase() || '—'}
                    </p>
                    <p className="text-gray-500 text-sm">
                      {new Date(order.createdAt).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        order.status === 'delivered'
                          ? 'bg-green-500/20 text-green-400'
                          : order.status === 'shipped'
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-gold-500/20 text-gold-500'
                      }`}
                    >
                      {order.status}
                    </span>
                    <span className="text-gold-500 font-bold">₹{order.totalPrice}</span>
                  </div>
                </div>
                <div className="mt-4 text-gray-400 text-sm">
                  {order.items?.map((item) => `${item.name} × ${item.quantity}`).join(', ')}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
