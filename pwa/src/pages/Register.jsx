import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { API } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({ name: '', phone: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const r = await API.post('/auth/register', form);
      navigate('/otp', { state: { userId: r.data.userId, phone: form.phone } });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white text-3xl font-bold mx-auto mb-3">S</div>
          <h1 className="text-2xl font-bold">Create Account</h1>
          <p className="text-gray-500 text-sm mt-1">Join Speedo today</p>
        </div>
        <div className="card p-6">
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Full Name</label>
              <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="input-field" placeholder="Your full name" required />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Phone Number</label>
              <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="input-field" placeholder="03xxxxxxxxx" required />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Password</label>
              <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} className="input-field" placeholder="Min 6 characters" minLength={6} required />
            </div>
            {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">{error}</div>}
            <button type="submit" disabled={loading} className="w-full btn-primary py-3">{loading ? 'Creating...' : 'Create Account'}</button>
          </form>
          <div className="mt-4 text-center text-sm text-gray-500">
            Already have an account? <Link to="/login" className="text-primary font-medium">Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
