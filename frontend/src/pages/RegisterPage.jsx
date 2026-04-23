import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'attendee', phone: '' });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-6">Register</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} className="w-full border p-2 rounded" required />
        <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} className="w-full border p-2 rounded" required />
        <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} className="w-full border p-2 rounded" required />
        <input name="phone" placeholder="Phone (optional)" value={formData.phone} onChange={handleChange} className="w-full border p-2 rounded" />
        <select name="role" value={formData.role} onChange={handleChange} className="w-full border p-2 rounded">
          <option value="attendee">Attendee</option>
          <option value="organizer">Organizer</option>
        </select>
        <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">Register</button>
      </form>
      <p className="mt-4 text-center">Already have an account? <Link to="/login" className="text-indigo-600">Login</Link></p>
    </div>
  );
};

export default RegisterPage;