import React, { useState, useEffect } from 'react';
import { API } from '../context/AuthContext';

// ─── PRODUCTS ───────────────────────────────────────────────────────────────
export function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', price: '', unit: '', categoryId: '', stock: 100, isFeatured: false });
  const [saving, setSaving] = useState(false);

  const load = () => {
    Promise.all([API.get('/admin/products'), API.get('/admin/categories')])
      .then(([p, c]) => { setProducts(p.data.products || []); setCategories(c.data.categories || []); })
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const save = async () => {
    if (!form.name || !form.price || !form.categoryId) return alert('Name, price, category required');
    setSaving(true);
    try {
      await API.post('/admin/products', form);
      setShowForm(false); setForm({ name: '', description: '', price: '', unit: '', categoryId: '', stock: 100, isFeatured: false }); load();
    } finally { setSaving(false); }
  };

  const toggle = async (id, isActive) => {
    await API.put(`/admin/products/${id}`, { isActive: !isActive }); load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-bold">Products <span className="text-gray-400 font-normal text-base">({products.length})</span></h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary py-2 px-4 text-sm">+ Add Product</button>
      </div>
      {showForm && (
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm mb-5">
          <h2 className="font-semibold mb-3">New Product</h2>
          <div className="grid lg:grid-cols-3 gap-3">
            <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="input-field text-sm" placeholder="Product name *" />
            <input value={form.price} onChange={e => setForm({...form, price: e.target.value})} type="number" className="input-field text-sm" placeholder="Price (Rs.) *" />
            <input value={form.unit} onChange={e => setForm({...form, unit: e.target.value})} className="input-field text-sm" placeholder="Unit (e.g. per kg)" />
            <select value={form.categoryId} onChange={e => setForm({...form, categoryId: e.target.value})} className="input-field text-sm">
              <option value="">Select Category *</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <input value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} type="number" className="input-field text-sm" placeholder="Stock" />
            <label className="flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-card cursor-pointer">
              <input type="checkbox" checked={form.isFeatured} onChange={e => setForm({...form, isFeatured: e.target.checked})} />
              <span className="text-sm">Featured Product</span>
            </label>
          </div>
          <input value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="input-field text-sm mt-3" placeholder="Description" />
          <div className="flex gap-2 mt-3">
            <button onClick={save} disabled={saving} className="btn-primary py-2 px-5 text-sm">{saving ? 'Saving...' : 'Save'}</button>
            <button onClick={() => setShowForm(false)} className="btn-outline py-2 px-5 text-sm">Cancel</button>
          </div>
        </div>
      )}
      {loading ? <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div> : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="bg-gray-50 text-gray-500 text-xs uppercase">
              <th className="px-4 py-3 text-left">Product</th>
              <th className="px-4 py-3 text-left">Category</th>
              <th className="px-4 py-3 text-left">Price</th>
              <th className="px-4 py-3 text-left">Stock</th>
              <th className="px-4 py-3 text-left">Featured</th>
              <th className="px-4 py-3 text-left">Status</th>
            </tr></thead>
            <tbody className="divide-y divide-gray-50">
              {products.map(p => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{p.name}<div className="text-xs text-gray-400">{p.unit}</div></td>
                  <td className="px-4 py-3 text-gray-500">{p.category?.name}</td>
                  <td className="px-4 py-3 font-semibold text-primary">Rs. {p.price}</td>
                  <td className="px-4 py-3">{p.stock}</td>
                  <td className="px-4 py-3">{p.isFeatured ? '⭐' : '—'}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggle(p.id, p.isActive)} className={`text-xs px-2 py-1 rounded-full font-medium ${p.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                      {p.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── CATEGORIES ─────────────────────────────────────────────────────────────
export function Categories() {
  const [cats, setCats] = useState([]);
  const [form, setForm] = useState({ name: '', slug: '', icon: '', sortOrder: 0 });
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const load = () => API.get('/admin/categories').then(r => setCats(r.data.categories || []));
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!form.name || !form.slug) return alert('Name and slug required');
    setSaving(true);
    try { await API.post('/admin/categories', form); setShowForm(false); setForm({ name: '', slug: '', icon: '', sortOrder: 0 }); load(); }
    finally { setSaving(false); }
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
          <thead><tr className="bg-gray-50 text-gray-500 text-xs uppercase">
            <th className="px-4 py-3 text-left">Icon</th>
            <th className="px-4 py-3 text-left">Name</th>
            <th className="px-4 py-3 text-left">Slug</th>
            <th className="px-4 py-3 text-left">Sort</th>
            <th className="px-4 py-3 text-left">Status</th>
          </tr></thead>
          <tbody className="divide-y divide-gray-50">
            {cats.map(c => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-2xl">{c.icon}</td>
                <td className="px-4 py-3 font-medium">{c.name}</td>
                <td className="px-4 py-3 text-gray-500 font-mono text-xs">{c.slug}</td>
                <td className="px-4 py-3">{c.sortOrder}</td>
                <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full ${c.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>{c.isActive ? 'Active' : 'Inactive'}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── BANNERS ────────────────────────────────────────────────────────────────
export function Banners() {
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
    try { await API.post('/admin/banners', fd, { headers: { 'Content-Type': 'multipart/form-data' } }); setShowForm(false); load(); }
    finally { setSaving(false); }
  };

  const del = async (id) => {
    if (!confirm('Delete this banner?')) return;
    await API.delete(`/admin/banners/${id}`); load();
  };

  const toggle = async (id, isActive) => { await API.put(`/admin/banners/${id}`, { isActive: !isActive }); load(); };

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
            <img src={b.image} alt={b.title} className="w-full h-36 object-cover bg-gray-100" onError={e => { e.target.style.display = 'none'; }} />
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
      </div>
    </div>
  );
}

// ─── CUSTOMERS ──────────────────────────────────────────────────────────────
export function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { API.get('/admin/customers').then(r => setCustomers(r.data.customers || [])).finally(() => setLoading(false)); }, []);

  return (
    <div>
      <h1 className="text-xl font-bold mb-5">Customers <span className="text-gray-400 font-normal text-base">({customers.length})</span></h1>
      {loading ? <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div> : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="bg-gray-50 text-gray-500 text-xs uppercase">
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Phone</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Orders</th>
              <th className="px-4 py-3 text-left">Joined</th>
              <th className="px-4 py-3 text-left">Status</th>
            </tr></thead>
            <tbody className="divide-y divide-gray-50">
              {customers.map(c => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{c.name}</td>
                  <td className="px-4 py-3 text-primary">{c.phone}</td>
                  <td className="px-4 py-3 text-gray-500">{c.email || '—'}</td>
                  <td className="px-4 py-3">{c._count?.orders || 0}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{new Date(c.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full ${c.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>{c.isActive ? 'Active' : 'Inactive'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── PRICING ────────────────────────────────────────────────────────────────
export function Pricing() {
  const [rules, setRules] = useState([]);
  const [editing, setEditing] = useState({});
  const [saving, setSaving] = useState(null);

  useEffect(() => { API.get('/admin/pricing').then(r => setRules(r.data.rules || [])); }, []);

  const save = async (id) => {
    setSaving(id);
    try { await API.put(`/admin/pricing/${id}`, { value: editing[id] }); API.get('/admin/pricing').then(r => setRules(r.data.rules || [])); }
    finally { setSaving(null); }
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-5">Pricing Rules</h1>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="bg-gray-50 text-gray-500 text-xs uppercase">
            <th className="px-5 py-3 text-left">Rule</th>
            <th className="px-5 py-3 text-left">Key</th>
            <th className="px-5 py-3 text-left">Current Value (Rs.)</th>
            <th className="px-5 py-3 text-left">Action</th>
          </tr></thead>
          <tbody className="divide-y divide-gray-50">
            {rules.map(r => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="px-5 py-4 font-medium">{r.label}</td>
                <td className="px-5 py-4 font-mono text-gray-500 text-xs">{r.key}</td>
                <td className="px-5 py-4">
                  <input type="number" defaultValue={r.value} onChange={e => setEditing({...editing, [r.id]: e.target.value})} className="input-field w-32 text-sm py-1.5" />
                </td>
                <td className="px-5 py-4">
                  <button onClick={() => save(r.id)} disabled={saving === r.id || !editing[r.id]} className="btn-primary py-1.5 px-4 text-xs disabled:opacity-50">
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

// ─── ANALYTICS ──────────────────────────────────────────────────────────────
export function Analytics() {
  const [data, setData] = useState(null);
  useEffect(() => { API.get('/admin/analytics').then(r => setData(r.data)).catch(() => {}); }, []);

  return (
    <div>
      <h1 className="text-xl font-bold mb-5">Analytics</h1>
      <div className="grid lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <h2 className="font-semibold mb-4">Orders by Type</h2>
          {data?.byType?.map(t => (
            <div key={t.type} className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span>{t.type === 'SPEEDMART' ? '🛒' : t.type === 'PHARMACY' ? '💊' : t.type === 'SPEEDSEND' ? '📦' : '✏️'}</span>
                <span className="text-sm font-medium">{t.type}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${Math.min(100, (t._count / (data.byType.reduce((s,x) => s + x._count, 0) || 1)) * 100)}%` }} />
                </div>
                <span className="text-sm font-bold text-primary w-8 text-right">{t._count}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <h2 className="font-semibold mb-4">Orders by Status</h2>
          {data?.byStatus?.map(s => (
            <div key={s.status} className="flex items-center justify-between mb-2 text-sm">
              <span className="text-gray-600">{s.status.replace(/_/g,' ')}</span>
              <span className="font-bold text-primary">{s._count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Products;
