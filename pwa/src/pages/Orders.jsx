import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API } from '../context/AuthContext';

const STATUS_COLORS = {
  SUBMITTED: 'bg-blue-100 text-blue-700',
  WAITING_FOR_ESTIMATE: 'bg-yellow-100 text-yellow-700',
  AWAITING_PAYMENT: 'bg-orange-100 text-orange-700',
  PAYMENT_UNDER_REVIEW: 'bg-purple-100 text-purple-700',
  PAYMENT_VERIFIED: 'bg-green-100 text-green-700',
  RIDER_ASSIGNED: 'bg-teal-100 text-teal-700',
  PURCHASING_ITEMS: 'bg-indigo-100 text-indigo-700',
  OUT_FOR_DELIVERY: 'bg-blue-100 text-blue-700',
  DELIVERED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/orders').then(r => setOrders(r.data.orders || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-16"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="px-4 py-4">
      <h1 className="text-xl font-bold mb-4">My Orders</h1>
      {orders.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">📋</div>
          <div className="text-gray-500">No orders yet</div>
          <button onClick={() => navigate('/speedmart')} className="btn-primary mt-4">Start Shopping</button>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map(order => (
            <div key={order.id} onClick={() => navigate(`/orders/${order.id}`)} className="card p-4 cursor-pointer active:scale-[0.99] transition-transform">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="font-semibold text-sm">#{order.orderNumber}</div>
                  <div className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[order.status] || 'bg-gray-100'}`}>
                  {order.status.replace(/_/g, ' ')}
                </span>
              </div>
              <div className="text-xs text-gray-500">{order.type} · {order.items.length} item(s)</div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm font-bold text-primary">Rs. {order.totalAmount}</span>
                <span className="text-xs text-gray-400">View Details →</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
