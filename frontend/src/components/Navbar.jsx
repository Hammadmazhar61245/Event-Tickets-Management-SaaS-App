import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FiSun, FiMoon, FiLogOut, FiUser } from 'react-icons/fi';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { dark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/70 dark:bg-gray-900/70 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold gradient-text">EventTix</Link>
          
          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/events" className="text-gray-700 dark:text-gray-200 hover:text-primary-600 transition">Events</Link>
            {user ? (
              <>
                <Link to="/dashboard" className="text-gray-700 dark:text-gray-200 hover:text-primary-600 transition">Dashboard</Link>
                {user.role === 'organizer' && (
                  <Link to="/organizer/events" className="text-gray-700 dark:text-gray-200 hover:text-primary-600 transition">My Events</Link>
                )}
                <button onClick={handleLogout} className="flex items-center text-gray-700 dark:text-gray-200 hover:text-red-500 transition">
                  <FiLogOut className="mr-1" /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 dark:text-gray-200 hover:text-primary-600 transition">Login</Link>
                <Link to="/register" className="bg-primary-600 text-white px-4 py-2 rounded-full hover:bg-primary-700 transition transform hover:scale-105">Sign Up</Link>
              </>
            )}
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition">
              {dark ? <FiSun className="text-yellow-400" /> : <FiMoon className="text-gray-600" />}
            </button>
          </div>
          
          {/* Mobile hamburger */}
          <div className="md:hidden flex items-center space-x-2">
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
              {dark ? <FiSun className="text-yellow-400" /> : <FiMoon className="text-gray-600" />}
            </button>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 text-gray-700 dark:text-gray-200">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
          </div>
        </div>
        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link to="/events" className="block px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">Events</Link>
            {user ? (
              <>
                <Link to="/dashboard" className="block px-4 py-2">Dashboard</Link>
                {user.role === 'organizer' && <Link to="/organizer/events" className="block px-4 py-2">My Events</Link>}
                <button onClick={handleLogout} className="block px-4 py-2 text-left w-full hover:bg-red-100 dark:hover:bg-red-900">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="block px-4 py-2">Login</Link>
                <Link to="/register" className="block px-4 py-2 font-semibold">Sign Up</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;