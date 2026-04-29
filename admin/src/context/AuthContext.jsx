import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);
export const API = axios.create({ baseURL: '/api' });
API.interceptors.request.use(cfg => {
  const token = localStorage.getItem('speedo_admin_token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('speedo_admin_token');
    if (token) {
      API.get('/auth/me').then(r => {
        if (r.data.user.role === 'ADMIN') setUser(r.data.user);
        else localStorage.removeItem('speedo_admin_token');
      }).catch(() => localStorage.removeItem('speedo_admin_token')).finally(() => setLoading(false));
    } else setLoading(false);
  }, []);

  const login = async (phone, password) => {
    const r = await API.post('/auth/login', { phone, password });
    if (r.data.user.role !== 'ADMIN') throw new Error('Admin access required');
    localStorage.setItem('speedo_admin_token', r.data.tokens.access);
    setUser(r.data.user);
  };

  const logout = () => { localStorage.removeItem('speedo_admin_token'); setUser(null); };
  return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>;
};
export const useAuth = () => useContext(AuthContext);
