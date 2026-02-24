// junior/pages/Tasks.jsx
import { useState, useEffect } from 'react';
import { CheckSquare, Clock, AlertCircle, Filter } from 'lucide-react';
import api from '../../api/api';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const { data } = await api.get('/junior/tasks');
      setTasks(data);
    } catch (err) {
      console.error('Error:', err);
      alert('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      await api.patch(`/junior/tasks/${taskId}`, { status: newStatus });
      fetchTasks();
      alert('Task status updated!');
    } catch (err) {
      alert('Failed to update task status');
    }
  };

  const isOverdue = (deadline) => new Date(deadline) < new Date();

  let filteredTasks = tasks;
  if (statusFilter) filteredTasks = filteredTasks.filter(t => t.status === statusFilter);
  if (priorityFilter) filteredTasks = filteredTasks.filter(t => t.priority === priorityFilter);

  const StatusBadge = ({ status }) => {
    const configs = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'PENDING' },
      in_progress: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'IN PROGRESS' },
      completed: { bg: 'bg-green-100', text: 'text-green-700', label: 'COMPLETED' }
    };
    const config = configs[status] || configs.pending;
    return (
      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const PriorityBadge = ({ priority }) => {
    const configs = {
      low: { bg: 'bg-gray-100', text: 'text-gray-700' },
      medium: { bg: 'bg-blue-100', text: 'text-blue-700' },
      high: { bg: 'bg-orange-100', text: 'text-orange-700' },
      urgent: { bg: 'bg-red-100', text: 'text-red-700' }
    };
    const config = configs[priority] || configs.medium;
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded ${config.bg} ${config.text}`}>
        {priority?.toUpperCase() || 'MEDIUM'}
      </span>
    );
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
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">My Tasks</h1>
        <p className="text-gray-600 mt-1">Manage your assigned tasks</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: tasks.length, color: 'bg-blue-500' },
          { label: 'Pending', value: tasks.filter(t => t.status === 'pending').length, color: 'bg-yellow-500' },
          { label: 'In Progress', value: tasks.filter(t => t.status === 'in_progress').length, color: 'bg-blue-600' },
          { label: 'Completed', value: tasks.filter(t => t.status === 'completed').length, color: 'bg-green-500' }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-600">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Filter size={16} className="inline mr-1" />
              Filter by Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Filter size={16} className="inline mr-1" />
              Filter by Priority
            </label>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tasks Grid */}
      <div className="grid gap-4">
        {filteredTasks.length > 0 ? filteredTasks.map((task) => (
          <div key={task._id} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-start gap-3 mb-2">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900">{task.title}</h3>
                    <p className="text-sm text-gray-600">{task.caseId?.title || 'N/A'} • {task.caseId?.caseNumber || ''}</p>
                  </div>
                  <div className="flex gap-2">
                    <PriorityBadge priority={task.priority} />
                    <StatusBadge status={task.status} />
                  </div>
                </div>
                
                {task.description && (
                  <p className="text-gray-700 mb-3">{task.description}</p>
                )}

                <div className="flex items-center gap-4 text-sm">
                  <div className={`flex items-center gap-1 ${isOverdue(task.deadline) ? 'text-red-600 font-semibold' : 'text-gray-600'}`}>
                    {isOverdue(task.deadline) && <AlertCircle size={14} />}
                    <Clock size={14} />
                    <span>Deadline: {new Date(task.deadline).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {task.status !== 'completed' && (
                <div className="flex flex-col gap-2 md:w-48">
                  <select
                    value={task.status}
                    onChange={(e) => updateTaskStatus(task._id, e.target.value)}
                    className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              )}
            </div>
          </div>
        )) : (
          <div className="text-center py-12 bg-white rounded-xl">
            <CheckSquare size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">No tasks found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tasks;