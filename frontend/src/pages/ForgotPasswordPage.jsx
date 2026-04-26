import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { Link } from 'react-router-dom';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      toast.success('If that email exists, a reset link has been sent.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md glass p-8 rounded-2xl">
        <h2 className="text-3xl font-bold gradient-text text-center mb-6">Forgot Password</h2>
        <p className="text-gray-600 dark:text-gray-300 text-center mb-6">Enter your email and we'll send you a reset link.</p>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input type="email" placeholder="Your email address" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-800/50 focus:ring-2 focus:ring-primary-500 outline-none" />
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading} className="gradient-bg text-white w-full py-3 rounded-xl font-semibold">
            {loading ? 'Sending...' : 'Send Reset Link'}
          </motion.button>
        </form>
        <p className="mt-4 text-center text-gray-600 dark:text-gray-400">
          <Link to="/login" className="text-primary-600 hover:underline">Back to Login</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;