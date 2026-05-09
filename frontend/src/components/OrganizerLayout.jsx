import { Outlet } from 'react-router-dom';
import OrganizerSidebar from './OrganizerSidebar';

const OrganizerLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-800">
      <OrganizerSidebar />
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default OrganizerLayout;