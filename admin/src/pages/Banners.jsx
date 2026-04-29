import React, { useState, useEffect } from 'react';
import { API } from '../context/AuthContext';

export default function Banners() {
  const [banners, setBanners] = useState([]);
  const [form, setForm] = useState({ title: '', link: '', sortOrder: 0 });
  const [file, setFile] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = () => API.get('/admin/banners').then(r => setBanners(r.data.banners || []));
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!form.title || !file) return alert('Title and image required');
    setSaving(true);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    fd.append('image', file);
    try {
      await API.post('/admin/banners', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setShowForm(false);
      setFile(null);
      setForm({ title: '', link: '', sortOrder: 0 });
      load();
    } finally { setSaving(false); }
  };

  const del = async (id) => {
    if (!confirm('Delete this banner?')) return;
    await API.delete(`/admin/banners/${id}`);
    load();
  };

  const toggle = async (id, isActive) => {
    await API.put(`/admin/banners/${id}`, { isActive: !isActive });
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-bold">Banners</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary py-2 px-4 text-sm">+ Add Banner</button>
      </div>
      {showForm && (
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm mb-4">
          <div className="grid lg:grid-cols-3 gap-3 mb-3">
            <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="input-field text-sm" placeholder="Banner title *" />
            <input value={form.link} onChange={e => setForm({...form, link: e.target.value})} className="input-field text-sm" placeholder="Link URL (optional)" />
            <input type="number" value={form.sortOrder} onChange={e => setForm({...form, sortOrder: e.target.value})} className="input-field text-sm" placeholder="Sort order" />
          </div>
          <label className="flex items-center gap-2 border-2 border-dashed border-gray-200 rounded-lg p-3 cursor-pointer hover:border-primary transition-colors mb-3">
            {file ? <span className="text-green-500 text-sm">✅ {file.name}</span> : <><span className="text-xl">🖼️</span><span className="text-sm text-gray-400">Upload banner image *</span></>}
            <input type="file" accept="image/*" onChange={e => setFile(e.target.files[0])} className="hidden" />
          </label>
          <div className="flex gap-2">
            <button onClick={save} disabled={saving} className="btn-primary py-2 px-5 text-sm">{saving ? 'Uploading...' : 'Save Banner'}</button>
            <button onClick={() => setShowForm(false)} className="btn-outline py-2 px-5 text-sm">Cancel</button>
          </div>
        </div>
      )}
      <div className="grid lg:grid-cols-3 gap-4">
        {banners.map(b => (
          <div key={b.id} className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm">
            <div className="w-full h-36 bg-gray-100 flex items-center justify-center">
              <img src={b.image} alt={b.title} className="w-full h-full object-cover" onError={e => { e.target.style.display='none'; }} />
            </div>
            <div className="p-4">
              <div className="font-semibold text-sm">{b.title}</div>
              {b.link && <div className="text-xs text-primary mt-0.5 truncate">{b.link}</div>}
              <div className="flex gap-2 mt-3">
                <button onClick={() => toggle(b.id, b.isActive)} className={`text-xs px-2 py-1 rounded-full ${b.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {b.isActive ? 'Active' : 'Inactive'}
                </button>
                <button onClick={() => del(b.id)} className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-600 ml-auto">Delete</button>
              </div>
            </div>
          </div>
        ))}
        {banners.length === 0 && <div className="col-span-3 text-center py-12 text-gray-400 text-sm">No banners yet. Add one above.</div>}
      </div>
    </div>
  );
}
