import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../context/CartContext'
import ChocolateImage from './ChocolateImage'

const CART_OPEN_EVENT = 'chocorush-open-cart'

export default function CartSidebar() {
  const { items, removeFromCart, updateQuantity, totalPrice } = useCart()
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true)
      document.body.style.overflow = 'hidden'
    }
    window.addEventListener(CART_OPEN_EVENT, handleOpen)
    return () => window.removeEventListener(CART_OPEN_EVENT, handleOpen)
  }, [])

  const closeCart = () => {
    setIsOpen(false)
    document.body.style.overflow = ''
  }

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') closeCart()
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [])

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeCart}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55]"
            />
            <motion.div
              id="cart-sidebar"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 right-0 h-full w-full sm:w-96 max-w-full bg-chocolate-800/98 backdrop-blur-xl border-l border-gold-500/20 z-[60] flex flex-col shadow-2xl"
            >
              <div className="p-6 border-b border-gold-500/20 flex justify-between items-center">
                <h3 className="font-playfair text-xl text-gold-500">Your Cart</h3>
                <button
                  onClick={closeCart}
                  className="p-2 text-gray-400 hover:text-gold-500 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                <AnimatePresence mode="popLayout">
                  {items.length === 0 ? (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-gray-400 text-center py-12"
                    >
                      Your cart is empty. Add some chocolates!
                    </motion.p>
                  ) : (
                    <div className="space-y-4">
                      {items.map((item) => (
                        <motion.div
                          key={item.id}
                          layout
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="flex gap-4 p-3 rounded-lg bg-chocolate-900/50"
                        >
                          <ChocolateImage
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-white truncate">{item.name}</h4>
                            <p className="text-gold-500 text-sm">₹{item.price}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-6 h-6 flex items-center justify-center rounded bg-chocolate-700 text-gold-500 hover:bg-gold-500 hover:text-chocolate-900"
                              >
                                −
                              </button>
                              <span className="text-sm w-6 text-center">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-6 h-6 flex items-center justify-center rounded bg-chocolate-700 text-gold-500 hover:bg-gold-500 hover:text-chocolate-900"
                              >
                                +
                              </button>
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="ml-auto text-red-400 hover:text-red-300 text-sm"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </AnimatePresence>
              </div>
              {items.length > 0 && (
                <div className="p-6 border-t border-gold-500/20">
                  <div className="flex justify-between text-lg mb-4">
                    <span>Total</span>
                    <span className="font-bold text-gold-500">₹{totalPrice}</span>
                  </div>
                  <Link to="/checkout" onClick={closeCart}>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-3 bg-gold-500 text-chocolate-900 font-semibold rounded-lg hover:bg-gold-400 hover:shadow-gold-glow transition-all btn-ripple"
                    >
                      Proceed to Checkout
                    </motion.button>
                  </Link>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
