import Event from '../models/Event.js';
import Order from '../models/Order.js';
import Ticket from '../models/Ticket.js';

export const organizerAnalytics = async (req, res) => {
  try {
    const organizerId = req.user._id;
    const events = await Event.find({ organizerId });
    const eventIds = events.map(e => e._id);

    const totalEvents = events.length;
    const totalTicketsSold = await Ticket.countDocuments({ eventId: { $in: eventIds }, status: 'valid' });
    const ticketsCancelled = await Ticket.countDocuments({ eventId: { $in: eventIds }, status: 'cancelled' });
    const revenue = await Order.aggregate([
      { $match: { eventId: { $in: eventIds }, paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    res.json({
      totalEvents,
      totalTicketsSold,
      ticketsCancelled,
      totalRevenue: revenue[0]?.total || 0,
      events
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};