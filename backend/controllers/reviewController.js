import mongoose from 'mongoose';
import Review from '../models/Review.js';

export const addReview = async (req, res) => {
  const { eventId, rating, comment } = req.body;
  try {
    // Check if user already reviewed this event
    const existing = await Review.findOne({ userId: req.user._id, eventId });
    if (existing) {
      return res.status(400).json({ message: 'You already reviewed this event' });
    }
    const review = await Review.create({
      userId: req.user._id,
      eventId,
      rating,
      comment
    });
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getEventReviews = async (req, res) => {
  const { eventId } = req.params;
  try {
    const reviews = await Review.find({ eventId })
      .populate('userId', 'name profilePicture')
      .sort({ createdAt: -1 });

    // Calculate average rating
    const avg = await Review.aggregate([
      { $match: { eventId: new mongoose.Types.ObjectId(eventId) } },
      { $group: { _id: null, average: { $avg: '$rating' }, count: { $sum: 1 } } }
    ]);

    const average = avg[0]?.average?.toFixed(1) || 0;
    const count = avg[0]?.count || 0;

    res.json({ reviews, average, count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};