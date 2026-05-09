import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api/axios';
import toast from 'react-hot-toast';
import TicketTierForm from '../components/TicketTierForm';

const OrganizerCreateEvent = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    type: 'in-person',
    startDate: '',
    endDate: '',
    startTime: '09:00',
    endTime: '17:00',
    venue: '',
    address: '',
    capacity: '',
    bannerImageUrl: '',
    organizerName: '',
    organizerEmail: '',
  });
  const [tiers, setTiers] = useState([]);
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch existing venues to let organizer choose
    api.get('/venues').then(res => setVenues(res.data)).catch(() => {});
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const addTier = (tier) => setTiers([...tiers, tier]);
  const removeTier = (index) => setTiers(tiers.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.startDate || !form.endDate || tiers.length === 0) {
      return toast.error('Please fill all required fields and add at least one ticket tier.');
    }
    setLoading(true);
    try {
      const eventRes = await api.post('/events', {
        ...form,
        startDate: new Date(`${form.startDate}T${form.startTime}`),
        endDate: new Date(`${form.endDate}T${form.endTime}`),
      });
      const eventId = eventRes.data._id;
      for (const tier of tiers) {
        await api.post(`/tickets/event/${eventId}`, tier);
      }
      toast.success('Event created!');
      navigate('/organizer/events');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold dark:text-white mb-6">Create New Event</h1>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm space-y-5">
          <h2 className="text-lg font-semibold dark:text-white">Event Details</h2>
          <input name="title" placeholder="Event name" value={form.title} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border dark:bg-gray-800 dark:border-gray-600" />
          <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border dark:bg-gray-800 dark:border-gray-600" />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm dark:text-gray-300">Category</label>
              <input name="category" value={form.category} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border dark:bg-gray-800 dark:border-gray-600" />
            </div>
            <div>
              <label className="block text-sm dark:text-gray-300">Event Type</label>
              <select name="type" value={form.type} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border dark:bg-gray-800 dark:border-gray-600">
                <option value="in-person">In-person</option>
                <option value="virtual">Virtual</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm dark:text-gray-300">Banner Image URL</label>
            <input name="bannerImageUrl" value={form.bannerImageUrl} onChange={handleChange} placeholder="https://..." className="w-full px-4 py-3 rounded-xl border dark:bg-gray-800 dark:border-gray-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm space-y-5">
          <h2 className="text-lg font-semibold dark:text-white">Date & Venue</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm dark:text-gray-300">Start Date</label>
              <input type="date" name="startDate" value={form.startDate} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border dark:bg-gray-800 dark:border-gray-600" />
            </div>
            <div>
              <label className="block text-sm dark:text-gray-300">End Date</label>
              <input type="date" name="endDate" value={form.endDate} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border dark:bg-gray-800 dark:border-gray-600" />
            </div>
            <div>
              <label className="block text-sm dark:text-gray-300">Start Time</label>
              <input type="time" name="startTime" value={form.startTime} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border dark:bg-gray-800 dark:border-gray-600" />
            </div>
            <div>
              <label className="block text-sm dark:text-gray-300">End Time</label>
              <input type="time" name="endTime" value={form.endTime} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border dark:bg-gray-800 dark:border-gray-600" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm dark:text-gray-300">Venue</label>
              <select name="venue" value={form.venue} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border dark:bg-gray-800 dark:border-gray-600">
                <option value="">Select venue</option>
                {venues.map(v => <option key={v._id} value={v.name}>{v.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm dark:text-gray-300">Address</label>
              <input name="address" value={form.address} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border dark:bg-gray-800 dark:border-gray-600" />
            </div>
            <div>
              <label className="block text-sm dark:text-gray-300">Max Capacity</label>
              <input type="number" name="capacity" value={form.capacity} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border dark:bg-gray-800 dark:border-gray-600" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm space-y-5">
          <h2 className="text-lg font-semibold dark:text-white">Tickets</h2>
          <TicketTierForm onAddTier={addTier} />
          {tiers.length > 0 && (
            <ul className="space-y-2">
              {tiers.map((tier, idx) => (
                <li key={idx} className="flex justify-between bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                  <span>{tier.name} — ${tier.price} (Qty: {tier.totalQuantity})</span>
                  <button type="button" onClick={() => removeTier(idx)} className="text-red-500">Remove</button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm space-y-5">
          <h2 className="text-lg font-semibold dark:text-white">Organizer Info</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm dark:text-gray-300">Organizer Name</label>
              <input name="organizerName" value={form.organizerName} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border dark:bg-gray-800 dark:border-gray-600" />
            </div>
            <div>
              <label className="block text-sm dark:text-gray-300">Contact Email</label>
              <input type="email" name="organizerEmail" value={form.organizerEmail} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border dark:bg-gray-800 dark:border-gray-600" />
            </div>
          </div>
        </div>

        <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} type="submit" disabled={loading} className="w-full gradient-bg text-white py-3 rounded-xl font-semibold">
          {loading ? 'Creating...' : 'Create Event'}
        </motion.button>
      </form>
    </div>
  );
};

export default OrganizerCreateEvent;