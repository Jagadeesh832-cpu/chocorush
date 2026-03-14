import { useEffect, useState, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import Hero from '../components/Hero'
import ProductCard from '../components/ProductCard'
import About from '../components/About'
import Contact from '../components/Contact'
import Footer from '../components/Footer'
import { productsApi } from '../api/client'
import { products as fallbackProducts } from '../data/products'

function SectionWrapper({ children, id }) {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [30, 0, -30])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8])

  const springRotateX = useSpring(rotateX, { stiffness: 100, damping: 30 })

  return (
    <motion.section
      id={id}
      ref={containerRef}
      style={{
        rotateX: springRotateX,
        opacity,
        scale,
        perspective: 1200,
        transformStyle: 'preserve-3d'
      }}
      className="py-16 md:py-24 px-4 sm:px-6 lg:px-8"
    >
      {children}
    </motion.section>
  )
}

export default function Home() {
  const { hash } = useLocation()
  const [products, setProducts] = useState(fallbackProducts)

  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash)
      el?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [hash])

  useEffect(() => {
    productsApi.list()
      .then((data) => setProducts(Array.isArray(data) ? data : fallbackProducts))
      .catch(() => setProducts(fallbackProducts))
  }, [])

  return (
    <div className="bg-cocoa-900 overflow-x-hidden">
      <Hero />

      <SectionWrapper id="products">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Our <span className="text-gold-gradient italic">Collection</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Discover our signature range of handcrafted chocolates, each made with the finest ingredients
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-12">
            {products.map((product, i) => (
              <ProductCard key={product._id || product.id} product={product} index={i} />
            ))}
          </div>
        </div>
      </SectionWrapper>

      <SectionWrapper id="about">
        <About />
      </SectionWrapper>

      <SectionWrapper id="contact">
        <Contact />
      </SectionWrapper>

      <Footer />
    </div>
  )
}
