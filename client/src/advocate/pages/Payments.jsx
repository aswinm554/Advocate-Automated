import { useState, useEffect } from 'react';
import { CreditCard, Search, Plus, DollarSign, Clock, CheckCircle, XCircle, X } from 'lucide-react';
import api from '../../api/api';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [clients, setClients] = useState([]);
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  
  const [formData, setFormData] = useState({
    clientId: '',
    caseId: '',
    amount: '',
    paymentType: 'consultation',
    description: ''
  });

  useEffect(() => {
    fetchPayments();
    fetchClients();
  }, [statusFilter]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const params = statusFilter ? `?status=${statusFilter}` : '';
      const { data } = await api.get(`/advocate/payments${params}`);
      setPayments(data);
    } catch (err) {
      console.error('Error fetching payments:', err);
      alert('Failed to load payments');
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      const { data } = await api.get('/advocate/clients');
      setClients(data);
    } catch (err) {
      console.error('Error fetching clients:', err);
    }
  };

  const fetchClientCases = async (clientId) => {
    try {
      const { data } = await api.get(`/advocate/cases?clientId=${clientId}`);
      setCases(data);
    } catch (err) {
      console.error('Error fetching cases:', err);
      setCases([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/advocate/payments/request', formData);
      setShowModal(false);
      resetForm();
      fetchPayments();
      alert('Payment request sent successfully!');
    } catch (err) {
      console.error('Error creating payment:', err);
      alert(err.response?.data?.message || 'Failed to create payment request');
    }
  };

  const handleStatusUpdate = async (paymentId, newStatus) => {
    if (!window.confirm(`Mark this payment as ${newStatus}?`)) return;
    
    try {
      await api.patch(`/advocate/payments/${paymentId}`, { status: newStatus });
      fetchPayments();
    } catch (err) {
      console.error('Error updating payment:', err);
      alert('Failed to update payment status');
    }
  };

  const resetForm = () => {
    setFormData({
      clientId: '',
      caseId: '',
      amount: '',
      paymentType: 'consultation',
      description: ''
    });
    setCases([]);
  };

  const StatusBadge = ({ status }) => {
    const configs = {
      requested: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: <Clock size={14} /> },
      paid: { bg: 'bg-green-100', text: 'text-green-700', icon: <CheckCircle size={14} /> },
      cancelled: { bg: 'bg-red-100', text: 'text-red-700', icon: <XCircle size={14} /> },
      pending: { bg: 'bg-blue-100', text: 'text-blue-700', icon: <Clock size={14} /> }
    };
    const config = configs[status] || configs.pending;
    
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full ${config.bg} ${config.text}`}>
        {config.icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getTotalAmount = (status) => {
    return payments
      .filter(p => !status || p.status === status)
      .reduce((sum, p) => sum + (p.amount || 0), 0);
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
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Payments</h1>
          <p className="text-gray-600 mt-1">Manage payment requests and transactions</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <Plus size={18} />
          New Payment Request
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Payments', value: payments.length, color: 'bg-blue-500' },
          { label: 'Requested', value: payments.filter(p => p.status === 'requested').length, color: 'bg-yellow-500' },
          { label: 'Paid', value: payments.filter(p => p.status === 'paid').length, color: 'bg-green-500' },
          { label: 'Total Amount', value: `₹${getTotalAmount().toLocaleString()}`, color: 'bg-purple-500' }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-600">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex gap-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="requested">Requested</option>
            <option value="paid">Paid</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Payments List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {payments.length > 0 ? (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Client</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Case</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Type</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Amount</th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Status</th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Date</th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {payments.map((payment) => (
                    <tr key={payment._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-900">{payment.clientId?.name || 'N/A'}</p>
                        <p className="text-sm text-gray-500">{payment.clientId?.email || ''}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-900">{payment.caseId?.title || 'N/A'}</p>
                        <p className="text-sm text-gray-500">{payment.caseId?.caseNumber || ''}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-700 capitalize">{payment.paymentType}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="font-semibold text-gray-900">₹{payment.amount.toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <StatusBadge status={payment.status} />
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-600">
                        {new Date(payment.createdAt).toLocaleDateString('en-IN')}
                      </td>
                      <td className="px-6 py-4">
                        {payment.status === 'requested' && (
                          <div className="flex gap-2 justify-center">
                            <button
                              onClick={() => handleStatusUpdate(payment._id, 'paid')}
                              className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition"
                            >
                              Mark Paid
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(payment._id, 'cancelled')}
                              className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition"
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y">
              {payments.map((payment) => (
                <div key={payment._id} className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-gray-900">{payment.clientId?.name || 'N/A'}</h3>
                      <p className="text-sm text-gray-500">{payment.caseId?.title || 'N/A'}</p>
                    </div>
                    <StatusBadge status={payment.status} />
                  </div>
                  
                  <div className="space-y-2 mb-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium capitalize">{payment.paymentType}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-bold text-lg text-gray-900">₹{payment.amount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-medium">{new Date(payment.createdAt).toLocaleDateString('en-IN')}</span>
                    </div>
                  </div>

                  {payment.status === 'requested' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleStatusUpdate(payment._id, 'paid')}
                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm"
                      >
                        Mark Paid
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(payment._id, 'cancelled')}
                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <CreditCard size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 mb-4">No payments found</p>
            <button
              onClick={() => setShowModal(true)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Create Payment Request
            </button>
          </div>
        )}
      </div>

      {/* Payment Request Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => { setShowModal(false); resetForm(); }}></div>
          
          <div className="relative bg-white rounded-xl shadow-2xl max-w-lg w-full">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold">New Payment Request</h2>
              <button onClick={() => { setShowModal(false); resetForm(); }} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Client *</label>
                <select
                  required
                  value={formData.clientId}
                  onChange={(e) => {
                    setFormData({ ...formData, clientId: e.target.value, caseId: '' });
                    fetchClientCases(e.target.value);
                  }}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Select Client --</option>
                  {clients.map((client) => (
                    <option key={client._id} value={client.userId._id}>
                      {client.userId.name} ({client.userId.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Case *</label>
                <select
                  required
                  value={formData.caseId}
                  onChange={(e) => setFormData({ ...formData, caseId: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={!formData.clientId}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Type *</label>
                <select
                  required
                  value={formData.paymentType}
                  onChange={(e) => setFormData({ ...formData, paymentType: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="consultation">Consultation Fee</option>
                  <option value="retainer">Retainer Fee</option>
                  <option value="hearing">Hearing Fee</option>
                  <option value="documentation">Documentation Fee</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹) *</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 5000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="3"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Payment details or notes..."
                />
              </div>

              <div className="flex gap-3 pt-4">
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
                  Send Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments;