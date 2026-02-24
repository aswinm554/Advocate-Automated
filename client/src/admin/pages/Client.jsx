import { useState, useEffect } from "react";
import api from "../../api/api";

import { 
  Users, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle, 
  XCircle, 
  Briefcase,
  Mail,
  Phone,
  MapPin,
  UserCheck
} from 'lucide-react';

const AdminClients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedClient, setExpandedClient] = useState(null);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/admin/clients');
      setClients(data.data || []);
    } catch (err) {
      console.error('Error fetching clients:', err);
      alert('Failed to load clients');
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (clientId) => {
    setExpandedClient(expandedClient === clientId ? null : clientId);
  };

  const filteredClients = clients.filter(client =>
    client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone?.includes(searchTerm)
  );

  const stats = {
    total: clients.length,
    verified: clients.filter(c => c.verified).length,
    withCases: clients.filter(c => c.totalCases > 0).length,
    totalCases: clients.reduce((sum, c) => sum + c.totalCases, 0)
  };

  const VerifiedBadge = ({ verified }) => (
    verified ? (
      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">
        <CheckCircle size={12} />
        Verified
      </span>
    ) : (
      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700">
        <XCircle size={12} />
        Not Verified
      </span>
    )
  );

  const StatusBadge = ({ status }) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-700',
      active: 'bg-blue-100 text-blue-700',
      closed: 'bg-gray-100 text-gray-700'
    };
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${colors[status] || 'bg-gray-100 text-gray-700'}`}>
        {status?.toUpperCase() || 'UNKNOWN'}
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
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Client Management</h1>
        <p className="text-gray-600 mt-1">View and manage all registered clients</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-linear-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Clients</p>
              <p className="text-3xl font-bold mt-2">{stats.total}</p>
            </div>
            <Users className="w-12 h-12 opacity-80" />
          </div>
        </div>

        <div className="bg-linear-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Verified</p>
              <p className="text-3xl font-bold mt-2">{stats.verified}</p>
            </div>
            <UserCheck className="w-12 h-12 opacity-80" />
          </div>
        </div>

        <div className="bg-linear-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">With Cases</p>
              <p className="text-3xl font-bold mt-2">{stats.withCases}</p>
            </div>
            <Briefcase className="w-12 h-12 opacity-80" />
          </div>
        </div>

        <div className="bg-linear-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Total Cases</p>
              <p className="text-3xl font-bold mt-2">{stats.totalCases}</p>
            </div>
            <Briefcase className="w-12 h-12 opacity-80" />
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Clients List */}
      <div className="space-y-4">
        {filteredClients.length > 0 ? filteredClients.map((client) => (
          <div key={client.clientId} className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Client Header */}
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-16 h-16 bg-linear-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shrink-0">
                    {client.name?.charAt(0).toUpperCase() || 'C'}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{client.name}</h3>
                      <VerifiedBadge verified={client.verified} />
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Mail size={14} />
                        <span>{client.email}</span>
                      </div>
                      {client.phone && (
                        <div className="flex items-center gap-2">
                          <Phone size={14} />
                          <span>{client.phone}</span>
                        </div>
                      )}
                      {client.address && (
                        <div className="flex items-center gap-2">
                          <MapPin size={14} />
                          <span>{client.address}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{client.totalCases}</p>
                    <p className="text-xs text-gray-600">Cases</p>
                  </div>
                  
                  {client.totalCases > 0 && (
                    <button
                      onClick={() => toggleExpand(client.clientId)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                    >
                      {expandedClient === client.clientId ? (
                        <>
                          <ChevronUp size={18} />
                          Hide Cases
                        </>
                      ) : (
                        <>
                          <ChevronDown size={18} />
                          View Cases
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Expanded Cases Section */}
            {expandedClient === client.clientId && client.cases && client.cases.length > 0 && (
              <div className="border-t bg-gray-50">
                <div className="p-6">
                  <h4 className="text-lg font-bold text-gray-800 mb-4">Cases ({client.cases.length})</h4>
                  <div className="space-y-3">
                    {client.cases.map((caseItem) => (
                      <div key={caseItem.caseId} className="bg-white p-4 rounded-lg shadow">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h5 className="font-bold text-gray-900">{caseItem.title}</h5>
                              <StatusBadge status={caseItem.status} />
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                              Case Number: <span className="font-semibold">{caseItem.caseNumber}</span>
                            </p>
                            
                            {caseItem.advocate && (
                              <div className="mb-2">
                                <p className="text-xs text-gray-500 mb-1">Lead Advocate:</p>
                                <div className="flex items-center gap-2 text-sm">
                                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                    {caseItem.advocate.name?.charAt(0).toUpperCase()}
                                  </div>
                                  <div>
                                    <p className="font-semibold text-gray-900">{caseItem.advocate.name}</p>
                                    <p className="text-xs text-gray-500">{caseItem.advocate.email}</p>
                                  </div>
                                </div>
                              </div>
                            )}

                            {caseItem.juniors && caseItem.juniors.length > 0 && (
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Junior Advocates:</p>
                                <div className="flex flex-wrap gap-2">
                                  {caseItem.juniors.map((junior, idx) => (
                                    <div key={idx} className="flex items-center gap-1 px-2 py-1 bg-purple-50 rounded text-xs">
                                      <div className="w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold">
                                        {junior.name?.charAt(0).toUpperCase()}
                                      </div>
                                      <span className="font-medium text-gray-700">{junior.name}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )) : (
          <div className="text-center py-12 bg-white rounded-xl">
            <Users size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">
              {searchTerm ? 'No clients found matching your search' : 'No clients registered yet'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminClients;