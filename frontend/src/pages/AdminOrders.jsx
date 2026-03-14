/**
 * AdminOrders - Order management (protected, admin only)
 * Uses auth token for API calls
 */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../api/client';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const load = () => {
        setLoading(true);
        api('/orders/all')
            .then(data => {
                setOrders(Array.isArray(data) ? data : []);
                setError('');
            })
            .catch((err) => {
                setError(err.message || 'Failed to load orders');
                setOrders([]);
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => { load(); }, []);

    const updateStatus = async (orderId, newStatus) => {
        try {
            const updatedOrder = await api(`/orders/${orderId}/status`, {
                method: 'PATCH',
                body: JSON.stringify({ status: newStatus })
            });
            setOrders(orders.map(o => o._id === orderId ? updatedOrder : o));
        } catch (err) {
            setError(err.message || 'Failed to update status');
        }
    };

    if (loading) return <div className="min-h-screen pt-24 flex items-center justify-center"><p className="text-gray-400">Loading Orders...</p></div>;

    return (
        <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-chocolate-900">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="font-playfair text-3xl font-bold text-gold-500">Order Management</h2>
                    <Link to="/admin" className="text-gray-400 hover:text-gold-500">← Admin Dashboard</Link>
                </div>
                {error && <div className="mb-4 p-3 rounded-lg bg-red-500/20 text-red-400 text-sm">{error}</div>}
                <div className="grid gap-6">
                    <AnimatePresence>
                        {orders.map((order) => (
                            <motion.div
                                key={order._id}
                                layout
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="glass p-6 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-6"
                            >
                                <div>
                                    <span className="text-gold font-bold bg-gold/10 px-2 py-1 rounded text-xs">#{order._id.slice(-6)}</span>
                                    <h3 className="text-xl text-white mt-2 font-playfair">{order.user?.name || 'Valued Customer'}</h3>
                                    <p className="text-gray-400 text-sm mt-1">{order.products?.length} Items • <span className="text-gold font-semibold">₹{order.totalPrice}</span></p>
                                    <p className="text-gray-500 text-xs mt-1">{order.address}</p>
                                </div>

                                <div className="flex flex-wrap justify-center gap-2">
                                    {[
                                        { label: 'Accept', color: 'bg-blue-500/20 text-blue-400 hover:bg-blue-500 hover:text-white' },
                                        { label: 'Reject', color: 'bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white' },
                                        { label: 'Preparing', color: 'bg-amber-500/20 text-amber-400 hover:bg-amber-500 hover:text-white' },
                                        { label: 'Delivered', color: 'bg-green-500/20 text-green-400 hover:bg-green-500 hover:text-white' }
                                    ].map(status => (
                                        <button
                                            key={status.label}
                                            onClick={() => updateStatus(order._id, status.label)}
                                            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${order.status === status.label
                                                ? 'bg-gold text-cocoa-900 shadow-gold/20 shadow-lg'
                                                : `bg-white/5 text-white/40 ${status.color}`
                                                }`}
                                        >
                                            {status.label}
                                        </button>
                                    ))}
                                </div>

                                <div className="text-right flex flex-col items-end gap-2">
                                    <span className={`px-4 py-1.5 rounded-full text-[10px] uppercase tracking-wider font-black ${order.paymentStatus === 'Completed' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                                        }`}>
                                        {order.paymentStatus}
                                    </span>
                                    <p className="text-gray-500 text-[10px] font-mono">{new Date(order.createdAt).toLocaleString()}</p>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default AdminOrders;
