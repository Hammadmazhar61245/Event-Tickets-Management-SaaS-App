import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../api/axios';
import { motion } from 'framer-motion';

const VerifyEmailPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    api.get(`/auth/verify/${token}`)
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'));
  }, [token]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <motion.div className="glass rounded-2xl p-10 text-center max-w-md" initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
        {status === 'loading' && <p className="text-xl dark:text-white">Verifying your email...</p>}
        {status === 'success' && (
          <>
            <h2 className="text-3xl font-bold gradient-text mb-4">Email Verified!</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">Your account is now active.</p>
            <button onClick={() => navigate('/login')} className="gradient-bg text-white px-6 py-2 rounded-full">Go to Login</button>
          </>
        )}
        {status === 'error' && (
          <>
            <h2 className="text-3xl font-bold text-red-500 mb-4">Invalid Link</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">The verification link is invalid or expired.</p>
            <button onClick={() => navigate('/register')} className="bg-gray-500 text-white px-6 py-2 rounded-full">Register Again</button>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default VerifyEmailPage;