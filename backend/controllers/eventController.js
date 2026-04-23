import Event from '../models/Event.js';
import TicketTier from '../models/TicketTier.js';

export const createEvent = async (req, res) => {
  try {
    const event = await Event.create({
      ...req.body,
      organizerId: req.user._id
    });
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getEvents = async (req, res) => {
  try {
    const events = await Event.find({ status: 'published' })
      .populate('organizerId', 'name email')
      .sort({ startDate: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizerId', 'name email');
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    const tiers = await TicketTier.find({ eventId: event._id });
    res.json({ ...event.toObject(), tiers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    if (event.organizerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedEvent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    if (event.organizerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await event.deleteOne();
    await TicketTier.deleteMany({ eventId: event._id });
    res.json({ message: 'Event removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({ organizerId: req.user._id }).sort({ createdAt: -1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};