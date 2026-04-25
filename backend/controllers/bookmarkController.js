import User from '../models/User.js';

export const toggleBookmark = async (req, res) => {
  const { eventId } = req.params;
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const index = user.bookmarkedEvents.indexOf(eventId);
    if (index === -1) {
      user.bookmarkedEvents.push(eventId);
    } else {
      user.bookmarkedEvents.splice(index, 1);
    }
    await user.save();
    res.json({ bookmarkedEvents: user.bookmarkedEvents });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBookmarks = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('bookmarkedEvents');
    res.json(user.bookmarkedEvents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};