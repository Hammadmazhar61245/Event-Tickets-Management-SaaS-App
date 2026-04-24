import Order from '../models/Order.js';
import TicketTier from '../models/TicketTier.js';
import Ticket from '../models/Ticket.js';
import Event from '../models/Event.js';
import { sendOrderConfirmation } from '../utils/emailService.js';

// Simulate a successful payment
export const simulatePayment = async (req, res) => {
  const { eventId, items } = req.body;

  try {
    // Validate items and check availability
    let total = 0;
    const populatedItems = [];

    for (const item of items) {
      const tier = await TicketTier.findById(item.tierId);
      if (!tier) {
        return res.status(404).json({ message: `Ticket tier ${item.tierId} not found` });
      }
      if (tier.soldCount + item.quantity > tier.totalQuantity) {
        return res.status(400).json({ message: `Not enough tickets for ${tier.name}` });
      }
      total += tier.price * item.quantity;
      populatedItems.push({
        tierId: tier._id,
        tierName: tier.name,
        quantity: item.quantity,
        unitPrice: tier.price
      });
    }

    // Create order (payment status = 'paid')
    const order = await Order.create({
      attendeeId: req.user._id,
      eventId,
      items: populatedItems,
      totalAmount: total,
      paymentStatus: 'paid',
      stripePaymentIntentId: 'simulated_' + Date.now() // dummy value
    });

    // Update ticket tiers sold count and generate tickets
    for (const item of populatedItems) {
      await TicketTier.findByIdAndUpdate(item.tierId, {
        $inc: { soldCount: item.quantity }
      });

      // Generate one ticket per item quantity
      for (let i = 0; i < item.quantity; i++) {
        await Ticket.create({
          orderId: order._id,
          eventId,
          tierId: item.tierId,
          attendeeId: req.user._id,
          tierName: item.tierName
        });
      }
    }

    // Populate event for email and response
    const event = await Event.findById(eventId);

    // Send confirmation email (can fail silently in dev)
    try {
      await sendOrderConfirmation(req.user.email, order, event);
    } catch (emailErr) {
      console.error('Email sending failed:', emailErr.message);
    }

    const fullOrder = await Order.findById(order._id)
      .populate('eventId', 'title startDate venue bannerImageUrl')
      .populate('attendeeId', 'name email');

    res.status(201).json(fullOrder);
  } catch (error) {
    console.error('Simulate payment error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Keep existing order retrieval functions unchanged
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ attendeeId: req.user._id })
      .populate('eventId', 'title startDate venue')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('eventId', 'title startDate venue bannerImageUrl')
      .populate('attendeeId', 'name email');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.attendeeId._id.toString() !== req.user._id.toString() && req.user.role !== 'organizer') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const tickets = await Ticket.find({ orderId: order._id });
    res.json({ ...order.toObject(), tickets });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ attendeeId: req.user._id })
      .populate('eventId', 'title startDate venue bannerImageUrl')
      .sort({ issuedAt: -1 });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};