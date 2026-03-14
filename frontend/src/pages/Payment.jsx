import { useState, useEffect } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useCart } from '../context/CartContext'
import { ordersApi } from '../api/client'

export default function Payment() {
    const { state } = useLocation()
    const navigate = useNavigate()
    const { clearCart } = useCart()
    const [upiId, setUpiId] = useState('')
    const [processing, setProcessing] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')

    // If someone lands here without an order from checkout, send them to menu
    useEffect(() => {
        if (!state?.orderData) {
            navigate('/menu')
        }
    }, [state, navigate])

    const handlePayment = async (e) => {
        e.preventDefault()

        if (!upiId.includes('@')) {
            setError('Please enter a valid UPI ID (e.g., example@upi)')
            return
        }

        setProcessing(true)
        setError('')

        try {
            // Simulate network payment delay
            await new Promise(resolve => setTimeout(resolve, 2000))

            const orderData = {
                ...state.orderData,
                paymentStatus: 'Completed',
                status: 'Ordered'
            }

            // Try API Client
            await ordersApi.create(orderData)

        } catch (err) {
            // Fallback
            try {
                const token = localStorage.getItem('chocorush-token')
                await fetch('/api/orders', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        ...(token && { Authorization: `Bearer ${token}` })
                    },
                    body: JSON.stringify({
                        ...state.orderData,
                        paymentStatus: 'Completed',
                        status: 'Ordered'
                    }),
                })
            } catch (e) {
                console.warn('Backend unavailable, proceeding with demo flow')
            }
        } finally {
            clearCart()
            setProcessing(false)
            setSuccess(true)
            setTimeout(() => navigate('/orders'), 4000)
        }
    }

    if (!state?.orderData) return null

    if (success) {
        return (
            <div className="min-h-screen pt-24 flex items-center justify-center px-4">
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 10 }}
                        className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6 border border-green-500/30"
                    >
                        <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    </motion.div>
                    <h2 className="font-playfair text-3xl font-bold text-white mb-2">Payment Successful!</h2>
                    <p className="text-gold-500 text-xl font-medium mb-2">Order Placed successfully</p>
                    <p className="text-gray-400 mb-6">Your handcrafted chocolates will be with you shortly.</p>

                    <div className="bg-chocolate-800/50 p-4 rounded-xl border border-gold-500/20 mb-6 text-left">
                        <p className="text-gray-400 text-sm mb-1">Amount Paid:</p>
                        <p className="text-white font-bold text-lg">₹{state.orderData.totalPrice}</p>
                    </div>

                    <p className="text-sm text-gray-500">Redirecting to your orders...</p>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
            <div className="max-w-md w-full">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-8 rounded-2xl bg-chocolate-800/80 backdrop-blur-md border border-gold-500/30 shadow-2xl relative overflow-hidden"
                >
                    {/* Decorative glow */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/10 blur-[50px] rounded-full pointer-events-none"></div>

                    <div className="text-center mb-8">
                        <h2 className="font-playfair text-3xl font-bold text-gold-500 mb-2">Secure Payment</h2>
                        <p className="text-gray-400">Complete your purchase of ₹{state.orderData.totalPrice}</p>
                    </div>

                    <form onSubmit={handlePayment} className="space-y-6">
                        <div className="flex justify-center mb-8">
                            <div className="p-4 bg-white rounded-xl shadow-inner relative group cursor-pointer border-4 border-gold-500/20 transition-all hover:border-gold-500/50">
                                {/* Mock QR Code generator image */}
                                <img
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=upi://pay?pa=chocorush@upi&pn=ChocoRush&am=${state.orderData.totalPrice}&cu=INR`}
                                    alt="UPI QR Code"
                                    className="w-40 h-40 opacity-90 group-hover:opacity-100 transition-opacity"
                                />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-white/80 transition-opacity font-bold text-cocoa-900">
                                    Scan with App
                                </div>
                            </div>
                        </div>

                        <div className="text-center text-sm font-medium text-gray-400 mb-2">OR</div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Enter your UPI ID</label>
                            <input
                                type="text"
                                required
                                value={upiId}
                                onChange={(e) => {
                                    setUpiId(e.target.value)
                                    setError('')
                                }}
                                className="w-full px-5 py-4 rounded-xl bg-chocolate-900 border border-gold-500/30 text-white placeholder-gray-500 focus:border-gold-500 outline-none transition-colors"
                                placeholder="username@upi"
                            />
                            {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
                        </div>

                        <motion.button
                            type="submit"
                            disabled={processing}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full py-4 mt-4 bg-gold-500 text-chocolate-900 font-bold text-lg rounded-xl flex items-center justify-center gap-2 hover:bg-gold-400 hover:shadow-[0_0_20px_rgba(234,179,8,0.3)] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {processing ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-chocolate-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                </>
                            ) : (
                                `Pay Now`
                            )}
                        </motion.button>
                    </form>

                    <button onClick={() => navigate(-1)} className="w-full text-center mt-6 text-gray-400 hover:text-white transition-colors text-sm">
                        ← Cancel Payment
                    </button>
                </motion.div>
            </div>
        </div>
    )
}
