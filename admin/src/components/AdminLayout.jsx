import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV = [
  { to: '/', label: 'Dashboard', icon: '📊', end: true },
  { to: '/orders', label: 'Orders', icon: '📦' },
  { to: '/products', label: 'Products', icon: '🛍️' },
  { to: '/categories', label: 'Categories', icon: '🗂️' },
  { to: '/banners', label: 'Banners', icon: '🖼️' },
  { to: '/customers', label: 'Customers', icon: '👥' },
  { to: '/pricing', label: 'Pricing Rules', icon: '💰' },
  { to: '/analytics', label: 'Analytics', icon: '📈' },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-56 bg-white shadow-lg flex flex-col transition-transform lg:translate-x-0 lg:static lg:shadow-none border-r border-gray-100 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-black text-sm">S</div>
          <div>
            <div className="font-bold text-sm text-primary">Speedo Admin</div>
            <div className="text-xs text-gray-400">{user?.name}</div>
          </div>
        </div>
        <nav className="flex-1 py-3 overflow-y-auto">
          {NAV.map(n => (
            <NavLink key={n.to} to={n.to} end={n.end}
              className={({ isActive }) => `flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors mx-2 rounded-lg ${isActive ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-50'}`}
              onClick={() => setSidebarOpen(false)}>
              <span>{n.icon}</span>{n.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-gray-100">
          <button onClick={() => { logout(); navigate('/login'); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg">
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3 lg:px-6">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-xl">☰</button>
          <h1 className="font-semibold text-gray-800 text-sm">Speedo Management Console</h1>
          <div className="ml-auto text-xs text-gray-400">👤 {user?.name} · Admin</div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
