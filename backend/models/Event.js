import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  organizerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  venue: { type: String, required: true },
  address: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  bannerImageUrl: { type: String, default: '' },
  status: { type: String, enum: ['draft', 'published', 'cancelled'], default: 'draft' },
  createdAt: { type: Date, default: Date.now }
});

const Event = mongoose.model('Event', eventSchema);
export default Event;