import { NavLink } from 'react-router-dom';
import {
  FiHome,
  FiCalendar,
  FiUsers,
  FiClipboard,
  FiMic,
  FiMapPin,
  FiBarChart2,
  FiSettings,
  FiLogOut
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const sidebarItems = [
  { to: '/organizer/dashboard', icon: FiHome, label: 'Dashboard' },
  { to: '/organizer/events', icon: FiCalendar, label: 'Events' },
  { to: '/organizer/attendees', icon: FiUsers, label: 'Attendees' },
  { to: '/organizer/tickets', icon: FiClipboard, label: 'Tickets' },
  { to: '/organizer/speakers', icon: FiMic, label: 'Speakers' },
  { to: '/organizer/venues', icon: FiMapPin, label: 'Venues' },
  { to: '/organizer/analytics', icon: FiBarChart2, label: 'Analytics' },
  { to: '/organizer/settings', icon: FiSettings, label: 'Settings' },
];

const OrganizerSidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className="w-64 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col sticky top-0">
      <div className="p-6 text-2xl font-bold gradient-text">EventTix</div>
      <nav className="flex-1 px-4 space-y-1">
        {sidebarItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                isActive
                  ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-200 font-medium'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-3">
          <img
            src={user?.profilePicture || '/default-avatar.png'}
            alt={user?.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold dark:text-white truncate">{user?.name}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-red-500 w-full"
        >
          <FiLogOut className="w-4 h-4" /> Logout
        </button>
      </div>
    </aside>
  );
};

export default OrganizerSidebar;   // ← ensure this line is present