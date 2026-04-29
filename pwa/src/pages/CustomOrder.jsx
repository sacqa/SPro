import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, API } from '../context/AuthContext';

export default function CustomOrder() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [form, setForm] = useState({ description: '', budget: '', paymentMethod: 'JAZZCASH' });
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!user) return navigate('/login');
    if (!form.description) return alert('Describe your order');
    setLoading(true);
    try {
      const r = await API.post('/orders', {
        type: 'CUSTOM', paymentMethod: form.paymentMethod,
        customDetails: { description: form.description, budget: form.budget ? parseFloat(form.budget) : null },
        items: [{ name: 'Custom Order', quantity: 1, price: 0 }],
      });
      navigate(`/order-confirmation/${r.data.order.id}`, { state: { order: r.data.order, whatsappUrl: r.data.whatsappUrl } });
    } finally { setLoading(false); }
  };

  return (
    <div className="px-4 py-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-1">Custom Order ✏️</h1>
      <p className="text-gray-500 text-sm mb-4">Need anything specific? Tell us and we'll get it!</p>
      <div className="space-y-4">
        <div className="card p-4">
          <label className="text-sm font-medium block mb-2">What do you need? *</label>
          <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="input-field resize-none h-32" placeholder="Describe anything you need us to purchase or do..." />
        </div>
        <div className="card p-4">
          <label className="text-sm font-medium block mb-2">Budget (Optional)</label>
          <input type="number" value={form.budget} onChange={e => setForm({...form, budget: e.target.value})} className="input-field" placeholder="Rs. your budget" />
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
          {loading ? 'Placing...' : '✅ Submit Custom Order'}
        </button>
      </div>
    </div>
  );
}
