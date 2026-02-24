// junior/pages/Profile.jsx
import { useState, useEffect } from 'react';
import api from '../../api/api';
import { User, Mail, Phone, MapPin, Calendar, Shield, Award, Edit, Lock } from 'lucide-react';

const JuniorProfile = () => {
  const [junior, setJunior] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get('/junior/profile');
      setJunior(response.data.junior);
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
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
        <p className="text-gray-600 mt-1">View and manage your information</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header with Avatar */}
        <div className="bg-linear-to-r from-purple-600 to-purple-700 px-6 py-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
              <User size={40} className="text-purple-600" />
            </div>
            <div className="text-center md:text-left text-white">
              <h2 className="text-2xl font-bold">{junior?.name}</h2>
              <p className="text-purple-100">{junior?.email}</p>
              <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
                <Award size={16} />
                <span className="text-sm">Junior Advocate</span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-50 rounded-lg">
                <User size={20} className="text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Full Name</p>
                <p className="font-medium text-gray-800">{junior?.name}</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-50 rounded-lg">
                <Mail size={20} className="text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Email Address</p>
                <p className="font-medium text-gray-800">{junior?.email}</p>
              </div>
            </div>

            {/* Phone */}
            {junior?.phone && (
              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <Phone size={20} className="text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone Number</p>
                  <p className="font-medium text-gray-800">{junior.phone}</p>
                </div>
              </div>
            )}

            {/* Address */}
            {junior?.address && (
              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <MapPin size={20} className="text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Address</p>
                  <p className="font-medium text-gray-800">{junior.address}</p>
                </div>
              </div>
            )}

            {/* Role */}
            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-50 rounded-lg">
                <Shield size={20} className="text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Role</p>
                <p className="font-medium text-gray-800">Junior Advocate</p>
              </div>
            </div>

            {/* Member Since */}
            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-50 rounded-lg">
                <Calendar size={20} className="text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Member Since</p>
                <p className="font-medium text-gray-800">
                  {junior?.createdAt ? new Date(junior.createdAt).toLocaleDateString('en-IN', {
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
          <button className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium flex items-center gap-2">
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
            <span className="text-gray-600">Verification Status</span>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              junior?.isVerified 
                ? 'bg-green-100 text-green-700' 
                : 'bg-yellow-100 text-yellow-700'
            }`}>
              {junior?.isVerified ? 'Verified' : 'Pending'}
            </span>
          </div>
          
          <div className="flex justify-between items-center py-3 border-b">
            <span className="text-gray-600">User ID</span>
            <span className="font-mono text-sm text-gray-800">{junior?._id}</span>
          </div>

          <div className="flex justify-between items-center py-3">
            <span className="text-gray-600">Last Updated</span>
            <span className="font-medium text-gray-800">
              {junior?.updatedAt ? new Date(junior.updatedAt).toLocaleDateString('en-IN', {
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

export default JuniorProfile;