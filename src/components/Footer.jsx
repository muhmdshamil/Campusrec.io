import { Link } from 'react-router-dom';

  export default function Footer(){
  const year = new Date().getFullYear();
  return (
    <footer className="bg-gradient-to-br from-brand-700 to-brand-500 mt-10 text-white">
      <div className="container max-w-[var(--container)] mx-auto px-4 py-16">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="text-xl font-bold">Campus Recruitment</div>
            <div className="mt-2 text-white/90">Connect students with verified companies. Simple. Fast. Secure.</div>
          </div>

          <nav className="grid grid-cols-2 gap-2 text-white/90">
            <Link to="/login" className="hover:text-white">Login</Link>
            <Link to="/register" className="hover:text-white">Register</Link>
          </nav>

          <div className="flex items-center gap-4">
            <a href="#" aria-label="Twitter" className="p-2 rounded-full hover:bg-white/10">
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 5.92c-.77.34-1.6.57-2.47.68a4.28 4.28 0 0 0 1.88-2.37 8.56 8.56 0 0 1-2.72 1.04A4.27 4.27 0 0 0 12.1 8.3a12.1 12.1 0 0 1-8.79-4.46 4.27 4.27 0 0 0 1.32 5.7 4.25 4.25 0 0 1-1.93-.53v.05a4.27 4.27 0 0 0 3.43 4.18 4.28 4.28 0 0 1-1.92.07 4.27 4.27 0 0 0 3.99 2.96A8.56 8.56 0 0 1 2 18.41a12.08 12.08 0 0 0 6.54 1.92c7.85 0 12.14-6.5 12.14-12.14 0-.19-.01-.37-.02-.56A8.67 8.67 0 0 0 22 5.92Z"/>
              </svg>
            </a>
            <a href="#" aria-label="LinkedIn" className="p-2 rounded-full hover:bg-white/10">
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5ZM0 8h5v16H0V8Zm7.5 0h4.8v2.2h.07c.67-1.26 2.3-2.6 4.74-2.6 5.08 0 6.02 3.34 6.02 7.68V24h-5v-7.2c0-1.72-.03-3.94-2.4-3.94-2.41 0-2.78 1.87-2.78 3.81V24h-5V8Z"/>
              </svg>
            </a>
            <a href="#" aria-label="GitHub" className="p-2 rounded-full hover:bg-white/10">
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M12 .5C5.73.5.98 5.24.98 11.5c0 4.85 3.14 8.96 7.49 10.41.55.1.75-.24.75-.53 0-.26-.01-1.13-.02-2.05-3.05.66-3.7-1.29-3.7-1.29-.5-1.26-1.23-1.6-1.23-1.6-1-.68.08-.67.08-.67 1.11.08 1.7 1.14 1.7 1.14.98 1.68 2.57 1.2 3.2.92.1-.71.38-1.2.69-1.47-2.43-.28-4.99-1.21-4.99-5.38 0-1.19.43-2.16 1.14-2.92-.11-.28-.49-1.41.11-2.94 0 0 .92-.29 3.02 1.11a10.5 10.5 0 0 1 5.5 0c2.1-1.4 3.02-1.11 3.02-1.11.6 1.53.22 2.66.11 2.94.71.76 1.14 1.73 1.14 2.92 0 4.18-2.56 5.1-5 5.37.39.34.73 1.01.73 2.04 0 1.47-.01 2.66-.01 3.02 0 .29.2.63.75.53 4.35-1.45 7.49-5.56 7.49-10.41C23.02 5.24 18.27.5 12 .5Z" clipRule="evenodd"/>
              </svg>
            </a>
          </div>
        </div>

        <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-white/80">
          <div>© {year} Campus Recruitment. All rights reserved.</div>
          <div>Created by Campus Recruitment Team</div>
        </div>
      </div>
    </footer>
  );
}
