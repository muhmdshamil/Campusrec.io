import { useState } from 'react';
import api from '../lib/api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Register(){
  const { setToken, setUser } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('STUDENT');
  const [companyName, setCompanyName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const body = { name, email, password, role, companyName: role==='COMPANY'? (companyName || name) : undefined };
      const { data } = await api.post('/auth/register', body);
      setToken(data.token);
      setUser(data.user);
      window.location.href = '/';
    } catch (err) {
      setError(err?.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="container max-w-[32rem] mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold mb-6">Create account</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-3">
          <input className="border rounded-md px-3 py-2" placeholder="Full name" value={name} onChange={e=>setName(e.target.value)} required />
          <select className="border rounded-md px-3 py-2" value={role} onChange={e=>setRole(e.target.value)}>
            <option value="STUDENT">Student</option>
            <option value="COMPANY">Company</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>
        {role==='COMPANY' && (
          <input className="w-full border rounded-md px-3 py-2" placeholder="Company name" value={companyName} onChange={e=>setCompanyName(e.target.value)} />
        )}
        <input className="w-full border rounded-md px-3 py-2" placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
        <input className="w-full border rounded-md px-3 py-2" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <button disabled={loading} className="w-full bg-brand-600 text-white py-2 rounded-md">{loading? 'Creating...' : 'Register'}</button>
      </form>
      <p className="text-sm text-gray-600 mt-4">Have an account? <a className="text-brand-600" href="/login">Login</a></p>
    </div>
  );
}
