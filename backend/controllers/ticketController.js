import TicketTier from '../models/TicketTier.js';
import Ticket from '../models/Ticket.js';
import Order from '../models/Order.js';

export const createTicketTier = async (req, res) => {
  try {
    const tier = await TicketTier.create({ ...req.body, eventId: req.params.eventId });
    res.status(201).json(tier);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getTicketTiers = async (req, res) => {
  try {
    const tiers = await TicketTier.find({ eventId: req.params.eventId });
    res.json(tiers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTicketTier = async (req, res) => {
  try {
    const tier = await TicketTier.findById(req.params.tierId);
    if (!tier) return res.status(404).json({ message: 'Tier not found' });
    const updatedTier = await TicketTier.findByIdAndUpdate(
      req.params.tierId,
      req.body,
      { new: true }
    );
    res.json(updatedTier);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteTicketTier = async (req, res) => {
  try {
    await TicketTier.findByIdAndDelete(req.params.tierId);
    res.json({ message: 'Ticket tier removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const cancelTicket = async (req, res) => {
  const { ticketId } = req.params;
  try {
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
    if (ticket.attendeeId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    if (ticket.status !== 'valid') {
      return res.status(400).json({ message: 'Ticket cannot be cancelled' });
    }

    ticket.status = 'cancelled';
    await ticket.save();

    // Simulated refund – update order payment status
    const order = await Order.findById(ticket.orderId);
    if (order) {
      order.paymentStatus = 'refunded';
      await order.save();
    }

    // Restore ticket tier count
    await TicketTier.findByIdAndUpdate(ticket.tierId, { $inc: { soldCount: -1 } });

    res.json({ message: 'Ticket cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};