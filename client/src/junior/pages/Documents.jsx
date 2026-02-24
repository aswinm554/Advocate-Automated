// junior/pages/Documents.jsx
import { useState, useEffect } from 'react';
import { FileText, Eye, Download, Search } from 'lucide-react';
import api from '../../api/api';

const Documents = () => {
  const [cases, setCases] = useState([]);
  const [selectedCase, setSelectedCase] = useState('');
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('');

  const categories = [
    { value: 'general', label: 'General' },
    { value: 'petition', label: 'Petition' },
    { value: 'evidence', label: 'Evidence' },
    { value: 'contract', label: 'Contract' },
    { value: 'court_order', label: 'Court Order' },
    { value: 'correspondence', label: 'Correspondence' },
    { value: 'affidavit', label: 'Affidavit' },
    { value: 'other', label: 'Other' }
  ];

  useEffect(() => {
    fetchCases();
  }, []);

  useEffect(() => {
    if (selectedCase) {
      fetchDocuments(selectedCase);
    }
  }, [selectedCase]);

  const fetchCases = async () => {
    try {
      const { data } = await api.get('/junior/cases');
      setCases(data);
      if (data.length > 0) {
        setSelectedCase(data[0]._id);
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Failed to load cases');
    } finally {
      setLoading(false);
    }
  };

  const fetchDocuments = async (caseId) => {
    try {
      setLoading(true);
      const { data } = await api.get(`/junior/documents`);
      setDocuments(data);
    } catch (err) {
      console.error('Error:', err);
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  const openDocument = (url) => {
    window.open(url, '_blank');
  };

  const filteredDocuments = categoryFilter
    ? documents.filter(doc => doc.category === categoryFilter)
    : documents;

  const getFileIcon = (fileUrl) => {
    const ext = fileUrl?.split('.').pop()?.toLowerCase();
    if (['pdf'].includes(ext)) return '📄';
    if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) return '🖼️';
    if (['doc', 'docx'].includes(ext)) return '📝';
    return '📎';
  };

  if (loading && cases.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Case Documents</h1>
        <p className="text-gray-600 mt-1">View documents for your assigned cases</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-600">Total Documents</p>
          <p className="text-2xl font-bold text-gray-800">{documents.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-600">This Case</p>
          <p className="text-2xl font-bold text-gray-800">{filteredDocuments.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-600">Total Cases</p>
          <p className="text-2xl font-bold text-gray-800">{cases.length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Case</label>
            <select
              value={selectedCase}
              onChange={(e) => setSelectedCase(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {cases.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.title} ({c.caseNumber})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid gap-4">
        {filteredDocuments.length > 0 ? filteredDocuments.map((doc) => (
          <div key={doc._id} className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-4xl">{getFileIcon(doc.fileUrl)}</span>
              <div>
                <h3 className="font-bold text-gray-900">{doc.title}</h3>
                <p className="text-sm text-gray-600">
                  {categories.find(c => c.value === doc.category)?.label || doc.category}
                </p>
                <p className="text-xs text-gray-500">
                  Uploaded: {new Date(doc.createdAt).toLocaleDateString('en-IN')}
                </p>
              </div>
            </div>
            <button
              onClick={() => openDocument(doc.fileUrl)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2 transition"
            >
              <Eye size={16} />
              View
            </button>
          </div>
        )) : (
          <div className="text-center py-12 bg-white rounded-xl">
            <FileText size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">
              {!selectedCase ? 'Select a case to view documents' : 'No documents available'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Documents;