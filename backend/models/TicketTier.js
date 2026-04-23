import mongoose from 'mongoose';

const ticketTierSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  totalQuantity: { type: Number, required: true, min: 1 },
  soldCount: { type: Number, default: 0 },
  description: { type: String }
});

const TicketTier = mongoose.model('TicketTier', ticketTierSchema);
export default TicketTier;