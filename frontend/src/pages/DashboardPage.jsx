
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link to="/my-tickets" className="bg-white p-6 rounded-lg shadow hover:shadow-md">
          <h2 className="text-xl font-semibold">My Tickets</h2>
          <p className="text-gray-600">View your purchased tickets</p>
        </Link>
        <Link to="/my-orders" className="bg-white p-6 rounded-lg shadow hover:shadow-md">
          <h2 className="text-xl font-semibold">Order History</h2>
          <p className="text-gray-600">View past orders</p>
        </Link>
        {user?.role === 'organizer' && (
          <>
            <Link to="/organizer/events" className="bg-white p-6 rounded-lg shadow hover:shadow-md">
              <h2 className="text-xl font-semibold">My Events</h2>
              <p className="text-gray-600">Manage your events</p>
            </Link>
            <Link to="/organizer/events/create" className="bg-white p-6 rounded-lg shadow hover:shadow-md">
              <h2 className="text-xl font-semibold">Create Event</h2>
              <p className="text-gray-600">Host a new event</p>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;