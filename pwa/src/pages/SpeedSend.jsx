import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, API } from '../context/AuthContext';

export default function SpeedSend() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [form, setForm] = useState({ senderName: '', senderPhone: '', receiverName: '', receiverPhone: '', receiverAddress: '', packageType: 'Small', weight: 1, isFragile: false, paymentMethod: 'JAZZCASH' });
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!user) return navigate('/login');
    const required = ['senderName','senderPhone','receiverName','receiverPhone','receiverAddress'];
    if (required.some(k => !form[k])) return alert('Fill all required fields');
    setLoading(true);
    try {
      const { paymentMethod, ...speedSendDetails } = form;
      const r = await API.post('/orders', { type: 'SPEEDSEND', paymentMethod, speedSendDetails: { ...speedSendDetails, weight: parseFloat(speedSendDetails.weight) }, items: [{ name: `Parcel (${form.packageType})`, quantity: 1, price: 0 }] });
      navigate(`/order-confirmation/${r.data.order.id}`, { state: { order: r.data.order, whatsappUrl: r.data.whatsappUrl } });
    } finally { setLoading(false); }
  };

  const F = ({ label, field, type='text', placeholder='' }) => (
    <div>
      <label className="text-sm font-medium block mb-1">{label}</label>
      <input type={type} value={form[field]} onChange={e => setForm({...form, [field]: e.target.value})} className="input-field" placeholder={placeholder} />
    </div>
  );

  return (
    <div className="px-4 py-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-1">SpeedSend 📦</h1>
      <p className="text-gray-500 text-sm mb-4">Send parcels anywhere in Dipalpur</p>
      <div className="space-y-3">
        <div className="card p-4 space-y-3">
          <h2 className="font-semibold text-sm text-gray-700">Sender Details</h2>
          <F label="Sender Name *" field="senderName" placeholder="Your name" />
          <F label="Sender Phone *" field="senderPhone" placeholder="03xxxxxxxxx" />
        </div>
        <div className="card p-4 space-y-3">
          <h2 className="font-semibold text-sm text-gray-700">Receiver Details</h2>
          <F label="Receiver Name *" field="receiverName" placeholder="Receiver name" />
          <F label="Receiver Phone *" field="receiverPhone" placeholder="03xxxxxxxxx" />
          <F label="Receiver Address *" field="receiverAddress" placeholder="Full delivery address" />
        </div>
        <div className="card p-4 space-y-3">
          <h2 className="font-semibold text-sm text-gray-700">Package Details</h2>
          <div>
            <label className="text-sm font-medium block mb-1">Package Type</label>
            <select value={form.packageType} onChange={e => setForm({...form, packageType: e.target.value})} className="input-field">
              {['Small','Medium','Large','Extra Large'].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <F label="Weight (kg)" field="weight" type="number" placeholder="1" />
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.isFragile} onChange={e => setForm({...form, isFragile: e.target.checked})} className="w-4 h-4" />
            <span className="text-sm">⚠️ Fragile Package</span>
          </label>
        </div>
        <div className="card p-4">
          <label className="text-sm font-medium block mb-2">Payment Method</label>
          <select value={form.paymentMethod} onChange={e => setForm({...form, paymentMethod: e.target.value})} className="input-field">
            <option value="JAZZCASH">JazzCash</option>
            <option value="EASYPAISA">EasyPaisa</option>
            <option value="BANK_TRANSFER">Bank Transfer</option>
          </select>
        </div>
        <button onClick={submit} disabled={loading} className="w-full btn-primary py-3">
          {loading ? 'Placing...' : '📦 Place Delivery Order'}
        </button>
      </div>
    </div>
  );
}
