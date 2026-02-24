// admin/pages/Reports.jsx
import { useState } from 'react';
import { 
  FileText, 
  Download, 
  Calendar, 
  TrendingUp, 
  Users, 
  Briefcase, 
  CreditCard,
  DollarSign,
  CheckCircle,
  Clock,
  XCircle,
  Filter
} from 'lucide-react';
import api from '../../api/api';

const Reports = () => {
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [filters, setFilters] = useState({
    reportType: 'summary',
    startDate: '',
    endDate: ''
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const generateReport = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/admin/summary', {
        params: {
          startDate: filters.startDate,
          endDate: filters.endDate
        }
      });
      setReportData(data);
    } catch (err) {
      console.error('Error generating report:', err);
      alert('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = () => {
    if (!reportData) {
      alert('Please generate a report first');
      return;
    }

    // Create CSV content
    const csvContent = generateCSV(reportData);
    
    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `admin_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateCSV = (data) => {
    const rows = [
      ['Admin Summary Report'],
      ['Generated on:', new Date().toLocaleString()],
      [''],
      ['Metric', 'Value'],
      ['Total Advocates', data.totalAdvocates],
      ['Approved Advocates', data.approvedAdvocates],
      ['Pending Advocates', data.pendingAdvocates],
      ['Rejected Advocates', data.rejectedAdvocates],
      ['Total Clients', data.totalClients],
      ['Total Cases', data.totalCases],
      ['Total Payments', data.totalPayments],
      ['Total Revenue', `₹${data.totalRevenue.toLocaleString('en-IN')}`],
    ];
    
    return rows.map(row => row.join(',')).join('\n');
  };

  const StatCard = ({ icon: Icon, label, value, color, subtext }) => (
    <div className={`bg-linear-to-br ${color} rounded-xl shadow-lg p-6 text-white`}>
      <div className="flex items-center justify-between mb-2">
        <Icon className="w-10 h-10 opacity-80" />
        <p className="text-3xl font-bold">{value}</p>
      </div>
      <p className="text-sm opacity-90">{label}</p>
      {subtext && <p className="text-xs opacity-75 mt-1">{subtext}</p>}
    </div>
  );

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">Generate comprehensive system reports</p>
        </div>
        <FileText className="w-12 h-12 text-blue-600" />
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <h2 className="text-xl font-semibold text-gray-800">Report Filters</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Report Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Report Type
            </label>
            <select
              name="reportType"
              value={filters.reportType}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="summary">Summary Report</option>
              <option value="advocates" disabled>Advocates Report (Coming Soon)</option>
              <option value="cases" disabled>Cases Report (Coming Soon)</option>
              <option value="financial" disabled>Financial Report (Coming Soon)</option>
            </select>
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date
            </label>
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={generateReport}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-md hover:shadow-lg"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Generating...
              </>
            ) : (
              <>
                <TrendingUp size={20} />
                View Report
              </>
            )}
          </button>

          {reportData && (
            <button
              onClick={downloadReport}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium shadow-md hover:shadow-lg"
            >
              <Download size={20} />
              Download CSV
            </button>
          )}
        </div>
      </div>

      {/* Report Display */}
      {reportData && (
        <div className="space-y-6">
          {/* Report Header */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Summary Report</h2>
                <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                  <Calendar size={16} />
                  Generated on: {new Date().toLocaleString('en-IN')}
                </p>
              </div>
              <div className="text-right">
                {filters.startDate && filters.endDate && (
                  <p className="text-sm text-gray-600">
                    Period: {new Date(filters.startDate).toLocaleDateString('en-IN')} - {new Date(filters.endDate).toLocaleDateString('en-IN')}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Advocates Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Users size={24} className="text-blue-600" />
              Advocates Overview
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                icon={Users}
                label="Total Advocates"
                value={reportData.totalAdvocates}
                color="from-blue-500 to-blue-600"
              />
              <StatCard
                icon={CheckCircle}
                label="Approved"
                value={reportData.approvedAdvocates}
                color="from-green-500 to-green-600"
                subtext="Active in system"
              />
              <StatCard
                icon={Clock}
                label="Pending"
                value={reportData.pendingAdvocates}
                color="from-yellow-500 to-yellow-600"
                subtext="Awaiting approval"
              />
              <StatCard
                icon={XCircle}
                label="Rejected"
                value={reportData.rejectedAdvocates}
                color="from-red-500 to-red-600"
                subtext="Not approved"
              />
            </div>
          </div>

          {/* System Metrics */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <TrendingUp size={24} className="text-purple-600" />
              System Metrics
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <StatCard
                icon={Users}
                label="Total Clients"
                value={reportData.totalClients}
                color="from-purple-500 to-purple-600"
                subtext="Registered users"
              />
              <StatCard
                icon={Briefcase}
                label="Total Cases"
                value={reportData.totalCases}
                color="from-indigo-500 to-indigo-600"
                subtext="All cases"
              />
              <StatCard
                icon={CreditCard}
                label="Total Payments"
                value={reportData.totalPayments}
                color="from-pink-500 to-pink-600"
                subtext="Transactions"
              />
            </div>
          </div>

          {/* Financial Overview */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <DollarSign size={24} className="text-green-600" />
              Financial Overview
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-linear-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-8 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm mb-2">Total Revenue</p>
                    <p className="text-5xl font-bold">₹{reportData.totalRevenue.toLocaleString('en-IN')}</p>
                    <p className="text-green-100 text-sm mt-2">
                      Average per payment: ₹{reportData.totalPayments > 0 
                        ? Math.round(reportData.totalRevenue / reportData.totalPayments).toLocaleString('en-IN') 
                        : 0}
                    </p>
                  </div>
                  <DollarSign className="w-20 h-20 opacity-80" />
                </div>
              </div>
            </div>
          </div>

          {/* Summary Table */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Detailed Summary</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Metric</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Total Advocates</td>
                    <td className="px-6 py-4 text-sm text-gray-700 text-right">{reportData.totalAdvocates}</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Approved Advocates</td>
                    <td className="px-6 py-4 text-sm text-gray-700 text-right">{reportData.approvedAdvocates}</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Pending Advocates</td>
                    <td className="px-6 py-4 text-sm text-gray-700 text-right">{reportData.pendingAdvocates}</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Rejected Advocates</td>
                    <td className="px-6 py-4 text-sm text-gray-700 text-right">{reportData.rejectedAdvocates}</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Total Clients</td>
                    <td className="px-6 py-4 text-sm text-gray-700 text-right">{reportData.totalClients}</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Total Cases</td>
                    <td className="px-6 py-4 text-sm text-gray-700 text-right">{reportData.totalCases}</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Total Payments</td>
                    <td className="px-6 py-4 text-sm text-gray-700 text-right">{reportData.totalPayments}</td>
                  </tr>
                  <tr className="hover:bg-gray-50 bg-green-50">
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">Total Revenue</td>
                    <td className="px-6 py-4 text-sm font-bold text-green-700 text-right">
                      ₹{reportData.totalRevenue.toLocaleString('en-IN')}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!reportData && !loading && (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <FileText size={64} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Report Generated</h3>
          <p className="text-gray-600 mb-6">Select filters and click "View Report" to generate a report</p>
        </div>
      )}
    </div>
  );
};

export default Reports;