import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { FiCamera } from 'react-icons/fi';

const OrganizerSettings = () => {
  const { user, refreshUser } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [prefs, setPrefs] = useState({
    emailOnRegistration: true,
    smsAlerts: false,
    weeklySummary: false,
    paymentReceipts: true
  });
  const [loading, setLoading] = useState(false);
  const [picture, setPicture] = useState(null);
  const [preview, setPreview] = useState('');

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      });
      setPreview(user.profilePicture || '');
      if (user.preferences) {
        setPrefs(user.preferences);
      }
    }
  }, [user]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handlePrefChange = (e) => setPrefs({ ...prefs, [e.target.name]: e.target.checked });

  const handlePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPicture(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!picture) return toast.error('Select an image');
    const formData = new FormData();
    formData.append('profilePicture', picture);
    const res = await api.put('/auth/profile-picture', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    toast.success('Profile picture updated');
    setPreview(res.data.profilePicture);
    await refreshUser();
    setPicture(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put('/auth/profile', { ...form, preferences: prefs });
      toast.success('Settings saved');
      await refreshUser();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold dark:text-white">Profile & Settings</h1>

      {/* Profile picture section */}
      <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm flex items-center gap-6">
        <div className="relative w-20 h-20 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
          {preview ? (
            <img src={preview} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <FiCamera className="w-full h-full p-4 text-gray-400" />
          )}
        </div>
        <div>
          <h2 className="text-lg font-semibold dark:text-white">{user?.name}</h2>
          <p className="text-sm text-gray-500">{user?.email}</p>
          <div className="mt-2 flex gap-2">
            <label className="px-3 py-1 text-sm rounded-full bg-gray-100 dark:bg-gray-700 cursor-pointer hover:bg-gray-200">
              Choose Image
              <input type="file" accept="image/*" onChange={handlePictureChange} className="hidden" />
            </label>
            {picture && (
              <button onClick={handleUpload} className="px-3 py-1 text-sm rounded-full bg-primary-600 text-white">
                Upload
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Personal info & Notification prefs */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-semibold dark:text-white">Personal Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm dark:text-gray-300">First Name</label>
              <input name="name" value={form.name} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border dark:bg-gray-800" required />
            </div>
            <div>
              <label className="block text-sm dark:text-gray-300">Email</label>
              <input name="email" value={form.email} disabled className="w-full px-4 py-2 rounded-lg border bg-gray-100 dark:bg-gray-700" />
            </div>
            <div>
              <label className="block text-sm dark:text-gray-300">Phone</label>
              <input name="phone" value={form.phone} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border dark:bg-gray-800" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-semibold dark:text-white">Notification Preferences</h2>
          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input type="checkbox" name="emailOnRegistration" checked={prefs.emailOnRegistration} onChange={handlePrefChange} className="w-4 h-4 text-primary-600 rounded" />
              <span className="dark:text-white">Email on new registration</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" name="smsAlerts" checked={prefs.smsAlerts} onChange={handlePrefChange} className="w-4 h-4 text-primary-600 rounded" />
              <span className="dark:text-white">SMS alerts</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" name="weeklySummary" checked={prefs.weeklySummary} onChange={handlePrefChange} className="w-4 h-4 text-primary-600 rounded" />
              <span className="dark:text-white">Weekly summary</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" name="paymentReceipts" checked={prefs.paymentReceipts} onChange={handlePrefChange} className="w-4 h-4 text-primary-600 rounded" />
              <span className="dark:text-white">Payment receipts</span>
            </label>
          </div>
        </div>

        <motion.button whileHover={{ scale: 1.01 }} type="submit" disabled={loading} className="w-full gradient-bg text-white py-3 rounded-xl font-semibold">
          {loading ? 'Saving...' : 'Save Settings'}
        </motion.button>
      </form>
    </div>
  );
};

export default OrganizerSettings;