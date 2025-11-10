import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { FaGoogle, FaFacebook, FaLinkedin } from 'react-icons/fa';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import api from '../lib/api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Auth({ mode: initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode); // 'login' | 'register'
  const isLogin = mode === 'login';

  const { setToken, setUser } = useAuth();
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('STUDENT');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const title = useMemo(() => (isLogin ? 'Welcome Back!' : 'Create Account'), [isLogin]);
  const subtitle = useMemo(
    () => (isLogin ? 'To keep connected with us please login with your personal info' : 'It only takes a minute to get started'),
    [isLogin]
  );

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        const { data } = await api.post('/auth/login', { email, password });
        setToken(data.token); setUser(data.user);
        const r = data.user?.role;
        const to = r === 'COMPANY' ? '/company' : r === 'ADMIN' ? '/admin' : '/student';
        window.location.href = to;
      } else {
        const body = { name, email, password, role, companyName: role==='COMPANY' ? (companyName || name) : undefined };
        await api.post('/auth/register', body);
        // Go to login after successful registration
        window.location.href = '/login';
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-gray-50 px-4">
      <motion.div layout className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden grid md:grid-cols-2">
        {/* Left panel */}
        <div className="relative p-10 bg-gradient-to-br from-brand-600 to-brand-400 text-white">
          <h2 className="text-3xl font-extrabold">{title}</h2>
          <p className="mt-3 text-white/90 max-w-sm">{subtitle}</p>
          <div className="absolute -bottom-10 -left-10 w-52 h-52 bg-white/10 rounded-full" />
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full" />
          <button onClick={() => setMode(isLogin ? 'register' : 'login')} className="mt-10 inline-flex items-center justify-center px-6 py-2 rounded-full border border-white/50 hover:bg-white/10">
            {isLogin ? 'Create an account' : 'Sign in'}
          </button>
        </div>

        {/* Right panel */}
        <div className="p-10">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold">{isLogin ? 'Sign in' : 'Create Account'}</h3>
            {!isLogin && (
              <div className="flex gap-3 text-brand-600">
                <FaGoogle /> <FaFacebook /> <FaLinkedin />
              </div>
            )}
          </div>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {!isLogin && (
              <>
                <div className="grid sm:grid-cols-2 gap-3">
                  <label className="flex flex-col gap-1">
                    <span className="text-sm text-gray-700">Full name</span>
                    <input id="name" className="border rounded-md px-3 py-2" placeholder="Full name" value={name} onChange={e=>setName(e.target.value)} required />
                  </label>
                  <label className="flex flex-col gap-1">
                    <span className="text-sm text-gray-700">Role</span>
                    <select id="role" className="border rounded-md px-3 py-2" value={role} onChange={e=>setRole(e.target.value)}>
                      <option value="STUDENT">Student</option>
                      <option value="COMPANY">Company</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </label>
                </div>
                {role==='COMPANY' && (
                  <label className="flex flex-col gap-1">
                    <span className="text-sm text-gray-700">Company name</span>
                    <input id="companyName" className="w-full border rounded-md px-3 py-2" placeholder="Company name" value={companyName} onChange={e=>setCompanyName(e.target.value)} />
                  </label>
                )}
              </>
            )}
            <label className="flex flex-col gap-1">
              <span className="text-sm text-gray-700">Email</span>
              <input id="email" className="w-full border rounded-md px-3 py-2" placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm text-gray-700">Password</span>
              <div className="relative">
                <input
                  id="password"
                  className="w-full border rounded-md px-3 py-2 pr-10"
                  placeholder="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e=>setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700"
                  onClick={()=>setShowPassword(s=>!s)}
                >
                  {showPassword ? <FaEyeSlash/> : <FaEye/>}
                </button>
              </div>
            </label>
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <button disabled={loading} className="w-full bg-brand-600 text-white py-2 rounded-md">{loading ? 'Please wait...' : isLogin ? 'Login' : 'Sign up'}</button>
          </form>
          <p className="text-sm text-gray-600 mt-4">
            {isLogin ? (
              <>No account? <button className="text-brand-600" onClick={() => setMode('register')}>Register</button></>
            ) : (
              <>Have an account? <button className="text-brand-600" onClick={() => setMode('login')}>Login</button></>
            )}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
