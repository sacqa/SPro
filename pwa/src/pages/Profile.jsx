import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, API } from '../context/AuthContext';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newAddr, setNewAddr] = useState({ label: 'Home', street: '', area: '', city: 'Dipalpur', isDefault: false });

  useEffect(() => {
    if (user) API.get('/users/addresses').then(r => setAddresses(r.data.addresses || [])).catch(() => {});
  }, [user]);

  const addAddress = async () => {
    if (!newAddr.street || !newAddr.area) return alert('Fill address fields');
    await API.post('/users/addresses', newAddr);
    const r = await API.get('/users/addresses');
    setAddresses(r.data.addresses || []);
    setShowAdd(false);
    setNewAddr({ label: 'Home', street: '', area: '', city: 'Dipalpur', isDefault: false });
  };

  if (!user) return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className="text-5xl mb-4">👤</div>
      <h2 className="text-xl font-bold">Sign in to continue</h2>
      <button onClick={() => navigate('/login')} className="btn-primary mt-4 px-8">Sign In</button>
      <button onClick={() => navigate('/register')} className="btn-outline mt-2 px-8">Create Account</button>
    </div>
  );

  return (
    <div className="px-4 py-4 max-w-md mx-auto">
      <div className="card p-5 mb-4 text-center">
        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3">
          {user.name[0].toUpperCase()}
        </div>
        <div className="font-bold text-lg">{user.name}</div>
        <div className="text-gray-500 text-sm">{user.phone}</div>
        {user.role === 'ADMIN' && <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full mt-1 inline-block">Admin</span>}
      </div>

      <div className="card p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold">Saved Addresses</h2>
          <button onClick={() => setShowAdd(!showAdd)} className="text-primary text-sm font-medium">+ Add</button>
        </div>
        {showAdd && (
          <div className="space-y-2 mb-3 p-3 bg-gray-50 rounded-lg">
            <input value={newAddr.label} onChange={e => setNewAddr({...newAddr, label: e.target.value})} className="input-field text-sm" placeholder="Label (Home/Work)" />
            <input value={newAddr.street} onChange={e => setNewAddr({...newAddr, street: e.target.value})} className="input-field text-sm" placeholder="Street / House No." />
            <input value={newAddr.area} onChange={e => setNewAddr({...newAddr, area: e.target.value})} className="input-field text-sm" placeholder="Area / Mohalla" />
            <input value={newAddr.city} onChange={e => setNewAddr({...newAddr, city: e.target.value})} className="input-field text-sm" placeholder="City" />
            <button onClick={addAddress} className="w-full btn-primary py-2 text-sm">Save Address</button>
          </div>
        )}
        {addresses.map(a => (
          <div key={a.id} className="flex items-start gap-3 py-2 border-b last:border-0">
            <span className="text-lg mt-0.5">📍</span>
            <div>
              <div className="text-sm font-medium">{a.label} {a.isDefault && <span className="text-xs bg-green-100 text-green-600 px-1 rounded">Default</span>}</div>
              <div className="text-xs text-gray-500">{a.street}, {a.area}, {a.city}</div>
            </div>
          </div>
        ))}
        {addresses.length === 0 && !showAdd && <div className="text-xs text-gray-400 text-center py-2">No addresses saved</div>}
      </div>

      <div className="card divide-y mb-4">
        <button onClick={() => navigate('/orders')} className="w-full text-left px-4 py-3 text-sm font-medium hover:bg-gray-50">📋 My Orders</button>
        <button onClick={() => navigate('/notifications')} className="w-full text-left px-4 py-3 text-sm font-medium hover:bg-gray-50">🔔 Notifications</button>
        <button onClick={() => window.open('https://wa.me/923337339009', '_blank')} className="w-full text-left px-4 py-3 text-sm font-medium hover:bg-gray-50">❓ Help & Support</button>
        <button onClick={logout} className="w-full text-left px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50">🚪 Logout</button>
      </div>
    </div>
  );
}
