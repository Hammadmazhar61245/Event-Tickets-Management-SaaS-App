import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiClipboard, FiCalendar, FiDollarSign, FiArrowRight } from 'react-icons/fi';
import api from '../api/axios';

const AttendeeDashboard = () => {
  const [stats, setStats] = useState({ ticketCount: 0, totalSpent: 0, upcomingEvents: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ticketsRes = await api.get('/orders/mytickets');
        const validTickets = ticketsRes.data.filter((t) => t.status === 'valid');
        const ticketCount = validTickets.length;

        // Calculate total spent from orders
        const ordersRes = await api.get('/orders/myorders');
        const totalSpent = ordersRes.data
          .filter((o) => o.paymentStatus === 'paid')
          .reduce((sum, o) => sum + o.totalAmount, 0);

        // Upcoming events (tickets for future events)
        const now = new Date();
        const upcoming = validTickets
          .filter((t) => t.eventId?.startDate && new Date(t.eventId.startDate) > now)
          .slice(0, 3);

        setStats({ ticketCount, totalSpent, upcomingEvents: upcoming });
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold dark:text-white">Good to see you!</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Here’s a quick look at your event world.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard icon={FiClipboard} title="My Tickets" value={stats.ticketCount} color="text-primary-500" />
        <StatCard icon={FiCalendar} title="Upcoming" value={stats.upcomingEvents.length} color="text-green-500" />
        <StatCard icon={FiDollarSign} title="Total Spent" value={`$${stats.totalSpent.toFixed(2)}`} color="text-yellow-500" />
      </div>

      {stats.upcomingEvents.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold dark:text-white mb-4">Your Next Events</h2>
          <div className="space-y-4">
            {stats.upcomingEvents.map((ticket) => (
              <motion.div
                key={ticket._id}
                whileHover={{ y: -2 }}
                className="glass rounded-xl p-5 flex justify-between items-center"
              >
                <div>
                  <h3 className="font-semibold dark:text-white">{ticket.eventId?.title}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(ticket.eventId.startDate).toLocaleDateString()} &middot; {ticket.tierName}
                  </p>
                </div>
                <Link
                  to={`/events/${ticket.eventId?._id}`}
                  className="text-primary-600 hover:underline flex items-center gap-1"
                >
                  View <FiArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <div className="border-t border-gray-200 dark:border-gray-700 pt-6 text-center text-sm text-gray-500">
        Ready for something new?{' '}
        <Link to="/events" className="text-primary-600 hover:underline">
          Browse all events
        </Link>
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, title, value, color }) => (
  <motion.div whileHover={{ y: -4 }} className="glass rounded-xl p-6 flex items-center gap-5">
    <div className={`p-3 rounded-full bg-white/50 dark:bg-gray-800 ${color}`}>
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <p className="text-2xl font-bold dark:text-white">{value}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
    </div>
  </motion.div>
);

export default AttendeeDashboard;