import { useState, useEffect } from 'react';
import { Calendar, Clock, User, Mail, Phone, Filter, CheckCircle, XCircle, AlertCircle, Search, RefreshCw } from 'lucide-react';
import api from '../../api/api';

const AdvocateAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    filterAppointments();
  }, [filterStatus, searchTerm, appointments]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await api.get('/advocate/appointments');
      setAppointments(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError('Failed to load appointments. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filterAppointments = () => {
    let filtered = appointments;

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(apt => apt.status === filterStatus);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(apt => 
        apt.clientUserId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.clientUserId?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.clientUserId?.phone?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredAppointments(filtered);
  };

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    const statusLabels = {
      approved: 'approve',
      rejected: 'reject',
      completed: 'mark as completed',
      cancelled: 'cancel'
    };

    if (!window.confirm(`Are you sure you want to ${statusLabels[newStatus]} this appointment?`)) {
      return;
    }

    try {
      setUpdatingId(appointmentId);
      await api.patch(`/advocate/appointments/${appointmentId}`, { status: newStatus });
      fetchAppointments();
      
      // Success notification
      const successMsg = document.createElement('div');
      successMsg.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-down';
      successMsg.textContent = `Appointment ${statusLabels[newStatus]}d successfully!`;
      document.body.appendChild(successMsg);
      setTimeout(() => successMsg.remove(), 3000);
    } catch (err) {
      console.error('Error updating appointment:', err);
      alert(err.response?.data?.message || 'Failed to update appointment');
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending: { 
        bg: 'bg-amber-50', 
        text: 'text-amber-700', 
        border: 'border-amber-200',
        icon: <Clock size={14} />
      },
      approved: { 
        bg: 'bg-emerald-50', 
        text: 'text-emerald-700', 
        border: 'border-emerald-200',
        icon: <CheckCircle size={14} />
      },
      rejected: { 
        bg: 'bg-rose-50', 
        text: 'text-rose-700', 
        border: 'border-rose-200',
        icon: <XCircle size={14} />
      },
      completed: { 
        bg: 'bg-blue-50', 
        text: 'text-blue-700', 
        border: 'border-blue-200',
        icon: <CheckCircle size={14} />
      },
      cancelled: { 
        bg: 'bg-gray-50', 
        text: 'text-gray-700', 
        border: 'border-gray-200',
        icon: <XCircle size={14} />
      }
    };
    return configs[status] || configs.pending;
  };

  const getStatusBadge = (status) => {
    const config = getStatusConfig(status);
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full border ${config.bg} ${config.text} ${config.border}`}>
        {config.icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getStatusCount = (status) => {
    return appointments.filter(apt => apt.status === status).length;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-blue-600 mb-4"></div>
          <p className="text-gray-600 font-medium">Loading appointments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Appointments</h1>
            </div>
            <button
              onClick={fetchAppointments}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <RefreshCw size={18} />
              Refresh
            </button>
          </div>

          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-start gap-3">
              <AlertCircle size={20} className="shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium">{error}</p>
              </div>
              <button
                onClick={fetchAppointments}
                className="px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition"
              >
                Retry
              </button>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          <StatCard
            title="All"
            value={appointments.length}
            icon={<Calendar size={20} />}
            gradient="from-blue-500 to-blue-600"
            active={filterStatus === 'all'}
            onClick={() => setFilterStatus('all')}
          />
          <StatCard
            title="Pending"
            value={getStatusCount('pending')}
            icon={<Clock size={20} />}
            gradient="from-amber-500 to-amber-600"
            active={filterStatus === 'pending'}
            onClick={() => setFilterStatus('pending')}
          />
          <StatCard
            title="Approved"
            value={getStatusCount('approved')}
            icon={<CheckCircle size={20} />}
            gradient="from-emerald-500 to-emerald-600"
            active={filterStatus === 'approved'}
            onClick={() => setFilterStatus('approved')}
          />
          <StatCard
            title="Completed"
            value={getStatusCount('completed')}
            icon={<CheckCircle size={20} />}
            gradient="from-blue-500 to-blue-600"
            active={filterStatus === 'completed'}
            onClick={() => setFilterStatus('completed')}
          />
          <StatCard
            title="Rejected"
            value={getStatusCount('rejected')}
            icon={<XCircle size={20} />}
            gradient="from-rose-500 to-rose-600"
            active={filterStatus === 'rejected'}
            onClick={() => setFilterStatus('rejected')}
          />
        </div>

        {/* Search & Filter Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            {/* Results Count */}
            <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-xl border border-gray-200">
              <Filter size={18} className="text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                {filteredAppointments.length} {filteredAppointments.length === 1 ? 'result' : 'results'}
              </span>
            </div>
          </div>
        </div>

        {/* Appointments List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {filteredAppointments.length > 0 ? (
            <>
              {/* Desktop Table */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-linear-to-br from-gray-50 to-gray-100 border-b border-gray-200">
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Client</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Contact</th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Appointment</th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredAppointments.map((appointment) => (
                      <tr key={appointment._id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold shadow-sm">
                              {appointment.clientUserId?.name?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{appointment.clientUserId?.name || 'N/A'}</p>
                              <p className="text-sm text-gray-500">Client</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Mail size={14} className="text-gray-400" />
                              <span className="truncate max-w-xs">{appointment.clientUserId?.email || 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Phone size={14} className="text-gray-400" />
                              <span>{appointment.clientUserId?.phone || 'N/A'}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-center space-y-1.5">
                            <div className="flex items-center justify-center gap-2 font-medium text-gray-900">
                              <Calendar size={16} className="text-blue-600" />
                              {new Date(appointment.appointmentDate).toLocaleDateString('en-IN', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </div>
                            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                              <Clock size={14} className="text-gray-400" />
                              {appointment.time || 'Not specified'}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          {getStatusBadge(appointment.status)}
                        </td>
                        <td className="px-6 py-4">
                          <ActionButtons
                            appointment={appointment}
                            onUpdate={handleStatusUpdate}
                            updating={updatingId === appointment._id}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Tablet & Mobile Cards */}
              <div className="lg:hidden divide-y divide-gray-200">
                {filteredAppointments.map((appointment) => (
                  <div key={appointment._id} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors">
                    {/* Card Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md">
                          {appointment.clientUserId?.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-lg">{appointment.clientUserId?.name || 'N/A'}</p>
                          <p className="text-sm text-gray-500">Client</p>
                        </div>
                      </div>
                      {getStatusBadge(appointment.status)}
                    </div>

                    {/* Card Body */}
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-3 text-gray-700 bg-gray-50 rounded-lg p-3">
                        <Mail size={18} className="text-blue-600 shrink-0" />
                        <span className="text-sm truncate">{appointment.clientUserId?.email || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-700 bg-gray-50 rounded-lg p-3">
                        <Phone size={18} className="text-green-600 shrink-0" />
                        <span className="text-sm">{appointment.clientUserId?.phone || 'N/A'}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center gap-3 text-gray-700 bg-gray-50 rounded-lg p-3">
                          <Calendar size={18} className="text-purple-600 shrink-0" />
                          <span className="text-sm font-medium">
                            {new Date(appointment.appointmentDate).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short'
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-700 bg-gray-50 rounded-lg p-3">
                          <Clock size={18} className="text-orange-600 shrink-0" />
                          <span className="text-sm font-medium">{appointment.time || 'N/A'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Card Actions */}
                    <ActionButtons
                      appointment={appointment}
                      onUpdate={handleStatusUpdate}
                      updating={updatingId === appointment._id}
                      mobile
                    />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <Calendar size={48} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Appointments Found</h3>
              <p className="text-gray-600 text-center max-w-md mb-6">
                {filterStatus === 'all' 
                  ? 'You don\'t have any appointments yet. They will appear here once clients book with you.' 
                  : `No ${filterStatus} appointments at the moment.`}
              </p>
              {filterStatus !== 'all' && (
                <button
                  onClick={() => setFilterStatus('all')}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  View All Appointments
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ title, value, icon, gradient, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`relative overflow-hidden p-4 sm:p-5 rounded-xl transition-all duration-200 ${
        active 
          ? 'ring-2 ring-blue-500 shadow-lg scale-105' 
          : 'hover:scale-105 hover:shadow-lg'
      }`}
    >
      <div className={`absolute inset-0 bg-linear-to-br ${gradient} opacity-90`}></div>
      <div className="relative z-10 text-white">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs sm:text-sm font-semibold opacity-90 uppercase tracking-wide">{title}</span>
          {icon}
        </div>
        <p className="text-2xl sm:text-3xl lg:text-4xl font-bold">{value}</p>
      </div>
      {active && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white"></div>
      )}
    </button>
  );
};

// Action Buttons Component
const ActionButtons = ({ appointment, onUpdate, updating, mobile = false }) => {
  const buttonClass = mobile 
    ? "flex-1 px-4 py-3 font-semibold rounded-xl transition-all duration-200 text-sm shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
    : "px-4 py-2 font-semibold rounded-lg transition-all duration-200 text-sm shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed";

  if (appointment.status === 'pending') {
    return (
      <div className={`flex gap-2 ${mobile ? '' : 'justify-center'}`}>
        <button
          onClick={() => onUpdate(appointment._id, 'approved')}
          disabled={updating}
          className={`${buttonClass} bg-emerald-500 hover:bg-emerald-600 text-white`}
        >
          {updating ? 'Processing...' : '✓ Approve'}
        </button>
        <button
          onClick={() => onUpdate(appointment._id, 'rejected')}
          disabled={updating}
          className={`${buttonClass} bg-rose-500 hover:bg-rose-600 text-white`}
        >
          {updating ? 'Processing...' : '✕ Reject'}
        </button>
      </div>
    );
  }

  if (appointment.status === 'approved') {
    return (
      <button
        onClick={() => onUpdate(appointment._id, 'completed')}
        disabled={updating}
        className={`${buttonClass} ${mobile ? 'w-full' : ''} bg-blue-500 hover:bg-blue-600 text-white`}
      >
        {updating ? 'Processing...' : '✓ Mark Complete'}
      </button>
    );
  }

  return (
    <span className={`text-sm text-gray-500 font-medium ${mobile ? 'block text-center py-2' : ''}`}>
      No actions available
    </span>
  );
};

export default AdvocateAppointments;