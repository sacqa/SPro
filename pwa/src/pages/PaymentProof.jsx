import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { API } from '../context/AuthContext';

const METHODS = {
  JAZZCASH: { icon: '📱', name: 'JazzCash', number: '0300-1234567', title: 'Send to JazzCash' },
  EASYPAISA: { icon: '💚', name: 'EasyPaisa', number: '0300-7654321', title: 'Send to EasyPaisa' },
  BANK_TRANSFER: { icon: '🏦', name: 'HBL Bank', number: 'IBAN: PK36HABB0000123456789', title: 'Bank Transfer' },
};

export default function PaymentProof() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [txId, setTxId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(null);

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (!f.type.startsWith('image/')) return setError('Only image files allowed');
    if (f.size > 5 * 1024 * 1024) return setError('File too large (max 5MB)');
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setError('');
  };

  const submit = async () => {
    if (!file) return setError('Please upload payment screenshot');
    if (!txId.trim()) return setError('Enter transaction ID');
    setLoading(true);
    const fd = new FormData();
    fd.append('proof', file);
    fd.append('transactionId', txId);
    try {
      await API.post(`/orders/${orderId}/payment-proof`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      navigate('/orders', { state: { success: 'Payment proof submitted! Admin will verify shortly.' } });
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="px-4 py-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-1">Upload Payment Proof</h1>
      <p className="text-gray-500 text-sm mb-5">Admin will manually verify your payment</p>

      <div className="card p-4 mb-4 bg-purple-50 border border-primary/20">
        <h2 className="font-semibold text-sm mb-3 text-primary">Payment Instructions</h2>
        <div className="space-y-3">
          {Object.entries(METHODS).map(([key, m]) => (
            <div key={key} className="flex items-center gap-3">
              <span className="text-2xl">{m.icon}</span>
              <div>
                <div className="text-sm font-medium">{m.name}</div>
                <div className="text-xs text-gray-500 font-mono">{m.number}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-4 mb-4">
        <label className="block mb-2 text-sm font-medium">Payment Screenshot *</label>
        <label className={`border-2 border-dashed rounded-card p-6 flex flex-col items-center cursor-pointer transition-colors ${preview ? 'border-primary' : 'border-gray-300 hover:border-primary'}`}>
          {preview ? (
            <img src={preview} className="max-h-48 rounded-lg object-contain" alt="Preview" />
          ) : (
            <>
              <div className="text-3xl mb-2">📸</div>
              <div className="text-sm text-gray-500">Tap to upload screenshot</div>
              <div className="text-xs text-gray-400 mt-1">JPG, PNG up to 5MB</div>
            </>
          )}
          <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
        </label>
      </div>

      <div className="card p-4 mb-4">
        <label className="block mb-2 text-sm font-medium">Transaction ID *</label>
        <input value={txId} onChange={e => setTxId(e.target.value)} className="input-field" placeholder="e.g., TXN123456789" />
      </div>

      {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">{error}</div>}

      <button onClick={submit} disabled={loading} className="w-full btn-primary py-3">
        {loading ? 'Uploading...' : '✅ Submit Payment Proof'}
      </button>
    </div>
  );
}
