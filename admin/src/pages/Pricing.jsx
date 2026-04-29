import React, { useState, useEffect } from 'react';
import { API } from '../context/AuthContext';

export default function Pricing() {
  const [rules, setRules] = useState([]);
  const [editing, setEditing] = useState({});
  const [saving, setSaving] = useState(null);
  const [msg, setMsg] = useState('');

  const load = () => API.get('/admin/pricing').then(r => setRules(r.data.rules || []));
  useEffect(() => { load(); }, []);

  const save = async (id) => {
    if (!editing[id]) return;
    setSaving(id);
    try {
      await API.put(`/admin/pricing/${id}`, { value: editing[id] });
      setMsg('✅ Saved!');
      load();
      setTimeout(() => setMsg(''), 2000);
    } finally { setSaving(null); }
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-5">Pricing Rules</h1>
      {msg && <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm">{msg}</div>}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs uppercase">
              <th className="px-5 py-3 text-left">Rule</th>
              <th className="px-5 py-3 text-left">Key</th>
              <th className="px-5 py-3 text-left">Value (Rs.)</th>
              <th className="px-5 py-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {rules.map(r => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="px-5 py-4 font-medium">{r.label}</td>
                <td className="px-5 py-4 font-mono text-gray-500 text-xs">{r.key}</td>
                <td className="px-5 py-4">
                  <input
                    type="number"
                    defaultValue={Number(r.value)}
                    onChange={e => setEditing({...editing, [r.id]: e.target.value})}
                    className="input-field w-32 text-sm py-1.5"
                  />
                </td>
                <td className="px-5 py-4">
                  <button
                    onClick={() => save(r.id)}
                    disabled={saving === r.id || !editing[r.id]}
                    className="btn-primary py-1.5 px-4 text-xs disabled:opacity-50"
                  >
                    {saving === r.id ? 'Saving...' : 'Save'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
