import React, { useState, useEffect } from 'react';
import api from '../../api/api';
import { User, Mail, Shield, Calendar, Loader } from 'lucide-react';

const AdminProfile = () => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAdminProfile();
  }, []);

  const fetchAdminProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/profile');
      
      console.log('Profile response:', response.data);
      setAdmin(response.data.admin);
      setError(null);
    } catch (err) {
      console.error('Error fetching admin profile:', err);
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
            onClick={fetchAdminProfile}
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
      
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Admin Profile</h1>
      </div>

    
      <div className="bg-white rounded-lg shadow p-4 md:p-6">
       
        <div className="flex items-center gap-4 mb-6 pb-6 border-b">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
            <User size={40} className="text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{admin?.name}</h2>
            <p className="text-gray-600">{admin?.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="flex items-start gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <User size={20} className="text-gray-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Full Name</p>
              <p className="font-medium text-gray-800">{admin?.name}</p>
            </div>
          </div>

          
          <div className="flex items-start gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Mail size={20} className="text-gray-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Email Address</p>
              <p className="font-medium text-gray-800">{admin?.email}</p>
            </div>
          </div>

          
          <div className="flex items-start gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Shield size={20} className="text-gray-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Role</p>
              <p className="font-medium text-gray-800 capitalize">{admin?.role}</p>
            </div>
          </div>

          
          <div className="flex items-start gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Calendar size={20} className="text-gray-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Account Created</p>
              <p className="font-medium text-gray-800">
                {admin?.createdAt ? new Date(admin.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t flex gap-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
            Edit Profile
          </button>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium">
            Change Password
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4 md:p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Information</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-gray-600">Account Status</span>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
              Active
            </span>
          </div>
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-gray-600">User ID</span>
            <span className="font-medium text-gray-800">{admin?._id}</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-600">Last Updated</span>
            <span className="font-medium text-gray-800">
              {admin?.updatedAt ? new Date(admin.updatedAt).toLocaleDateString('en-US', {
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

export default AdminProfile;