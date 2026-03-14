import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ProductCard from '../components/ProductCard'
import Footer from '../components/Footer'
import { productsApi } from '../api/client'
import { products as fallbackProducts } from '../data/products'

export default function Menu() {
  const [products, setProducts] = useState(fallbackProducts)

  useEffect(() => {
    productsApi.list()
      .then((data) => setProducts(Array.isArray(data) ? data : fallbackProducts))
      .catch(() => setProducts(fallbackProducts))
  }, [])

  return (
    <div className="pt-24 md:pt-28">
      <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="font-playfair text-4xl md:text-5xl font-bold text-white mb-4">
              Our <span className="text-gold-500">Menu</span>
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Explore our collection of premium handcrafted chocolates. Each piece is made with the finest ingredients.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {products.map((product, i) => (
              <ProductCard key={product._id || product.id} product={product} index={i} />
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}
