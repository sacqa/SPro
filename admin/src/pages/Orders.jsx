import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API } from '../context/AuthContext';

const STATUS_COLORS = {
  SUBMITTED: 'bg-blue-100 text-blue-700', WAITING_FOR_ESTIMATE: 'bg-yellow-100 text-yellow-700',
  AWAITING_PAYMENT: 'bg-orange-100 text-orange-700', PAYMENT_UNDER_REVIEW: 'bg-purple-100 text-purple-700',
  PAYMENT_VERIFIED: 'bg-green-100 text-green-700', RIDER_ASSIGNED: 'bg-teal-100 text-teal-700',
  PURCHASING_ITEMS: 'bg-indigo-100 text-indigo-700', OUT_FOR_DELIVERY: 'bg-blue-100 text-blue-700',
  DELIVERED: 'bg-green-100 text-green-700', CANCELLED: 'bg-red-100 text-red-700',
};

const ALL_STATUSES = ['SUBMITTED','WAITING_FOR_ESTIMATE','AWAITING_PAYMENT','PAYMENT_UNDER_REVIEW','PAYMENT_VERIFIED','RIDER_ASSIGNED','PURCHASING_ITEMS','OUT_FOR_DELIVERY','DELIVERED','CANCELLED'];

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterType, setFilterType] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetch = async () => {
    setLoading(true);
    const params = { page, limit: 20 };
    if (filterStatus) params.status = filterStatus;
    if (filterType) params.type = filterType;
    try {
      const r = await API.get('/admin/orders', { params });
      setOrders(r.data.orders || []);
      setTotal(r.data.total || 0);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, [page, filterStatus, filterType]);

  return (
    <div>
      <h1 className="text-xl font-bold mb-5">All Orders <span className="text-gray-400 font-normal text-base">({total})</span></h1>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-wrap gap-3">
          <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(1); }} className="input-field w-auto text-sm py-2">
            <option value="">All Statuses</option>
            {ALL_STATUSES.map(s => <option key={s} value={s}>{s.replace(/_/g,' ')}</option>)}
          </select>
          <select value={filterType} onChange={e => { setFilterType(e.target.value); setPage(1); }} className="input-field w-auto text-sm py-2">
            <option value="">All Types</option>
            {['SPEEDMART','PHARMACY','SPEEDSEND','CUSTOM'].map(t => <option key={t}>{t}</option>)}
          </select>
          <button onClick={fetch} className="btn-primary py-2 px-4 text-sm">🔄 Refresh</button>
        </div>
        {loading ? (
          <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="bg-gray-50 text-gray-500 text-xs uppercase">
                <th className="px-4 py-3 text-left">Order #</th>
                <th className="px-4 py-3 text-left">Customer</th>
                <th className="px-4 py-3 text-left">Type</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Payment</th>
                <th className="px-4 py-3 text-left">Total</th>
                <th className="px-4 py-3 text-left">Date</th>
              </tr></thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map(o => (
                  <tr key={o.id} onClick={() => navigate(`/orders/${o.id}`)} className="hover:bg-gray-50 cursor-pointer">
                    <td className="px-4 py-3 font-medium text-primary">{o.orderNumber}</td>
                    <td className="px-4 py-3">{o.user?.name}<div className="text-xs text-gray-400">{o.user?.phone}</div></td>
                    <td className="px-4 py-3"><span className="bg-gray-100 px-2 py-0.5 rounded text-xs">{o.type}</span></td>
                    <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[o.status] || 'bg-gray-100'}`}>{o.status.replace(/_/g,' ')}</span></td>
                    <td className="px-4 py-3 text-xs text-gray-500">{o.paymentMethod || '—'}</td>
                    <td className="px-4 py-3 font-semibold">Rs. {o.totalAmount}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{new Date(o.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
          <span>Page {page}</span>
          <div className="flex gap-2">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1 border rounded disabled:opacity-40">← Prev</button>
            <button disabled={orders.length < 20} onClick={() => setPage(p => p + 1)} className="px-3 py-1 border rounded disabled:opacity-40">Next →</button>
          </div>
        </div>
      </div>
    </div>
  );
}
