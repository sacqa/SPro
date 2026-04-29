import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(phone, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white text-3xl font-bold mx-auto mb-3">S</div>
          <h1 className="text-2xl font-bold">Welcome to Speedo</h1>
          <p className="text-gray-500 text-sm mt-1">Fast delivery in Dipalpur</p>
        </div>
        <div className="card p-6">
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Phone Number</label>
              <input value={phone} onChange={e => setPhone(e.target.value)} className="input-field" placeholder="03xxxxxxxxx" required />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="input-field" placeholder="Your password" required />
            </div>
            {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">{error}</div>}
            <button type="submit" disabled={loading} className="w-full btn-primary py-3">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <div className="mt-4 text-center text-sm text-gray-500">
            Don't have an account? <Link to="/register" className="text-primary font-medium">Register</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
