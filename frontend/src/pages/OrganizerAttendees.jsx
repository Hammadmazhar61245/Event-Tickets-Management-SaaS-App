import { useState, useEffect } from 'react';
import api from '../api/axios';
import { FiSearch } from 'react-icons/fi';

const OrganizerAttendees = () => {
  const [attendees, setAttendees] = useState([]);
  const [filterEvent, setFilterEvent] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    // Fetch all orders/tickets with user details (backend endpoint needed)
    api.get('/attendees').then(res => setAttendees(res.data));
  }, []);

  // Dummy filter logic
  const filtered = attendees.filter(a => {
    const matchEvent = filterEvent ? a.eventId?.title === filterEvent : true;
    const matchStatus = filterStatus ? a.status === filterStatus : true;
    return matchEvent && matchStatus;
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold dark:text-white">Attendees</h1>
      <div className="flex gap-4 items-center">
        <select onChange={e => setFilterEvent(e.target.value)} className="px-4 py-2 rounded-lg border dark:bg-gray-800">
          <option value="">All Events</option>
          {/* dynamically add */}
        </select>
        <select onChange={e => setFilterStatus(e.target.value)} className="px-4 py-2 rounded-lg border dark:bg-gray-800">
          <option value="">All Statuses</option>
          <option>Checked in</option><option>Registered</option><option>Pending</option><option>No-show</option>
        </select>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="p-3">Name</th><th className="p-3">Email</th><th className="p-3">Event</th>
              <th className="p-3">Ticket Type</th><th className="p-3">Status</th><th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(att => (
              <tr key={att._id} className="border-t dark:border-gray-700">
                <td className="p-3">{att.user?.name}</td>
                <td className="p-3">{att.user?.email}</td>
                <td className="p-3">{att.eventId?.title}</td>
                <td className="p-3">{att.tierName}</td>
                <td className="p-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    att.status === 'valid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {att.status === 'valid' ? 'Registered' : 'Cancelled'}
                  </span>
                </td>
                <td className="p-3"><button className="text-primary-600">View</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrganizerAttendees;