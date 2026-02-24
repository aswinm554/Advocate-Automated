// client/pages/Documents.jsx
import { useState, useEffect } from 'react';
import { FileText, Eye, ExternalLink } from 'lucide-react';
import api from '../../api/api';

const ClientDocuments = () => {
  const [cases, setCases] = useState([]);
  const [selectedCase, setSelectedCase] = useState('');
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

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
      const { data } = await api.get('/client/cases');
      setCases(data);
      if (data.length > 0) {
        setSelectedCase(data[0]._id);
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDocuments = async (caseId) => {
    try {
      const { data } = await api.get(`/client/documents/${caseId}`);
      setDocuments(data);
    } catch (err) {
      console.error('Error:', err);
      setDocuments([]);
    }
  };

  const openInNewTab = (url) => {
    window.open(url, '_blank');
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>;
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold">Case Documents</h1>

      <div className="bg-white p-4 rounded-lg shadow">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Case</label>
        <select
          value={selectedCase}
          onChange={(e) => setSelectedCase(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {cases.map((c) => (
            <option key={c._id} value={c._id}>
              {c.title} ({c.caseNumber})
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4">
        {documents.length > 0 ? documents.map((doc) => (
          <div key={doc._id} className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition flex items-center justify-between">
            <div className="flex items-center gap-4">
              <FileText size={40} className="text-blue-600" />
              <div>
                <h3 className="font-bold text-gray-900">{doc.title}</h3>
                <p className="text-sm text-gray-600">{doc.category}</p>
                <p className="text-xs text-gray-500">{new Date(doc.createdAt).toLocaleDateString('en-IN')}</p>
              </div>
            </div>
            <button
              onClick={() => openInNewTab(doc.fileUrl)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Eye size={16} />
              View
            </button>
          </div>
        )) : (
          <div className="text-center py-12 bg-white rounded-lg">
            <FileText size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">No documents available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientDocuments;