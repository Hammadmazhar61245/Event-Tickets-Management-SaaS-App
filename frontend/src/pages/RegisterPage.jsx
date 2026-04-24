import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'attendee', phone: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(formData);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md glass p-8 rounded-2xl shadow-xl"
      >
        <h2 className="text-3xl font-bold gradient-text text-center mb-6">Create Account</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-800/50 focus:ring-2 focus:ring-primary-500 outline-none transition" />
          <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-800/50 focus:ring-2 focus:ring-primary-500 outline-none transition" />
          <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} required
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-800/50 focus:ring-2 focus:ring-primary-500 outline-none transition" />
          <input name="phone" placeholder="Phone (optional)" value={formData.phone} onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-800/50 focus:ring-2 focus:ring-primary-500 outline-none transition" />
          <select name="role" value={formData.role} onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-800/50 focus:ring-2 focus:ring-primary-500 outline-none transition">
            <option value="attendee">Attendee</option>
            <option value="organizer">Organizer</option>
          </select>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit" disabled={loading}
            className="w-full gradient-bg text-white py-3 rounded-xl font-semibold disabled:opacity-50 transition"
          >
            {loading ? 'Creating...' : 'Register'}
          </motion.button>
        </form>
        <p className="mt-6 text-center text-gray-600 dark:text-gray-400">
          Already have an account? <Link to="/login" className="text-primary-600 font-semibold hover:underline">Login</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default RegisterPage;