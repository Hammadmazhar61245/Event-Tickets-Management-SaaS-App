import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const HomePage = () => {
  const [featuredEvents, setFeaturedEvents] = useState([]);

  useEffect(() => {
    api.get('/events').then(res => setFeaturedEvents(res.data.slice(0, 3)));
  }, []);

  return (
    <div>
      <section className="text-center py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Discover Amazing Events</h1>
        <p className="text-xl text-gray-600 mb-8">Book tickets for the best events near you</p>
        <Link to="/events" className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700">Browse Events</Link>
      </section>
      <section className="mt-12">
        <h2 className="text-2xl font-semibold mb-6">Featured Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredEvents.map(event => (
            <Link key={event._id} to={`/events/${event._id}`} className="bg-white rounded-lg shadow hover:shadow-lg transition">
              <img src={event.bannerImageUrl || 'https://via.placeholder.com/300x150'} alt={event.title} className="w-full h-40 object-cover rounded-t-lg" />
              <div className="p-4">
                <h3 className="font-semibold text-lg">{event.title}</h3>
                <p className="text-gray-600">{new Date(event.startDate).toLocaleDateString()}</p>
                <p className="text-gray-600">{event.venue}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;