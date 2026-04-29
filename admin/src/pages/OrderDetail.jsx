import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API } from '../context/AuthContext';

const ALL_STATUSES = ['SUBMITTED','WAITING_FOR_ESTIMATE','AWAITING_PAYMENT','PAYMENT_UNDER_REVIEW','PAYMENT_VERIFIED','RIDER_ASSIGNED','PURCHASING_ITEMS','OUT_FOR_DELIVERY','DELIVERED','CANCELLED'];

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newStatus, setNewStatus] = useState('');
  const [note, setNote] = useState('');
  const [rider, setRider] = useState({ name: '', phone: '', vehicle: '' });
  const [updating, setUpdating] = useState(false);
  const [msg, setMsg] = useState('');

  const load = () => API.get(`/admin/orders/${id}`).then(r => { setOrder(r.data.order); setNewStatus(r.data.order.status); }).catch(() => {}).finally(() => setLoading(false));
  useEffect(() => { load(); }, [id]);

  const updateStatus = async () => {
    setUpdating(true);
    try {
      await API.put(`/admin/orders/${id}/status`, { status: newStatus, note, ...(rider.name ? rider : {}) });
      setMsg('✅ Status updated!');
      load();
    } catch (e) { setMsg('❌ ' + (e.response?.data?.message || 'Error')); }
    finally { setUpdating(false); setTimeout(() => setMsg(''), 3000); }
  };

  const approvePayment = async (approved) => {
    setUpdating(true);
    try {
      await API.put(`/admin/orders/${id}/payment`, { approved, note: approved ? 'Payment verified by admin' : 'Payment rejected by admin' });
      setMsg(approved ? '✅ Payment approved!' : '❌ Payment rejected');
      load();
    } finally { setUpdating(false); setTimeout(() => setMsg(''), 3000); }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  if (!order) return <div className="p-6 text-center text-gray-500">Order not found</div>;

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-3 mb-5">
        <button onClick={() => navigate(-1)} className="text-primary font-medium">← Back</button>
        <h1 className="text-xl font-bold">Order #{order.orderNumber}</h1>
        <span className="bg-primary/10 text-primary text-sm px-3 py-1 rounded-full font-medium">{order.type}</span>
      </div>

      {msg && <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">{msg}</div>}

      <div className="grid lg:grid-cols-2 gap-4 mb-4">
        {/* Customer Info */}
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <h2 className="font-semibold mb-3">Customer</h2>
          <div className="space-y-1 text-sm">
            <div><span className="text-gray-500">Name:</span> <span className="font-medium">{order.user?.name}</span></div>
            <div><span className="text-gray-500">Phone:</span> <a href={`tel:${order.user?.phone}`} className="text-primary font-medium">{order.user?.phone}</a></div>
            {order.address && <div><span className="text-gray-500">Address:</span> {order.address.street}, {order.address.area}, {order.address.city}</div>}
          </div>
        </div>

        {/* Payment Info */}
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <h2 className="font-semibold mb-3">Payment</h2>
          <div className="space-y-1 text-sm">
            <div><span className="text-gray-500">Method:</span> <span className="font-medium">{order.paymentMethod}</span></div>
            <div><span className="text-gray-500">Status:</span> <span className="font-medium">{order.status}</span></div>
            {order.transactionId && <div><span className="text-gray-500">TXN ID:</span> <span className="font-mono">{order.transactionId}</span></div>}
            <div><span className="text-gray-500">Total:</span> <span className="font-bold text-primary text-base">Rs. {order.totalAmount}</span></div>
          </div>
          {order.paymentProof && (
            <div className="mt-3">
              <div className="text-xs text-gray-500 mb-1">Payment Proof:</div>
              <img src={order.paymentProof} alt="Payment Proof" className="max-h-48 rounded-lg border cursor-pointer" onClick={() => window.open(order.paymentProof, '_blank')} />
              {order.status === 'PAYMENT_UNDER_REVIEW' && (
                <div className="flex gap-2 mt-2">
                  <button onClick={() => approvePayment(true)} disabled={updating} className="flex-1 bg-green-500 text-white text-sm py-2 rounded-lg font-medium">✅ Approve</button>
                  <button onClick={() => approvePayment(false)} disabled={updating} className="flex-1 bg-red-500 text-white text-sm py-2 rounded-lg font-medium">❌ Reject</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Items */}
      <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm mb-4">
        <h2 className="font-semibold mb-3">Order Items</h2>
        <div className="space-y-2">
          {order.items.map(item => (
            <div key={item.id} className="flex items-center justify-between text-sm py-1 border-b last:border-0">
              <span className="font-medium">{item.name}</span>
              <div className="flex items-center gap-4">
                <span className="text-gray-500">× {item.quantity}</span>
                <span className="font-semibold">Rs. {(item.price * item.quantity).toFixed(0)}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 pt-3 border-t space-y-1 text-sm">
          <div className="flex justify-between text-gray-500"><span>Delivery Fee</span><span>Rs. {order.deliveryFee}</span></div>
          <div className="flex justify-between text-gray-500"><span>Service Charge</span><span>Rs. {order.serviceCharge}</span></div>
          <div className="flex justify-between font-bold text-base text-primary"><span>Total</span><span>Rs. {order.totalAmount}</span></div>
        </div>
      </div>

      {/* Update Status */}
      <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm mb-4">
        <h2 className="font-semibold mb-3">Update Status</h2>
        <div className="grid lg:grid-cols-2 gap-3 mb-3">
          <div>
            <label className="text-sm font-medium block mb-1">New Status</label>
            <select value={newStatus} onChange={e => setNewStatus(e.target.value)} className="input-field text-sm">
              {ALL_STATUSES.map(s => <option key={s} value={s}>{s.replace(/_/g,' ')}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Note</label>
            <input value={note} onChange={e => setNote(e.target.value)} className="input-field text-sm" placeholder="Optional note..." />
          </div>
        </div>
        {(newStatus === 'RIDER_ASSIGNED' || order.riderName) && (
          <div className="grid lg:grid-cols-3 gap-3 mb-3">
            <input value={rider.name} onChange={e => setRider({...rider, name: e.target.value})} className="input-field text-sm" placeholder="Rider Name" />
            <input value={rider.phone} onChange={e => setRider({...rider, phone: e.target.value})} className="input-field text-sm" placeholder="Rider Phone" />
            <input value={rider.vehicle} onChange={e => setRider({...rider, vehicle: e.target.value})} className="input-field text-sm" placeholder="Vehicle (e.g., Honda 125)" />
          </div>
        )}
        <button onClick={updateStatus} disabled={updating} className="btn-primary py-2 px-6 text-sm">
          {updating ? 'Updating...' : '💾 Update Status'}
        </button>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
        <h2 className="font-semibold mb-3">Status Timeline</h2>
        <div className="space-y-2">
          {order.statusLogs?.map(log => (
            <div key={log.id} className="flex gap-3 items-start text-sm">
              <div className="w-2 h-2 bg-primary rounded-full mt-1.5 flex-shrink-0" />
              <div>
                <span className="font-medium">{log.status.replace(/_/g,' ')}</span>
                {log.note && <span className="text-gray-400 ml-2">— {log.note}</span>}
                <div className="text-xs text-gray-400">{new Date(log.createdAt).toLocaleString()}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
