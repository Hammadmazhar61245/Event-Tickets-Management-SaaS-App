import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSearch, FiMapPin, FiCalendar, FiArrowRight, FiUsers, FiStar, FiActivity } from 'react-icons/fi';
import api from '../api/axios';

const HomePage = () => {
  const [featuredEvent, setFeaturedEvent] = useState(null);
  const [stats, setStats] = useState({ totalEvents: 0, totalAttendees: 0 });

  useEffect(() => {
    // Fetch published events, pick the first upcoming one as featured
    api.get('/events').then(res => {
      const upcoming = res.data.filter(e => new Date(e.startDate) > new Date()).sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
      if (upcoming.length > 0) setFeaturedEvent(upcoming[0]);
      // Build stats (mock numbers for demo)
      setStats({
        totalEvents: res.data.length,
        totalAttendees: 1240, // you could fetch from analytics if you want real numbers
      });
    });
  }, []);

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white dark:bg-gray-900 rounded-3xl shadow-xl mb-16">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary-100/50 to-purple-100/50 dark:from-primary-900/20 dark:to-purple-900/20" />
        <div className="relative z-10 flex flex-col lg:flex-row items-center p-8 md:p-16">
          <div className="flex-1 space-y-6">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-6xl font-extrabold dark:text-white"
            >
              Discover Incredible Events
              <br />
              <span className="gradient-text">Near You</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl"
            >
              Book tickets for the hottest concerts, festivals, and experiences — seamlessly, beautifully, instantly.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-4 items-center"
            >
              <Link
                to="/events"
                className="gradient-bg text-white px-8 py-4 rounded-full text-lg font-semibold hover:scale-105 transition-transform inline-flex items-center gap-2"
              >
                Explore Events <FiArrowRight />
              </Link>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <FiMapPin />
                <span>New York, NY</span>
              </div>
            </motion.div>
          </div>

          {/* Stats */}
          <div className="flex-1 mt-10 lg:mt-0 lg:ml-10">
            <div className="grid grid-cols-2 gap-4">
              <StatCard icon={<FiActivity className="w-6 h-6 text-primary-500" />} value="12K+" label="Live Events" />
              <StatCard icon={<FiUsers className="w-6 h-6 text-green-500" />} value="3.4M" label="Attendees" />
              <StatCard icon={<FiStar className="w-6 h-6 text-yellow-500" />} value="98%" label="Satisfaction" />
              <StatCard icon={<FiCalendar className="w-6 h-6 text-red-500" />} value={stats.totalEvents} label="Upcoming" />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Event */}
      {featuredEvent && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-white dark:bg-gray-900 shadow-xl p-8 md:p-12 flex flex-col lg:flex-row items-center gap-8"
        >
          <div className="w-full lg:w-1/2">
            <img
              src={featuredEvent.bannerImageUrl || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
              alt={featuredEvent.title}
              className="w-full h-72 object-cover rounded-2xl shadow-lg"
            />
          </div>
          <div className="w-full lg:w-1/2 space-y-5">
            <div className="flex items-center gap-2 text-sm text-primary-600 dark:text-primary-400">
              <FiCalendar className="w-4 h-4" />
              <span>{new Date(featuredEvent.startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold dark:text-white">{featuredEvent.title}</h2>
            <p className="text-gray-600 dark:text-gray-300 line-clamp-3">{featuredEvent.description}</p>
            <div className="flex items-center gap-6">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Starting at</p>
                <p className="text-2xl font-bold gradient-text">
                  ${featuredEvent.tiers?.[0]?.price ? featuredEvent.tiers[0].price : '0.00'}
                </p>
              </div>
              <Link
                to={`/events/${featuredEvent._id}`}
                className="gradient-bg text-white px-8 py-3 rounded-full font-semibold hover:scale-105 transition-transform inline-flex items-center gap-2"
              >
                Book Now <FiArrowRight />
              </Link>
            </div>
          </div>
        </motion.div>
      )}

      {/* Additional Info (optional) */}
      <div className="mt-16 text-center">
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Trusted by thousands of event organizers worldwide
        </p>
        <div className="flex justify-center gap-8 mt-4 opacity-50">
          <span className="text-lg font-semibold dark:text-white">EventTix</span>
          <span className="text-lg font-semibold dark:text-white">Live</span>
          <span className="text-lg font-semibold dark:text-white">Gather</span>
        </div>
      </div>
    </div>
  );
};

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

export default HomePage;