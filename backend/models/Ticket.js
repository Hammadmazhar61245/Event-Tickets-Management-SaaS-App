import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  tierId: { type: mongoose.Schema.Types.ObjectId, ref: 'TicketTier', required: true },
  attendeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tierName: { type: String, required: true },
  status: { type: String, enum: ['valid', 'used', 'cancelled'], default: 'valid' },
  issuedAt: { type: Date, default: Date.now }
});

const Ticket = mongoose.model('Ticket', ticketSchema);
export default Ticket;