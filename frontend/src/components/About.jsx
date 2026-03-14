import { motion } from 'framer-motion'
import ChocolateImage from './ChocolateImage'

const timeline = [
  { year: '2010', title: 'Founded', desc: 'Started with a passion for fine chocolates' },
  { year: '2015', title: 'Global Sourcing', desc: 'Partnered with cocoa farms worldwide' },
  { year: '2020', title: 'Award Winning', desc: 'Recognized for artisan excellence' },
  { year: '2024', title: 'Your Doorstep', desc: 'Premium delivery across India' },
]

export default function About() {
  return (
    <section id="about" className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-chocolate-950/50">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <ChocolateImage
              src="https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=600&h=500&fit=crop"
              alt="Chocolate craftsmanship"
              className="rounded-2xl shadow-2xl w-full object-cover h-64 sm:h-80 lg:h-96"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-white mb-6">
              Our <span className="text-gold-500">Story</span>
            </h2>
            <p className="text-gray-400 mb-8 leading-relaxed">
              Handcrafted chocolates made from the finest cocoa beans sourced globally.
              Every piece is a testament to our commitment to quality, sustainability,
              and the art of chocolate making.
            </p>
            <p className="text-gray-400 mb-10 leading-relaxed">
              From bean to bar, we ensure each creation meets the highest standards.
              Our master chocolatiers blend traditional techniques with innovative
              flavors to bring you an unforgettable experience.
            </p>
            <div className="space-y-6">
              {timeline.map((item, i) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-4"
                >
                  <span className="text-gold-500 font-bold shrink-0">{item.year}</span>
                  <div>
                    <h4 className="text-white font-semibold">{item.title}</h4>
                    <p className="text-gray-500 text-sm">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
