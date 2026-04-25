import Event from '../models/Event.js';

export const advancedSearch = async (req, res) => {
  try {
    const { query, category, startDate, endDate, minPrice, maxPrice, location } = req.query;
    let filter = { status: 'published' };

    if (query) {
      filter.title = { $regex: query, $options: 'i' };
    }
    if (category) {
      filter.category = { $regex: category, $options: 'i' };
    }
    if (startDate || endDate) {
      filter.startDate = {};
      if (startDate) filter.startDate.$gte = new Date(startDate);
      if (endDate) filter.startDate.$lte = new Date(endDate);
    }
    if (location) {
      filter.venue = { $regex: location, $options: 'i' };
    }

    // For price range, we need to filter events by ticket tiers (aggregation)
    let events;
    if (minPrice || maxPrice) {
      const match = { ...filter };
      events = await Event.aggregate([
        { $match: match },
        {
          $lookup: {
            from: 'tickettiers',
            localField: '_id',
            foreignField: 'eventId',
            as: 'tiers'
          }
        },
        {
          $match: {
            'tiers.price': minPrice ? { $gte: Number(minPrice) } : { $gte: 0 },
            ...(maxPrice && { 'tiers.price': { ...(minPrice && { $gte: Number(minPrice) }), $lte: Number(maxPrice) } })
          }
        }
      ]);
      // Mongoose doesn't auto-populate array fields, so we need to manually convert
      events = events.map(e => Event.hydrate(e));
    } else {
      events = await Event.find(filter).sort({ startDate: 1 });
    }

    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};