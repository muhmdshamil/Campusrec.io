import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function StudentNav(){
  const { logout } = useAuth();
  const onLogout = () => { logout(); window.location.href = '/login'; };
  const [open, setOpen] = useState(false);
  const location = useLocation();
  useEffect(() => { setOpen(false); }, [location.pathname, location.search, location.hash]);
  return (
    <header className="sticky top-0 z-20 bg-gradient-to-r from-brand-700 to-brand-500 text-white">
      <div className="px-6 h-16 flex items-center justify-between">
        <Link to="/student" className="font-bold text-xl">Campus • Student</Link>
        <nav className="hidden md:flex items-center gap-6">
          <NavLink to="/student" className={({isActive})=> isActive? 'font-medium' : 'hover:opacity-80'}>Home</NavLink>
          <NavLink 
            to="/student#about" 
            className={({isActive}) => isActive ? 'font-medium' : 'hover:opacity-80'}
            onClick={(e) => {
              if (window.location.pathname === '/student') {
                e.preventDefault();
                const aboutSection = document.getElementById('about');
                if (aboutSection) {
                  aboutSection.scrollIntoView({ behavior: 'smooth' });
                }
              }
            }}
          >
            {({ isActive }) => (
              <span className={isActive ? 'font-medium' : 'hover:opacity-80'}>
                About
              </span>
            )}
          </NavLink>
          <NavLink to="/student/jobs" className={({isActive})=> isActive? 'font-medium' : 'hover:opacity-80'}>Jobs</NavLink>
          <NavLink 
            to="/student#faq"
            onClick={(e) => {
              if (window.location.pathname === '/student') {
                e.preventDefault();
                const faqSection = document.getElementById('faq');
                if (faqSection) {
                  faqSection.scrollIntoView({ behavior: 'smooth' });
                }
              }
            }}
          >
            {({ isActive }) => (
              <span className={isActive ? 'font-medium' : 'hover:opacity-80'}>
                FAQ
              </span>
            )}
          </NavLink>
          <NavLink to="/student/profile" className={({isActive})=> isActive? 'font-medium' : 'hover:opacity-80'}>Profile</NavLink>
          <button onClick={onLogout} className="bg-black px-4 py-2">Logout</button>
        </nav>
        <button
          className="md:hidden inline-flex items-center justify-center p-2 rounded hover:bg-white/10"
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
      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white text-gray-900 border-t">
          <nav className="px-6 py-4 flex flex-col gap-4">
            <NavLink to="/student" className={({isActive})=> isActive? 'font-medium text-brand-700' : 'hover:opacity-80'} onClick={()=>setOpen(false)}>Home</NavLink>
            <Link 
              to="/student#about" 
              className={({isActive}) => isActive ? 'font-medium text-brand-700' : 'hover:opacity-80'}
              onClick={(e) => {
                setOpen(false);
                if (window.location.pathname === '/student') {
                  e.preventDefault();
                  setTimeout(() => {
                    const aboutSection = document.getElementById('about');
                    if (aboutSection) {
                      aboutSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }, 100);
                }
              }}
            >
              About
            </Link>
            <NavLink to="/student/jobs" className={({isActive})=> isActive? 'font-medium text-brand-700' : 'hover:opacity-80'} onClick={()=>setOpen(false)}>Jobs</NavLink>
            <NavLink 
              to="/student#faq" 
              className={({isActive}) => isActive ? 'font-medium text-brand-700' : 'hover:opacity-80'} 
              onClick={(e) => {
                setOpen(false);
                if (window.location.pathname === '/student') {
                  e.preventDefault();
                  setTimeout(() => {
                    const faqSection = document.getElementById('faq');
                    if (faqSection) {
                      faqSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }, 100);
                }
              }}
            >
              FAQ
            </NavLink>
            <NavLink to="/student/profile" className={({isActive})=> isActive? 'font-medium text-brand-700' : 'hover:opacity-80'} onClick={()=>setOpen(false)}>Profile</NavLink>
            <button onClick={()=>{ setOpen(false); onLogout(); }} className="mt-2 bg-brand-600 text-white px-4 py-2 rounded">Logout</button>
          </nav>
        </div>
      )}
    </header>
  );
}
