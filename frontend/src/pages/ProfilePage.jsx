import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { FiCamera } from 'react-icons/fi';

const ProfilePage = () => {
  const { user, refreshUser } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [picture, setPicture] = useState(null);
  const [preview, setPreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef();

  // When user data loads, populate the form and set initial preview
  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      });
      // Set preview from the user profile picture (full URL from server)
      setPreview(user.profilePicture || '');
    }
  }, [user]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handlePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPicture(file);
      setPreview(URL.createObjectURL(file)); // show local preview immediately
    }
  };

  const handleUpload = async () => {
    if (!picture) return toast.error('Select an image first');
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('profilePicture', picture);
      const res = await api.put('/auth/profile-picture', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Profile picture updated!');
      // Update global user state to reflect new picture
      await refreshUser();
      // Keep the preview from server response (the /uploads/... path)
      setPreview(res.data.profilePicture || '');
      setPicture(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put('/auth/profile', form);
      toast.success('Profile updated!');
      await refreshUser(); // refresh global state
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <motion.h2
        className="text-3xl font-bold gradient-text mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        My Profile
      </motion.h2>

      {/* Profile picture section */}
      <div className="glass rounded-2xl p-8 mb-8 flex flex-col items-center">
        <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 mb-4 border-2 border-white/30 shadow-md">
          {preview ? (
            <img
              src={preview}
              alt="Profile"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/default-avatar.png'; // fallback
              }}
            />
          ) : (
            <FiCamera className="w-full h-full p-6 text-gray-400" />
          )}
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={handlePictureChange}
          ref={fileInputRef}
          className="hidden"
        />
        <div className="flex space-x-3">
          <button
            onClick={() => fileInputRef.current.click()}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded-full text-sm"
          >
            Choose Image
          </button>
          {picture && (
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="px-4 py-2 gradient-bg text-white rounded-full text-sm"
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          )}
        </div>
      </div>

      {/* Profile info form */}
      <motion.form
        onSubmit={handleSubmit}
        className="glass rounded-2xl p-8 space-y-5"
        initial={{ y: 20 }}
        animate={{ y: 0 }}
      >
        <div>
          <label className="block text-gray-600 dark:text-gray-300 mb-1">Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-800/50 focus:ring-2 focus:ring-primary-500 outline-none"
            required
          />
        </div>
        <div>
          <label className="block text-gray-600 dark:text-gray-300 mb-1">Email</label>
          <input
            name="email"
            value={form.email}
            disabled
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700/50 text-gray-500"
          />
        </div>
        <div>
          <label className="block text-gray-600 dark:text-gray-300 mb-1">Phone</label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-800/50 focus:ring-2 focus:ring-primary-500 outline-none"
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading}
          className="gradient-bg text-white w-full py-3 rounded-xl font-semibold"
        >
          {loading ? 'Saving...' : 'Update Profile'}
        </motion.button>
      </motion.form>
    </div>
  );
};

export default ProfilePage;