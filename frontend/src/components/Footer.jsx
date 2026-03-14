import { Link } from 'react-router-dom'

const footerLinks = [
  { label: 'Home', path: '/' },
  { label: 'Menu', path: '/menu' },
  { label: 'Booking', path: '/booking' },
  { label: 'About', path: '/#about' },
  { label: 'Contact', path: '/#contact' },
]

export default function Footer() {
  return (
    <footer className="border-t border-gold-500/20 bg-chocolate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <Link to="/" className="font-playfair text-2xl font-bold text-gold-500">
              ChocoRush
            </Link>
            <p className="mt-3 text-gray-500 text-sm">
              Luxury chocolates crafted with passion and delivered with care.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-gold-500 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>hello@chocorush.com</li>
              <li>+91 98765 43210</li>
              <li>123 Chocolate Lane, Mumbai</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Follow Us</h4>
            <div className="flex gap-4">
              {['Facebook', 'Instagram', 'Twitter'].map((name) => (
                <a
                  key={name}
                  href="#"
                  className="text-gray-400 hover:text-gold-500 transition-colors"
                >
                  {name}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="pt-8 border-t border-gold-500/10 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} ChocoRush. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
