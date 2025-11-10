import CompanyNav from '../nav/CompanyNav.jsx';
import Footer from '../components/Footer.jsx';

export default function CompanyLayout({ children }){
  return (
    <div className="min-h-screen flex flex-col">
      <CompanyNav />
      <main className="flex-1 container max-w-[var(--container)] mx-auto px-4 py-8">{children}</main>
      <Footer />
    </div>
  );
}
