import { useState, useEffect } from 'react';
import { FileText, Upload, Trash2, Eye, Lock, X, ExternalLink } from 'lucide-react';
import api from '../../api/api';

const Documents = () => {
    const [documents, setDocuments] = useState([]);
    const [cases, setCases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [selectedCase, setSelectedCase] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [uploading, setUploading] = useState(false);

    const [formData, setFormData] = useState({
        caseId: '',
        title: '',
        category: 'general',
        isPrivate: false,
        file: null
    });

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
            setLoading(true);
            const { data } = await api.get('/advocate/cases');
            setCases(data);
            if (data.length > 0) {
                setSelectedCase(data[0]._id);
            }
        } catch (err) {
            console.error('Error fetching cases:', err);
            alert('Failed to load cases');
        } finally {
            setLoading(false);
        }
    };

    const fetchDocuments = async (caseId) => {
        try {
            setLoading(true);
            const { data } = await api.get(`/advocate/documents/${caseId}`);
            setDocuments(data);
        } catch (err) {
            console.error('Error fetching documents:', err);
            setDocuments([]);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) {
                alert('File size must be less than 10MB');
                e.target.value = '';
                return;
            }
            setFormData({ ...formData, file });
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        setUploading(true);

        try {
            const uploadData = new FormData();
            uploadData.append('caseId', formData.caseId);
            uploadData.append('title', formData.title);
            uploadData.append('category', formData.category);
            uploadData.append('isPrivate', formData.isPrivate);
            uploadData.append('file', formData.file);

            await api.post('/advocate/documents', uploadData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setShowUploadModal(false);
            resetForm();
            if (selectedCase) {
                fetchDocuments(selectedCase);
            }
            alert('Document uploaded successfully!');
        } catch (err) {
            console.error('Error uploading document:', err);
            alert(err.response?.data?.message || 'Failed to upload document');
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (documentId) => {
        if (!window.confirm('Are you sure you want to delete this document?')) return;

        try {
            await api.delete(`/advocate/documents/${documentId}`);
            fetchDocuments(selectedCase);
            alert('Document deleted successfully');
        } catch (err) {
            console.error('Error deleting document:', err);
            alert('Failed to delete document');
        }
    };

    const handleView = (document) => {
        setSelectedDocument(document);
        setShowViewModal(true);
    };

    const openInNewTab = (url) => {
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    const resetForm = () => {
        setFormData({
            caseId: '',
            title: '',
            category: 'general',
            isPrivate: false,
            file: null
        });
    };

    const filteredDocuments = documents.filter(doc =>
        !categoryFilter || doc.category === categoryFilter
    );

    const getFileIcon = (fileUrl) => {
        const ext = fileUrl?.split('.').pop()?.toLowerCase();
        if (['pdf'].includes(ext)) return '📄';
        if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return '🖼️';
        if (['doc', 'docx'].includes(ext)) return '📝';
        return '📎';
    };

    const isImage = (fileUrl) => {
        const ext = fileUrl?.split('.').pop()?.toLowerCase();
        return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext);
    };

    if (loading && cases.length === 0) {
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
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Documents</h1>
                    <p className="text-gray-600 mt-1">Manage case documents and files</p>
                </div>
                <button
                    onClick={() => {
                        setFormData({ ...formData, caseId: selectedCase });
                        setShowUploadModal(true);
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    disabled={!selectedCase}
                >
                    <Upload size={18} />
                    Upload Document
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg shadow">
                    <p className="text-sm text-gray-600">Total Documents</p>
                    <p className="text-2xl font-bold text-gray-800">{documents.length}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <p className="text-sm text-gray-600">Private</p>
                    <p className="text-2xl font-bold text-gray-800">
                        {documents.filter(d => d.isPrivate).length}
                    </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <p className="text-sm text-gray-600">Public</p>
                    <p className="text-2xl font-bold text-gray-800">
                        {documents.filter(d => !d.isPrivate).length}
                    </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <p className="text-sm text-gray-600">This Month</p>
                    <p className="text-2xl font-bold text-gray-800">
                        {documents.filter(d => {
                            const created = new Date(d.createdAt);
                            const now = new Date();
                            return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
                        }).length}
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-lg shadow">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Select Case</label>
                        <select
                            value={selectedCase}
                            onChange={(e) => setSelectedCase(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">-- Select Case --</option>
                            {cases.map((caseItem) => (
                                <option key={caseItem._id} value={caseItem._id}>
                                    {caseItem.title} ({caseItem.caseNumber})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Category</label>
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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

            {/* Documents List */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                {selectedCase && filteredDocuments.length > 0 ? (
                    <>
                        {/* Desktop Table */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Document</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Category</th>
                                        <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Privacy</th>
                                        <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Uploaded</th>
                                        <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {filteredDocuments.map((doc) => (
                                        <tr key={doc._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-2xl">{getFileIcon(doc.fileUrl)}</span>
                                                    <div>
                                                        <p className="font-semibold text-gray-900">{doc.title}</p>
                                                        <p className="text-sm text-gray-500">
                                                            {doc.fileUrl?.split('/').pop()?.split('?')[0] || 'Document'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700">
                                                    {categories.find(c => c.value === doc.category)?.label || doc.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {doc.isPrivate ? (
                                                    <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700">
                                                        <Lock size={12} />
                                                        Private
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">
                                                        <Eye size={12} />
                                                        Public
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-center text-sm text-gray-600">
                                                {new Date(doc.createdAt).toLocaleDateString('en-IN')}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-2 justify-center">
                                                    <button
                                                        onClick={() => handleView(doc)}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                        title="View Document"
                                                    >
                                                        <Eye size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => openInNewTab(doc.fileUrl)}
                                                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                                                        title="Open in New Tab"
                                                    >
                                                        <ExternalLink size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(doc._id)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={18} />
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
                            {filteredDocuments.map((doc) => (
                                <div key={doc._id} className="p-4">
                                    <div className="flex items-start gap-3 mb-3">
                                        <span className="text-3xl">{getFileIcon(doc.fileUrl)}</span>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-gray-900">{doc.title}</h3>
                                            <p className="text-sm text-gray-500">{categories.find(c => c.value === doc.category)?.label}</p>
                                        </div>
                                        {doc.isPrivate ? (
                                            <Lock size={16} className="text-red-600" />
                                        ) : (
                                            <Eye size={16} className="text-green-600" />
                                        )}
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleView(doc)}
                                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                                        >
                                            <Eye size={16} className="inline mr-1" />
                                            View
                                        </button>
                                        <button
                                            onClick={() => handleDelete(doc._id)}
                                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="text-center py-12">
                        <FileText size={48} className="mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-600 mb-4">
                            {!selectedCase
                                ? 'Please select a case to view documents'
                                : 'No documents found'}
                        </p>
                        {selectedCase && (
                            <button
                                onClick={() => {
                                    setFormData({ ...formData, caseId: selectedCase });
                                    setShowUploadModal(true);
                                }}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                            >
                                Upload First Document
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Upload Modal */}
            {showUploadModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => { setShowUploadModal(false); resetForm(); }}></div>

                    <div className="relative bg-white rounded-xl shadow-2xl max-w-lg w-full">
                        <div className="flex items-center justify-between p-6 border-b">
                            <h2 className="text-xl font-bold">Upload Document</h2>
                            <button onClick={() => { setShowUploadModal(false); resetForm(); }} className="p-2 hover:bg-gray-100 rounded-lg">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleUpload} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Case *</label>
                                <select
                                    required
                                    value={formData.caseId}
                                    onChange={(e) => setFormData({ ...formData, caseId: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">-- Select Case --</option>
                                    {cases.map((caseItem) => (
                                        <option key={caseItem._id} value={caseItem._id}>
                                            {caseItem.title} ({caseItem.caseNumber})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Document Title *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., Petition Draft"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                                <select
                                    required
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {categories.map((cat) => (
                                        <option key={cat.value} value={cat.value}>
                                            {cat.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">File *</label>
                                <input
                                    type="file"
                                    required
                                    onChange={handleFileChange}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                />
                                <p className="text-xs text-gray-500 mt-1">Max file size: 10MB. Accepted: PDF, DOC, DOCX, JPG, PNG</p>
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="isPrivate"
                                    checked={formData.isPrivate}
                                    onChange={(e) => setFormData({ ...formData, isPrivate: e.target.checked })}
                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <label htmlFor="isPrivate" className="text-sm font-medium text-gray-700">
                                    Mark as Private (Only you can view)
                                </label>
                            </div>

                            <div className="flex gap-3 pt-4 border-t">
                                <button
                                    type="button"
                                    onClick={() => { setShowUploadModal(false); resetForm(); }}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={uploading}
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                                >
                                    {uploading ? 'Uploading...' : 'Upload Document'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* View Document Modal */}
            {showViewModal && selectedDocument && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowViewModal(false)}></div>

                    <div className="relative bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col">
                        <div className="flex items-center justify-between p-6 border-b">
                            <div>
                                <h2 className="text-xl font-bold">{selectedDocument.title}</h2>
                                <p className="text-sm text-gray-600">
                                    {categories.find(c => c.value === selectedDocument.category)?.label} • 
                                    {new Date(selectedDocument.createdAt).toLocaleDateString('en-IN')}
                                </p>
                            </div>
                            <button onClick={() => setShowViewModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-auto p-6">
                            {isImage(selectedDocument.fileUrl) ? (
                                <img 
                                    src={selectedDocument.fileUrl} 
                                    alt={selectedDocument.title}
                                    className="max-w-full h-auto mx-auto rounded-lg shadow-lg"
                                />
                            ) : (
                                <iframe
                                    src={selectedDocument.fileUrl}
                                    className="w-full h-150 border rounded-lg"
                                    title={selectedDocument.title}
                                />
                            )}
                        </div>

                        <div className="p-6 border-t flex gap-3">
                            <button
                                onClick={() => openInNewTab(selectedDocument.fileUrl)}
                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                            >
                                <ExternalLink size={18} className="inline mr-2" />
                                Open in New Tab
                            </button>
                            <button
                                onClick={() => setShowViewModal(false)}
                                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Documents;