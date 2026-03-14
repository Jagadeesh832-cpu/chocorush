import mongoose from 'mongoose';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/chocorush';

// Unique chocolate images (images.unsplash.com - reliable, source.unsplash.com is deprecated)
const products = [
  {
    name: 'Dark Truffle Delight',
    description: 'Rich 70% dark chocolate truffles with a velvety ganache center',
    price: 199,
    category: 'Truffles',
    image: 'https://images.unsplash.com/photo-1606312619070-d48b4f7b7168?w=800&h=800&fit=crop&q=85',
  },
  {
    name: 'Hazelnut Heaven',
    description: 'Premium hazelnut balls enrobed in fine chocolate and crunch',
    price: 249,
    category: 'Nuts',
    image: 'https://images.pexels.com/photos/4110101/pexels-photo-4110101.jpeg',
  },
  {
    name: 'Caramel Crunch',
    description: 'Sea salt caramel pieces wrapped in dark chocolate bites',
    price: 229,
    category: 'Bars',
    image: 'https://images.pexels.com/photos/45202/brownie-dessert-cake-sweet-45202.jpeg',
  },
  {
    name: 'Choco Berry Delight',
    description: 'A mix of dark chocolate and tart wild berries',
    price: 269,
    category: 'Fruits',
    image: 'https://images.pexels.com/photos/4051553/pexels-photo-4051553.jpeg',
  },
  {
    name: 'Luxury Chocolate Gift Pack',
    description: 'The ultimate luxurious chocolate gifting experience',
    price: 499,
    category: 'Assorted',
    image: 'https://images.pexels.com/photos/2067396/pexels-photo-2067396.jpeg',
  }
];

const seed = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    await Product.deleteMany({});
    const createdProducts = await Product.insertMany(products);
    console.log('Sample products created.');

    await User.deleteMany({});
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@chocorush.com',
      password: 'adminpassword',
      role: 'admin'
    });
    const customer = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      role: 'customer',
      address: {
        street: '123 Cocoa Lane',
        city: 'Mumbai',
        state: 'Maharashtra',
        zipCode: '400001'
      }
    });
    console.log('Sample users created.');

    await Order.deleteMany({});
    const sampleOrder = await Order.create({
      user: customer._id,
      products: [
        { product: createdProducts[0]._id, quantity: 2 },
        { product: createdProducts[1]._id, quantity: 1 }
      ],
      totalPrice: 1347,
      status: 'Preparing',
      paymentStatus: 'Completed',
      deliveryAddress: customer.address
    });
    console.log(`Sample order created: ${sampleOrder._id}`);

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();
