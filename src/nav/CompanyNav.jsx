import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function CompanyNav(){
  const { logout } = useAuth();
  const onLogout = () => { logout(); window.location.href = '/login'; };
  const [open, setOpen] = useState(false);
  const location = useLocation();
  useEffect(() => { setOpen(false); }, [location.pathname, location.search, location.hash]);
  return (
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b">
      <div className="container max-w-[var(--container)] mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/company" className="font-bold text-xl">Campus • Company</Link>
        <nav className="hidden md:flex items-center gap-6">
          <NavLink to="/company" className={({isActive})=> isActive? 'text-brand-600 font-medium' : 'hover:text-brand-600'}>Dashboard</NavLink>
          <NavLink to="/company/applications" className={({isActive})=> isActive? 'text-brand-600 font-medium' : 'hover:text-brand-600'}>Applications</NavLink>
          <button onClick={onLogout} className="text-white bg-gray-900 px-4 py-2">Logout</button>
        </nav>
        <button
          className="md:hidden inline-flex items-center justify-center p-2 rounded hover:bg-gray-100"
          onClick={() => setOpen(o=>!o)}
          aria-label="Toggle navigation"
          aria-expanded={open}
        >
          {open ? (
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>
      {open && (
        <div className="md:hidden bg-white text-gray-900 border-t">
          <nav className="container max-w-[var(--container)] mx-auto px-4 py-4 flex flex-col gap-4">
            <NavLink to="/company" className={({isActive})=> isActive? 'font-medium text-brand-700' : 'hover:text-brand-700'} onClick={()=>setOpen(false)}>Dashboard</NavLink>
            <NavLink to="/company/applications" className={({isActive})=> isActive? 'font-medium text-brand-700' : 'hover:text-brand-700'} onClick={()=>setOpen(false)}>Applications</NavLink>
            <button onClick={()=>{ setOpen(false); onLogout(); }} className="mt-2 bg-brand-600 text-white px-4 py-2 rounded">Logout</button>
          </nav>
        </div>
      )}
    </header>
  );
}
