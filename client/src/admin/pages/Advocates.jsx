import { useState, useEffect } from 'react';
import { X, FileText, ExternalLink } from 'lucide-react';
import AdvocateTable from "../../admin/components/AdvocateTable";
import api from "../../api/api";

const Advocate = () => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [advocates, setAdvocates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedAdvocateId, setSelectedAdvocateId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);

  useEffect(() => {
    fetchAdvocates();
  }, []);

  const fetchAdvocates = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/advocates/all');

      const rawData = response?.data?.data || [];

      const transformedData = rawData
        .filter(a => a && a.userId)
        .map(advocate => ({
          id: advocate._id,
          _id: advocate._id,
          name: advocate.userId?.name || "N/A",
          email: advocate.userId?.email || "N/A",
          licenseNumber: advocate.licenseNumber || "N/A",
          specialization: advocate.specialization || "N/A",
          experience: advocate.experience || 0,
          status: advocate.status || "unknown",
          licenseDocument: advocate.licenseDocument,
          createdAt: advocate.createdAt,
          updatedAt: advocate.updatedAt
        }));

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
    if (!window.confirm('Are you sure you want to approve this advocate?')) {
      return;
    }

    try {
      await api.patch(`/admin/advocates/approve/${id}`);
      fetchAdvocates();
      alert('Advocate approved successfully!');
    } catch (err) {
      console.error('Error approving advocate:', err);
      alert('Failed to approve advocate. Please try again.');
    }
  };

  const openRejectModal = (id) => {
    setSelectedAdvocateId(id);
    setRejectionReason('');
    setShowRejectModal(true);
  };

  const closeRejectModal = () => {
    setShowRejectModal(false);
    setSelectedAdvocateId(null);
    setRejectionReason('');
  };

  const handleReject = async (e) => {
    e.preventDefault();

    if (!rejectionReason.trim()) {
      alert("Please provide a rejection reason");
      return;
    }

    try {
      setIsRejecting(true);
      await api.patch(
        `/admin/advocates/reject/${selectedAdvocateId}`,
        { reason: rejectionReason }
      );

      fetchAdvocates();
      closeRejectModal();
      alert("Advocate rejected successfully!");
    } catch (err) {
      console.error("Error rejecting advocate:", err);
      alert("Failed to reject advocate. Please try again.");
    } finally {
      setIsRejecting(false);
    }
  };

  const viewLicenseDocument = (url) => {
    if (url) {
      window.open(url, '_blank');
    } else {
      alert('No license document available');
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
              <div key={a._id} className="border shadow-lg rounded-lg p-4 hover:shadow-xl transition">
                <div className="mb-3">
                  <h3 className="font-semibold text-gray-800 text-lg">{a.name}</h3>
                  <p className="text-sm text-gray-600">{a.email}</p>
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

                {/* License Document Section */}
                <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText size={20} className="text-blue-600" />
                      <span className="text-sm font-medium text-gray-700">License Document</span>
                    </div>
                    {a.licenseDocument ? (
                      <button
                        onClick={() => viewLicenseDocument(a.licenseDocument)}
                        className="flex items-center gap-1 text-xs px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                      >
                        <ExternalLink size={14} />
                        View
                      </button>
                    ) : (
                      <span className="text-xs text-red-600">Not uploaded</span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleApprove(a._id)}
                    className="flex-1 px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => openRejectModal(a._id)}
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

      {/* Rejection Modal */}
      {showRejectModal && (
        <div 
          className="fixed inset-0 flex items-center justify-center p-4"
          style={{ zIndex: 99999 }}
        >
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
            onClick={closeRejectModal}
          ></div>

          {/* Modal Content */}
          <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b bg-red-50 rounded-t-xl">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Reject Advocate</h2>
                <p className="text-sm text-gray-600 mt-1">Please provide a reason for rejection</p>
              </div>
              <button 
                onClick={closeRejectModal} 
                className="p-2 hover:bg-red-100 rounded-lg transition"
                disabled={isRejecting}
              >
                <X size={24} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleReject} className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rejection Reason *
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Enter the reason for rejecting this advocate..."
                  rows="5"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                  required
                  disabled={isRejecting}
                />
                <p className="text-xs text-gray-500 mt-1">
                  This reason will be saved and can be reviewed later
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={closeRejectModal}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                  disabled={isRejecting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isRejecting}
                >
                  {isRejecting ? 'Rejecting...' : 'Reject Advocate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Advocate;