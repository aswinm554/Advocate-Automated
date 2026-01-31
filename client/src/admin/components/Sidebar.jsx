import { useState } from 'react';
import { NavLink } from "react-router-dom";

import { MdMenuOpen } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";

import { LayoutDashboard, UserCheck, Users, FileBarChart, ClipboardList, LogOut } from 'lucide-react';

const menuItems = [
  {
    icons: <LayoutDashboard size={30} />,
    label: 'Dashboard',
    path: "/admin"
  },
  {
    icons: < UserCheck size={30} />,
    label: 'Advocates',
    path: "/admin/advocates"
  },
  {
    icons: <  Users size={30} />,
    label: 'Clients',
    path: "/admin/clients"
  },
  {
    icons: < FileBarChart size={30} />,
    label: 'Reports',
    path : "/admin/reports"
  },
  {
    icons: <ClipboardList size={30} />,
    label: 'Activitylogs',
    path: "/admin/activitylog",

  },
  {
    icons: <  LogOut size={30} />,
    label: 'Logout',
    path: "/logout"
  }
]

const Sidebar = () => {

  const [open, setOpen] = useState(true)

  return (
    <div className={`shadow-md h-screen p-2 flex flex-col duration-500 bg-white text-gray-800 ${open ? 'w-60' : 'w-16'}`}>

      {/* Header */}
      <div className=' px-3 py-2 h-20 flex justify-between items-center'>
        <img src="https://imgs.search.brave.com/2D7yqHR8nqEsZFHq3yGoV5oqoZXqMR-tqFp0JfCw6hQ/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly90aHVt/YnMuZHJlYW1zdGlt/ZS5jb20vYi9sYXd5/ZXItYXR0b3JuZXkt/bG9nby1zaGllbGQt/c3dvcmQtbGF3LWxl/Z2FsLWFkdm9jYXRl/LWRlc2lnbi10ZW1w/bGF0ZS1saW5lYXIt/c3R5bGUtZmlybS1z/ZWN1cml0eS1jb21w/YW55LWxvZ290eXBl/LXByb3RlY3QtZGVm/ZW5zZS03ODUyMzMz/OC5qcGc" alt="Logo" className={`${open ? 'w-10' : 'w-0'} rounded-md`} />
        <div><MdMenuOpen size={36} className={` duration-500 cursor-pointer ${!open && ' rotate-180'}`} onClick={() => setOpen(!open)} /></div>
      </div>

      {/* Body */}

      <div className='flex-1'>
        {menuItems.map((item, index) => (
          <NavLink
            to={item.path}
            key={index}
            className={({ isActive }) =>
              `px-2 py-4 my-3 rounded-md duration-300 cursor-pointer flex gap-6 items-center group
       ${isActive ? "bg-gray-200 font-semibold" : "hover:bg-gray-200"}`
            }
          >
            <div>{item.icons}</div>
            <p className={`${!open && "w-0 translate-x-24"} duration-500 overflow-hidden`}>
              {item.label}
            </p>
            <p
              className={`${open && "hidden"} absolute left-32 shadow-md rounded-md
       w-0 p-0 text-black bg-white duration-100 overflow-hidden
       group-hover:w-fit group-hover:p-2 group-hover:left-16`}
            >
              {item.label}
            </p>
          </NavLink>
        ))}

      </div>
      {/* footer */}
      <div className='flex items-center gap-2 px-3 py-2'>
        <div><FaUserCircle size={30} /></div>
        <div className={`leading-5 ${!open && 'w-0 translate-x-24'} duration-500 overflow-hidden`}>
          <p>Admin</p>
          <span className='text-xs'>admin@legal.com</span>

        </div>
      </div>


    </div>
  )
}

export default Sidebar;