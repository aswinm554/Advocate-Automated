import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { Users, UserCheck, Clock, UserStar } from "lucide-react";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAdvocates: 0,
    totalClients: 0,
    pendingAdvocates: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const DashboardData = async () => {
      try {
        setLoading(true);
        const res = await api.get("/admin/reports/stats");

        setStats({
          totalUsers: res.data.totalUsers,
          totalAdvocates: res.data.totalAdvocates,
          totalClients: res.data.totalClients,
          pendingAdvocates: res.data.pendingAdvocates,
        });
        console.log(res.data.totalUsers);
        setError(null);
      } catch (err) {
        console.error("Failed to load admin dashboard", err);
        setError("Failed to load dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    DashboardData();
  }, []);

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Dashboard</h1>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <span className="block sm:inline">{error}</span>
          <button
            onClick={() => window.location.reload()}
            className="ml-4 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon={<Users size={24} />}
            bgColor="bg-blue-100"
            iconColor="text-blue-600"
          />
          <StatCard
            title="Total Advocates"
            value={stats.totalAdvocates}
            icon={<UserCheck size={24} />}
            bgColor="bg-green-100"
            iconColor="text-green-600"
          />
          <StatCard
            title="Pending Approvals"
            value={stats.pendingAdvocates}
            icon={<Clock size={24} />}
            bgColor="bg-yellow-100"
            iconColor="text-yellow-600"
          />
          <StatCard
            title="Total Clients"
            value={stats.totalClients}
            icon={<UserStar size={24} />}
            bgColor="bg-purple-100"
            iconColor="text-purple-600"
          />
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-4 md:p-6">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Recent Activity</h2>
          <p className="text-sm text-gray-600 mt-1">Latest updates and actions</p>
        </div>

        <div className="space-y-3">
          <ActivityItem
            text="Advocate Rahul submitted registration"
            time="2 minutes ago"
            status="pending"
          />
          <ActivityItem
            text="Admin approved Advocate Meera"
            time="1 hour ago"
            status="approved"
          />
          <ActivityItem
            text="Client Arjun registered"
            time="3 hours ago"
            status="info"
          />
          <ActivityItem
            text="Admin rejected Advocate Kumar"
            time="Yesterday"
            status="rejected"
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

const StatCard = ({ title, value, icon, bgColor, iconColor }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 md:p-5 hover:shadow-md transition">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-2xl md:text-3xl font-bold text-gray-800">{value}</p>
        </div>
        <div className={`p-3 ${bgColor} rounded-full ${iconColor}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

const ActivityItem = ({ text, time, status }) => {
  const getStatusColor = () => {
    switch (status) {
      case "pending":
        return "border-l-4 border-yellow-500 bg-yellow-50";
      case "approved":
        return "border-l-4 border-green-500 bg-green-50";
      case "rejected":
        return "border-l-4 border-red-500 bg-red-50";
      default:
        return "border-l-4 border-blue-500 bg-blue-50";
    }
  };

  return (
    <div
      className={`p-4 rounded-lg ${getStatusColor()} hover:shadow-sm transition`}
    >
      <div className="flex justify-between items-start">
        <p className="text-sm text-gray-700 font-medium flex-1">{text}</p>
        <span className="text-xs text-gray-500 ml-4 whitespace-nowrap">{time}</span>
      </div>
    </div>
  );
};