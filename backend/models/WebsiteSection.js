/**
 * WebsiteSection - Editable content for Hero, About, Contact, etc.
 * Admin can update text, images, buttons, and toggle section visibility.
 */
import mongoose from 'mongoose';

const websiteSectionSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true }, // e.g. 'hero', 'about', 'contact'
  title: { type: String, default: '' },
  content: { type: mongoose.Schema.Types.Mixed, default: {} }, // Flexible JSON for text, images, buttons
  isEnabled: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model('WebsiteSection', websiteSectionSchema);
