import Order from '../models/Order.js';
import TicketTier from '../models/TicketTier.js';
import Ticket from '../models/Ticket.js';
import Event from '../models/Event.js';
import stripe from 'stripe';
import { sendOrderConfirmation } from '../utils/emailService.js';

const stripeInstance = stripe(process.env.STRIPE_SECRET_KEY);

export const createPaymentIntent = async (req, res) => {
  const { eventId, items } = req.body;
  try {
    // Validate items and calculate amount
    let total = 0;
    for (const item of items) {
      const tier = await TicketTier.findById(item.tierId);
      if (!tier) throw new Error(`Tier ${item.tierId} not found`);
      if (tier.soldCount + item.quantity > tier.totalQuantity) {
        throw new Error(`Not enough tickets for ${tier.name}`);
      }
      total += tier.price * item.quantity;
    }

    const paymentIntent = await stripeInstance.paymentIntents.create({
      amount: Math.round(total * 100), // cents
      currency: 'usd',
      metadata: { eventId, userId: req.user._id.toString() }
    });

    res.json({ clientSecret: paymentIntent.client_secret, total });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const createOrder = async (req, res) => {
  const { eventId, items, paymentIntentId } = req.body;
  try {
    // Recalculate and check availability
    let total = 0;
    const populatedItems = [];
    for (const item of items) {
      const tier = await TicketTier.findById(item.tierId);
      if (!tier) throw new Error('Ticket tier not found');
      if (tier.soldCount + item.quantity > tier.totalQuantity) {
        throw new Error(`Not enough tickets for ${tier.name}`);
      }
      total += tier.price * item.quantity;
      populatedItems.push({
        tierId: tier._id,
        tierName: tier.name,
        quantity: item.quantity,
        unitPrice: tier.price
      });
    }

    // Create order
    const order = await Order.create({
      attendeeId: req.user._id,
      eventId,
      items: populatedItems,
      totalAmount: total,
      paymentStatus: 'paid',
      stripePaymentIntentId: paymentIntentId
    });

    // Update ticket tiers sold count and generate tickets
    for (const item of populatedItems) {
      await TicketTier.findByIdAndUpdate(item.tierId, {
        $inc: { soldCount: item.quantity }
      });

      // Generate tickets (one per quantity)
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

    // Populate event details for email
    const event = await Event.findById(eventId);
    await sendOrderConfirmation(req.user.email, order, event);

    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

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