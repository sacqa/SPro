import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API } from '../context/AuthContext';

const StatCard = ({ label, value, icon, color }) => (
  <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
    <div className="flex items-center justify-between">
      <div>
        <div className="text-sm text-gray-500 font-medium">{label}</div>
        <div className="text-2xl font-bold mt-1">{value}</div>
      </div>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${color}`}>{icon}</div>
    </div>
  </div>
);

const STATUS_COLORS = {
  SUBMITTED: 'bg-blue-100 text-blue-700', AWAITING_PAYMENT: 'bg-orange-100 text-orange-700',
  PAYMENT_UNDER_REVIEW: 'bg-purple-100 text-purple-700', PAYMENT_VERIFIED: 'bg-green-100 text-green-700',
  DELIVERED: 'bg-green-100 text-green-700', CANCELLED: 'bg-red-100 text-red-700',
};

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/admin/dashboard').then(r => setData(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div>
      <h1 className="text-xl font-bold mb-5">Dashboard</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Orders" value={data?.stats?.totalOrders || 0} icon="📦" color="bg-purple-100" />
        <StatCard label="Pending Orders" value={data?.stats?.pendingOrders || 0} icon="⏳" color="bg-orange-100" />
        <StatCard label="Total Customers" value={data?.stats?.customers || 0} icon="👥" color="bg-blue-100" />
        <StatCard label="Revenue (Rs.)" value={(data?.stats?.revenue || 0).toLocaleString()} icon="💰" color="bg-green-100" />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold">Recent Orders</h2>
          <button onClick={() => navigate('/orders')} className="text-primary text-sm font-medium">View All →</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="bg-gray-50 text-gray-500 text-xs uppercase">
              <th className="px-4 py-3 text-left">Order #</th>
              <th className="px-4 py-3 text-left">Customer</th>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Total</th>
              <th className="px-4 py-3 text-left">Date</th>
            </tr></thead>
            <tbody className="divide-y divide-gray-50">
              {data?.recentOrders?.map(o => (
                <tr key={o.id} onClick={() => navigate(`/orders/${o.id}`)} className="hover:bg-gray-50 cursor-pointer">
                  <td className="px-4 py-3 font-medium text-primary">{o.orderNumber}</td>
                  <td className="px-4 py-3">{o.user?.name}<div className="text-xs text-gray-400">{o.user?.phone}</div></td>
                  <td className="px-4 py-3"><span className="bg-gray-100 px-2 py-0.5 rounded text-xs">{o.type}</span></td>
                  <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[o.status] || 'bg-gray-100'}`}>{o.status.replace(/_/g,' ')}</span></td>
                  <td className="px-4 py-3 font-semibold">Rs. {o.totalAmount}</td>
                  <td className="px-4 py-3 text-gray-400">{new Date(o.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
