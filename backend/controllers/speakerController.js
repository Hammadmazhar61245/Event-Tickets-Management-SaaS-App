import Speaker from '../models/Speaker.js';

export const createSpeaker = async (req, res) => {
  try {
    const speaker = await Speaker.create({ ...req.body, organizerId: req.user._id });
    res.status(201).json(speaker);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getSpeakers = async (req, res) => {
  try {
    const speakers = await Speaker.find({ organizerId: req.user._id }).sort({ name: 1 });
    res.json(speakers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateSpeaker = async (req, res) => {
  try {
    const speaker = await Speaker.findById(req.params.id);
    if (!speaker) return res.status(404).json({ message: 'Speaker not found' });
    if (speaker.organizerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const updated = await Speaker.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteSpeaker = async (req, res) => {
  try {
    const speaker = await Speaker.findById(req.params.id);
    if (!speaker) return res.status(404).json({ message: 'Speaker not found' });
    if (speaker.organizerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await speaker.deleteOne();
    res.json({ message: 'Speaker removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};