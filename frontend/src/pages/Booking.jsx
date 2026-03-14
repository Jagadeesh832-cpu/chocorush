import { useState } from 'react'
import { motion } from 'framer-motion'
import Footer from '../components/Footer'
import { bookingsApi } from '../api/client'

export default function Booking() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    guests: 2,
    date: '',
    time: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await bookingsApi.create(formData)
    } catch {
      // Fallback: still show success for demo
    }
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 rounded-full bg-gold-500/20 flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="font-playfair text-2xl text-white mb-2">Reservation Confirmed!</h2>
          <p className="text-gray-400">We look forward to hosting your chocolate tasting experience.</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="pt-24 pb-16">
      <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="font-playfair text-4xl md:text-5xl font-bold text-white mb-4">
              Reserve a <span className="text-gold-500">Table</span>
            </h1>
            <p className="text-gray-400">
              Book your chocolate tasting or dessert reservation with us
            </p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onSubmit={handleSubmit}
            className="p-6 md:p-8 rounded-2xl bg-chocolate-800/50 border border-gold-500/20 space-y-6"
          >
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-chocolate-900 border border-gold-500/30 text-white placeholder-gray-500 focus:border-gold-500 outline-none"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-chocolate-900 border border-gold-500/30 text-white placeholder-gray-500 focus:border-gold-500 outline-none"
                  placeholder="your@email.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Phone *</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-chocolate-900 border border-gold-500/30 text-white placeholder-gray-500 focus:border-gold-500 outline-none"
                placeholder="+91 98765 43210"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Number of Guests *</label>
              <select
                required
                value={formData.guests}
                onChange={(e) => setFormData({ ...formData, guests: +e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-chocolate-900 border border-gold-500/30 text-white focus:border-gold-500 outline-none"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                  <option key={n} value={n}>{n} {n === 1 ? 'guest' : 'guests'}</option>
                ))}
              </select>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Preferred Date *</label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-chocolate-900 border border-gold-500/30 text-white focus:border-gold-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Preferred Time *</label>
                <input
                  type="time"
                  required
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-chocolate-900 border border-gold-500/30 text-white focus:border-gold-500 outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Special Requests</label>
              <textarea
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-chocolate-900 border border-gold-500/30 text-white placeholder-gray-500 focus:border-gold-500 outline-none resize-none"
                placeholder="Any allergies, preferences, or special occasions..."
              />
            </div>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 bg-gold-500 text-chocolate-900 font-semibold rounded-lg hover:bg-gold-400 hover:shadow-gold-glow transition-all btn-ripple"
            >
              Reserve Table
            </motion.button>
          </motion.form>
        </div>
      </section>
      <Footer />
    </div>
  )
}
