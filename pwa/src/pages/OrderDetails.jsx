import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API } from '../context/AuthContext';

const ALL_STATUSES = ['SUBMITTED','WAITING_FOR_ESTIMATE','AWAITING_PAYMENT','PAYMENT_UNDER_REVIEW','PAYMENT_VERIFIED','RIDER_ASSIGNED','PURCHASING_ITEMS','OUT_FOR_DELIVERY','DELIVERED'];

const STATUS_LABELS = {
  SUBMITTED: 'Order Submitted',
  WAITING_FOR_ESTIMATE: 'Waiting for Estimate',
  AWAITING_PAYMENT: 'Awaiting Payment',
  PAYMENT_UNDER_REVIEW: 'Payment Under Review',
  PAYMENT_VERIFIED: 'Payment Verified',
  RIDER_ASSIGNED: 'Rider Assigned',
  PURCHASING_ITEMS: 'Purchasing Items',
  OUT_FOR_DELIVERY: 'Out for Delivery',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
};

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(`/orders/${id}`).then(r => setOrder(r.data.order)).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="flex justify-center py-16"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  if (!order) return <div className="p-6 text-center text-gray-500">Order not found</div>;

  const currentIdx = ALL_STATUSES.indexOf(order.status);
  const isCancelled = order.status === 'CANCELLED';

  return (
    <div className="px-4 py-4 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-4">
        <button onClick={() => navigate(-1)} className="text-primary">← Back</button>
        <h1 className="font-bold text-lg">#{order.orderNumber}</h1>
      </div>

      {/* Status & Payment */}
      <div className="card p-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${isCancelled ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {STATUS_LABELS[order.status]}
          </span>
          <span className="text-sm font-bold text-primary">Rs. {order.totalAmount}</span>
        </div>
        <div className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleString()}</div>
        {order.riderName && (
          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
            <div className="text-sm font-semibold">🛵 Rider: {order.riderName}</div>
            <div className="text-xs text-gray-500">{order.riderVehicle} · {order.riderPhone}</div>
            <a href={`tel:${order.riderPhone}`} className="text-xs text-primary font-medium">📞 Call Rider</a>
          </div>
        )}
      </div>

      {/* Timeline */}
      {!isCancelled && (
        <div className="card p-4 mb-4">
          <h2 className="font-semibold mb-4">Order Progress</h2>
          <div className="space-y-3">
            {ALL_STATUSES.map((s, i) => {
              const log = order.statusLogs?.find(l => l.status === s);
              const done = i <= currentIdx;
              const current = i === currentIdx;
              return (
                <div key={s} className="flex gap-3 items-start">
                  <div className={`w-5 h-5 rounded-full flex-shrink-0 mt-0.5 flex items-center justify-center border-2 transition-all ${done ? 'bg-primary border-primary text-white' : 'border-gray-300'}`}>
                    {done && <span className="text-xs">✓</span>}
                  </div>
                  {i < ALL_STATUSES.length - 1 && (
                    <div className={`absolute ml-2 mt-5 w-0.5 h-5 ${i < currentIdx ? 'bg-primary' : 'bg-gray-200'}`} style={{position:'relative',left:'9px',top:'-18px',marginLeft:'0',marginRight:'-2px'}} />
                  )}
                  <div className="flex-1">
                    <div className={`text-sm font-medium ${current ? 'text-primary' : done ? 'text-gray-700' : 'text-gray-400'}`}>{STATUS_LABELS[s]}</div>
                    {log && <div className="text-xs text-gray-400">{new Date(log.createdAt).toLocaleString()}</div>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Items */}
      <div className="card p-4 mb-4">
        <h2 className="font-semibold mb-3">Items</h2>
        <div className="space-y-2">
          {order.items.map(item => (
            <div key={item.id} className="flex items-center justify-between text-sm">
              <span>{item.name} × {item.quantity}</span>
              <span className="font-medium">Rs. {(item.price * item.quantity).toFixed(0)}</span>
            </div>
          ))}
          <div className="border-t pt-2 space-y-1 text-sm">
            <div className="flex justify-between text-gray-500"><span>Delivery Fee</span><span>Rs. {order.deliveryFee}</span></div>
            <div className="flex justify-between text-gray-500"><span>Service Charge</span><span>Rs. {order.serviceCharge}</span></div>
            <div className="flex justify-between font-bold text-base mt-2"><span>Total</span><span className="text-primary">Rs. {order.totalAmount}</span></div>
          </div>
        </div>
      </div>

      {/* Upload payment if awaiting */}
      {order.status === 'AWAITING_PAYMENT' && (
        <button onClick={() => navigate(`/payment-proof/${order.id}`)} className="w-full btn-primary py-3">
          📸 Upload Payment Proof
        </button>
      )}
    </div>
  );
}
