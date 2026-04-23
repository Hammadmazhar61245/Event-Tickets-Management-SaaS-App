import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  tierId: { type: mongoose.Schema.Types.ObjectId, ref: 'TicketTier', required: true },
  tierName: { type: String, required: true },
  quantity: { type: Number, required: true },
  unitPrice: { type: Number, required: true }
});

const orderSchema = new mongoose.Schema({
  attendeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  items: [orderItemSchema],
  totalAmount: { type: Number, required: true },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
  stripePaymentIntentId: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);
export default Order;