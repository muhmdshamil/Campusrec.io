import { useEffect, useState } from 'react';
import api from '../../lib/api.js';
import ApplicationDetails from './ApplicationDetails';
import { FiDownload, FiCheck, FiX, FiUser } from 'react-icons/fi';

export default function CompanyDashboard(){
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [jobs, setJobs] = useState([]);
  const [apps, setApps] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);

  async function postJob(e){
    e.preventDefault();
    try {
      await api.post('/jobs', { title, description, location });
      setTitle(''); setLocation(''); setDescription('');
      await Promise.all([loadJobs(), loadApplications()]);
    } catch (e) {
      alert(e?.response?.data?.message || 'Failed to post job');
    }
  }

  async function loadJobs(){
    const { data } = await api.get('/jobs');
    setJobs(data);
  }

  async function loadApplications(){
    try {
      const { data } = await api.get('/applications/company');
      setApps(data);
    } catch {}
  }

  async function setStatus(id, status) {
    try {
      // Support optional message (e.g., interview invite note)
      let payload = { status };
      if (typeof status === 'object' && status !== null) {
        // Backward-compat: if called with an object { status, message }
        payload = status;
      }
      await api.patch(`/applications/${id}`, payload);
      await loadApplications();
      return true;
    } catch (error) {
      console.error('Error updating application status:', error);
      return false;
    }
  }

  useEffect(()=>{ loadJobs(); loadApplications(); }, []);

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <section className="lg:col-span-2 bg-white p-6 rounded-xl shadow">
        <h1 className="font-semibold text-lg mb-4">Post a Job</h1>
        <form onSubmit={postJob} className="grid sm:grid-cols-2 gap-4">
          <input value={title} onChange={e=>setTitle(e.target.value)} className="border rounded-md px-3 py-2" placeholder="Title" required />
          <input value={location} onChange={e=>setLocation(e.target.value)} className="border rounded-md px-3 py-2" placeholder="Location" />
          <textarea value={description} onChange={e=>setDescription(e.target.value)} className="sm:col-span-2 border rounded-md px-3 py-2" rows="4" placeholder="Description" required/>
          <button className="sm:col-span-2 bg-brand-600 text-white py-2 rounded-md">Submit</button>
        </form>
        <h3 className="font-semibold mt-8 mb-3">My Jobs</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {jobs.map(j => (
            <div key={j.id} className="border rounded-lg p-4 bg-white">
              <div className="font-semibold">{j.title}</div>
              <div className="text-gray-500 text-sm">{j.location || 'Remote'}</div>
              <div className="mt-2 line-clamp-2 text-gray-600">{j.description}</div>
            </div>
          ))}
        </div>
      </section>
      <aside className="bg-white p-6 rounded-xl shadow">
        <h3 className="font-semibold">Applications</h3>
        <div className="mt-3 space-y-3 text-sm max-h-[28rem] overflow-auto">
          {apps.map(a => (
            <div 
              key={a.id} 
              className="border rounded-lg p-3 hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => setSelectedApp(a)}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-medium text-gray-900">{a.job.title}</div>
                  <div className="flex items-center text-sm text-gray-600 mt-1">
                    <FiUser className="mr-1.5 h-4 w-4 text-gray-400" />
                    {a.student.user.name}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{a.student.user.email}</div>
                </div>
                <div className="flex flex-col items-end">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    a.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                    a.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {a.status}
                  </span>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedApp(a);
                    }}
                    className="mt-2 text-xs text-brand-600 hover:text-brand-700"
                  >
                    View Details
                  </button>
                </div>
              </div>
              {a.resumeUrl && (
                <div className="mt-2 flex items-center text-xs text-gray-500">
                  <FiDownload className="mr-1 h-3 w-3" />
                  <span className="truncate">{a.resumeUrl.split('/').pop()}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </aside>

      {/* Application Details Modal */}
      {selectedApp && (
        <ApplicationDetails
          application={selectedApp}
          onClose={() => setSelectedApp(null)}
          onStatusChange={setStatus}
        />
      )}
    </div>
  );
}
