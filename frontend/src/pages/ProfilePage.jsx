import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({ name: user.name || '', email: user.email, phone: user.phone || '' });
    }
  }, [user]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.put('/auth/profile', form);
      toast.success('Profile updated!');
      // Update user context (simply reload)
      window.location.reload();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <motion.h2 className="text-3xl font-bold gradient-text mb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        My Profile
      </motion.h2>
      <motion.form onSubmit={handleSubmit} className="glass rounded-2xl p-8 space-y-5" initial={{ y: 20 }} animate={{ y: 0 }}>
        <div>
          <label className="block text-gray-600 dark:text-gray-300 mb-1">Name</label>
          <input name="name" value={form.name} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-800/50 focus:ring-2 focus:ring-primary-500 outline-none" required />
        </div>
        <div>
          <label className="block text-gray-600 dark:text-gray-300 mb-1">Email</label>
          <input name="email" value={form.email} onChange={handleChange} disabled className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700/50 text-gray-500" />
        </div>
        <div>
          <label className="block text-gray-600 dark:text-gray-300 mb-1">Phone</label>
          <input name="phone" value={form.phone} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-800/50 focus:ring-2 focus:ring-primary-500 outline-none" />
        </div>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading} className="gradient-bg text-white py-3 rounded-xl font-semibold w-full">
          {loading ? 'Saving...' : 'Update Profile'}
        </motion.button>
      </motion.form>
    </div>
  );
};

export default ProfilePage;