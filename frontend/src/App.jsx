import { Routes, Route } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Menu from './pages/Menu'
import Checkout from './pages/Checkout'
import Booking from './pages/Booking'
import Login from './pages/Login'
import Admin from './pages/Admin'
import Orders from './pages/Orders'
import CartSidebar from './components/CartSidebar'
import ProtectedRoute from './components/ProtectedRoute'
import OrderTracking from './pages/OrderTracking'
import AdminOrders from './pages/AdminOrders'
import Payment from './pages/Payment'

function App() {
  return (
    <div className="min-h-screen bg-cocoa-900">
      <Navbar />
      <CartSidebar />
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/tracking/:id" element={<OrderTracking />} />
          <Route path="/login" element={<Login />} />
          {/* Admin routes - protected: only admins can access */}
          <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
          <Route path="/admin/orders" element={<ProtectedRoute><AdminOrders /></ProtectedRoute>} />
        </Routes>
      </AnimatePresence>
    </div>
  )
}

export default App
