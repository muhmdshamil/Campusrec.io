import AdminNav from '../nav/AdminNav.jsx';
import Footer from '../components/Footer.jsx';

export default function AdminLayout({ children }){
  return (
    <div className="min-h-screen flex flex-col">
      <AdminNav />
      <main className="flex-1 container max-w-[var(--container)] mx-auto px-4 py-8">{children}</main>
      <Footer />
    </div>
  );
}
