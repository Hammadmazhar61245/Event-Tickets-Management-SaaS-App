import Ticket from '../models/Ticket.js';
import Event from '../models/Event.js';

export const getAttendees = async (req, res) => {
  try {
    // Get all events owned by the organizer
    const events = await Event.find({ organizerId: req.user._id }).select('_id');
    const eventIds = events.map(e => e._id);

    const tickets = await Ticket.find({ eventId: { $in: eventIds } })
      .populate('attendeeId', 'name email profilePicture phone')
      .populate('eventId', 'title startDate venue')
      .sort({ issuedAt: -1 })
      .lean();

    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};