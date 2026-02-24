// client/pages/Payments.jsx
import { useState, useEffect } from 'react';
import { CreditCard, Download } from 'lucide-react';
import api from '../../api/api';

const ClientPayments = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null);

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        try {
            const { data } = await api.get('/client/payments');
            setPayments(data);
        } catch (err) {
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handlePay = async (paymentId) => {
        try {
            setProcessingId(paymentId);

            await new Promise((resolve) => setTimeout(resolve, 2000));

            const fakeTransactionId =
                "RZP_" + Math.random().toString(36).substring(2, 10).toUpperCase();

            await api.post(`/client/payments/pay/${paymentId}`, {
                paymentMethod: "razorpay",
                transactionId: fakeTransactionId
            });

            fetchPayments();
            alert("Payment successful 🎉");

        } catch (err) {
            alert("Payment failed");
        } finally {
            setProcessingId(null);
        }
    };

    const downloadInvoice = async (paymentId) => {
        try {
            const response = await api.get(`/client/payments/invoice/${paymentId}`, {
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `invoice-${paymentId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            alert('Failed to download invoice');
        }
    };

    const StatusBadge = ({ status }) => {
        const colors = {
            requested: 'bg-yellow-100 text-yellow-700',
            paid: 'bg-green-100 text-green-700',
            cancelled: 'bg-red-100 text-red-700'
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
            <h1 className="text-2xl md:text-3xl font-bold">Payments</h1>

            <div className="grid gap-4">
                {payments.length > 0 ? payments.map((payment) => (
                    <div key={payment._id} className="bg-white p-6 rounded-lg shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-bold text-gray-900">{payment.caseId?.title}</h3>
                                <p className="text-sm text-gray-600">{payment.paymentType}</p>
                                <p className="text-xs text-gray-500">{payment.description}</p>
                            </div>
                            <StatusBadge status={payment.status} />
                        </div>

                        <div className="flex items-center justify-between">
                            <p className="text-2xl font-bold text-blue-600">₹{payment.amount}</p>
                            <div className="flex gap-2">
                                {payment.status === 'requested' && (
                                    <button
                                        onClick={() => handlePay(payment._id)}
                                        disabled={processingId === payment._id}
                                        className={`px-4 py-2 text-white rounded-lg ${processingId === payment._id
                                                ? "bg-gray-400 cursor-not-allowed"
                                                : "bg-green-600 hover:bg-green-700"
                                            }`}
                                    >
                                        {processingId === payment._id ? "Processing..." : "Pay Now"}
                                    </button>
                                )}
                                {payment.status === 'paid' && payment.invoicePath && (
                                    <button
                                        onClick={() => downloadInvoice(payment._id)}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                                    >
                                        <Download size={16} />
                                        Invoice
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="text-center py-12 bg-white rounded-lg">
                        <CreditCard size={48} className="mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-600">No payments yet</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClientPayments;