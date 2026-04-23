import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../utils/formatDate';

const EventDetailsPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/events/${id}`).then(res => {
      setEvent(res.data);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!event) return <div>Event not found</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <img src={event.bannerImageUrl || 'https://via.placeholder.com/800x300'} alt={event.title} className="w-full h-64 object-cover rounded-lg mb-6" />
      <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
      <p className="text-gray-600 mb-4">Organized by {event.organizerId?.name}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <p className="font-semibold">Date & Time</p>
          <p>{formatDate(event.startDate)} - {formatDate(event.endDate)}</p>
          <p className="font-semibold mt-4">Venue</p>
          <p>{event.venue}, {event.address}</p>
          <p className="font-semibold mt-4">Category</p>
          <p>{event.category}</p>
        </div>
        <div>
          <p className="font-semibold">Description</p>
          <p className="whitespace-pre-line">{event.description}</p>
        </div>
      </div>
      <div>
        <h2 className="text-2xl font-semibold mb-4">Ticket Tiers</h2>
        {event.tiers?.length > 0 ? (
          <div className="space-y-3">
            {event.tiers.map(tier => (
              <div key={tier._id} className="border p-4 rounded-lg flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{tier.name}</h3>
                  <p className="text-gray-600">{tier.description}</p>
                  <p className="text-sm">Available: {tier.totalQuantity - tier.soldCount} / {tier.totalQuantity}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold">${tier.price}</p>
                  {user ? (
                    <Link to={`/checkout/${event._id}`} state={{ tiers: event.tiers }} className="mt-2 inline-block bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">Select</Link>
                  ) : (
                    <Link to="/login" className="mt-2 inline-block bg-gray-600 text-white px-4 py-2 rounded">Login to Buy</Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No ticket tiers available.</p>
        )}
      </div>
    </div>
  );
};

export default EventDetailsPage;