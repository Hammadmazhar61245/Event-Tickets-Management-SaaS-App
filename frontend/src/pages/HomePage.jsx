import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api/axios';
import { formatDate } from '../utils/formatDate';

const HomePage = () => {
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/events').then(res => {
      setFeaturedEvents(res.data.slice(0, 6));
      setLoading(false);
    });
  }, []);

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="text-center py-20">
        <motion.h1 
          initial={{ y: -40, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-extrabold gradient-text mb-6"
        >
          Discover Amazing Events
        </motion.h1>
        <motion.p 
          initial={{ y: 20, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto"
        >
          Book tickets for the hottest events near you – with a seamless, beautiful experience.
        </motion.p>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Link to="/events" className="gradient-bg text-white px-8 py-4 rounded-full text-lg font-semibold hover:scale-105 inline-block transition-transform">
            Browse Events
          </Link>
        </motion.div>
      </section>

      {/* Featured Events */}
      <section className="mt-12">
        <h2 className="text-3xl font-bold mb-8 dark:text-white">Featured Events</h2>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-xl h-64"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredEvents.map((event, index) => (
              <motion.div
                key={event._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="glass rounded-xl overflow-hidden card-hover cursor-pointer"
              >
                <Link to={`/events/${event._id}`}>
                  <img src={event.bannerImageUrl || 'https://via.placeholder.com/400x200?text=Event'} alt={event.title} className="w-full h-48 object-cover" />
                  <div className="p-5">
                    <h3 className="font-semibold text-xl dark:text-white">{event.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">{formatDate(event.startDate)}</p>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">{event.venue}</p>
                    <span className="mt-3 inline-block px-3 py-1 text-xs font-medium text-primary-700 bg-primary-100 dark:bg-primary-900 dark:text-primary-200 rounded-full">
                      {event.category}
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;