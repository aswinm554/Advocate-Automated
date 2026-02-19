import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { MdMenuOpen } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
import {
    LayoutDashboard, CalendarCheck
    , Briefcase, Users, UserPlus, CreditCard, FileText, CheckSquare, LogOut
} from 'lucide-react';
import api from "../../api/api";

const menuItems = [
    {
        icons: <LayoutDashboard size={30} />,
        label: 'Dashboard',
        path: "/advocate"
    },
    {
        icons: <CalendarCheck size={30} />,
        label: 'Appointments',
        path: "/advocate/appointments"
    },
    {
        icons: <Briefcase size={30} />,
        label: 'Cases',
        path: "/advocate/cases"
    },
    {
        icons: <Users size={30} />,
        label: 'Clients',
        path: "/advocate/clients"
    },
    {
        icons: <UserPlus size={30} />,
        label: 'Junior Advocate',
        path: "/advocate/junior",
    },
    {
        icons: <CheckSquare size={30} />,
        label: 'Tasks',
        path: "/advocate/tasks",
    },
    {
        icons: <FileText size={30} />,
        label: 'Documents',
        path: "/advocate/documents",
    },
    {
        icons: <CreditCard size={30} />,
        label: 'Payments',
        path: "/advocate/payments",
    },

];

const Sidebar = ({ open, setOpen }) => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        if (window.confirm('Are you sure you want to logout?')) {
            try {
                await api.post('/auth/logout');
                localStorage.clear();
                navigate('/login', { replace: true });
            } catch (error) {
                console.error('Logout error:', error);
                localStorage.clear();
                navigate('/login', { replace: true });
            }
        }
    };

    const handleProfile = () => {
        console.log('Profile clicked!');
        navigate("/advocate/profile");
    }

    return (
        <div className={`fixed left-0 top-0 shadow-md h-screen p-2 flex flex-col duration-500 bg-white text-gray-800 z-50 ${open ? 'w-60' : 'w-20'}`}>

            <div className='px-3 py-2 h-20 flex justify-between items-center'>
                <img
                    src="https://imgs.search.brave.com/2D7yqHR8nqEsZFHq3yGoV5oqoZXqMR-tqFp0JfCw6hQ/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly90aHVt/YnMuZHJlYW1zdGlt/ZS5jb20vYi9sYXd5/ZXItYXR0b3JuZXkt/bG9nby1zaGllbGQt/c3dvcmQtbGF3LWxl/Z2FsLWFkdm9jYXRl/LWRlc2lnbi10ZW1w/bGF0ZS1saW5lYXIt/c3R5bGUtZmlybS1z/ZWN1cml0eS1jb21w/YW55LWxvZ290eXBl/LXByb3RlY3QtZGVm/ZW5zZS03ODUyMzMz/OC5qcGc"
                    alt="Logo"
                    className={`${open ? 'w-12' : 'w-0'} rounded-md transition-all duration-500`}
                />
                <div>
                    <MdMenuOpen
                        size={36}
                        className={`duration-500 cursor-pointer ${!open && 'rotate-180'}`}
                        onClick={() => setOpen(!open)}
                    />
                </div>
            </div>
 
            <div className='flex-1 overflow-y-auto'>
                {menuItems.map((item, index) => (
                    <NavLink
                        to={item.path}
                        key={index}
                        end={item.path === "/advocate"}
                        className={({ isActive }) =>
                            `px-2 py-4 my-3 rounded-md duration-300 cursor-pointer flex gap-6 items-center group relative
              ${isActive ? "bg-gray-200 font-semibold" : "hover:bg-gray-200"}`
                        }
                    >
                        <div className="shrink-0">{item.icons}</div>
                        <p className={`${!open && "w-0 translate-x-24"} duration-500 overflow-hidden whitespace-nowrap`}>
                            {item.label}
                        </p>
                        <p
                            className={`${open && "hidden"} absolute left-full ml-2 shadow-md rounded-md
              px-0 py-0 text-black bg-white duration-100 overflow-hidden whitespace-nowrap
              group-hover:px-3 group-hover:py-2 opacity-0 group-hover:opacity-100`}
                        >
                            {item.label}
                        </p>
                    </NavLink>
                ))}

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
                    <p
                        className={`${open && "hidden"} absolute left-full ml-2 shadow-md rounded-md
            px-0 py-0 text-red-600 bg-white duration-100 overflow-hidden whitespace-nowrap
            group-hover:px-3 group-hover:py-2 opacity-0 group-hover:opacity-100`}
                    >
                        Logout
                    </p>
                </button>
            </div>

            <div className='flex items-center gap-2 px-3 py-2 border-t cursor-pointer hover:bg-gray-200 rounded-md transition' onClick={handleProfile}>
                <div className="shrink-0">
                    <FaUserCircle size={30} />
                </div>
                <div className={`leading-5 ${!open && 'w-0 translate-x-24'} duration-500 overflow-hidden`}>
                    <p className="font-medium">Advocate</p>
                    <span className='text-xs text-gray-600'>email</span>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;