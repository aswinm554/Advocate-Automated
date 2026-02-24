// client/pages/Appointments.jsx
import { useState, useEffect } from 'react';
import { Calendar, Plus, X, Clock } from 'lucide-react';
import api from '../../api/api';

const Appointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [advocates, setAdvocates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        advocateId: '',
        appointmentDate: '',
        reason: ''
    });

    useEffect(() => {
        fetchAppointments();
        fetchAdvocates();
    }, []);

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/client/appointments');
            setAppointments(data);
        } catch (err) {
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchAdvocates = async () => {
        try {
            // You'll need an endpoint to get all approved advocates
            const { data } = await api.get('/client/appointments/advocates');
            setAdvocates(data);
        } catch (err) {
            console.error('Error:', err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setSubmitting(true);

            const { data } = await api.post("/client/appointments", formData);

            setShowModal(false);
            resetForm();
            fetchAppointments();

            alert(data.message || "Appointment booked successfully!");

        } catch (err) {
            alert(err.response?.data?.message || "Failed to book appointment");
        } finally {
            setSubmitting(false);
        }
    };

    const resetForm = () => {
        setFormData({ advocateId: '', appointmentDate: '', reason: '' });
    };

    const getMinDateTime = () => {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        return now.toISOString().slice(0, 16);
    };

    const StatusBadge = ({ status }) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-700',
            approved: 'bg-green-100 text-green-700',
            rejected: 'bg-red-100 text-red-700',
            completed: 'bg-blue-100 text-blue-700'
        };
        return (
            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${colors[status]}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>;
    }

    return (
        <div className="p-4 md:p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl md:text-3xl font-bold">My Appointments</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    <Plus size={18} />
                    Book Appointment
                </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                {appointments.length > 0 ? (
                    <div className="divide-y">
                        {appointments.map((apt) => (
                            <div key={apt._id} className="p-4 hover:bg-gray-50">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-semibold text-gray-900">
                                            {apt.advocateId?.name || 'N/A'}
                                        </p>
                                        <p className="text-sm text-gray-600">{apt.advocateId?.email}</p>
                                        <p className="text-sm text-gray-700 mt-2">{apt.reason}</p>
                                    </div>
                                    <StatusBadge status={apt.status} />
                                </div>
                                <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                                    <Clock size={14} />
                                    {new Date(apt.appointmentDate).toLocaleString('en-IN')}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-600">No appointments yet</p>
                    </div>
                )}
            </div>

            {/* Book Appointment Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
                    <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full">
                        <div className="flex items-center justify-between p-6 border-b">
                            <h2 className="text-xl font-bold">Book Appointment</h2>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Select Advocate *</label>
                                <select
                                    required
                                    value={formData.advocateId}
                                    onChange={(e) => setFormData({ ...formData, advocateId: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">-- Select Advocate --</option>
                                    {advocates.map((adv) => (
                                        <option key={adv._id} value={adv._id}>
                                            {adv.name} - {adv.specialization}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time *</label>
                                <input
                                    type="datetime-local"
                                    required
                                    min={getMinDateTime()}
                                    value={formData.appointmentDate}
                                    onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Reason *</label>
                                <textarea
                                    required
                                    value={formData.reason}
                                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                    rows="3"
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                    placeholder="Describe your legal issue..."
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Book Now
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Appointments;