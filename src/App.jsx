 import { Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import Auth from './pages/Auth.jsx';
import StudentLayout from './layouts/StudentLayout.jsx';
import CompanyLayout from './layouts/CompanyLayout.jsx';
import AdminLayout from './layouts/AdminLayout.jsx';
import StudentDashboard from './pages/student/Dashboard.jsx';
import Jobs from './pages/student/Jobs.jsx';
import Profile from './pages/student/Profile.jsx';
import CompanyDashboard from './pages/company/Dashboard.jsx';
import Applications from './pages/company/Applications.jsx';
import AdminOverview from './pages/admin/Overview.jsx';

export default function App(){
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace/>} />
      <Route path="/login" element={<Auth mode="login"/>} />
      <Route path="/register" element={<Auth mode="register"/>} />

      <Route path="/student" element={<StudentLayout><StudentDashboard/></StudentLayout>} />
      <Route path="/student/jobs" element={<StudentLayout><Jobs/></StudentLayout>} />
      <Route path="/student/profile" element={<StudentLayout><Profile/></StudentLayout>} />
      <Route path="/company" element={<CompanyLayout><CompanyDashboard/></CompanyLayout>} />
      <Route path="/company/applications" element={<CompanyLayout><Applications/></CompanyLayout>} />
      <Route path="/admin" element={<AdminLayout><AdminOverview/></AdminLayout>} />
    </Routes>
  );
}
