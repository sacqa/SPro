import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { API } from '../context/AuthContext';

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const { add } = useCart();

  React.useEffect(() => {
    if (!query.trim()) return setResults([]);
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const r = await API.get('/products', { params: { search: query } });
        setResults(r.data.products || []);
      } finally { setLoading(false); }
    }, 400);
    return () => clearTimeout(t);
  }, [query]);

  return (
    <div className="px-4 py-4">
      <div className="flex items-center gap-2 bg-white rounded-full px-4 py-3 shadow-sm mb-4 border border-gray-200">
        <span className="text-gray-400">🔍</span>
        <input autoFocus value={query} onChange={e => setQuery(e.target.value)} className="flex-1 outline-none text-sm" placeholder="Search products, groceries..." />
        {query && <button onClick={() => setQuery('')} className="text-gray-400">✕</button>}
      </div>
      {loading && <div className="text-center text-gray-400 text-sm py-4">Searching...</div>}
      {results.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {results.map(p => (
            <div key={p.id} className="card p-3">
              <div className="h-24 bg-gray-100 rounded-lg flex items-center justify-center text-3xl mb-2">🛒</div>
              <div className="text-sm font-medium leading-tight line-clamp-2">{p.name}</div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm font-bold text-primary">Rs. {p.price}</span>
                <button onClick={() => add({ ...p, price: Number(p.price) })} className="w-7 h-7 bg-primary text-white rounded-full flex items-center justify-center text-lg">+</button>
              </div>
            </div>
          ))}
        </div>
      )}
      {!loading && query && results.length === 0 && <div className="text-center text-gray-400 py-8">No results for "{query}"</div>}
      {!query && <div className="text-center text-gray-400 py-8 text-sm">🔍 Search for groceries, medicines, and more</div>}
    </div>
  );
}
