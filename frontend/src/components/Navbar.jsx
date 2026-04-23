import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold text-indigo-600">EventTix</Link>
          <div className="flex items-center space-x-4">
            <Link to="/events" className="text-gray-700 hover:text-indigo-600">Events</Link>
            {user ? (
              <>
                <Link to="/dashboard" className="text-gray-700 hover:text-indigo-600">Dashboard</Link>
                {user.role === 'organizer' && (
                  <Link to="/organizer/events" className="text-gray-700 hover:text-indigo-600">My Events</Link>
                )}
                <button onClick={handleLogout} className="text-gray-700 hover:text-indigo-600">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-indigo-600">Login</Link>
                <Link to="/register" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;