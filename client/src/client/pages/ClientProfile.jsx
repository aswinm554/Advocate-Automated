// client/pages/Profile.jsx
import { useState, useEffect } from 'react';
import api from '../../api/api';
import { User, Mail, Phone, MapPin, Calendar, Shield, Edit, Lock } from 'lucide-react';

const ClientProfile = () => {
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get('/client/profile');
      setClient(response.data.client);
      setError(null);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to load profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 md:p-6">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 md:p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <span className="block sm:inline">{error}</span>
          <button 
            onClick={fetchProfile}
            className="ml-4 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">My Profile</h1>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header with Avatar */}
        <div className="bg-linear-to-r from-blue-600 to-blue-700 px-6 py-8">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
              <User size={40} className="text-blue-600" />
            </div>
            <div className="text-white">
              <h2 className="text-2xl font-bold">{client?.name}</h2>
              <p className="text-blue-100">{client?.email}</p>
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <User size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Full Name</p>
                <p className="font-medium text-gray-800">{client?.name}</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Mail size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Email Address</p>
                <p className="font-medium text-gray-800">{client?.email}</p>
              </div>
            </div>

            {/* Phone */}
            {client?.phone && (
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Phone size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone Number</p>
                  <p className="font-medium text-gray-800">{client.phone}</p>
                </div>
              </div>
            )}

            {/* Address */}
            {client?.address && (
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <MapPin size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Address</p>
                  <p className="font-medium text-gray-800">{client.address}</p>
                </div>
              </div>
            )}

            {/* Role */}
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Shield size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Role</p>
                <p className="font-medium text-gray-800 capitalize">Client</p>
              </div>
            </div>

            {/* Member Since */}
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Calendar size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Member Since</p>
                <p className="font-medium text-gray-800">
                  {client?.createdAt ? new Date(client.createdAt).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-6 pb-6 pt-4 border-t flex flex-wrap gap-3">
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center gap-2">
            <Edit size={18} />
            Edit Profile
          </button>
          <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium flex items-center gap-2">
            <Lock size={18} />
            Change Password
          </button>
        </div>
      </div>

      {/* Account Status */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Information</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-3 border-b">
            <span className="text-gray-600">Account Status</span>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
              Active
            </span>
          </div>
          
          <div className="flex justify-between items-center py-3 border-b">
            <span className="text-gray-600">User ID</span>
            <span className="font-mono text-sm text-gray-800">{client?._id}</span>
          </div>

          <div className="flex justify-between items-center py-3">
            <span className="text-gray-600">Last Updated</span>
            <span className="font-medium text-gray-800">
              {client?.updatedAt ? new Date(client.updatedAt).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              }) : 'N/A'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientProfile;