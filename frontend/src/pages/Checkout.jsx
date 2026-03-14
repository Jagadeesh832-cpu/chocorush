import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useCart } from '../context/CartContext'
import { ordersApi } from '../api/client'

function useLocation() {
  const [location, setLocation] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported')
      setLoading(false)
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude })
        setLoading(false)
      },
      (err) => {
        setError(err.message)
        setLoading(false)
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }, [])

  return { location, error, loading }
}

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart()
  const navigate = useNavigate()
  const { location, error: locError } = useLocation()
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    paymentMethod: 'cod',
  })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (items.length === 0) return

    // Redirect to the Demo Payment page with order data
    navigate('/payment', {
      state: {
        orderData: {
          ...formData,
          items: items.map(({ _id, id, ...i }) => ({ ...i, id: _id || id })),
          totalPrice,
          status: 'Ordered',
          location,
        }
      }
    })
  }

  if (items.length === 0 && !success) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <h2 className="font-playfair text-2xl text-white mb-4">Your cart is empty</h2>
          <Link to="/menu">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} className="px-6 py-3 bg-gold-500 text-chocolate-900 font-semibold rounded-lg">
              Browse Menu
            </motion.button>
          </Link>
        </motion.div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="font-playfair text-2xl text-white mb-2">Order Placed!</h2>
          <p className="text-gray-400 mb-6">Thank you for your order. We will deliver soon.</p>
          <p className="text-sm text-gray-500">Redirecting to home...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="font-playfair text-3xl md:text-4xl font-bold text-white mb-8">
          Checkout
        </motion.h1>

        {locError && (
          <p className="mb-4 text-amber-400 text-sm">Location not shared. Delivery tracking may be limited.</p>
        )}

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6 p-6 rounded-2xl bg-chocolate-800/50 border border-gold-500/20"
          >
            <h3 className="font-playfair text-xl text-gold-500 mb-4">Delivery Details</h3>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Full Name *</label>
              <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 rounded-lg bg-chocolate-900 border border-gold-500/30 text-white placeholder-gray-500 focus:border-gold-500 outline-none" placeholder="Your name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Phone Number *</label>
              <input type="tel" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-4 py-3 rounded-lg bg-chocolate-900 border border-gold-500/30 text-white placeholder-gray-500 focus:border-gold-500 outline-none" placeholder="+91 98765 43210" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Delivery Address *</label>
              <textarea required rows={3} value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="w-full px-4 py-3 rounded-lg bg-chocolate-900 border border-gold-500/30 text-white placeholder-gray-500 focus:border-gold-500 outline-none resize-none" placeholder="Full address" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-3">Payment Method</label>
              <div className="space-y-2">
                <label className="flex items-center gap-3 p-3 rounded-lg bg-chocolate-900 border border-gold-500/30 cursor-pointer hover:border-gold-500/50">
                  <input type="radio" name="payment" value="cod" checked={formData.paymentMethod === 'cod'} onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })} className="text-gold-500" />
                  <span>Cash on Delivery</span>
                </label>
                <label className="flex items-center gap-3 p-3 rounded-lg bg-chocolate-900 border border-gold-500/30 cursor-pointer hover:border-gold-500/50">
                  <input type="radio" name="payment" value="card" checked={formData.paymentMethod === 'card'} onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })} className="text-gold-500" />
                  <span>Card / UPI</span>
                </label>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="p-6 rounded-2xl bg-chocolate-800/50 border border-gold-500/20">
              <h3 className="font-playfair text-xl text-gold-500 mb-4">Order Summary</h3>
              <div className="space-y-3 mb-6">
                {items.map((item) => (
                  <div key={item._id || item.id} className="flex justify-between text-gray-400">
                    <span>{item.name} × {item.quantity}</span>
                    <span className="text-gold-500">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-lg font-bold text-white pt-4 border-t border-gold-500/20">
                <span>Total</span>
                <span className="text-gold-500">₹{totalPrice}</span>
              </div>
            </div>
            <motion.button
              type="submit"
              disabled={submitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 bg-gold-500 text-chocolate-900 font-semibold rounded-lg hover:bg-gold-400 hover:shadow-gold-glow transition-all btn-ripple disabled:opacity-70"
            >
              Proceed to Payment
            </motion.button>
            <Link to="/menu" className="block text-center text-gray-400 hover:text-gold-500 text-sm">
              Continue Shopping
            </Link>
          </motion.div>
        </form>
      </div>
    </div>
  )
}
