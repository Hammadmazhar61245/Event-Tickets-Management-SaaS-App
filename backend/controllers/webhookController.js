import stripe from 'stripe';
import Order from '../models/Order.js';
import TicketTier from '../models/TicketTier.js';
import Ticket from '../models/Ticket.js';
import Event from '../models/Event.js';
import { sendOrderConfirmation } from '../utils/emailService.js';

const stripeInstance = stripe(process.env.STRIPE_SECRET_KEY);

export const handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripeInstance.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    const { eventId, userId } = paymentIntent.metadata;

    // Check if order already exists to avoid duplicate
    const existingOrder = await Order.findOne({ stripePaymentIntentId: paymentIntent.id });
    if (existingOrder) {
      return res.json({ received: true });
    }

    // We need the items from somewhere - typically stored in payment metadata or client side.
    // For simplicity, we assume items were sent in metadata (serialized). In production you'd store a cart session.
    // Since we don't have items here, we'll rely on the frontend calling /api/orders after payment.
    // But webhook should still handle. We'll log for now.
    console.log(`Payment succeeded for intent ${paymentIntent.id}, event ${eventId}, user ${userId}`);
    // Optionally you could implement order creation here if you store cart in DB.
  }

  res.json({ received: true });
};