import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiBookmark } from 'react-icons/fi';
import api from '../api/axios';
import { formatDate } from '../utils/formatDate';
import toast from 'react-hot-toast';

const BookmarksPage = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/bookmarks')
      .then(res => setBookmarks(res.data))
      .finally(() => setLoading(false));
  }, []);

  const removeBookmark = async (eventId) => {
    try {
      await api.put(`/bookmarks/${eventId}`);
      setBookmarks(bookmarks.filter(e => e._id !== eventId));
      toast.success('Bookmark removed');
    } catch (err) {
      toast.error('Error removing bookmark');
    }
  };

  if (loading) return <div className="text-center py-8">Loading bookmarks...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold gradient-text mb-8">My Bookmarked Events</h1>
      {bookmarks.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">You haven't bookmarked any events yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarks.map(event => (
            <motion.div key={event._id} whileHover={{ y: -5 }} className="glass rounded-xl overflow-hidden">
              <img src={event.bannerImageUrl || 'https://via.placeholder.com/400x200'} className="w-full h-40 object-cover" alt={event.title} />
              <div className="p-4 flex justify-between items-start">
                <div>
                  <h3 className="font-semibold dark:text-white">{event.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-300">{formatDate(event.startDate)}</p>
                  <p className="text-sm text-gray-400">{event.venue}</p>
                </div>
                <button onClick={() => removeBookmark(event._id)} className="text-red-400 hover:text-red-600">
                  <FiBookmark className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookmarksPage;