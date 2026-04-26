import Order from '../models/Order.js';
import TicketTier from '../models/TicketTier.js';
import Ticket from '../models/Ticket.js';
import Event from '../models/Event.js';
import PromoCode from '../models/PromoCode.js';
import { sendOrderConfirmation } from '../utils/emailService.js';
import { applyPromoCode } from '../controllers/promoController.js';

// ----- Simulate a successful payment -----
export const simulatePayment = async (req, res) => {
  const { eventId, items, promoCode } = req.body;

  try {
    let total = 0;
    const populatedItems = [];

    // 1. Validate ticket tiers & calculate total
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

    // 2. Apply promo code if provided
    let discountAmount = 0;
    if (promoCode) {
      const promo = await PromoCode.findOne({ code: promoCode.toUpperCase() });
      if (!promo || !promo.isActive) {
        return res.status(400).json({ message: 'Invalid promo code' });
      }
      if (promo.validFrom && new Date() < promo.validFrom) {
        return res.status(400).json({ message: 'Promo code not yet active' });
      }
      if (promo.validUntil && new Date() > promo.validUntil) {
        return res.status(400).json({ message: 'Promo code expired' });
      }
      if (promo.maxUses && promo.usedCount >= promo.maxUses) {
        return res.status(400).json({ message: 'Promo code usage limit reached' });
      }
      if (total < promo.minOrderAmount) {
        return res.status(400).json({ message: `Minimum order $${promo.minOrderAmount} not met` });
      }

      if (promo.discountType === 'percentage') {
        discountAmount = (total * promo.discountValue) / 100;
      } else {
        discountAmount = promo.discountValue;
      }
      discountAmount = Math.min(discountAmount, total);  // cannot exceed order total
      await applyPromoCode(promoCode);   // increment usage count
    }

    const finalTotal = total - discountAmount;

    // 3. Create the order
    const order = await Order.create({
      attendeeId: req.user._id,
      eventId,
      items: populatedItems,
      totalAmount: finalTotal,
      paymentStatus: 'paid',
      stripePaymentIntentId: 'simulated_' + Date.now()
    });

    // 4. Update ticket tier sold counts & generate tickets
    for (const item of populatedItems) {
      await TicketTier.findByIdAndUpdate(item.tierId, {
        $inc: { soldCount: item.quantity }
      });
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

    // 5. Send confirmation email
    const event = await Event.findById(eventId);
    try {
      await sendOrderConfirmation(req.user.email, order, event);
    } catch (emailErr) {
      console.error('Email sending failed:', emailErr.message);
    }

    // 6. Return populated order
    const fullOrder = await Order.findById(order._id)
      .populate('eventId', 'title startDate venue bannerImageUrl')
      .populate('attendeeId', 'name email');

    res.status(201).json(fullOrder);
  } catch (error) {
    console.error('Simulate payment error:', error);
    res.status(500).json({ message: error.message });
  }
};

// ----- Get all orders of the logged-in user -----
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ attendeeId: req.user._id })
      .select('items totalAmount paymentStatus createdAt eventId')
      .populate('eventId', 'title startDate venue bannerImageUrl')
      .sort({ createdAt: -1 })
      .lean();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ----- Get a single order by ID (owner or organizer) -----
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('eventId', 'title startDate venue bannerImageUrl')
      .populate('attendeeId', 'name email')
      .lean();

    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (
      order.attendeeId._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'organizer'
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const tickets = await Ticket.find({ orderId: order._id }).lean();
    res.json({ ...order, tickets });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ----- Get all tickets of the logged-in user -----
export const getMyTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ attendeeId: req.user._id })
      .populate('eventId', 'title startDate venue bannerImageUrl')
      .select('tierName status issuedAt eventId')
      .sort({ issuedAt: -1 })
      .lean();
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};