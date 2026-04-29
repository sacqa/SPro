import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { API } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const STATIC_BANNERS = [
  { id: 1, bg: 'from-purple-600 to-purple-800', title: 'Fresh Groceries', sub: 'Delivered in 40 mins', cta: 'Shop Now', route: '/speedmart' },
  { id: 2, bg: 'from-green-500 to-green-700', title: 'Pharmacy Orders', sub: 'Medicines at your door', cta: 'Order Now', route: '/pharmacy' },
  { id: 3, bg: 'from-blue-500 to-blue-700', title: 'SpeedSend', sub: 'Send parcels instantly', cta: 'Get Started', route: '/speedsend' },
];

const SERVICES = [
  { label: 'SpeedMart', desc: 'Groceries & Essentials', icon: '🛒', color: 'bg-purple-100', route: '/speedmart' },
  { label: 'Pharmacy', desc: 'Medicines & Health', icon: '💊', color: 'bg-green-100', route: '/pharmacy' },
  { label: 'SpeedSend', desc: 'Send a Parcel', icon: '📦', color: 'bg-blue-100', route: '/speedsend' },
  { label: 'Custom', desc: 'Any Custom Request', icon: '✏️', color: 'bg-orange-100', route: '/custom' },
];

function BannerSlider() {
  const navigate = useNavigate();
  const [idx, setIdx] = useState(0);
  const timer = useRef(null);

  useEffect(() => {
    timer.current = setInterval(() => setIdx(i => (i + 1) % STATIC_BANNERS.length), 4000);
    return () => clearInterval(timer.current);
  }, []);

  const prev = () => setIdx(i => (i - 1 + STATIC_BANNERS.length) % STATIC_BANNERS.length);
  const next = () => setIdx(i => (i + 1) % STATIC_BANNERS.length);

  return (
    <div className="relative overflow-hidden rounded-card mx-4 lg:mx-0">
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${idx * 100}%)` }}
      >
        {STATIC_BANNERS.map((b) => (
          <div
            key={b.id}
            className={`min-w-full h-44 lg:h-80 bg-gradient-to-r ${b.bg} flex items-center px-8 cursor-pointer`}
            onClick={() => navigate(b.route)}
          >
            <div className="text-white">
              <div className="text-2xl lg:text-4xl font-bold">{b.title}</div>
              <div className="text-sm lg:text-lg opacity-90 mt-1">{b.sub}</div>
              <button className="mt-3 bg-white text-primary text-sm font-semibold px-5 py-2 rounded-full">
                {b.cta}
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* Dots */}
      <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
        {STATIC_BANNERS.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            className={`h-1.5 rounded-full transition-all ${i === idx ? 'bg-white w-5' : 'bg-white/50 w-1.5'}`}
          />
        ))}
      </div>
      <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center text-xs shadow">◀</button>
      <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center text-xs shadow">▶</button>
    </div>
  );
}

function ProductCard({ product }) {
  const { add, update, items } = useCart();
  const cartItem = items.find(i => i.id === product.id);

  return (
    <div className="card p-3 flex flex-col">
      <div className="w-full h-28 bg-gray-50 rounded-lg mb-2 flex items-center justify-center overflow-hidden">
        {product.image
          ? <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-lg" />
          : <span className="text-4xl">🛒</span>
        }
      </div>
      <div className="text-xs text-gray-400 truncate">{product.category?.name}</div>
      <div className="text-sm font-semibold leading-tight line-clamp-2 mt-0.5 flex-1">{product.name}</div>
      {product.unit && <div className="text-xs text-gray-400">{product.unit}</div>}
      <div className="flex items-center justify-between mt-2">
        <div className="text-base font-bold text-primary">Rs. {product.price}</div>
        {cartItem ? (
          <div className="flex items-center gap-1">
            <button
              onClick={() => update(product.id, cartItem.qty - 1)}
              className="w-7 h-7 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm"
            >-</button>
            <span className="text-sm font-semibold w-5 text-center">{cartItem.qty}</span>
            <button
              onClick={() => update(product.id, cartItem.qty + 1)}
              className="w-7 h-7 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm"
            >+</button>
          </div>
        ) : (
          <button
            onClick={() => add({ ...product, price: Number(product.price) })}
            className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold shadow"
          >+</button>
        )}
      </div>
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [delivery, setDelivery] = useState('instant');
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    API.get('/products?featured=true&limit=8')
      .then(r => setProducts(r.data.products || []))
      .catch(() => {})
      .finally(() => setLoadingProducts(false));
    API.get('/categories')
      .then(r => setCategories(r.data.categories || []))
      .catch(() => {});
  }, []);

  return (
    <div className="pb-4">
      {/* Store status */}
      <div className="bg-amber-50 border-b border-amber-200 px-4 py-1.5 text-xs text-amber-700 text-center">
        ⏰ Store hours: 8:00 AM – 11:00 PM &nbsp;·&nbsp; <span className="text-green-600 font-semibold">Currently Open</span>
      </div>

      {/* Delivery mode */}
      <div className="px-4 py-3 flex gap-2">
        <button
          onClick={() => setDelivery('instant')}
          className={`flex-1 py-2.5 rounded-pill text-sm font-semibold flex items-center justify-center gap-1 border transition-all ${delivery === 'instant' ? 'bg-primary text-white border-primary' : 'bg-white text-gray-600 border-gray-200'}`}
        >⚡ Instant · 40 mins</button>
        <button
          onClick={() => setDelivery('scheduled')}
          className={`flex-1 py-2.5 rounded-pill text-sm font-semibold flex items-center justify-center gap-1 border transition-all ${delivery === 'scheduled' ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-600 border-gray-200'}`}
        >📅 Scheduled · 8–10 AM</button>
      </div>

      {/* Hero Banner */}
      <BannerSlider />

      {/* Services */}
      <div className="px-4 mt-5">
        <h2 className="font-bold text-base mb-3">Our Services</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {SERVICES.map(s => (
            <button
              key={s.label}
              onClick={() => navigate(s.route)}
              className="card p-4 flex flex-col items-start gap-2 active:scale-95 transition-transform text-left"
            >
              <div className={`w-10 h-10 ${s.color} rounded-xl flex items-center justify-center text-xl`}>{s.icon}</div>
              <div>
                <div className="font-semibold text-sm">{s.label}</div>
                <div className="text-xs text-gray-500">{s.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <div className="mt-5">
          <div className="px-4 flex items-center justify-between mb-3">
            <h2 className="font-bold text-base">Categories</h2>
            <button onClick={() => navigate('/speedmart')} className="text-primary text-sm font-medium">View All →</button>
          </div>
          <div className="flex gap-4 overflow-x-auto hide-scrollbar px-4 pb-1">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => navigate(`/speedmart?category=${cat.slug}`)}
                className="flex flex-col items-center gap-1.5 flex-shrink-0 active:scale-95 transition-transform"
              >
                <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center text-2xl border-2 border-purple-100">
                  {cat.icon || '🛍️'}
                </div>
                <span className="text-xs text-center w-16 leading-tight text-gray-600">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Featured Products */}
      <div className="mt-5 px-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-base">Featured Products</h2>
          <button onClick={() => navigate('/speedmart')} className="text-primary text-sm font-medium">View All →</button>
        </div>
        {loadingProducts ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[...Array(4)].map((_, i) => <div key={i} className="card h-52 animate-pulse bg-gray-100" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>

      {/* Promo Banner */}
      <div className="mx-4 mt-5 rounded-card overflow-hidden bg-gradient-to-r from-green-500 to-emerald-600 p-5 text-white">
        <div className="text-lg font-bold">🎉 Free Delivery</div>
        <div className="text-sm opacity-90">On your first order!</div>
        <button
          onClick={() => navigate('/speedmart')}
          className="mt-2 bg-white text-green-600 text-sm font-semibold px-4 py-1.5 rounded-full"
        >Shop Now</button>
      </div>

      {/* Daily Essentials */}
      <div className="mt-5 px-4">
        <h2 className="font-bold text-base mb-3">Daily Essentials</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: 'Dairy & Eggs', icon: '🥛', cat: 'dairy-eggs' },
            { label: 'Bakery', icon: '🍞', cat: 'bakery' },
            { label: 'Snacks', icon: '🍫', cat: 'snacks' },
            { label: 'Beverages', icon: '🧃', cat: 'beverages' },
          ].map(item => (
            <button
              key={item.label}
              onClick={() => navigate(`/speedmart?category=${item.cat}`)}
              className="card p-4 text-center active:scale-95 transition-transform"
            >
              <div className="text-3xl mb-2">{item.icon}</div>
              <div className="text-sm font-semibold">{item.label}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
