import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, API } from '../context/AuthContext';

export default function Pharmacy() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [form, setForm] = useState({ description: '', paymentMethod: 'JAZZCASH', notes: '' });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!user) return navigate('/login');
    if (!form.description) return alert('Describe medicines needed');
    setLoading(true);
    try {
      const r = await API.post('/orders', { type: 'PHARMACY', paymentMethod: form.paymentMethod, notes: form.notes, items: [{ name: 'Pharmacy Order', quantity: 1, price: 0 }] });
      if (file) {
        const fd = new FormData();
        fd.append('prescription', file);
        fd.append('description', form.description);
        await API.post(`/orders/${r.data.order.id}/prescription`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      navigate(`/order-confirmation/${r.data.order.id}`, { state: { order: r.data.order, whatsappUrl: r.data.whatsappUrl } });
    } finally { setLoading(false); }
  };

  return (
    <div className="px-4 py-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-1">Pharmacy Order 💊</h1>
      <p className="text-gray-500 text-sm mb-4">Describe your medicines. We'll source and deliver them.</p>
      <div className="space-y-4">
        <div className="card p-4">
          <label className="text-sm font-medium block mb-2">Medicines Required *</label>
          <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="input-field resize-none h-28" placeholder="e.g., Panadol 500mg x2, Brufen 400mg x10..." />
        </div>
        <div className="card p-4">
          <label className="text-sm font-medium block mb-2">Upload Prescription (Optional)</label>
          <label className="border-2 border-dashed border-gray-200 rounded-card p-4 flex flex-col items-center cursor-pointer hover:border-primary transition-colors">
            {file ? <span className="text-green-500 text-sm">✅ {file.name}</span> : <><span className="text-2xl">📋</span><span className="text-sm text-gray-400 mt-1">Upload prescription image</span></>}
            <input type="file" accept="image/*" onChange={e => setFile(e.target.files[0])} className="hidden" />
          </label>
        </div>
        <div className="card p-4 space-y-3">
          <div>
            <label className="text-sm font-medium block mb-1">Special Notes</label>
            <input value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} className="input-field" placeholder="Any special instructions..." />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Payment Method</label>
            <select value={form.paymentMethod} onChange={e => setForm({...form, paymentMethod: e.target.value})} className="input-field">
              <option value="JAZZCASH">JazzCash</option>
              <option value="EASYPAISA">EasyPaisa</option>
              <option value="BANK_TRANSFER">Bank Transfer</option>
            </select>
          </div>
        </div>
        <button onClick={submit} disabled={loading} className="w-full btn-primary py-3">
          {loading ? 'Placing...' : '📦 Place Pharmacy Order'}
        </button>
      </div>
    </div>
  );
}
