import { Outlet } from 'react-router-dom';
import AttendeeSidebar from './AttendeeSidebar';

const AttendeeLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-800">
      <AttendeeSidebar />
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AttendeeLayout;