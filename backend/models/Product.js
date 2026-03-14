import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  category: {
    type: String,
    required: true,
    enum: ['Truffles', 'Fudge', 'Assorted', 'Nuts', 'Sugar-Free', 'Bars', 'Bites', 'Fruits']
  },
  stock: { type: Number, default: 0 },
  rating: { type: Number, default: 5 },
  isActive: { type: Boolean, default: true }  // Admin can enable/disable products
}, { timestamps: true });

export default mongoose.model('Product', productSchema);
