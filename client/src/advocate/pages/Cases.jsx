import { useState, useEffect } from 'react';
import { Briefcase, Search, Plus, Edit, Calendar, X, MessageCircle, Send } from 'lucide-react';
import api from '../../api/api';

const Cases = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showMessagesModal, setShowMessagesModal] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [clients, setClients] = useState([]);
  const [loadingClients, setLoadingClients] = useState(false);

  // Message states
  const [messages, setMessages] = useState([]);
  const [messageContent, setMessageContent] = useState('');
  const [selectedReceiver, setSelectedReceiver] = useState('');
  const [caseParticipants, setCaseParticipants] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  const [formData, setFormData] = useState({
    title: '',
    caseNumber: '',
    court: '',
    status: 'pending',
    hearingDate: '',
    description: '',
    clientId: ''
  });

  useEffect(() => {
    fetchCases();
  }, [statusFilter, searchTerm]);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchCases = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      if (searchTerm) params.append('search', searchTerm);

      const { data } = await api.get(`/advocate/cases?${params.toString()}`);
      setCases(data);
    } catch (err) {
      alert('Failed to load cases');
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      setLoadingClients(true);
      const { data } = await api.get('/advocate/clients');
      setClients(data);
    } catch (err) {
      console.error('Error fetching clients:', err);
      alert('Failed to load clients');
    } finally {
      setLoadingClients(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        const updatedData = {};
        Object.keys(formData).forEach((key) => {
          if (formData[key] !== selectedCase[key]) {
            updatedData[key] = formData[key];
          }
        });
        await api.patch(`/advocate/cases/${selectedCase._id}`, updatedData);
      } else {
        await api.post('/advocate/cases', formData);
      }
      closeModal();
      fetchCases();
    } catch (err) {
      console.log(err.response);
      alert(err.response?.data?.message || 'Operation failed');
    }
  };

  const openModal = (type, caseData = null) => {
    if (type === 'create') {
      setIsEdit(false);
      setFormData({
        title: '',
        caseNumber: '',
        court: '',
        status: 'pending',
        hearingDate: '',
        description: '',
        clientId: ''
      });
    } else {
      setIsEdit(true);
      setSelectedCase(caseData);
      setFormData({
        title: caseData.title,
        caseNumber: caseData.caseNumber,
        court: caseData.court,
        status: caseData.status,
        hearingDate: caseData.hearingDate ? new Date(caseData.hearingDate).toISOString().slice(0, 16) : '',
        description: caseData.description || '',
        clientId: caseData.clientId || ''
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCase(null);
    setIsEdit(false);
  };

  // Message Functions
  const openMessagesModal = async (caseData) => {
    setSelectedCase(caseData);
    setShowMessagesModal(true);
    await fetchCaseDetails(caseData._id);
    await fetchMessages(caseData._id);
  };

  const closeMessagesModal = () => {
    setShowMessagesModal(false);
    setSelectedCase(null);
    setMessages([]);
    setMessageContent('');
    setSelectedReceiver('');
    setCaseParticipants([]);
  };

  const fetchCaseDetails = async (caseId) => {
    try {
      const { data } = await api.get(`/advocate/cases/${caseId}`);

      // Build participants list
      const participants = [];

      // Add client
      if (data.clientId) {
        participants.push({
          id: typeof data.clientId === 'object' ? data.clientId._id : data.clientId,
          name: data.clientId?.name || 'Client',
          role: 'client'
        });
      }

      // Add assigned juniors
      if (data.assignedJuniors && data.assignedJuniors.length > 0) {
        data.assignedJuniors.forEach(junior => {

          const juniorId =
            typeof junior === "object" ? junior._id : junior;

          const juniorName =
            typeof junior === "object" ? junior.name : "Junior Advocate";

          participants.push({
            id: juniorId,
            name: juniorName,
            role: "junior_advocate"
          });
        });
      }

      setCaseParticipants(participants);

      // Auto-select first participant
      if (participants.length > 0) {
        setSelectedReceiver(participants[0].id);
      }
    } catch (err) {
      console.error('Error fetching case details:', err);
    }
  };

  const fetchMessages = async (caseId) => {
    try {
      setLoadingMessages(true);
      const { data } = await api.get(`/messages/${caseId}`);
      setMessages(data);
    } catch (err) {
      console.error('Error fetching messages:', err);
    } finally {
      setLoadingMessages(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();

    if (!messageContent.trim() || !selectedReceiver) {
      alert('Please select a receiver and enter a message');
      return;
    }

    try {
      setSendingMessage(true);
      await api.post('/messages', {
        caseId: selectedCase._id,
        receiverId: String(selectedReceiver),
        content: messageContent.trim()
      });

      setMessageContent('');
      await fetchMessages(selectedCase._id);

      // Scroll to bottom
      setTimeout(() => {
        const messagesContainer = document.getElementById('messages-container');
        if (messagesContainer) {
          messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
      }, 100);
    } catch (err) {
      console.error('Error sending message:', err);
      alert('Failed to send message');
    } finally {
      setSendingMessage(false);
    }
  };

  const StatusBadge = ({ status }) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-700',
      active: 'bg-blue-100 text-blue-700',
      closed: 'bg-gray-100 text-gray-700'
    };
    return (
      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${colors[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
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
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Cases</h1>
        </div>
        <button
          onClick={() => openModal('create')}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <Plus size={18} />
          New Case
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: cases.length },
          { label: 'Pending', value: cases.filter(c => c.status === 'pending').length },
          { label: 'Active', value: cases.filter(c => c.status === 'active').length },
          { label: 'Closed', value: cases.filter(c => c.status === 'closed').length }
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
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search cases..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="active">Active</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Cases List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {cases.length > 0 ? (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Case</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Court</th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Hearing</th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Status</th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {cases.map((c) => (
                    <tr key={c._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-900">{c.title}</p>
                        <p className="text-sm text-gray-500">{c.caseNumber}</p>
                        <p className="text-sm text-gray-500">
                          Client: {c.clientId?.userId?.name || "N/A"}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-gray-700">{c.court}</td>
                      <td className="px-6 py-4 text-center text-sm">
                        {c.hearingDate ? (
                          <div className="flex items-center justify-center gap-1">
                            <Calendar size={14} className="text-blue-600" />
                            {new Date(c.hearingDate).toLocaleDateString('en-IN')}
                          </div>
                        ) : (
                          <span className="text-gray-400">Not set</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <StatusBadge status={c.status} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => openMessagesModal(c)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                            title="Messages"
                          >
                            <MessageCircle size={18} />
                          </button>
                          {c.status !== 'closed' && (
                            <button
                              onClick={() => openModal('edit', c)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                              title="Edit"
                            >
                              <Edit size={18} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y">
              {cases.map((c) => (
                <div key={c._id} className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-gray-900">{c.title}</h3>
                      <p className="text-sm text-gray-500">{c.caseNumber}</p>
                      <p className="text-sm text-gray-500">
                        Client: {c.clientId?.userId?.name || "N/A"}

                      </p>
                    </div>
                    <StatusBadge status={c.status} />
                  </div>
                  <div className="space-y-2 text-sm mb-3">
                    <p className="text-gray-700"><span className="font-medium">Court:</span> {c.court}</p>
                    {c.hearingDate && (
                      <p className="text-gray-700">
                        <span className="font-medium">Hearing:</span> {new Date(c.hearingDate).toLocaleDateString('en-IN')}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openMessagesModal(c)}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2"
                    >
                      <MessageCircle size={16} />
                      Messages
                    </button>
                    {c.status !== 'closed' && (
                      <button
                        onClick={() => openModal('edit', c)}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                      >
                        Edit
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <Briefcase size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 mb-4">No cases found</p>
            <button
              onClick={() => openModal('create')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Create First Case
            </button>
          </div>
        )}
      </div>

      {/* Edit/Create Case Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={closeModal}></div>
          <div className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-gray-900">{isEdit ? 'Edit Case' : 'Create New Case'}</h2>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg transition" type="button">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Property Dispute"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Case Number *</label>
                  <input
                    type="text"
                    required
                    value={formData.caseNumber}
                    onChange={(e) => setFormData({ ...formData, caseNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., CS/2024/001"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Client *</label>
                  <select
                    required
                    value={formData.clientId}
                    onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="">-- Select a Client --</option>
                    {clients.map((client) => (
                      <option
                        key={client._id}
                        value={client._id}                       >
                        {client.userId?.name || client.name} ({client.userId?.email || client.email})
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    {clients.length} client{clients.length !== 1 ? "s" : ""} available
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Court *</label>
                  <input
                    type="text"
                    required
                    value={formData.court}
                    onChange={(e) => setFormData({ ...formData, court: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., District Court, Kerala"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
                  <select
                    required
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="pending">Pending</option>
                    <option value="active">Active</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hearing Date & Time</label>
                  <input
                    type="datetime-local"
                    value={formData.hearingDate}
                    onChange={(e) => setFormData({ ...formData, hearingDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Brief description of the case..."
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  {isEdit ? 'Update Case' : 'Create Case'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Messages Modal */}
      {showMessagesModal && selectedCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={closeMessagesModal}></div>

          <div className="relative bg-white rounded-xl shadow-2xl max-w-4xl w-full h-[80vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{selectedCase.title}</h2>
                <p className="text-sm text-gray-600">{selectedCase.caseNumber}</p>
              </div>
              <button onClick={closeMessagesModal} className="p-2 hover:bg-gray-100 rounded-lg transition">
                <X size={24} />
              </button>
            </div>

            {/* Messages Container */}
            <div
              id="messages-container"
              className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50"
            >
              {loadingMessages ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : messages.length > 0 ? (
                messages.map((msg) => {
                  const isSent = msg.sender._id === currentUser.id;
                  return (
                    <div key={msg._id} className={`flex ${isSent ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] ${isSent ? 'bg-blue-600 text-white' : 'bg-white text-gray-900'} rounded-lg p-4 shadow`}>
                        <div className="flex items-center gap-2 mb-1">
                          <p className={`text-xs font-semibold ${isSent ? 'text-blue-100' : 'text-gray-600'}`}>
                            {isSent ? 'You' : msg.sender.name}
                          </p>
                          <span className={`text-xs ${isSent ? 'text-blue-200' : 'text-gray-500'}`}>
                            ({msg.sender.role})
                          </span>
                        </div>
                        <p className="wrap-break-words">{msg.content}</p>
                        <p className={`text-xs mt-2 ${isSent ? 'text-blue-200' : 'text-gray-500'}`}>
                          {new Date(msg.createdAt).toLocaleString('en-IN', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <MessageCircle size={48} className="mb-3 opacity-50" />
                  <p>No messages yet. Start the conversation!</p>
                </div>
              )}
            </div>

            {/* Message Input */}
            <form onSubmit={sendMessage} className="p-6 border-t bg-white">
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Send to:</label>
                  <select
                    value={selectedReceiver}
                    onChange={(e) => setSelectedReceiver(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">-- Select Recipient --</option>
                    {caseParticipants.map((participant) => (
                      <option key={participant.id} value={participant.id}>
                        {participant.name} ({participant.role})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={sendingMessage}
                  />
                  <button
                    type="submit"
                    disabled={sendingMessage || !messageContent.trim() || !selectedReceiver}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Send size={18} />
                    {sendingMessage ? 'Sending...' : 'Send'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cases;