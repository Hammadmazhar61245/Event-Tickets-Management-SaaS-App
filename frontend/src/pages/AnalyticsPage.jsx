import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiDollarSign, FiClipboard, FiCalendar, FiTrendingDown } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../api/axios';

const AnalyticsPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/analytics').then(res => {
      setStats(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="text-center py-8">Loading analytics...</div>;
  if (!stats) return <div className="text-center py-8">Failed to load data.</div>;

  const chartData = stats.events?.map(e => ({
    name: e.title.length > 20 ? e.title.slice(0, 17) + '...' : e.title,
    tickets: e.ticketsSold || 0
  })) || [];

  return (
    <div>
      <h1 className="text-3xl font-bold gradient-text mb-8">Organizer Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <motion.div whileHover={{ y: -5 }} className="glass rounded-xl p-6">
          <FiCalendar className="w-8 h-8 text-primary-500 mb-2" />
          <p className="text-2xl font-bold dark:text-white">{stats.totalEvents}</p>
          <p className="text-gray-500 dark:text-gray-300">Total Events</p>
        </motion.div>
        <motion.div whileHover={{ y: -5 }} className="glass rounded-xl p-6">
          <FiClipboard className="w-8 h-8 text-green-500 mb-2" />
          <p className="text-2xl font-bold dark:text-white">{stats.totalTicketsSold}</p>
          <p className="text-gray-500 dark:text-gray-300">Tickets Sold</p>
        </motion.div>
        <motion.div whileHover={{ y: -5 }} className="glass rounded-xl p-6">
          <FiDollarSign className="w-8 h-8 text-yellow-500 mb-2" />
          <p className="text-2xl font-bold dark:text-white">${stats.totalRevenue.toFixed(2)}</p>
          <p className="text-gray-500 dark:text-gray-300">Revenue</p>
        </motion.div>
        <motion.div whileHover={{ y: -5 }} className="glass rounded-xl p-6">
          <FiTrendingDown className="w-8 h-8 text-red-500 mb-2" />
          <p className="text-2xl font-bold dark:text-white">{stats.ticketsCancelled}</p>
          <p className="text-gray-500 dark:text-gray-300">Cancellations</p>
        </motion.div>
      </div>
      <div className="glass rounded-xl p-6">
        <h2 className="text-xl font-semibold dark:text-white mb-4">Tickets per Event</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="tickets" fill="#6366f1" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AnalyticsPage;