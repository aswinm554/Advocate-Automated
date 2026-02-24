// client/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import { Calendar, Briefcase, FileText, CreditCard } from 'lucide-react';
import api from '../../api/api';

const ClientDashboard = () => {
  const [stats, setStats] = useState({
    appointments: 0,
    cases: 0,
    documents: 0,
    payments: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [appointments, cases, payments] = await Promise.all([
        api.get('/client/appointments'),
        api.get('/client/cases'),
        api.get('/client/payments')
      ]);

      setStats({
        appointments: appointments.data.length,
        cases: cases.data.length,
        documents: 0, // Will need to aggregate from all cases
        payments: payments.data.length
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: 'Appointments', value: stats.appointments, icon: <Calendar size={40} />, color: 'bg-blue-500' },
    { label: 'Cases', value: stats.cases, icon: <Briefcase size={40} />, color: 'bg-green-500' },
    { label: 'Documents', value: stats.documents, icon: <FileText size={40} />, color: 'bg-purple-500' },
    { label: 'Payments', value: stats.payments, icon: <CreditCard size={40} />, color: 'bg-orange-500' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Client Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's your overview</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-full text-white`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientDashboard;