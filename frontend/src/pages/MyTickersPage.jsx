import { useEffect, useState } from 'react';
import api from '../api/axios';
import { formatDate } from '../utils/formatDate';

const MyTicketsPage = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/mytickets')
      .then(res => setTickets(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;

  if (tickets.length === 0) return <div>No tickets purchased yet.</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Tickets</h1>
      <div className="space-y-4">
        {tickets.map(ticket => (
          <div key={ticket._id} className="bg-white p-4 rounded shadow flex justify-between items-center">
            <div>
              <h3 className="font-semibold">{ticket.eventId?.title || 'Event'}</h3>
              <p className="text-sm text-gray-600">{ticket.tierName}</p>
              <p className="text-xs text-gray-500">Issued: {formatDate(ticket.issuedAt)}</p>
              <p className="text-xs text-gray-500">Status: {ticket.status}</p>
            </div>
            <a href={`/events/${ticket.eventId?._id}`} className="text-indigo-600 hover:underline">View Event</a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyTicketsPage;