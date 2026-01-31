import React, {useEffect, useState} from "react";
import api from "../../api/api";
import {Users,UserCheck,Clock, UserStar} from "lucide-react";



const Dashboard = () => {

    const[stats, setStats] = useState({totalUsers:0,totalAdvocates:0,totalClients:0,pendingAdvocates:0})
    useEffect(()=> {
      const DashboardData = async () => {
      try {
        const res = await api.get("/admin/reports/stats");

        setStats({
          totalUsers: res.data.totalUsers,
          totalAdvocates: res.data.totalAdvocates,
          totalClients: res.data.totalClients,
          pendingAdvocates: res.data.pendingAdvocates,
        });
        console.log(res.data.totalUsers)
      } catch (err) {
        console.error("Failed to load admin dashboard", err);
      }
    };

    DashboardData();
  }, []);
  
  return (
    <div className="space-y-6">

      {/* Page Title */}
      <h1 className="text-2xl font-semibold text-gray-800">
        Dashboard
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Users" value={stats.totalUsers} icon={<Users size={22} />} />
        <StatCard title="Total Advocates" value={stats.totalAdvocates} icon={<UserCheck size={22} />} />
        <StatCard title="Pending Approvals" value={stats.pendingAdvocates} icon={<Clock size={22} />} />
        <StatCard title="Total Clients" value={stats.totalClients} icon={<UserStar size={22} />} />
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">
            Recent Activity
          </h2>
        </div>

        <ul className="divide-y">
          <ActivityItem
            text="Advocate Rahul submitted registration"
            time="2 minutes ago"
          />
          <ActivityItem
            text="Admin approved Advocate Meera"
            time="1 hour ago"
          />
          <ActivityItem
            text="Client Arjun registered"
            time="3 hours ago"
          />
          <ActivityItem
            text="Admin rejected Advocate Kumar"
            time="Yesterday"
          />
        </ul>
      </div>

    </div>
  );
};

export default Dashboard;

/* ---------- Components ---------- */

const StatCard = ({ title, value, icon }) => {
  return (
    <div className="bg-white border rounded-lg p-5 shadow-sm hover:shadow-md transition">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-semibold text-gray-800">
            {value}
          </p>
        </div>
        <div className="p-3 bg-gray-100 rounded-full text-gray-700">
          {icon}
        </div>
      </div>
    </div>
  );
};

const ActivityItem = ({ text, time }) => {
  return (
    <li className="px-6 py-4 flex justify-between items-center text-sm">
      <span className="text-gray-700">{text}</span>
      <span className="text-gray-400">{time}</span>
    </li>
  );
};
