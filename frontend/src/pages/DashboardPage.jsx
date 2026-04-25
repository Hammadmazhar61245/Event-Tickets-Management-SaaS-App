import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiClipboard, FiShoppingBag, FiUser, FiBarChart2, FiBookmark } from 'react-icons/fi';

const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-3xl font-bold gradient-text mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link to="/my-tickets" className="glass rounded-xl p-6 card-hover flex items-center space-x-4">
          <FiClipboard className="w-8 h-8 text-primary-500" />
          <div>
            <h2 className="text-xl font-semibold dark:text-white">My Tickets</h2>
            <p className="text-gray-500 dark:text-gray-300">View purchased tickets</p>
          </div>
        </Link>
        <Link to="/my-orders" className="glass rounded-xl p-6 card-hover flex items-center space-x-4">
          <FiShoppingBag className="w-8 h-8 text-green-500" />
          <div>
            <h2 className="text-xl font-semibold dark:text-white">Order History</h2>
            <p className="text-gray-500 dark:text-gray-300">View past orders</p>
          </div>
        </Link>
        <Link to="/profile" className="glass rounded-xl p-6 card-hover flex items-center space-x-4">
          <FiUser className="w-8 h-8 text-yellow-500" />
          <div>
            <h2 className="text-xl font-semibold dark:text-white">Profile</h2>
            <p className="text-gray-500 dark:text-gray-300">Edit your details</p>
          </div>
        </Link>
        {user?.role === 'organizer' && (
          <>
            <Link to="/organizer/events" className="glass rounded-xl p-6 card-hover flex items-center space-x-4">
              <FiBarChart2 className="w-8 h-8 text-red-500" />
              <div>
                <h2 className="text-xl font-semibold dark:text-white">My Events</h2>
                <p className="text-gray-500 dark:text-gray-300">Manage your events</p>
              </div>
            </Link>
            <Link to="/organizer/analytics" className="glass rounded-xl p-6 card-hover flex items-center space-x-4">
              <FiBarChart2 className="w-8 h-8 text-purple-500" />
              <div>
                <h2 className="text-xl font-semibold dark:text-white">Analytics</h2>
                <p className="text-gray-500 dark:text-gray-300">Sales & revenue</p>
              </div>
            </Link>
          </>
        )}
        <Link to="/bookmarks" className="glass rounded-xl p-6 card-hover flex items-center space-x-4">
          <FiBookmark className="w-8 h-8 text-yellow-600" />
          <div>
            <h2 className="text-xl font-semibold dark:text-white">Bookmarks</h2>
            <p className="text-gray-500 dark:text-gray-300">Saved events</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default DashboardPage;