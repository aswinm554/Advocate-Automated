import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from "../components/Sidebar"
const JuniorLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className={`flex-1 transition-all duration-500 ${sidebarOpen ? 'ml-60' : 'ml-16'}`}>
        <Outlet />
      </div>
    </div>
  );
};

export default JuniorLayout;