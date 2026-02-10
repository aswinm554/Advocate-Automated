import { useState, useEffect } from 'react';
import AdvocateTable from "../../admin//components/AdvocateTable"
import api from "../../api/api"

const Advocate = () => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [advocates, setAdvocates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  
  useEffect(() => {
    fetchAdvocates();
  }, []);

  const fetchAdvocates = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/advocates/all');
      
      console.log('API Response:', response.data);
      
    
      const transformedData = response.data.data.map(advocate => ({
        id: advocate._id,
        _id: advocate._id,
        name: advocate.userId.name,
        email: advocate.userId.email,
        licenseNumber: advocate.licenseNumber,
        specialization: advocate.specialization,
        experience: advocate.experience,
        status: advocate.status,
        licenseDocument: advocate.licenseDocument,
        createdAt: advocate.createdAt,
        updatedAt: advocate.updatedAt
      }));
      
      console.log('Transformed Data:', transformedData);
      setAdvocates(transformedData);
      setError(null);
    } catch (err) {
      console.error('Error fetching advocates:', err);
      setError('Failed to fetch advocates. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  
  const pendingAdvocates = advocates.filter(a => a.status === 'pending');

  const handleApprove = async (id) => {
    try {
      await api.patch(`/admin/advocates/approve/${id}`); 
      fetchAdvocates();
      alert('Advocate approved successfully!');
    } catch (err) {
      console.error('Error approving advocate:', err);
      alert('Failed to approve advocate. Please try again.');
    }
  };

  const handleReject = async (id) => {
    try {
      await api.patch(`/admin/advocates/reject/${id}`); 
      fetchAdvocates();
      alert('Advocate rejected successfully!');
    } catch (err) {
      console.error('Error rejecting advocate:', err);
      alert('Failed to reject advocate. Please try again.');
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Advocates Management</h1>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <span className="block sm:inline">{error}</span>
          <button 
            onClick={fetchAdvocates}
            className="ml-4 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      )}

      <AdvocateTable 
        advocates={advocates}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        loading={loading}
      />

      {!loading && pendingAdvocates.length > 0 && (
        <div className="bg-white rounded-lg shadow p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Pending Approvals</h2>
            <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
              {pendingAdvocates.length} Pending
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendingAdvocates.map((a) => (
              <div key={a._id} className="shadow-lg rounded-lg p-4 hover:shadow-md transition">
                <div className="mb-3">
                  <h3 className="font-semibold text-gray-800 text-lg">{a.name}</h3>
                  <p className="text-sm text-gray-600">{a.email}</p>
                  {a.phone !== 'N/A' && <p className="text-sm text-gray-600">{a.phone}</p>}
                </div>

                <div className="space-y-2 text-sm mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">License:</span>
                    <span className="font-medium">{a.licenseNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Specialization:</span>
                    <span className="font-medium">{a.specialization}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Experience:</span>
                    <span className="font-medium">{a.experience} years</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => handleApprove(a._id)}
                    className="flex-1 px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
                  >
                    Approve
                  </button>
                  <button 
                    onClick={() => handleReject(a._id)}
                    className="flex-1 px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Advocate;