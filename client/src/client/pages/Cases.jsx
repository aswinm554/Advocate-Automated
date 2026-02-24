import { useState, useEffect } from 'react';
import { Briefcase, Calendar, MessageCircle, Send, X, Eye, User, MapPin, FileText, Clock } from 'lucide-react';
import api from '../../api/api';

const ClientCases = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMessagesModal, setShowMessagesModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageContent, setMessageContent] = useState('');
  const [advocateId, setAdvocateId] = useState('');
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      const { data } = await api.get('/client/cases');
      setCases(data);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const openMessagesModal = (caseData) => {
    setSelectedCase(caseData);
    setShowMessagesModal(true);
    
    // Extract advocate ID directly
    const advId = caseData.advocateId?._id || caseData.advocateId;
    setAdvocateId(advId);
    
    if (advId) {
      fetchMessages(caseData._id);
    }
  };

  const closeMessagesModal = () => {
    setShowMessagesModal(false);
    setSelectedCase(null);
    setMessages([]);
    setMessageContent('');
    setAdvocateId('');
  };

  const openDetailsModal = (caseData) => {
    setSelectedCase(caseData);
    setShowDetailsModal(true);
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedCase(null);
  };

  const fetchMessages = async (caseId) => {
    try {
      setLoadingMessages(true);
      const { data } = await api.get(`/messages/${caseId}`);
      setMessages(data);
      
      setTimeout(() => {
        const container = document.getElementById('messages-container');
        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      }, 100);
    } catch (err) {
      console.error('Error fetching messages:', err);
      setMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    
    if (!messageContent.trim() || !advocateId) {
      alert('Please enter a message');
      return;
    }

    try {
      setSendingMessage(true);
      
      await api.post('/messages', {
        caseId: selectedCase._id,
        receiverId: advocateId,
        content: messageContent.trim(),
        messageType: 'text'
      });
      
      setMessageContent('');
      await fetchMessages(selectedCase._id);
    } catch (err) {
      console.error('Error sending message:', err);
      alert(err.response?.data?.message || 'Failed to send message');
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
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">My Cases</h1>
        <p className="text-gray-600 mt-1">Your active legal cases</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-linear-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Cases</p>
              <p className="text-3xl font-bold mt-2">{cases.length}</p>
            </div>
            <Briefcase className="w-12 h-12 opacity-80" />
          </div>
        </div>

        <div className="bg-linear-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Active Cases</p>
              <p className="text-3xl font-bold mt-2">
                {cases.filter(c => c.status === 'active').length}
              </p>
            </div>
            <Briefcase className="w-12 h-12 opacity-80" />
          </div>
        </div>

        <div className="bg-linear-to-br from-yellow-500 to-yellow-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm">Pending Cases</p>
              <p className="text-3xl font-bold mt-2">
                {cases.filter(c => c.status === 'pending').length}
              </p>
            </div>
            <Briefcase className="w-12 h-12 opacity-80" />
          </div>
        </div>
      </div>

      {/* Cases Grid */}
      <div className="grid gap-4">
        {cases.length > 0 ? cases.map((c) => (
          <div key={c._id} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{c.title}</h3>
                    <p className="text-sm text-gray-600">{c.caseNumber}</p>
                  </div>
                  <StatusBadge status={c.status} />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Court</p>
                    <p className="font-semibold">{c.court}</p>
                  </div>
                  {c.hearingDate && (
                    <div>
                      <p className="text-gray-600">Next Hearing</p>
                      <p className="font-semibold flex items-center gap-1">
                        <Calendar size={14} />
                        {new Date(c.hearingDate).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                  )}
                </div>
                
                {c.description && (
                  <p className="mt-4 text-gray-700 bg-gray-50 p-3 rounded-lg">{c.description}</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => openDetailsModal(c)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2 whitespace-nowrap shadow-md hover:shadow-lg"
                >
                  <Eye size={18} />
                  View Details
                </button>
                <button
                  onClick={() => openMessagesModal(c)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 whitespace-nowrap shadow-md hover:shadow-lg"
                >
                  <MessageCircle size={18} />
                  Messages
                </button>
              </div>
            </div>
          </div>
        )) : (
          <div className="text-center py-12 bg-white rounded-lg">
            <Briefcase size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">No cases assigned yet</p>
          </div>
        )}
      </div>

      {/* Case Details Modal */}
      {showDetailsModal && selectedCase && (
        <div 
          className="fixed inset-0 flex items-center justify-center p-4"
          style={{ zIndex: 99999 }}
        >
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
            onClick={closeDetailsModal}
          ></div>

          <div className="relative bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b bg-linear-to-r from-green-600 to-green-700 text-white rounded-t-xl sticky top-0">
              <div>
                <h2 className="text-2xl font-bold">{selectedCase.title}</h2>
                <p className="text-sm text-green-100">{selectedCase.caseNumber}</p>
              </div>
              <button 
                onClick={closeDetailsModal} 
                className="p-2 hover:bg-green-800 rounded-lg transition"
              >
                <X size={24} />
              </button>
            </div>

            {/* Details Content */}
            <div className="p-6 space-y-6">
              {/* Status Section */}
              <div>
                <h3 className="text-sm font-semibold text-gray-600 uppercase mb-2">Status</h3>
                <StatusBadge status={selectedCase.status} />
              </div>

              {/* Case Information */}
              <div>
                <h3 className="text-sm font-semibold text-gray-600 uppercase mb-3 flex items-center gap-2">
                  <FileText size={16} />
                  Case Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <p className="text-xs text-gray-500">Case Number</p>
                    <p className="font-semibold text-gray-900">{selectedCase.caseNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Court</p>
                    <p className="font-semibold text-gray-900">{selectedCase.court}</p>
                  </div>
                  {selectedCase.hearingDate && (
                    <div>
                      <p className="text-xs text-gray-500">Next Hearing</p>
                      <p className="font-semibold text-gray-900 flex items-center gap-1">
                        <Calendar size={14} className="text-green-600" />
                        {new Date(selectedCase.hearingDate).toLocaleDateString('en-IN', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-gray-500">Case Filed</p>
                    <p className="font-semibold text-gray-900">
                      {new Date(selectedCase.createdAt).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Advocate Information */}
              {selectedCase.advocateId && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-600 uppercase mb-3 flex items-center gap-2">
                    <User size={16} />
                    Your Advocate
                  </h3>
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <p className="font-bold text-gray-900 text-lg">
                      {selectedCase.advocateId?.name || 'N/A'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {selectedCase.advocateId?.email || 'N/A'}
                    </p>
                    <span className="inline-block mt-2 px-2 py-1 bg-blue-600 text-white text-xs font-semibold rounded">
                      ADVOCATE
                    </span>
                  </div>
                </div>
              )}

              {/* Description */}
              {selectedCase.description && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-600 uppercase mb-3">Case Description</h3>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-gray-700 whitespace-pre-wrap">{selectedCase.description}</p>
                  </div>
                </div>
              )}

              {/* Timeline */}
              <div>
                <h3 className="text-sm font-semibold text-gray-600 uppercase mb-3 flex items-center gap-2">
                  <Clock size={16} />
                  Timeline
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-600">Case Filed:</span>
                    <span className="font-medium text-gray-900">
                      {new Date(selectedCase.createdAt).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-600">Last Updated:</span>
                    <span className="font-medium text-gray-900">
                      {new Date(selectedCase.updatedAt).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t bg-gray-50 rounded-b-xl">
              <button
                onClick={closeDetailsModal}
                className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Messages Modal - SIMPLIFIED WITHOUT DROPDOWN */}
      {showMessagesModal && selectedCase && (
        <div 
          className="fixed inset-0 flex items-center justify-center p-4"
          style={{ zIndex: 99999 }}
        >
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
            onClick={closeMessagesModal}
          ></div>

          <div className="relative bg-white rounded-xl shadow-2xl max-w-4xl w-full h-[85vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b bg-linear-to-r from-blue-600 to-blue-700 text-white rounded-t-xl">
              <div>
                <h2 className="text-xl font-bold">{selectedCase.title}</h2>
                <p className="text-sm text-blue-100">{selectedCase.caseNumber}</p>
              </div>
              <button 
                onClick={closeMessagesModal} 
                className="p-2 hover:bg-blue-800 rounded-lg transition"
              >
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
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : messages.length > 0 ? (
                messages.map((msg) => {
                  const isSent = msg.sender._id === currentUser.id;
                  return (
                    <div key={msg._id} className={`flex ${isSent ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] ${isSent ? 'bg-blue-600 text-white' : 'bg-white text-gray-900'} rounded-lg p-4 shadow-md`}>
                        <div className="flex items-center gap-2 mb-1">
                          <p className={`text-xs font-semibold ${isSent ? 'text-blue-100' : 'text-gray-600'}`}>
                            {isSent ? 'You' : msg.sender?.name || 'Unknown'}
                          </p>
                          <span className={`text-xs ${isSent ? 'text-blue-200' : 'text-gray-500'}`}>
                            ({msg.sender?.role || 'unknown'})
                          </span>
                        </div>
                        <p className="wrap-break-words whitespace-pre-wrap">{msg.content}</p>
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
                  <MessageCircle size={64} className="mb-4 opacity-50" />
                  <p className="text-lg font-medium">No messages yet</p>
                  <p className="text-sm">Start the conversation with your advocate!</p>
                </div>
              )}
            </div>

            {/* Message Input Form - NO DROPDOWN */}
            <form onSubmit={sendMessage} className="p-6 border-t bg-white rounded-b-xl">
              <div className="space-y-3">
                {/* Recipient Info - No Dropdown */}
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Sending to:</span>{' '}
                    <span className="text-blue-700 font-semibold">
                      {selectedCase.advocateId?.name || 'Your Advocate'}
                    </span>
                    {' '}(Advocate)
                  </p>
                </div>
                
                {/* Message Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={sendingMessage}
                    required
                  />
                  <button
                    type="submit"
                    disabled={sendingMessage || !messageContent.trim()}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium shadow-md hover:shadow-lg"
                  >
                    <Send size={20} />
                    <span className="hidden sm:inline">{sendingMessage ? 'Sending...' : 'Send'}</span>
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

export default ClientCases;