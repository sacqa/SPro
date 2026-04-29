import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const API = axios.create({ baseURL: '/api' });

API.interceptors.request.use(cfg => {
  const token = localStorage.getItem('speedo_token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = async () => {
    const token = localStorage.getItem('speedo_token');
    if (!token) { setLoading(false); return; }
    try {
      const r = await API.get('/auth/me');
      setUser(r.data.user);
    } catch {
      localStorage.removeItem('speedo_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMe(); }, []);

  const login = async (phone, password) => {
    const r = await API.post('/auth/login', { phone, password });
    localStorage.setItem('speedo_token', r.data.tokens.access);
    setUser(r.data.user);
    return r.data;
  };

  const logout = () => {
    localStorage.removeItem('speedo_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, fetchMe, API }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
