import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import io from 'socket.io-client';

const statusSteps = ['Ordered', 'Preparing', 'Shipped', 'Delivered'];

const OrderTracking = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [currentStatus, setCurrentStatus] = useState('');

    useEffect(() => {
        // Fetch initial order status
        fetch(`http://localhost:5000/api/orders/${id}`)
            .then(res => res.json())
            .then(data => {
                setOrder(data);
                setCurrentStatus(data.status);
            });

        // Connect to Socket.io
        const socket = io('http://localhost:5000');
        socket.emit('joinOrder', id);

        socket.on('statusUpdate', (data) => {
            if (data.orderId === id) {
                setCurrentStatus(data.status);
            }
        });

        return () => socket.disconnect();
    }, [id]);

    if (!order) return <div className="min-h-screen flex items-center justify-center">Loading Tracking Details...</div>;

    const currentStepIndex = statusSteps.indexOf(currentStatus);

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 md:px-8">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass p-8 rounded-3xl border border-gold/20"
                >
                    <h1 className="text-4xl font-serif text-gold mb-2">Track Your Delicacies</h1>
                    <p className="text-gray-400 mb-8">Order ID: #{id}</p>

                    <div className="relative flex justify-between items-center mb-12">
                        {/* Progress Bar Background */}
                        <div className="absolute top-1/2 left-0 w-full h-1 bg-white/10 -translate-y-1/2 z-0"></div>

                        {/* Active Progress Bar */}
                        <motion.div
                            className="absolute top-1/2 left-0 h-1 bg-gold -translate-y-1/2 z-0"
                            initial={{ width: '0%' }}
                            animate={{ width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%` }}
                            transition={{ duration: 1, ease: "easeInOut" }}
                        ></motion.div>

                        {statusSteps.map((step, index) => (
                            <div key={step} className="relative z-10 flex flex-col items-center">
                                <motion.div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-500 ${index <= currentStepIndex ? 'bg-gold border-gold text-cocoa-900' : 'bg-cocoa-900 border-white/20 text-white/40'
                                        }`}
                                    animate={index === currentStepIndex ? { scale: [1, 1.2, 1] } : {}}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                >
                                    {index + 1}
                                </motion.div>
                                <span className={`mt-4 font-medium ${index <= currentStepIndex ? 'text-gold' : 'text-white/40'}`}>
                                    {step}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-white/10">
                        <div>
                            <h3 className="text-xl font-serif text-gold mb-4">Delivery Address</h3>
                            <p className="text-gray-300">
                                {order.deliveryAddress?.street}<br />
                                {order.deliveryAddress?.city}, {order.deliveryAddress?.state}<br />
                                {order.deliveryAddress?.zipCode}
                            </p>
                        </div>
                        <div>
                            <h3 className="text-xl font-serif text-gold mb-4">Estimated Delivery</h3>
                            <p className="text-3xl font-bold">45-60 mins</p>
                            <p className="text-gray-400 text-sm mt-2">Our artisans are crafting your order with love.</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default OrderTracking;
