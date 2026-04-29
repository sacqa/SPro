import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const NAV = [
  { to: '/', label: 'Home', icon: '🏠' },
  { to: '/speedmart', label: 'SpeedMart', icon: '🛒' },
  { to: '/pharmacy', label: 'Pharmacy', icon: '💊' },
  { to: '/speedsend', label: 'SpeedSend', icon: '📦' },
  { to: '/custom', label: 'Custom Orders', icon: '✏️' },
  { to: '/orders', label: 'Orders', icon: '📋' },
  { to: '/profile', label: 'Profile', icon: '👤' },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-brand-bg">
      {/* Desktop Header */}
      <header className="hidden lg:flex fixed top-0 left-0 right-0 h-16 bg-white shadow-sm z-50 items-center px-6 gap-4">
        <div className="flex items-center gap-3 w-60 flex-shrink-0">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">S</div>
          <span className="font-bold text-primary text-lg">Speedo</span>
          <span className="text-xs text-gray-500 border border-gray-200 rounded px-2 py-0.5">📍 Dipalpur</span>
        </div>
        <div className="flex-1">
          <input onClick={() => navigate('/search')} className="w-full bg-gray-100 rounded-full px-4 py-2 text-sm outline-none cursor-pointer" placeholder="Search for Fresh Food, Groceries..." readOnly />
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/notifications')} className="relative text-xl">🔔</button>
          <button onClick={() => navigate('/checkout')} className="relative text-xl">
            🛒{count > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">{count}</span>}
          </button>
          {user ? (
            <button onClick={() => navigate('/profile')} className="flex items-center gap-2 text-sm font-medium text-primary">👤 {user.name.split(' ')[0]}</button>
          ) : (
            <button onClick={() => navigate('/login')} className="btn-primary text-sm">Login</button>
          )}
        </div>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-16 bottom-0 w-60 bg-white border-r border-brand-border flex-col py-4 z-40">
        {NAV.map(n => (
          <NavLink key={n.to} to={n.to} end={n.to === '/'}
            className={({ isActive }) => `flex items-center gap-3 px-5 py-3 text-sm font-medium transition-colors ${isActive ? 'text-primary bg-purple-50 border-r-2 border-primary' : 'text-gray-600 hover:bg-gray-50'}`}>
            <span>{n.icon}</span>{n.label}
          </NavLink>
        ))}
        {user && <button onClick={logout} className="mt-auto mx-4 text-left px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg">🚪 Logout</button>}
      </aside>

      {/* Mobile Top Bar */}
      <header className="lg:hidden fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xs">S</div>
            <div>
              <div className="text-xs text-gray-500">Delivering to</div>
              <div className="text-sm font-semibold flex items-center gap-1">📍 Dipalpur <span className="text-gray-400">▾</span></div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/notifications')} className="relative text-lg">🔔</button>
          </div>
        </div>
        <div className="px-4 pb-3">
          <div onClick={() => navigate('/search')} className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2 cursor-pointer">
            <span className="text-gray-400 text-sm">🔍</span>
            <span className="text-gray-400 text-sm">Search for Fresh Food</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="lg:ml-60 lg:mt-16 mt-28 pb-20 lg:pb-6">
        <div className="lg:max-w-6xl lg:mx-auto lg:px-6">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-brand-border shadow-nav z-50 bottom-nav-safe">
        <div className="flex items-end justify-around px-2 py-1">
          {[
            { to: '/', icon: '🏠', label: 'Home' },
            { to: '/search', icon: '🔍', label: 'Search' },
            null, // center
            { to: '/checkout', icon: '🛒', label: 'Cart', badge: count },
            user ? { to: '/profile', icon: '👤', label: 'Profile' } : { to: '/login', icon: '👤', label: 'Login' },
          ].map((item, i) => {
            if (!item) return (
              <button key="center" onClick={() => navigate('/speedmart')} className="flex flex-col items-center -mt-5">
                <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center shadow-lg border-4 border-white">
                  <span className="text-white text-xl font-bold">⚡</span>
                </div>
              </button>
            );
            return (
              <NavLink key={item.to} to={item.to} end={item.to === '/'}
                className={({ isActive }) => `flex flex-col items-center py-1 px-2 text-xs relative ${isActive ? 'text-primary' : 'text-gray-500'}`}>
                <span className="text-xl relative">
                  {item.icon}
                  {item.badge > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px]">{item.badge}</span>}
                </span>
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
