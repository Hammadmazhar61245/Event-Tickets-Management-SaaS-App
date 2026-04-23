import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import TicketTierForm from '../components/TicketTierForm';

const CreateEventPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    venue: '',
    address: '',
    startDate: '',
    endDate: '',
    bannerImageUrl: '',
  });
  const [tiers, setTiers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const addTier = (tier) => setTiers([...tiers, tier]);
  const removeTier = (index) => setTiers(tiers.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Create event
      const eventRes = await api.post('/events', form);
      const eventId = eventRes.data._id;

      // Create ticket tiers
      for (const tier of tiers) {
        await api.post(`/tickets/event/${eventId}`, tier);
      }

      navigate('/organizer/events');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create Event</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="title" placeholder="Event Title" value={form.title} onChange={handleChange} className="w-full border p-2 rounded" required />
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} className="w-full border p-2 rounded" required />
        <input name="category" placeholder="Category (e.g., Music, Tech)" value={form.category} onChange={handleChange} className="w-full border p-2 rounded" required />
        <input name="venue" placeholder="Venue Name" value={form.venue} onChange={handleChange} className="w-full border p-2 rounded" required />
        <input name="address" placeholder="Address" value={form.address} onChange={handleChange} className="w-full border p-2 rounded" required />
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm">Start Date</label>
            <input name="startDate" type="datetime-local" value={form.startDate} onChange={handleChange} className="w-full border p-2 rounded" required />
          </div>
          <div className="flex-1">
            <label className="block text-sm">End Date</label>
            <input name="endDate" type="datetime-local" value={form.endDate} onChange={handleChange} className="w-full border p-2 rounded" required />
          </div>
        </div>
        <input name="bannerImageUrl" placeholder="Banner Image URL (optional)" value={form.bannerImageUrl} onChange={handleChange} className="w-full border p-2 rounded" />

        <div className="border-t pt-4 mt-4">
          <h2 className="text-xl font-semibold mb-2">Ticket Tiers</h2>
          <TicketTierForm onAddTier={addTier} />
          {tiers.length > 0 && (
            <ul className="mt-3 space-y-2">
              {tiers.map((tier, idx) => (
                <li key={idx} className="flex justify-between bg-gray-100 p-2 rounded">
                  <span>{tier.name} - ${tier.price} (Qty: {tier.totalQuantity})</span>
                  <button type="button" onClick={() => removeTier(idx)} className="text-red-500">Remove</button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 disabled:opacity-50">
          {loading ? 'Creating...' : 'Create Event'}
        </button>
      </form>
    </div>
  );
};

export default CreateEventPage;