import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCalendar, FiMapPin, FiUser } from 'react-icons/fi';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../utils/formatDate';

const EventDetailsPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/events/${id}`).then(res => {
      setEvent(res.data);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <div className="animate-pulse space-y-4"><div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-xl"/></div>;
  if (!event) return <div className="text-center text-red-500">Event not found.</div>;

  return (
    <div className="max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-2xl overflow-hidden shadow-2xl">
        <img src={event.bannerImageUrl || 'https://via.placeholder.com/1200x400'} alt={event.title} className="w-full h-72 object-cover" />
        <div className="p-8">
          <h1 className="text-4xl font-bold gradient-text">{event.title}</h1>
          <div className="flex flex-wrap items-center gap-4 mt-4 text-gray-600 dark:text-gray-300">
            <span className="flex items-center"><FiUser className="mr-2" /> {event.organizerId?.name}</span>
            <span className="flex items-center"><FiCalendar className="mr-2" /> {formatDate(event.startDate)} - {formatDate(event.endDate)}</span>
            <span className="flex items-center"><FiMapPin className="mr-2" /> {event.venue}, {event.address}</span>
          </div>
          <p className="mt-6 whitespace-pre-line text-gray-700 dark:text-gray-200 leading-relaxed">{event.description}</p>
        </div>
      </motion.div>

      {/* Ticket Tiers */}
      <h2 className="text-3xl font-bold mt-12 mb-6 dark:text-white">Ticket Tiers</h2>
      <div className="grid gap-6">
        {event.tiers?.length > 0 ? event.tiers.map(tier => (
          <motion.div
            key={tier._id}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            whileHover={{ scale: 1.01 }}
            className="glass rounded-xl p-6 flex justify-between items-center"
          >
            <div>
              <h3 className="font-semibold text-xl dark:text-white">{tier.name}</h3>
              <p className="text-gray-600 dark:text-gray-300">{tier.description}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Available: {tier.totalQuantity - tier.soldCount} / {tier.totalQuantity}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold gradient-text">${tier.price}</p>
              {user ? (
                <Link to={`/checkout/${event._id}`} state={{ tiers: event.tiers }} className="mt-2 inline-block gradient-bg text-white px-6 py-2 rounded-full hover:scale-105 transition-transform">
                  Select
                </Link>
              ) : (
                <Link to="/login" className="mt-2 inline-block bg-gray-500 text-white px-6 py-2 rounded-full">Login to Buy</Link>
              )}
            </div>
          </motion.div>
        )) : <p className="text-gray-500 dark:text-gray-400">No ticket tiers available.</p>}
      </div>
    </div>
  );
};

export default EventDetailsPage;