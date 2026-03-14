import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Cinematic Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-cocoa-900"></div>
        <div className="absolute inset-0 glow-overlay opacity-30"></div>
        {/* Floating Cocoa Particles (Mock) */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gold/40 rounded-full"
            initial={{
              x: Math.random() * 100 + "%",
              y: Math.random() * 100 + "%",
              opacity: 0.2
            }}
            animate={{
              y: ["-10%", "110%"],
              x: (Math.random() - 0.5) * 20 + "%",
              opacity: [0.2, 0.5, 0.2]
            }}
            transition={{
              duration: 10 + Math.random() * 20,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="text-5xl md:text-7xl font-serif leading-tight mb-6">
            Luxury Chocolates <br />
            <span className="text-gold-gradient italic">Crafted to</span> <br />
            Perfection
          </h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-lg mb-8 leading-relaxed">
            Experience the symphony of taste with our premium homemade delicacies,
            crafted by artisans and delivered fresh to your doorstep nationwide.
          </p>
          <div className="flex flex-wrap gap-4 mt-8">
            <Link
              to="/menu"
              className="px-10 py-4 bg-gold-gradient rounded-full text-cocoa-900 font-bold text-lg hover:shadow-gold/40 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              Order Now
            </Link>
            <Link
              to="/booking"
              className="px-10 py-4 glass rounded-full text-gold font-bold text-lg border-gold/30 hover:bg-gold/10 transition-all duration-300"
            >
              View Menu
            </Link>
          </div>
        </motion.div>

        {/* Cinematic Visual */}
        <motion.div
          className="relative flex justify-center items-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          {/* Glowing Background Ring */}
          <div className="absolute w-64 h-64 md:w-96 md:h-96 bg-gold/10 rounded-full blur-3xl"></div>

          <motion.div
            className="relative z-10 w-64 h-64 md:w-96 md:h-96 flex items-center justify-center animate-float"
            whileHover={{ scale: 1.05 }}
          >
            {/* Pulsing Spotlight Glow */}
            <motion.div
              className="absolute inset-0 bg-gold/30 rounded-full blur-[60px]"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            ></motion.div>

            {/* The Floating Product Image - Stacked White Chocolate */}
            <img
              src="https://images.pexels.com/photos/1693027/pexels-photo-1693027.jpeg"
              alt="Premium Stacked White Chocolate"
              className="w-full h-auto drop-shadow-[0_50px_50px_rgba(0,0,0,0.8)] relative z-20 border-8 border-white/5 rounded-lg shadow-2xl"
            />
          </motion.div>

          {/* Micro-animations: Floating ingredients */}
          <motion.div
            className="absolute -top-10 -right-10 w-28 h-28 glass rounded-2xl flex items-center justify-center border-gold/20 overflow-hidden shadow-2xl"
            animate={{ y: [0, -20, 0], rotate: [0, 15, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <img src="https://images.pexels.com/photos/4110101/pexels-photo-4110101.jpeg" />
          </motion.div>
          <motion.div
            className="absolute -bottom-12 -left-12 w-32 h-32 glass rounded-3xl flex items-center justify-center border-gold/20 overflow-hidden shadow-2xl"
            animate={{ y: [0, 25, 0], rotate: [0, -12, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
          >
            <img src="https://images.unsplash.com/photo-1548907040-4baa42d10919?auto=format&fit=crop&w=200&h=200" alt="Stacked Piece" className="w-full h-full object-cover" />
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
