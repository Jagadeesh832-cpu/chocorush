import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useCart, openCartSidebar } from '../context/CartContext'

export default function ProductCard({ product, index, showAddButton = true }) {
  const { addToCart } = useCart()

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product)
    openCartSidebar() // Show success context
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      viewport={{ once: true }}
      className="glass-card group relative p-5 rounded-[2rem] flex flex-col h-full cursor-pointer"
    >
      {/* Badge */}
      <div className="absolute top-4 left-4 z-10">
        <span className="px-3 py-1 bg-gold/20 backdrop-blur-md border border-gold/30 text-gold text-xs font-bold rounded-full">
          {product.category || 'Handmade'}
        </span>
      </div>

      {/* Image Container - responsive aspect-square, lazy load, unique fallback */}
      <div className="relative aspect-square overflow-hidden rounded-2xl mb-4 bg-cocoa-800 shadow-inner">
        <motion.img
          src={product.image ? `${product.image}${product.image.includes('?') ? '&' : '?'}v=2` : 'https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=400&h=400&fit=crop&q=80'}
          alt={`${product.name} - handcrafted premium chocolate`}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
          onError={(e) => {
            e.target.onerror = null
            e.target.src = 'https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=400&h=400&fit=crop&q=80'
          }}
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
      </div>

      {/* Content */}
      <h3 className="text-xl font-serif text-white mb-2 group-hover:text-gold transition-colors duration-300">
        {product.name}
      </h3>
      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
        {product.description || 'Artisanal chocolate crafted for the finest palates.'}
      </p>

      {/* Footer */}
      <div className="mt-auto flex items-center justify-between relative z-20">
        <span className="text-2xl font-bold text-gold">₹{product.price}</span>
        {showAddButton && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleAddToCart}
            className="px-4 py-1.5 bg-pink-gradient text-white rounded-lg shadow-md shadow-pink-500/10 hover:shadow-pink-500/30 transition-all font-bold text-xs relative z-30"
          >
            Add to Cart
          </motion.button>
        )}
      </div>

      {/* Hover Detail Link */}
      <Link
        to={`/menu`}
        className="absolute inset-0 z-10"
        aria-label="View Product"
      />
    </motion.div>
  )
}
