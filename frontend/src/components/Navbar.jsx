import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart, openCartSidebar } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/menu', label: 'Menu' },
  { path: '/orders', label: 'Order' },
  { path: '/booking', label: 'Booking' },
  { path: '/#about', label: 'About' },
  { path: '/#contact', label: 'Contact' },
]

export default function Navbar({ onCartOpen }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { totalItems } = useCart()
  const { user, logout } = useAuth()
  const location = useLocation()

  const openCart = () => openCartSidebar()

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 glass border-b border-gold-500/20"
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <span className="font-playfair text-2xl md:text-3xl font-bold text-gold-500 group-hover:text-gold-400 transition-colors">
              ChocoRush
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`nav-link text-sm font-medium transition-colors ${location.pathname === link.path
                  ? 'text-gold-500'
                  : 'text-gray-300 hover:text-gold-500'
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right section */}
          <div className="flex items-center gap-4">
            {/* Cart */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={openCart}
              className="relative p-3 text-gold-500 hover:text-gold-400 rounded-full transition-all group"
            >
              <div className="absolute inset-0 bg-gold/10 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <svg className="w-7 h-7 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {totalItems > 0 && (
                <motion.span
                  initial={{ scale: 0, y: 10 }}
                  animate={{ scale: 1, y: 0 }}
                  className="absolute top-0 right-0 bg-gold-gradient text-cocoa-900 text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center shadow-lg shadow-gold/40 border border-cocoa-900/20"
                >
                  {totalItems}
                </motion.span>
              )}
            </motion.button>

            {user?.role === 'admin' && (
              <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="hidden sm:flex text-sm font-medium text-gray-300 hover:text-gold-500 nav-link">
                Admin
              </Link>
            )}
            {/* Login / Profile */}
            {user ? (
              <div className="hidden sm:flex items-center gap-2">
                <span className="text-gray-400 text-sm">{user.name}</span>
                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); window.location.href = '/'; }}
                  className="text-sm text-gray-400 hover:text-gold-500"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/login">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="hidden sm:block px-4 py-2 bg-gold-500 text-chocolate-900 font-semibold rounded-lg hover:bg-gold-400 hover:shadow-gold-glow transition-all btn-ripple"
                >
                  Login / Sign Up
                </motion.button>
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gold-500 hover:bg-gold-500/10 rounded-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden"
            >
              <div className="py-4 space-y-2">
                {navLinks.map((link) => (
                  <Link key={link.path} to={link.path} onClick={() => setMobileMenuOpen(false)} className="block py-2 text-gray-300 hover:text-gold-500 transition-colors">
                    {link.label}
                  </Link>
                ))}
                {user?.role === 'admin' && (
                  <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-gold-500">
                    Admin
                  </Link>
                )}
                {user ? (
                  <button onClick={() => { logout(); setMobileMenuOpen(false); window.location.href = '/'; }} className="block py-2 text-gray-300 hover:text-gold-500 w-full text-left">
                    Logout
                  </button>
                ) : (
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-gold-500 font-semibold">
                    Login / Sign Up
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  )
}
