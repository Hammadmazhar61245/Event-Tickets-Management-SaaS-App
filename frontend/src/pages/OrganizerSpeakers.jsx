import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { FiEdit, FiTrash2 } from 'react-icons/fi';

const OrganizerSpeakers = () => {
  const [speakers, setSpeakers] = useState([]);
  const [form, setForm] = useState({ name: '', bio: '', imageUrl: '', email: '' });
  const [editId, setEditId] = useState(null);

  const fetchSpeakers = async () => {
    const res = await api.get('/speakers');
    setSpeakers(res.data);
  };

  useEffect(() => { fetchSpeakers(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`/speakers/${editId}`, form);
        toast.success('Speaker updated');
      } else {
        await api.post('/speakers', form);
        toast.success('Speaker added');
      }
      setForm({ name: '', bio: '', imageUrl: '', email: '' });
      setEditId(null);
      fetchSpeakers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error');
    }
  };

  const handleEdit = (speaker) => {
    setForm({ name: speaker.name, bio: speaker.bio, imageUrl: speaker.imageUrl, email: speaker.email });
    setEditId(speaker._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete speaker?')) {
      await api.delete(`/speakers/${id}`);
      toast.success('Speaker deleted');
      fetchSpeakers();
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold dark:text-white">Speakers</h1>
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input placeholder="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required className="w-full px-4 py-2 rounded-lg border dark:bg-gray-800" />
          <input placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full px-4 py-2 rounded-lg border dark:bg-gray-800" />
          <input placeholder="Image URL" value={form.imageUrl} onChange={e => setForm({...form, imageUrl: e.target.value})} className="w-full px-4 py-2 rounded-lg border dark:bg-gray-800" />
          <textarea placeholder="Bio" value={form.bio} onChange={e => setForm({...form, bio: e.target.value})} className="w-full px-4 py-2 rounded-lg border dark:bg-gray-800" />
        </div>
        <motion.button whileHover={{ scale: 1.02 }} type="submit" className="bg-primary-600 text-white px-6 py-2 rounded-full">
          {editId ? 'Update' : 'Add'} Speaker
        </motion.button>
        {editId && <button type="button" onClick={() => { setEditId(null); setForm({ name: '', bio: '', imageUrl: '', email: '' }); }} className="ml-2 text-sm text-gray-500">Cancel</button>}
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {speakers.map(s => (
          <motion.div key={s._id} layout className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow-sm flex items-start gap-4">
            <img src={s.imageUrl || '/default-avatar.png'} alt={s.name} className="w-12 h-12 rounded-full object-cover" />
            <div className="flex-1">
              <h3 className="font-semibold dark:text-white">{s.name}</h3>
              <p className="text-xs text-gray-500">{s.email}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{s.bio?.slice(0, 60)}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(s)}><FiEdit className="text-gray-400 hover:text-primary-500" /></button>
              <button onClick={() => handleDelete(s._id)}><FiTrash2 className="text-gray-400 hover:text-red-500" /></button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default OrganizerSpeakers;