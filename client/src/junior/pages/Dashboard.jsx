// junior/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import { CheckSquare, Briefcase, Clock, AlertCircle, TrendingUp } from 'lucide-react';
import api from '../../api/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalTasks: 0,
    pendingTasks: 0,
    completedTasks: 0,
    overdueTasks: 0,
    totalCases: 0,
    activeCases: 0
  });
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const { data } = await api.get('/junior/dashboard');
      setStats(data.stats);
      setRecentTasks(data.recentTasks);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's your overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-linear-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Tasks</p>
              <p className="text-3xl font-bold mt-2">{stats.totalTasks}</p>
            </div>
            <CheckSquare className="w-12 h-12 opacity-80" />
          </div>
        </div>

        <div className="bg-linear-to-br from-yellow-500 to-yellow-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm">Pending Tasks</p>
              <p className="text-3xl font-bold mt-2">{stats.pendingTasks}</p>
            </div>
            <Clock className="w-12 h-12 opacity-80" />
          </div>
        </div>

        <div className="bg-linear-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Completed</p>
              <p className="text-3xl font-bold mt-2">{stats.completedTasks}</p>
            </div>
            <CheckSquare className="w-12 h-12 opacity-80" />
          </div>
        </div>

        <div className="bg-linear-to-br from-red-500 to-red-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm">Overdue</p>
              <p className="text-3xl font-bold mt-2">{stats.overdueTasks}</p>
            </div>
            <AlertCircle className="w-12 h-12 opacity-80" />
          </div>
        </div>

        <div className="bg-linear-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Total Cases</p>
              <p className="text-3xl font-bold mt-2">{stats.totalCases}</p>
            </div>
            <Briefcase className="w-12 h-12 opacity-80" />
          </div>
        </div>

        <div className="bg-linear-to-br from-cyan-500 to-cyan-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-cyan-100 text-sm">Active Cases</p>
              <p className="text-3xl font-bold mt-2">{stats.activeCases}</p>
            </div>
            <TrendingUp className="w-12 h-12 opacity-80" />
          </div>
        </div>
      </div>

      {/* Recent Tasks */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Recent Tasks</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {recentTasks.length > 0 ? recentTasks.map((task) => (
            <div key={task._id} className="p-4 hover:bg-gray-50 transition">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{task.title}</h3>
                  <p className="text-sm text-gray-600">{task.caseId?.title || 'N/A'}</p>
                </div>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                  task.status === 'completed' ? 'bg-green-100 text-green-700' :
                  task.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {task.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  <span>Deadline: {new Date(task.deadline).toLocaleDateString('en-IN')}</span>
                </div>
                <div className={`px-2 py-0.5 rounded text-xs font-medium ${
                  task.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                  task.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                  task.priority === 'medium' ? 'bg-blue-100 text-blue-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {task.priority?.toUpperCase() || 'MEDIUM'}
                </div>
              </div>
            </div>
          )) : (
            <div className="p-8 text-center text-gray-500">
              <CheckSquare size={48} className="mx-auto mb-3 text-gray-300" />
              <p>No tasks assigned yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;