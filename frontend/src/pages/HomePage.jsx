import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiSearch,
  FiMapPin,
  FiCalendar,
  FiArrowRight,
  FiUsers,
  FiStar,
  FiActivity,
  FiCreditCard,
  FiCheckCircle,
  FiTruck,
  FiHash,
} from 'react-icons/fi';
import api from '../api/axios';

const HomePage = () => {
  const navigate = useNavigate();
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Fetch published events, pick the first 3 upcoming as featured
    api.get('/events').then(res => {
      const upcoming = res.data
        .filter(e => new Date(e.startDate) > new Date())
        .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
      setFeaturedEvents(upcoming.slice(0, 3));
    });
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/events?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="animate-fade-in space-y-24 pb-16">
      {/* ───── Hero Section ───── */}
      <section className="relative overflow-hidden bg-white dark:bg-gray-900 rounded-3xl shadow-xl">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary-100/50 to-blue-100/50 dark:from-primary-900/20 dark:to-blue-900/20" />
        <div className="relative z-10 flex flex-col lg:flex-row items-center p-8 md:p-16 gap-10">
          {/* Left text */}
          <div className="flex-1 space-y-6">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-6xl font-extrabold dark:text-white"
            >
              Discover Incredible
              <br />
              <span className="gradient-text">Events Near You</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl"
            >
              Book tickets for the hottest concerts, festivals, and experiences —
              seamlessly, beautifully, instantly.
            </motion.p>

            {/* Search Bar */}
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              onSubmit={handleSearch}
              className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-full px-5 py-3 shadow-md max-w-md border border-gray-200 dark:border-gray-700"
            >
              <FiSearch className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search events, categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent outline-none text-gray-700 dark:text-gray-200 placeholder:text-gray-400"
              />
              <button
                type="submit"
                className="gradient-bg text-white p-2 rounded-full hover:scale-105 transition"
              >
                <FiArrowRight className="w-4 h-4" />
              </button>
            </motion.form>
          </div>

          {/* Right stats */}
          <div className="flex-1 grid grid-cols-2 gap-4">
            <StatCard icon={<FiActivity className="w-6 h-6 text-primary-500" />} value="12K+" label="Live Events" />
            <StatCard icon={<FiUsers className="w-6 h-6 text-green-500" />} value="3.4M" label="Attendees" />
            <StatCard icon={<FiStar className="w-6 h-6 text-yellow-500" />} value="98%" label="Satisfaction" />
            <StatCard icon={<FiCalendar className="w-6 h-6 text-red-500" />} value={featuredEvents.length} label="Upcoming" />
          </div>
        </div>
      </section>

      {/* ───── How It Works ───── */}
      <section className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold dark:text-white mb-12">
          How It <span className="gradient-text">Works</span>
        </h2>
        <div className="flex flex-col md:flex-row gap-10 justify-center">
          <StepCard
            icon={<FiSearch className="w-8 h-8 text-primary-500" />}
            title="Find Events"
            description="Browse thousands of events or search by category, location, and date."
          />
          <StepCard
            icon={<FiCreditCard className="w-8 h-8 text-primary-500" />}
            title="Book Tickets"
            description="Secure your spot instantly with our simulated payment system."
          />
          <StepCard
            icon={<FiCheckCircle className="w-8 h-8 text-primary-500" />}
            title="Enjoy the Show"
            description="Download your ticket with QR code and have an amazing experience."
          />
        </div>
      </section>

      {/* ───── Featured Events ───── */}
      {featuredEvents.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl md:text-4xl font-bold dark:text-white">
              Featured <span className="gradient-text">Events</span>
            </h2>
            <Link
              to="/events"
              className="text-primary-600 hover:underline flex items-center gap-2"
            >
              View All <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredEvents.map((event, idx) => (
              <motion.div
                key={event._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                className="glass rounded-2xl overflow-hidden shadow-md card-hover"
              >
                <Link to={`/events/${event._id}`}>
                  <img
                    src={event.bannerImageUrl || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
                    alt={event.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-5 space-y-3">
                    <span className="px-3 py-1 text-xs font-medium text-primary-700 bg-primary-100 dark:bg-primary-900 dark:text-primary-200 rounded-full">
                      {event.category}
                    </span>
                    <h3 className="text-xl font-semibold dark:text-white">{event.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <FiCalendar className="w-4 h-4" />
                      <span>{new Date(event.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <FiMapPin className="w-4 h-4" />
                      <span>{event.venue}</span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 line-clamp-2">{event.description}</p>
                    <div className="flex items-center justify-between pt-2">
                      <p className="text-lg font-bold gradient-text">
                        From ${event.tiers?.[0]?.price || '0.00'}
                      </p>
                      <FiArrowRight className="text-primary-500 w-5 h-5" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* ───── Trust Bar ───── */}
      <section className="text-center">
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Trusted by thousands of event organizers worldwide
        </p>
        <div className="flex justify-center gap-10 mt-4 opacity-50">
          <span className="text-lg font-semibold dark:text-white">EventTix</span>
          <span className="text-lg font-semibold dark:text-white">Live</span>
          <span className="text-lg font-semibold dark:text-white">Gather</span>
        </div>
      </section>
    </div>
  );
};

// ── Reusable Components ──

const StatCard = ({ icon, value, label }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm flex items-center gap-4 hover:shadow-md transition"
  >
    <div className="p-3 rounded-full bg-gray-100 dark:bg-gray-700">
      {icon}
    </div>
    <div>
      <p className="text-2xl font-bold dark:text-white">{value}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
    </div>
  </motion.div>
);

const StepCard = ({ icon, title, description }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="flex flex-col items-center text-center max-w-xs glass rounded-2xl p-8 shadow-sm"
  >
    <div className="p-4 rounded-full bg-primary-100 dark:bg-primary-900 mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-semibold dark:text-white mb-2">{title}</h3>
    <p className="text-gray-600 dark:text-gray-300">{description}</p>
  </motion.div>
);

export default HomePage;