import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../api/axios';
import { formatDate } from '../utils/formatDate';
import toast from 'react-hot-toast';

const OrganizerTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('');

  useEffect(() => {
    api.get('/tickets').then(res => setTickets(res.data)); // You need a new endpoint or use attendee endpoint but filter by event
    // To keep it simple, we'll use the attendee endpoint which already returns tickets
    api.get('/attendees').then(res => {
      setTickets(res.data);
      const uniqueEvents = [...new Map(res.data.map(t => [t.eventId?._id, t.eventId])).values()];
      setEvents(uniqueEvents);
    });
  }, []);

  const filtered = selectedEvent ? tickets.filter(t => t.eventId?._id === selectedEvent) : tickets;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold dark:text-white">Tickets</h1>
        <select value={selectedEvent} onChange={e => setSelectedEvent(e.target.value)} className="px-4 py-2 rounded-lg border dark:bg-gray-800">
          <option value="">All Events</option>
          {events.map(ev => (
            <option key={ev._id} value={ev._id}>{ev.title}</option>
          ))}
        </select>
      </div>
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="p-3 text-left">Attendee</th>
              <th className="p-3 text-left">Event</th>
              <th className="p-3 text-left">Ticket Type</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(ticket => (
              <tr key={ticket._id} className="border-t dark:border-gray-700">
                <td className="p-3">{ticket.attendeeId?.name || 'N/A'}</td>
                <td className="p-3">{ticket.eventId?.title}</td>
                <td className="p-3">{ticket.tierName}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    ticket.status === 'valid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {ticket.status}
                  </span>
                </td>
                <td className="p-3 text-sm">{formatDate(ticket.issuedAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrganizerTickets;