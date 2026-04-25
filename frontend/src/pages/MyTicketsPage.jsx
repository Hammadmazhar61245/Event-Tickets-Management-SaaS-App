import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { formatDate } from '../utils/formatDate';

const MyTicketsPage = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTickets = () => {
    api.get('/orders/mytickets')
      .then(res => setTickets(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const cancelTicket = async (ticketId) => {
    if (!window.confirm('Are you sure you want to cancel this ticket?')) return;
    try {
      await api.put(`/tickets/cancel/${ticketId}`);
      toast.success('Ticket cancelled');
      fetchTickets(); // refresh
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cancel failed');
    }
  };

  if (loading) return <div className="text-center py-8">Loading tickets...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold gradient-text mb-8">My Tickets</h1>
      {tickets.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No tickets purchased yet.</p>
      ) : (
        <div className="space-y-4">
          {tickets.map(ticket => (
            <motion.div key={ticket._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-xl p-5 flex justify-between items-center">
              <div>
                <h3 className="font-semibold dark:text-white">{ticket.eventId?.title || 'Event'}</h3>
                <p className="text-gray-600 dark:text-gray-300">{ticket.tierName}</p>
                <p className="text-xs text-gray-500">Issued: {formatDate(ticket.issuedAt)} | Status: <span className={ticket.status === 'valid' ? 'text-green-500' : 'text-red-500'}>{ticket.status}</span></p>
              </div>
              {ticket.status === 'valid' && (
                <button onClick={() => cancelTicket(ticket._id)} className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition">
                  Cancel
                </button>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTicketsPage;