import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [phone, setPhone] = useState('03001234567');
  const [password, setPassword] = useState('Admin@123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try { await login(phone, password); navigate('/'); }
    catch (err) { setError(err.response?.data?.message || err.message || 'Login failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-white text-2xl font-black mx-auto mb-3">S</div>
          <h1 className="text-xl font-bold">Speedo Admin</h1>
          <p className="text-gray-400 text-sm mt-1">Management Console</p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Phone</label>
            <input value={phone} onChange={e => setPhone(e.target.value)} className="input-field" placeholder="03xxxxxxxxx" required />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="input-field" placeholder="Password" required />
          </div>
          {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">{error}</div>}
          <button type="submit" disabled={loading} className="w-full btn-primary py-3">{loading ? 'Signing in...' : 'Sign In'}</button>
        </form>
        <p className="text-xs text-gray-400 text-center mt-4">Default: 03001234567 / Admin@123</p>
      </div>
    </div>
  );
}
