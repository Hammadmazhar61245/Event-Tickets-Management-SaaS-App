import TicketTier from '../models/TicketTier.js';

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