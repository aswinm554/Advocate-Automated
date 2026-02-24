import { useState, useEffect } from 'react';
import { UserPlus, Users, Eye, Plus, X, Briefcase, Mail, Phone, Calendar, Link } from 'lucide-react';
import api from '../../api/api';

const JuniorAdvocates = () => {
  const [juniors, setJuniors] = useState([]);
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCasesModal, setShowCasesModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedJunior, setSelectedJunior] = useState(null);
  const [juniorCases, setJuniorCases] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: ''
  });

  const [assignData, setAssignData] = useState({
    id: '',
    caseId: ''
  });

  useEffect(() => {
    fetchJuniors();
    fetchCases();
  }, []);

  const fetchJuniors = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/advocate/juniors');
      setJuniors(data);
    } catch (err) {
      console.error('Error fetching juniors:', err);
      alert('Failed to load junior advocates');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      await api.post('/advocate/juniors', formData);
      setShowAddModal(false);
      resetForm();
      fetchJuniors();
      alert('Junior advocate added successfully!');
    } catch (err) {
      console.error('Error adding junior:', err);
      alert(err.response?.data?.message || 'Failed to add junior advocate');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAssignCase = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      await api.put('/advocate/juniors', assignData);
      setShowAssignModal(false);
      setAssignData({ id: '', caseId: '' });
      alert('Case assigned successfully!');
     if (selectedJunior) {
  const { data } = await api.get(`/advocate/juniors/${selectedJunior._id}`);
  setJuniorCases(data);
}
    } catch (err) {
      console.error('Error assigning case:', err);
      alert(err.response?.data?.message || 'Failed to assign case');
    } finally {
      setSubmitting(false);
    }
  };

  const viewJuniorCases = async (junior) => {
    try {
      setSelectedJunior(junior);
      const { data } = await api.get(`/advocate/juniors/${junior._id}`);
      setJuniorCases(data);
      setShowCasesModal(true);
    } catch (err) {
      console.error('Error fetching junior cases:', err);
      alert('Failed to load cases');
    }
  };

  const openAssignModal = (junior) => {
    setSelectedJunior(junior);
    setAssignData({ ...assignData, id: junior._id });
    setShowAssignModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      phone: '',
      address: ''
    });
  };

  const StatusBadge = ({ status }) => {
    const active = status === 'active' || !status;
    return (
      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
        active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
      }`}>
        {active ? 'Active' : 'Inactive'}
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
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Junior Advocates</h1>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <Plus size={18} />
          Add Junior Advocate
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-600">Total Junior Advocates</p>
          <p className="text-2xl font-bold text-gray-800">{juniors.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-600">Active</p>
          <p className="text-2xl font-bold text-gray-800">
            {juniors.filter(j => j.status === 'active' || !j.status).length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-600">This Month</p>
          <p className="text-2xl font-bold text-gray-800">
            {juniors.filter(j => {
              const created = new Date(j.createdAt);
              const now = new Date();
              return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
            }).length}
          </p>
        </div>
      </div>

      {/* Juniors List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {juniors.length > 0 ? (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Contact</th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Status</th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Joined</th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {juniors.map((junior) => (
                    <tr key={junior._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-semibold">
                            {junior.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{junior.name}</p>
                            <p className="text-sm text-gray-500">Junior Advocate</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <Mail size={14} className="text-gray-400" />
                            {junior.email}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <Phone size={14} className="text-gray-400" />
                            {junior.phone}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <StatusBadge status={junior.status} />
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-600">
                        {new Date(junior.createdAt).toLocaleDateString('en-IN')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => viewJuniorCases(junior)}
                            className="inline-flex items-center gap-1 px-3 py-1 text-xs bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
                          >
                            <Eye size={14} />
                            View Cases
                          </button>
                          <button
                            onClick={() => openAssignModal(junior)}
                            className="inline-flex items-center gap-1 px-3 py-1 text-xs bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition"
                          >
                            <Link size={14} />
                            Assign Case
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y">
              {juniors.map((junior) => (
                <div key={junior._id} className="p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-lg">
                      {junior.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900">{junior.name}</h3>
                      <p className="text-sm text-gray-500">Junior Advocate</p>
                      <StatusBadge status={junior.status} />
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 rounded-lg p-2">
                      <Mail size={14} className="text-gray-400" />
                      <span className="truncate">{junior.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 rounded-lg p-2">
                      <Phone size={14} className="text-gray-400" />
                      <span>{junior.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 rounded-lg p-2">
                      <Calendar size={14} className="text-gray-400" />
                      <span>Joined: {new Date(junior.createdAt).toLocaleDateString('en-IN')}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => viewJuniorCases(junior)}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                    >
                      <Eye size={16} className="inline mr-1" />
                      View Cases
                    </button>
                    <button
                      onClick={() => openAssignModal(junior)}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm"
                    >
                      <Link size={16} className="inline mr-1" />
                      Assign
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <Users size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 mb-4">No junior advocates added yet</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Add First Junior Advocate
            </button>
          </div>
        )}
      </div>

      {/* Add Junior Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => { setShowAddModal(false); resetForm(); }}></div>
          
          <div className="relative bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold">Add Junior Advocate</h2>
              <button onClick={() => { setShowAddModal(false); resetForm(); }} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Rahul Verma"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="rahul@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                <input
                  type="password"
                  required
                  minLength="6"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Minimum 6 characters"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 9876543210"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                <textarea
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  rows="3"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Full address..."
                />
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => { setShowAddModal(false); resetForm(); }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {submitting ? 'Adding...' : 'Add Junior Advocate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Case Modal */}
      {showAssignModal && selectedJunior && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setShowAssignModal(false)}></div>
          
          <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold">Assign Case</h2>
              <button onClick={() => setShowAssignModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleAssignCase} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Junior Advocate</label>
                <input
                  type="text"
                  value={selectedJunior.name}
                  disabled
                  className="w-full px-3 py-2 border rounded-lg bg-gray-100 text-gray-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Case *</label>
                <select
                  required
                  value={assignData.caseId}
                  onChange={(e) => setAssignData({ ...assignData, caseId: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Select a Case --</option>
                  {cases.map((caseItem) => (
                    <option key={caseItem._id} value={caseItem._id}>
                      {caseItem.title} ({caseItem.caseNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                >
                  {submitting ? 'Assigning...' : 'Assign Case'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Cases Modal */}
      {showCasesModal && selectedJunior && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setShowCasesModal(false)}></div>
          
          <div className="relative bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
              <div>
                <h2 className="text-xl font-bold">Cases Assigned to {selectedJunior.name}</h2>
                <p className="text-sm text-gray-600">{selectedJunior.email}</p>
              </div>
              <button onClick={() => setShowCasesModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              {juniorCases.length > 0 ? (
                <div className="space-y-3">
                  {juniorCases.map((caseItem) => (
                    <div key={caseItem._id} className="border rounded-lg p-4 hover:bg-gray-50 transition">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-gray-900">{caseItem.title}</h3>
                          <p className="text-sm text-gray-500">{caseItem.caseNumber}</p>
                        </div>
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          caseItem.status === 'active' ? 'bg-blue-100 text-blue-700' :
                          caseItem.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {caseItem.status}
                        </span>
                      </div>
                      {caseItem.hearingDate && (
                        <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                          <Calendar size={14} />
                          Next Hearing: {new Date(caseItem.hearingDate).toLocaleDateString('en-IN')}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Briefcase size={48} className="mx-auto text-gray-400 mb-3" />
                  <p className="text-gray-600 mb-4">No cases assigned yet</p>
                  <button
                    onClick={() => {
                      setShowCasesModal(false);
                      openAssignModal(selectedJunior);
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                  >
                    Assign a Case
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JuniorAdvocates;