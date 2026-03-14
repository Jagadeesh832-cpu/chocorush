import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['customer', 'admin', 'delivery'], default: 'customer' },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  wallet: { type: Number, default: 0 }
}, { timestamps: true });

/**
 * Pre-save hook: Hash password with bcrypt before saving to DB.
 * Uses 10 salt rounds. Skips if password was not modified (e.g. on profile update).
 */
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

/**
 * Instance method: Compare plain-text password with stored hash.
 * Uses bcrypt.compare(). Must be called on a Mongoose document (do not use .lean() in login query).
 * @param {string} candidatePassword - Plain password from login form
 * @returns {Promise<boolean>} - True if match
 */
userSchema.method('comparePassword', async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
});

export default mongoose.model('User', userSchema);
