import React, { useState, useEffect } from 'react';
import { API } from '../context/AuthContext';

export default function Categories() {
  const [cats, setCats] = useState([]);
  const [form, setForm] = useState({ name: '', slug: '', icon: '', sortOrder: 0 });
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const load = () => API.get('/admin/categories').then(r => setCats(r.data.categories || []));
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!form.name || !form.slug) return alert('Name and slug required');
    setSaving(true);
    try {
      await API.post('/admin/categories', form);
      setShowForm(false);
      setForm({ name: '', slug: '', icon: '', sortOrder: 0 });
      load();
    } finally { setSaving(false); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-bold">Categories</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary py-2 px-4 text-sm">+ Add Category</button>
      </div>
      {showForm && (
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm mb-4">
          <div className="grid lg:grid-cols-4 gap-3">
            <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="input-field text-sm" placeholder="Category name *" />
            <input value={form.slug} onChange={e => setForm({...form, slug: e.target.value})} className="input-field text-sm" placeholder="slug (e.g. dairy-eggs) *" />
            <input value={form.icon} onChange={e => setForm({...form, icon: e.target.value})} className="input-field text-sm" placeholder="Emoji icon 🥛" />
            <input value={form.sortOrder} onChange={e => setForm({...form, sortOrder: e.target.value})} type="number" className="input-field text-sm" placeholder="Sort order" />
          </div>
          <div className="flex gap-2 mt-3">
            <button onClick={save} disabled={saving} className="btn-primary py-2 px-5 text-sm">{saving ? 'Saving...' : 'Save'}</button>
            <button onClick={() => setShowForm(false)} className="btn-outline py-2 px-5 text-sm">Cancel</button>
          </div>
        </div>
      )}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs uppercase">
              <th className="px-4 py-3 text-left">Icon</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Slug</th>
              <th className="px-4 py-3 text-left">Sort</th>
              <th className="px-4 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {cats.map(c => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-2xl">{c.icon}</td>
                <td className="px-4 py-3 font-medium">{c.name}</td>
                <td className="px-4 py-3 text-gray-500 font-mono text-xs">{c.slug}</td>
                <td className="px-4 py-3">{c.sortOrder}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${c.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                    {c.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {cats.length === 0 && <div className="text-center py-10 text-gray-400 text-sm">No categories yet</div>}
      </div>
    </div>
  );
}
