import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '@/lib/axios';

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const { data } = await api.get('/api/applications/company');
        setApplications(data);
      } catch (err) {
        console.error('Error fetching applications:', err);
        setError('Failed to load applications. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  if (loading) return <div className="p-6">Loading applications...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Job Applications</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {applications.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No applications found.
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {applications.map((app) => (
              <Link
                key={app.id}
                to={`/company/applications/${app.id}`}
                className="block hover:bg-gray-50 transition-colors p-4"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {app.student?.user?.name || 'Unknown Student'}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Applied for {app.job?.title || 'a job'}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      app.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      app.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {app.status}
                    </span>
                    <svg className="w-5 h-5 text-gray-400 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
