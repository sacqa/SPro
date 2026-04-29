import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth, API } from '../context/AuthContext';

const PAYMENT_METHODS = [
  { id: 'JAZZCASH', label: 'JazzCash', icon: '📱', detail: '0300-1234567' },
  { id: 'EASYPAISA', label: 'EasyPaisa', icon: '💚', detail: '0300-7654321' },
  { id: 'BANK_TRANSFER', label: 'Bank Transfer', icon: '🏦', detail: 'HBL: 123456789' },
];

export default function Checkout() {
  const { items, total, count, clear } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    API.get('/users/addresses').then(r => {
      setAddresses(r.data.addresses || []);
      const def = r.data.addresses.find(a => a.isDefault);
      if (def) setSelectedAddress(def.id);
    }).catch(() => {});
  }, []);

  const deliveryFee = 50, serviceCharge = 20;
  const grandTotal = total + deliveryFee + serviceCharge;

  const placeOrder = async () => {
    if (!paymentMethod) return setError('Select payment method');
    setLoading(true);
    setError('');
    try {
      const orderItems = items.map(i => ({ name: i.name, quantity: i.qty, price: i.price, productId: i.id, image: i.image }));
      const r = await API.post('/orders', {
        type: 'SPEEDMART', addressId: selectedAddress || undefined,
        paymentMethod, notes, items: orderItems,
      });
      clear();
      navigate(`/order-confirmation/${r.data.order.id}`, { state: { order: r.data.order, whatsappUrl: r.data.whatsappUrl } });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
    } finally { setLoading(false); }
  };

  if (count === 0) return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className="text-6xl mb-4">🛒</div>
      <h2 className="text-xl font-bold">Your cart is empty</h2>
      <button onClick={() => navigate('/speedmart')} className="btn-primary mt-4">Browse Products</button>
    </div>
  );

  return (
    <div className="px-4 py-4 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Checkout</h1>

      {/* Items */}
      <div className="card p-4 mb-4">
        <h2 className="font-semibold mb-3">Order Items ({count})</h2>
        <div className="space-y-3">
          {items.map(item => (
            <div key={item.id} className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                {item.image ? <img src={item.image} className="w-full h-full object-cover rounded-lg" /> : '🛒'}
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium leading-tight">{item.name}</div>
                <div className="text-xs text-gray-500">Qty: {item.qty}</div>
              </div>
              <div className="text-sm font-bold text-primary">Rs. {(item.price * item.qty).toFixed(0)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Delivery Address */}
      <div className="card p-4 mb-4">
        <h2 className="font-semibold mb-3">Delivery Address</h2>
        {addresses.length === 0 ? (
          <button onClick={() => navigate('/profile')} className="text-primary text-sm">+ Add delivery address</button>
        ) : (
          <div className="space-y-2">
            {addresses.map(addr => (
              <label key={addr.id} className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer ${selectedAddress === addr.id ? 'border-primary bg-purple-50' : 'border-gray-200'}`}>
                <input type="radio" name="address" value={addr.id} checked={selectedAddress === addr.id} onChange={() => setSelectedAddress(addr.id)} className="mt-1" />
                <div>
                  <div className="text-sm font-medium">{addr.label}</div>
                  <div className="text-xs text-gray-500">{addr.street}, {addr.area}, {addr.city}</div>
                </div>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Payment Method */}
      <div className="card p-4 mb-4">
        <h2 className="font-semibold mb-3">Payment Method</h2>
        <div className="space-y-2">
          {PAYMENT_METHODS.map(m => (
            <label key={m.id} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer ${paymentMethod === m.id ? 'border-primary bg-purple-50' : 'border-gray-200'}`}>
              <input type="radio" name="payment" value={m.id} checked={paymentMethod === m.id} onChange={() => setPaymentMethod(m.id)} />
              <span className="text-xl">{m.icon}</span>
              <div>
                <div className="text-sm font-medium">{m.label}</div>
                <div className="text-xs text-gray-500">{m.detail}</div>
              </div>
            </label>
          ))}
        </div>
        <div className="mt-3 bg-amber-50 rounded-lg p-3 text-xs text-amber-700">
          ⚠️ No Cash on Delivery. You'll need to upload payment proof after placing your order.
        </div>
      </div>

      {/* Notes */}
      <div className="card p-4 mb-4">
        <h2 className="font-semibold mb-2">Special Instructions</h2>
        <textarea value={notes} onChange={e => setNotes(e.target.value)} className="input-field resize-none h-20" placeholder="Any special instructions..." />
      </div>

      {/* Summary */}
      <div className="card p-4 mb-4">
        <h2 className="font-semibold mb-3">Order Summary</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>Rs. {total.toFixed(0)}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Delivery Fee</span><span>Rs. {deliveryFee}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Service Charge</span><span>Rs. {serviceCharge}</span></div>
          <div className="border-t pt-2 flex justify-between font-bold text-base">
            <span>Total</span><span className="text-primary">Rs. {grandTotal.toFixed(0)}</span>
          </div>
        </div>
      </div>

      {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">{error}</div>}

      <button onClick={placeOrder} disabled={loading} className="w-full btn-primary py-4 text-base">
        {loading ? 'Placing Order...' : `Place Order · Rs. ${grandTotal.toFixed(0)}`}
      </button>
    </div>
  );
}
