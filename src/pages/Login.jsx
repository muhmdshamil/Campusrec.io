import { useState } from 'react';
import api from '../lib/api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login(){
  const { setToken, setUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      setToken(data.token);
      setUser(data.user);
      window.location.href = '/';
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="container max-w-[28rem] mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold mb-6">Login</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <input className="w-full border rounded-md px-3 py-2" placeholder="Email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
        <input className="w-full border rounded-md px-3 py-2" placeholder="Password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <button disabled={loading} className="w-full bg-brand-600 text-white py-2 rounded-md">{loading? 'Signing in...' : 'Login'}</button>
      </form>
      <p className="text-sm text-gray-600 mt-4">No account? <a className="text-brand-600" href="/register">Register</a></p>
    </div>
  );
}
