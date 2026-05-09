import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiUsers, FiDollarSign, FiCalendar, FiCheckCircle, FiClock, FiEdit, FiXCircle } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../api/axios';
import { Link } from 'react-router-dom';

const OrganizerDashboard = () => {
  const [stats, setStats] = useState(null);
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  useEffect(() => {
    api.get('/analytics').then(res => setStats(res.data));
    api.get('/events/myevents').then(res => {
      // get only upcoming (published) events, limit 3
      const upcoming = res.data.filter(e => e.status === 'published').slice(0, 3);
      setUpcomingEvents(upcoming);
    });
  }, []);

  if (!stats) return <div className="p-8 text-center text-gray-500">Loading dashboard...</div>;

  const chartData = stats.events?.map(e => ({
    name: e.title.length > 15 ? e.title.slice(0, 15) + '…' : e.title,
    tickets: e.ticketsSold || 0
  })) || [];

  const completed = stats.events.filter(e => e.status === 'completed').length;
  const upcoming = stats.events.filter(e => e.status === 'published').length;
  const draft = stats.events.filter(e => e.status === 'draft').length;
  const cancelled = stats.events.filter(e => e.status === 'cancelled').length;

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold dark:text-white">Good morning, Organizer 🎉</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Here’s what’s happening with your events today</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={FiCalendar} title="Total Events" value={stats.totalEvents} change="+12%" />
        <StatCard icon={FiUsers} title="Total Attendees" value={stats.totalTicketsSold} change="+8%" />
        <StatCard icon={FiDollarSign} title="Revenue" value={`$${(stats.totalRevenue / 1000).toFixed(1)}k`} change="+24%" />
        <StatCard icon={FiTrendingUp} title="Upcoming" value={upcoming} change="Next: May 10" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart */}
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4 dark:text-white">Attendance Overview</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Bar dataKey="tickets" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Event status breakdown */}
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4 dark:text-white">Event Status Breakdown</h2>
          <div className="space-y-4">
            <StatusBar icon={FiCheckCircle} color="bg-green-500" label="Completed" value={completed} total={stats.totalEvents} />
            <StatusBar icon={FiClock} color="bg-blue-500" label="Upcoming" value={upcoming} total={stats.totalEvents} />
            <StatusBar icon={FiEdit} color="bg-gray-500" label="Draft" value={draft} total={stats.totalEvents} />
            <StatusBar icon={FiXCircle} color="bg-red-500" label="Cancelled" value={cancelled} total={stats.totalEvents} />
          </div>
        </div>
      </div>

      {/* Upcoming events table */}
      <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4 dark:text-white">Upcoming Events</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="text-left text-sm text-gray-500 dark:text-gray-400 border-b dark:border-gray-700">
              <tr>
                <th className="pb-3">Event</th>
                <th className="pb-3">Date</th>
                <th className="pb-3">Venue</th>
                <th className="pb-3">Registered</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {upcomingEvents.map(event => (
                <tr key={event._id} className="border-b dark:border-gray-700 last:border-0">
                  <td className="py-3 font-medium dark:text-white">{event.title}</td>
                  <td className="py-3 text-sm">{new Date(event.startDate).toLocaleDateString()}</td>
                  <td className="py-3 text-sm">{event.venue}</td>
                  <td className="py-3 text-sm">--</td>
                  <td className="py-3">
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200">
                      Upcoming
                    </span>
                  </td>
                </tr>
              ))}
              {upcomingEvents.length === 0 && (
                <tr><td colSpan="5" className="py-6 text-center text-gray-400">No upcoming events</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-4">
          <Link to="/organizer/events" className="text-primary-600 hover:underline text-sm">View all events →</Link>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, title, value, change }) => (
  <motion.div whileHover={{ y: -4 }} className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm">
    <Icon className="w-8 h-8 text-primary-500 mb-3" />
    <p className="text-2xl font-bold dark:text-white">{value}</p>
    <p className="text-gray-500 dark:text-gray-400 text-sm">{title} {change && <span className="text-green-500 ml-1">{change}</span>}</p>
  </motion.div>
);

const StatusBar = ({ icon: Icon, color, label, value, total }) => (
  <div>
    <div className="flex justify-between text-sm dark:text-gray-300 mb-1">
      <span className="flex items-center gap-2"><Icon className="w-4 h-4" /> {label}</span>
      <span>{value}</span>
    </div>
    <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700">
      <div className={`h-2 rounded-full ${color}`} style={{ width: `${total ? (value/total)*100 : 0}%` }} />
    </div>
  </div>
);

export default OrganizerDashboard;