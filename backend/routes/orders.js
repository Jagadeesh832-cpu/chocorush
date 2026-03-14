import express from 'express';
import Order from '../models/Order.js';
import { getIO } from '../socket.js';
import { authenticate, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// GET all orders - Admin only
router.get('/all', authenticate, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find().populate('user').populate('products.product').sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create order
router.post('/', async (req, res) => {
  const order = new Order({
    ...req.body,
    status: 'Ordered',
    paymentStatus: 'Pending'
  });
  try {
    const newOrder = await order.save();
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET user orders
router.get('/user/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId }).populate('products.product');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single order tracking
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('products.product');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH update status - Admin only
router.patch('/:id/status', authenticate, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });

    // Emit socket event for real-time tracking update
    const io = getIO();
    io.to(req.params.id).emit('statusUpdate', { orderId: req.params.id, status });

    res.json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
