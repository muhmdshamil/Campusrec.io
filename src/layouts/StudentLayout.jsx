import StudentNav from '../nav/StudentNav.jsx';
import Footer from '../components/Footer.jsx';

export default function StudentLayout({ children }){
  return (
    <div className="min-h-screen flex flex-col">
      <StudentNav />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
