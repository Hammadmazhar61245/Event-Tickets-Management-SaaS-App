import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api/axios';
import { formatDate } from '../utils/formatDate';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');

  useEffect(() => {
    api.get('/events').then(res => {
      setEvents(res.data);
      setLoading(false);
    });
  }, []);

  const filtered = category
    ? events.filter(e => e.category.toLowerCase().includes(category.toLowerCase()))
    : events;

  return (
    <div>
      <h1 className="text-4xl font-bold gradient-text mb-8">Discover Events</h1>
      <div className="mb-8">
        <input
          type="text"
          placeholder="Filter by category..."
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full max-w-md px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-800/50 focus:ring-2 focus:ring-primary-500 outline-none backdrop-blur-sm"
        />
      </div>
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => <div key={i} className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-xl h-64"></div>)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((event, idx) => (
            <motion.div
              key={event._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ y: -5 }}
            >
              <Link to={`/events/${event._id}`} className="glass rounded-xl overflow-hidden block card-hover">
                <img src={event.bannerImageUrl || 'https://via.placeholder.com/400x200'} alt={event.title} className="w-full h-48 object-cover" />
                <div className="p-5">
                  <h3 className="font-semibold text-xl dark:text-white">{event.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">{formatDate(event.startDate)}</p>
                  <p className="text-gray-500 dark:text-gray-400">{event.venue}</p>
                  <span className="mt-2 inline-block px-3 py-1 text-xs font-medium text-primary-700 bg-primary-100 dark:bg-primary-900 dark:text-primary-200 rounded-full">{event.category}</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventsPage;