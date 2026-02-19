import { useState, useEffect } from 'react';
import { Briefcase, Clock, CheckSquare, FolderOpen, Calendar, Activity } from 'lucide-react';
import api from '../../api/api';

const AdvocateDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    cases: { total: 0, active: 0, pending: 0, closed: 0 },
    upcomingHearings: [],
    recentActivities: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/advocate/dashboard');
      console.log('Dashboard data:', response.data);
      setDashboardData(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching dashboard:', err);
      setError('Failed to load dashboard. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 md:p-6 flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 md:p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <span>{error}</span>
          <button
            onClick={fetchDashboardData}
            className="ml-4 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">

      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Dashboard</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard
          title="Total Cases"
          value={dashboardData.cases.total}
          icon={<Briefcase size={24} />}
          bgColor="bg-blue-100"
          iconColor="text-blue-600"
        />
        <StatCard
          title="Active Cases"
          value={dashboardData.cases.active}
          icon={<FolderOpen size={24} />}
          bgColor="bg-green-100"
          iconColor="text-green-600"
        />
        <StatCard
          title="Pending Cases"
          value={dashboardData.cases.pending}
          icon={<Clock size={24} />}
          bgColor="bg-yellow-100"
          iconColor="text-yellow-600"
        />
        <StatCard
          title="Closed Cases"
          value={dashboardData.cases.closed}
          icon={<CheckSquare size={24} />}
          bgColor="bg-gray-100"
          iconColor="text-gray-600"
        />
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Upcoming Hearings */}
        <div className="bg-white rounded-lg shadow p-4 md:p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar size={20} className="text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-800">Upcoming Hearings</h2>
            <span className="ml-auto px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
              Next 7 days
            </span>
          </div>

          {dashboardData.upcomingHearings.length > 0 ? (
            <div className="space-y-3">
              {dashboardData.upcomingHearings.map((hearing, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 truncate">{hearing.title}</p>
                      <p className="text-sm text-gray-600 truncate">{hearing.court}</p>
                    </div>
                    <div className="ml-3 text-right shrink-0">
                      <p className="text-sm font-medium text-blue-600">
                        {new Date(hearing.hearingDate).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short'
                        })}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(hearing.hearingDate).toLocaleTimeString('en-IN', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-gray-400">
              <Calendar size={40} className="mb-2 opacity-50" />
              <p className="text-sm">No upcoming hearings this week</p>
            </div>
          )}
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-lg shadow p-4 md:p-6">
          <div className="flex items-center gap-2 mb-4">
            <Activity size={20} className="text-green-600" />
            <h2 className="text-lg font-semibold text-gray-800">Recent Activities</h2>
          </div>

          {dashboardData.recentActivities.length > 0 ? (
            <div className="space-y-3">
              {dashboardData.recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                  <div className="w-2 h-2 mt-2 rounded-full bg-green-500 shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {activity.caseId?.title || 'Unknown Case'}
                    </p>
                    <p className="text-xs text-gray-600 truncate">{activity.action}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(activity.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-gray-400">
              <Activity size={40} className="mb-2 opacity-50" />
              <p className="text-sm">No recent activities</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdvocateDashboard;

// Stat Card Component
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