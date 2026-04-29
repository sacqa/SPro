import React, { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { API, useAuth } from '../context/AuthContext';

export default function OTP() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const refs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { fetchMe } = useAuth();
  const { userId, phone } = location.state || {};

  if (!userId) {
    navigate('/register', { replace: true });
    return null;
  }

  const handleChange = (i, val) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...otp];
    next[i] = val.slice(-1);
    setOtp(next);
    if (val && i < 5) refs.current[i + 1]?.focus();
  };

  const handleKey = (i, e) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) refs.current[i - 1]?.focus();
  };

  const submit = async () => {
    const code = otp.join('');
    if (code.length < 6) return setError('Enter 6-digit OTP');
    setLoading(true);
    setError('');
    try {
      const r = await API.post('/auth/verify-otp', { userId, otp: code });
      localStorage.setItem('speedo_token', r.data.tokens.access);
      await fetchMe();
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired OTP');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm card p-8 text-center">
        <div className="text-4xl mb-4">📱</div>
        <h1 className="text-xl font-bold">Verify Your Phone</h1>
        <p className="text-gray-500 text-sm mt-2 mb-6">
          OTP sent to <strong>{phone}</strong>
        </p>
        <div className="flex gap-2 justify-center mb-6">
          {otp.map((v, i) => (
            <input
              key={i}
              ref={el => refs.current[i] = el}
              value={v}
              onChange={e => handleChange(i, e.target.value)}
              onKeyDown={e => handleKey(i, e)}
              className="w-10 h-12 border-2 border-gray-200 rounded-lg text-center text-lg font-bold focus:border-primary outline-none transition-colors"
              maxLength={1}
              inputMode="numeric"
              autoComplete="one-time-code"
            />
          ))}
        </div>
        {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">{error}</div>}
        <button onClick={submit} disabled={loading} className="w-full btn-primary py-3">
          {loading ? 'Verifying...' : 'Verify OTP'}
        </button>
        <p className="text-xs text-gray-400 mt-4">
          💡 In dev mode, check backend console for the OTP
        </p>
      </div>
    </div>
  );
}
