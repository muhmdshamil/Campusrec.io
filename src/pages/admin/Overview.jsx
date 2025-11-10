import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAdminStats, getRecentUsers, getRecentJobs } from '@/services/adminService';
import StatCard from '@/components/admin/StatCard';
import DataTable from '@/components/admin/DataTable';

export default function Overview() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalJobs: 0,
    totalApplications: 0,
    approvedApplications: 0,
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsData, usersData, jobsData] = await Promise.all([
          getAdminStats(),
          getRecentUsers(),
          getRecentJobs(),
        ]);
        
        setStats(statsData);
        setRecentUsers(usersData);
        setRecentJobs(jobsData);
      } catch (err) {
        console.error('Error fetching admin data:', err);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const userColumns = [
    { key: 'name', title: 'Name' },
    { key: 'email', title: 'Email' },
    { 
      key: 'role', 
      title: 'Role',
      render: (value) => (
        <span className="capitalize">{value.toLowerCase()}</span>
      )
    },
    { 
      key: 'status', 
      title: 'Status',
      type: 'status'
    },
    { 
      key: 'createdAt', 
      title: 'Joined',
      type: 'date'
    },
  ];

  const jobColumns = [
    { key: 'title', title: 'Job Title' },
    { key: 'company.name', title: 'Company' },
    { 
      key: 'type', 
      title: 'Type',
      render: (value) => (
        <span className="capitalize">{value?.toLowerCase() || '-'}</span>
      )
    },
    { 
      key: 'status', 
      title: 'Status',
      type: 'status'
    },
    { 
      key: 'createdAt', 
      title: 'Posted',
      type: 'date'
    },
  ];

  const handleUserClick = (user) => {
    navigate(`/admin/users/${user.id}`);
  };

  const handleJobClick = (job) => {
    navigate(`/admin/jobs/${job.id}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Users" 
          value={stats.totalUsers} 
          icon="users"
          change={5.2} // This would come from your API
        />
        <StatCard 
          title="Total Jobs" 
          value={stats.totalJobs} 
          icon="jobs"
          change={12.7}
        />
        <StatCard 
          title="Applications" 
          value={stats.totalApplications} 
          icon="applications"
          change={8.3}
        />
        <StatCard 
          title="Approved" 
          value={stats.approvedApplications} 
          icon="approved"
          change={15.8}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <DataTable
          title="Recent Users"
          columns={userColumns}
          data={recentUsers}
          onRowClick={handleUserClick}
          emptyMessage="No users found"
        />

        {/* Recent Jobs */}
        <DataTable
          title="Recent Jobs"
          columns={jobColumns}
          data={recentJobs}
          onRowClick={handleJobClick}
          emptyMessage="No jobs found"
        />
      </div>

     
    </div>
  );
}
