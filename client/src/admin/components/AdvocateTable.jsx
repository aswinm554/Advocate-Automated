import { Search, Filter } from 'lucide-react';

const AdvocateTable = ({ advocates, filterStatus, setFilterStatus, searchTerm, setSearchTerm, loading }) => {
  
  // Filter advocates based on status and search
  const filteredAdvocates = advocates.filter(advocate => {
    const matchesStatus = filterStatus === 'all' || advocate.status === filterStatus;
    const matchesSearch = advocate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          advocate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          advocate.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="bg-white rounded-lg shadow p-3 sm:p-4 md:p-6">
      <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">All Advocates</h2>
      
      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
        {/* Search Bar */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by name, email, or license..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-gray-600" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full sm:w-auto px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
          </select>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center py-8 sm:py-12">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          {/* Desktop/Tablet Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left font-semibold">Name</th>
                  <th className="p-3 text-left font-semibold">Email</th>
                  <th className="p-3 text-center font-semibold">License</th>
                  <th className="p-3 text-center font-semibold">Specialization</th>
                  <th className="p-3 text-center font-semibold">Experience</th>
                  <th className="p-3 text-center font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredAdvocates.length > 0 ? (
                  filteredAdvocates.map((a) => (
                    <tr key={a.id} className="hover:bg-gray-50 transition">
                      <td className="p-3 font-medium text-gray-800">{a.name}</td>
                      <td className="p-3 text-gray-600">{a.email}</td>
                      <td className="p-3 text-center text-gray-700">{a.licenseNumber}</td>
                      <td className="p-3 text-center text-gray-700">{a.specialization}</td>
                      <td className="p-3 text-center text-gray-700">{a.experience} yrs</td>
                      <td className="p-3 text-center">
                        <span className={`inline-block px-3 py-1 text-xs rounded-full font-medium ${
                          a.status === 'approved' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {a.status.charAt(0).toUpperCase() + a.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-gray-500">
                      No advocates found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Tablet View (Medium screens) - Compact Table */}
          <div className="hidden md:block lg:hidden overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left font-semibold">Name</th>
                  <th className="p-2 text-left font-semibold">Email</th>
                  <th className="p-2 text-center font-semibold">License</th>
                  <th className="p-2 text-center font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredAdvocates.length > 0 ? (
                  filteredAdvocates.map((a) => (
                    <tr key={a.id} className="hover:bg-gray-50 transition">
                      <td className="p-2">
                        <div className="font-medium text-gray-800">{a.name}</div>
                        <div className="text-xs text-gray-500">{a.specialization} • {a.experience} yrs</div>
                      </td>
                      <td className="p-2 text-gray-600 text-sm">{a.email}</td>
                      <td className="p-2 text-center text-gray-700 text-sm">{a.licenseNumber}</td>
                      <td className="p-2 text-center">
                        <span className={`inline-block px-2 py-1 text-xs rounded-full font-medium ${
                          a.status === 'approved' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {a.status.charAt(0).toUpperCase() + a.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="p-6 text-center text-gray-500">
                      No advocates found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards View */}
          <div className="md:hidden space-y-3">
            {filteredAdvocates.length > 0 ? (
              filteredAdvocates.map((a) => (
                <div key={a.id} className="rounded-lg p-3 sm:p-4 bg-gray-50 hover:bg-gray-100 transition">
                  <div className="flex justify-between items-start mb-2 sm:mb-3">
                    <div className="flex-1 min-w-0 pr-2">
                      <h3 className="font-semibold text-gray-800 text-sm sm:text-base truncate">{a.name}</h3>
                      <p className="text-xs sm:text-sm text-gray-600 truncate">{a.email}</p>
                    </div>
                    <span className={`shrink-0 px-2 sm:px-3 py-1 text-xs rounded-full font-medium whitespace-nowrap ${
                      a.status === 'approved' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {a.status.charAt(0).toUpperCase() + a.status.slice(1)}
                    </span>
                  </div>
                  <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">License:</span>
                      <span className="font-medium text-gray-800 text-right">{a.licenseNumber}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Specialization:</span>
                      <span className="font-medium text-gray-800 text-right">{a.specialization}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Experience:</span>
                      <span className="font-medium text-gray-800">{a.experience} yrs</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 sm:p-8 text-center text-gray-500 text-sm sm:text-base">
                No advocates found
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AdvocateTable;