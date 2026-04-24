import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const MyEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      const res = await api.get('/events/myevents');
      setEvents(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEvents(); }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Delete this event?')) {
      await api.delete(`/events/${id}`);
      setEvents(events.filter(e => e._id !== id));
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Events</h1>
        <Link to="/organizer/events/create" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
          Create New Event
        </Link>
      </div>
      {events.length === 0 ? (
        <p>No events yet.</p>
      ) : (
        <div className="grid gap-4">
          {events.map(event => (
            <div key={event._id} className="bg-white p-4 rounded shadow flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{event.title}</h3>
                <p className="text-sm text-gray-600">{new Date(event.startDate).toLocaleDateString()} | {event.status}</p>
              </div>
              <div className="space-x-2">
                <Link to={`/organizer/events/${event._id}/edit`} className="text-indigo-600 hover:underline">Edit</Link>
                <button onClick={() => handleDelete(event._id)} className="text-red-600 hover:underline">Delete</button>
                <Link to={`/events/${event._id}`} className="text-gray-600 hover:underline">View</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyEventsPage;