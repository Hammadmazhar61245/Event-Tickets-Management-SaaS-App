import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { formatDate } from '../utils/formatDate';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get('/events');
        setEvents(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const filteredEvents = category
    ? events.filter(e => e.category.toLowerCase().includes(category.toLowerCase()))
    : events;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Discover Events</h1>
      <div className="mb-6">
        <input
          type="text"
          placeholder="Filter by category (e.g., Music, Tech)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2 rounded w-full max-w-md"
        />
      </div>
      {loading ? (
        <p>Loading events...</p>
      ) : filteredEvents.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map(event => (
            <Link
              key={event._id}
              to={`/events/${event._id}`}
              className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden"
            >
              <img
                src={event.bannerImageUrl || 'https://via.placeholder.com/400x200?text=No+Image'}
                alt={event.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1">{event.title}</h3>
                <p className="text-gray-600 text-sm">{event.category}</p>
                <p className="text-gray-600 text-sm">{formatDate(event.startDate)}</p>
                <p className="text-gray-600 text-sm">{event.venue}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventsPage;