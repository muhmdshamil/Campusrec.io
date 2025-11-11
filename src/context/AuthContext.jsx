import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../lib/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));

  useEffect(() => {
    if (token) localStorage.setItem('token', token); else localStorage.removeItem('token');
  }, [token]);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        if (!token) { if (active) setUser(null); return; }
        const { data } = await api.get('/auth/me');
        if (active) setUser(data);
      } catch (e) {
        if (active) { setUser(null); setToken(null); }
      }
    })();
    return () => { active = false; };
  }, [token]);

  const value = useMemo(() => ({ user, setUser, token, setToken, logout: () => { setUser(null); setToken(null); } }), [user, token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
