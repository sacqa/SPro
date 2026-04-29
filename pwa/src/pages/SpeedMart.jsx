import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { API } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

function ProductCard({ product }) {
  const { add, update, items } = useCart();
  const cartItem = items.find(i => i.id === product.id);
  return (
    <div className="card p-3 flex flex-col">
      <div className="w-full h-28 bg-gray-100 rounded-lg mb-2 flex items-center justify-center text-4xl overflow-hidden">
        {product.image
          ? <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-lg" />
          : '🛒'}
      </div>
      <div className="text-xs text-gray-400 truncate">{product.category?.name}</div>
      <div className="text-sm font-semibold leading-tight line-clamp-2 mt-0.5 flex-1">{product.name}</div>
      {product.unit && <div className="text-xs text-gray-400">{product.unit}</div>}
      <div className="flex items-center justify-between mt-2">
        <div className="text-sm font-bold text-primary">Rs. {product.price}</div>
        {cartItem ? (
          <div className="flex items-center gap-1">
            <button onClick={() => update(product.id, cartItem.qty - 1)} className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">-</button>
            <span className="text-xs font-semibold w-4 text-center">{cartItem.qty}</span>
            <button onClick={() => update(product.id, cartItem.qty + 1)} className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">+</button>
          </div>
        ) : (
          <button onClick={() => add({ ...product, price: Number(product.price) })} className="w-7 h-7 bg-primary text-white rounded-full flex items-center justify-center text-lg font-bold shadow">+</button>
        )}
      </div>
    </div>
  );
}

export default function SpeedMart() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const { count, total: cartTotal } = useCart();

  useEffect(() => {
    API.get('/categories').then(r => setCategories(r.data.categories || [])).catch(() => {});
  }, []);

  useEffect(() => {
    fetchProducts(1);
    setPage(1);
  }, [activeCategory, search]);

  const fetchProducts = async (p) => {
    setLoading(true);
    const params = { page: p, limit: 12 };
    if (activeCategory !== 'all') params.category = activeCategory;
    if (search) params.search = search;
    try {
      const r = await API.get('/products', { params });
      if (p === 1) setProducts(r.data.products || []);
      else setProducts(prev => [...prev, ...(r.data.products || [])]);
      setTotal(r.data.total || 0);
    } finally { setLoading(false); }
  };

  const loadMore = () => {
    const next = page + 1;
    setPage(next);
    fetchProducts(next);
  };

  return (
    <div className="pb-4">
      <div className="bg-white px-4 py-3 sticky top-28 lg:top-16 z-30 shadow-sm">
        <div className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-2 mb-3">
          <span className="text-gray-400 text-sm">🔍</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-transparent text-sm flex-1 outline-none"
            placeholder="Search products..."
          />
          {search && <button onClick={() => setSearch('')} className="text-gray-400 text-xs">✕</button>}
        </div>
        <div className="flex gap-2 overflow-x-auto hide-scrollbar">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-1.5 rounded-pill text-sm font-medium flex-shrink-0 transition-all ${activeCategory === 'all' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}`}
          >All</button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.slug)}
              className={`px-4 py-1.5 rounded-pill text-sm font-medium flex-shrink-0 transition-all ${activeCategory === cat.slug ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}`}
            >{cat.icon} {cat.name}</button>
          ))}
        </div>
      </div>

      <div className="px-4 pt-4">
        {loading && page === 1 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[...Array(8)].map((_, i) => <div key={i} className="card p-3 h-52 animate-pulse bg-gray-100" />)}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 text-gray-400">No products found</div>
        ) : (
          <>
            <div className="text-sm text-gray-500 mb-3">{total} products</div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {products.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
            {products.length < total && (
              <button onClick={loadMore} disabled={loading} className="w-full mt-4 py-3 btn-outline">
                {loading ? 'Loading...' : `View More (${total - products.length} remaining)`}
              </button>
            )}
          </>
        )}
      </div>

      {/* Cart sticky bar */}
      {count > 0 && (
        <div className="fixed bottom-20 lg:bottom-6 left-4 right-4 z-40">
          <button
            onClick={() => navigate('/checkout')}
            className="w-full bg-primary text-white font-semibold py-3.5 rounded-card shadow-lg flex items-center justify-between px-5"
          >
            <span className="bg-white/20 px-2 py-0.5 rounded text-sm">{count} items</span>
            <span>View Cart</span>
            <span className="font-bold">Rs. {cartTotal.toFixed(0)}</span>
          </button>
        </div>
      )}
    </div>
  );
}
