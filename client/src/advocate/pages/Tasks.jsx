import { useState, useEffect } from 'react';
import { CheckSquare, Plus, Trash2, Clock, AlertCircle, X, Calendar } from 'lucide-react';
import api from '../../api/api';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [cases, setCases] = useState([]);
  const [allJuniors, setAllJuniors] = useState([]);
  const [availableJuniors, setAvailableJuniors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    caseId: '',
    assignedTo: '',
    title: '',
    description: '',
    deadline: '',
    priority: 'medium'
  });




  useEffect(() => {
    fetchTasks();
    fetchCases();
    fetchJuniors();
  }, []);

  useEffect(() => {
    if (formData.caseId) {
      filterJuniorsForCase(formData.caseId);
    } else {
      setAvailableJuniors([]);
    }
  }, [formData.caseId]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/advocate/tasks');
      setTasks(data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      alert('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const fetchCases = async () => {
    try {
      const { data } = await api.get('/advocate/cases');
      setCases(data);
    } catch (err) {
      console.error('Error fetching cases:', err);
    }
  };

  const fetchJuniors = async () => {
    try {
      const { data } = await api.get('/advocate/juniors');
      setAllJuniors(data);
      console.log("Juniors:", data);
    } catch (err) {
      console.error('Error fetching juniors:', err);
    }
  };

  const filterJuniorsForCase = async (caseId) => {
    try {
      if (caseId) {
        setAvailableJuniors(allJuniors);
      } else {
        setAvailableJuniors([]);
      }
    } catch (err) {
      console.error('Error filtering juniors:', err);
      setAvailableJuniors([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post('/advocate/tasks', formData);
      setShowModal(false);
      resetForm();
      fetchTasks();
      alert('Task created successfully!');
    } catch (err) {
      console.error('Error creating task:', err);
      alert(err.response?.data?.message || 'Failed to create task');
    }
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      await api.delete(`/advocate/tasks/${taskId}`);
      fetchTasks();
      alert('Task deleted successfully');
    } catch (err) {
      console.error('Error deleting task:', err);
      alert('Failed to delete task');
    }
  };

  const resetForm = () => {
    setFormData({
      caseId: '',
      assignedTo: '',
      title: '',
      description: '',
      deadline: '',
      priority: 'medium'
    });
    setAvailableJuniors([]);
  };

  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  const StatusBadge = ({ status }) => {
    const configs = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: <Clock size={14} /> },
      in_progress: { bg: 'bg-blue-100', text: 'text-blue-700', icon: <Clock size={14} /> },
      completed: { bg: 'bg-green-100', text: 'text-green-700', icon: <CheckSquare size={14} /> }
    };
    const config = configs[status] || configs.pending;

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full ${config.bg} ${config.text}`}>
        {config.icon}
        {status.replace('_', ' ').charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
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
        {priority.toUpperCase()}
      </span>
    );
  };

  const isOverdue = (deadline) => {
    return new Date(deadline) < new Date();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Tasks</h1>
          <p className="text-gray-600 mt-1">Assign and manage tasks for junior advocates</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <Plus size={18} />
          New Task
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Tasks', value: tasks.length },
          { label: 'Pending', value: tasks.filter(t => t.status === 'pending').length },
          { label: 'In Progress', value: tasks.filter(t => t.status === 'in_progress').length },
          { label: 'Completed', value: tasks.filter(t => t.status === 'completed').length }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-600">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Tasks List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {tasks.length > 0 ? (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Task</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Case</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Assigned To</th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Priority</th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Deadline</th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Status</th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {tasks.map((task) => (
                    <tr key={task._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-900">{task.title}</p>
                        {task.description && (
                          <p className="text-sm text-gray-500 truncate max-w-xs">{task.description}</p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-900">{task.caseId?.title || 'N/A'}</p>
                        <p className="text-sm text-gray-500">{task.caseId?.caseNumber || ''}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-900">{task.assignedTo?.name || 'N/A'}</p>
                        <p className="text-sm text-gray-500">{task.assignedTo?.email || ''}</p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <PriorityBadge priority={task.priority} />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className={`text-sm ${isOverdue(task.deadline) ? 'text-red-600 font-semibold' : 'text-gray-600'}`}>
                          {isOverdue(task.deadline) && <AlertCircle size={14} className="inline mr-1" />}
                          {new Date(task.deadline).toLocaleDateString('en-IN')}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(task.deadline).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <StatusBadge status={task.status} />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleDelete(task._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Delete Task"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y">
              {tasks.map((task) => (
                <div key={task._id} className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900">{task.title}</h3>
                      {task.description && (
                        <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                      )}
                    </div>
                    <button
                      onClick={() => handleDelete(task._id)}
                      className="ml-2 p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="space-y-2 mb-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Case:</span>
                      <span className="font-medium">{task.caseId?.title || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Assigned To:</span>
                      <span className="font-medium">{task.assignedTo?.name || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Priority:</span>
                      <PriorityBadge priority={task.priority} />
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Deadline:</span>
                      <span className={`font-medium ${isOverdue(task.deadline) ? 'text-red-600' : ''}`}>
                        {new Date(task.deadline).toLocaleDateString('en-IN')}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Status:</span>
                      <StatusBadge status={task.status} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <CheckSquare size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 mb-4">No tasks assigned yet</p>
            <button
              onClick={() => setShowModal(true)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Create First Task
            </button>
          </div>
        )}
      </div>


      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => { setShowModal(false); resetForm(); }}></div>

          <div className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold">Create New Task</h2>
              <button onClick={() => { setShowModal(false); resetForm(); }} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Case *</label>
                  <select
                    required
                    value={formData.caseId}
                    onChange={(e) => setFormData({ ...formData, caseId: e.target.value, assignedTo: '' })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">-- Select Case --</option>
                    {cases.map((caseItem) => (
                      <option key={caseItem._id} value={caseItem._id}>
                        {caseItem.title} ({caseItem.caseNumber})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assign To *</label>
                  <select
                    required
                    value={formData.assignedTo}
                    onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={!formData.caseId}
                  >
                    <option value="">
                      {!formData.caseId
                        ? '-- Select Case First --'
                        : availableJuniors.length === 0
                          ? '-- No Junior Assigned to Case --'
                          : '-- Select Junior Advocate --'}
                    </option>
                    {availableJuniors.map((junior) => (
                      <option key={junior._id} value={junior._id}>
                        {junior.name} ({junior.email})
                      </option>
                    ))}
                  </select>
                  {formData.caseId && availableJuniors.length === 0 && (
                    <p className="text-xs text-red-600 mt-1">No junior advocates assigned to this case</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Task Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Draft petition for hearing"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority *</label>
                  <select
                    required
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deadline *</label>
                  <input
                    type="datetime-local"
                    required
                    min={getMinDateTime()}
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows="3"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="Task details and instructions..."
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); resetForm(); }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;