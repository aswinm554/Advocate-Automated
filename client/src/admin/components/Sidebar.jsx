import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { MdMenuOpen } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
import { LayoutDashboard, UserCheck, Users, FileBarChart, ClipboardList, LogOut, Scale } from 'lucide-react';
import api from "../../api/api";

const menuItems = [
  {
    icons: <LayoutDashboard size={30} />,
    label: 'Dashboard',
    path: "/admin"
  },
  {
    icons: <UserCheck size={30} />,
    label: 'Advocates',
    path: "/admin/advocates"
  },
  {
    icons: <Users size={30} />,
    label: 'Clients',
    path: "/admin/clients"
  },
  {
    icons: <FileBarChart size={30} />,
    label: 'Reports',
    path: "/admin/reports"
  },
  // {
  //   icons: <ClipboardList size={30} />,
  //   label: 'Activitylogs',
  //   path: "/admin/activitylog",
  // }
];

const Sidebar = ({ open, setOpen }) => {
  const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      try {
        await api.post('/auth/logout');
        localStorage.clear();
        navigate('/', { replace: true });
      } catch (error) {
        console.error('Logout error:', error);
        localStorage.clear();
        navigate('/', { replace: true });
      }
    }
  };
  
  const handleProfile = ()=> {
      console.log('Profile clicked!'); // Add this
    navigate("/admin/profile");
  }

  return (
    <div className={`fixed left-0 top-0 shadow-md h-screen p-2 flex flex-col duration-500 bg-white text-gray-800 z-50 ${open ? 'w-60' : 'w-16'}`}>

      {/* Header */}
      <div className='px-3 py-2 h-20 flex justify-between items-center'>
       <Scale
  className={`
    ${open ? 'w-10 h-10 opacity-100' : 'w-0 h-0 opacity-0'}
    text-blue-700
    transition-all duration-500
  `}
/>
        <div>
          <MdMenuOpen 
            size={36} 
            className={`duration-500 cursor-pointer ${!open && 'rotate-180'}`} 
            onClick={() => setOpen(!open)} 
          />
        </div>
      </div>

      {/* Body */}
      <div className='flex-1 overflow-y-auto'>
        {menuItems.map((item, index) => (
          <NavLink
            to={item.path}
            key={index}
            end={item.path === "/admin"}
            className={({ isActive }) =>
              `px-2 py-4 my-3 rounded-md duration-300 cursor-pointer flex gap-6 items-center group relative
              ${isActive ? "bg-gray-200 font-semibold" : "hover:bg-gray-200"}`
            }
          >
            <div className="shrink-0">{item.icons}</div>
            <p className={`${!open && "w-0 translate-x-24"} duration-500 overflow-hidden whitespace-nowrap`}>
              {item.label}
            </p>
            {/* Tooltip on hover when sidebar is closed */}
            <p
              className={`${open && "hidden"} absolute left-full ml-2 shadow-md rounded-md
              px-0 py-0 text-black bg-white duration-100 overflow-hidden whitespace-nowrap
              group-hover:px-3 group-hover:py-2 opacity-0 group-hover:opacity-100`}
            >
              {item.label}
            </p>
          </NavLink>
        ))}

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full px-2 py-4 my-3 rounded-md duration-300 cursor-pointer flex gap-6 items-center group relative hover:bg-red-50"
        >
          <div className="shrink-0 text-red-600">
            <LogOut size={30} />
          </div>
          <p className={`${!open && "w-0 translate-x-24"} duration-500 overflow-hidden whitespace-nowrap text-red-600`}>
            Logout
          </p>
          {/* Tooltip on hover when sidebar is closed */}
          <p
            className={`${open && "hidden"} absolute left-full ml-2 shadow-md rounded-md
            px-0 py-0 text-red-600 bg-white duration-100 overflow-hidden whitespace-nowrap
            group-hover:px-3 group-hover:py-2 opacity-0 group-hover:opacity-100`}
          >
            Logout
          </p>
        </button>
      </div>

      {/* Footer */}
      <div className='flex items-center gap-2 px-3 py-2 border-t cursor-pointer hover:bg-gray-200 rounded-md transition' onClick={handleProfile}>
        <div className="shrink-0">
          <FaUserCircle size={30} />
          </div>
        <div className={`leading-5 ${!open && 'w-0 translate-x-24'} duration-500 overflow-hidden`}>
          <p className="font-medium">{user.name || 'Admin'}</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;