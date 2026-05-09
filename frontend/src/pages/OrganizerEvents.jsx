import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api/axios';
import { FiEdit, FiEye } from 'react-icons/fi';

const TABS = [
  { key: 'all', label: 'All' },
  { key: 'published', label: 'Upcoming', color: 'bg-blue-500' },
  { key: 'completed', label: 'Completed', color: 'bg-green-500' },
  { key: 'draft', label: 'Draft', color: 'bg-gray-400' },
  { key: 'cancelled', label: 'Cancelled', color: 'bg-red-500' },
];

const OrganizerEvents = () => {
  const [events, setEvents] = useState([]);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    api.get('/events/myevents').then(res => setEvents(res.data));
  }, []);

  const filtered = activeTab === 'all' ? events : events.filter(e => e.status === activeTab);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold dark:text-white">All Events</h1>
        <Link to="/organizer/events/create" className="bg-primary-600 text-white px-4 py-2 rounded-full hover:bg-primary-700">+ New Event</Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              activeTab === tab.key
                ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-200'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100'
            }`}
          >
            {tab.label} {tab.key !== 'all' && `(${events.filter(e => e.status === tab.key).length})`}
            {tab.color && <span className={`inline-block w-2 h-2 rounded-full ml-2 ${tab.color}`}></span>}
          </button>
        ))}
      </div>

      {/* Events Table */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="p-4 text-left">Event Name</th>
              <th className="p-4 text-left">Date</th>
              <th className="p-4 text-left">Venue</th>
              <th className="p-4 text-left">Attendees</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(event => (
              <tr key={event._id} className="border-t dark:border-gray-700">
                <td className="p-4 font-medium dark:text-white">{event.title}</td>
                <td className="p-4 text-sm">{new Date(event.startDate).toLocaleDateString()}</td>
                <td className="p-4 text-sm">{event.venue}</td>
                <td className="p-4 text-sm">{/* You'll need to fetch attendee count separately */}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    event.status === 'published' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' :
                    event.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200' :
                    event.status === 'draft' ? 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300' :
                    'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {event.status}
                  </span>
                </td>
                <td className="p-4 flex gap-2">
                  <button className="text-primary-600 hover:text-primary-800"><FiEdit /></button>
                  <Link to={`/events/${event._id}`} className="text-gray-600 hover:text-gray-800"><FiEye /></Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrganizerEvents;