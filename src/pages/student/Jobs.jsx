import { useEffect, useState, useRef } from 'react';
import { useLocation as useRouterLocation } from 'react-router-dom';
import api from '../../lib/api.js';
import { useAuth } from '../../context/AuthContext';

const Jobs = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [title, setTitle] = useState('');
  const [position, setPosition] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicationData, setApplicationData] = useState({
    name: '',
    email: '',
    phone: '',
    cv: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);
  const routerLocation = useRouterLocation();

  async function loadJobs(pTitle = title, pPosition = position, pLocation = location, updateURL = true) {
    // Update the state first
    const newTitle = pTitle !== undefined ? pTitle : title;
    const newPosition = pPosition !== undefined ? pPosition : position;
    const newLocation = pLocation !== undefined ? pLocation : location;
    
    setTitle(newTitle);
    setPosition(newPosition);
    setLocation(newLocation);
     
    setLoading(true);
    try {
      const q = `${newTitle} ${newPosition}`.trim();
      const { data } = await api.get('/jobs', { params: { q, location: newLocation } });
      setJobs(data);
      
      // Update URL with search parameters
      if (updateURL) {
        const params = new URLSearchParams();
        if (newTitle) params.set('title', newTitle);
        if (newPosition) params.set('position', newPosition);
        if (newLocation) params.set('location', newLocation);
        
        const newUrl = `${window.location.pathname}?${params.toString()}`;
        window.history.pushState({}, '', newUrl);
      }
    } finally { 
      setLoading(false); 
    }
  }

  const handleApplyClick = (job) => {
    setSelectedJob(job);
    // Pre-fill user data if available
    setApplicationData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      cv: null
    });
    setShowApplyModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setApplicationData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Check file size (10MB max)
      const maxSize = 10 * 1024 * 1024; // 10MB in bytes
      if (file.size > maxSize) {
        alert('File size exceeds 10MB limit');
        return;
      }
      
      setApplicationData(prev => ({
        ...prev,
        cv: file
      }));
    }
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    if (!selectedJob) return;

    // Validate form
    if (!applicationData.name || !applicationData.email) {
      alert('Please fill in all required fields');
      return;
    }

    if (!applicationData.cv) {
      alert('Please upload your CV');
      return;
    }

    setIsSubmitting(true);
    try {
      console.log('Starting file upload...');
      
      // Upload CV to Cloudinary
      const formData = new FormData();
      formData.append('resume', applicationData.cv);

      console.log('Sending file to server...');
      const uploadResponse = await api.post('/upload/resume', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Upload response:', uploadResponse.data);

      if (!uploadResponse.data.success) {
        throw new Error(uploadResponse.data.message || 'Failed to upload resume');
      }

      console.log('Submitting application...');
      // Submit application with resume URL from Cloudinary
      const applicationResponse = await api.post(`/applications/jobs/${selectedJob.id}/apply`, {
        name: applicationData.name,
        email: applicationData.email,
        phone: applicationData.phone,
        resumeUrl: uploadResponse.data.url,
      });

      console.log('Application response:', applicationResponse.data);
      alert('Application submitted successfully!');
      
      // Reset form and close modal
      setApplicationData({
        name: '',
        email: '',
        phone: '',
        cv: null,
      });
      setShowApplyModal(false);
      setSelectedJob(null);
    } catch (error) {
      console.error('Error submitting application:', error);
      alert(error?.response?.data?.message || 'Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => { loadJobs(); }, []);

  useEffect(() => {
    if (!routerLocation.search) return;
    const sp = new URLSearchParams(routerLocation.search);
    const t = sp.get('title') || '';
    const p = sp.get('position') || '';
    const l = sp.get('location') || '';
    setTitle(t);
    setPosition(p);
    setLocation(l);
    loadJobs(t, p, l);
  }, [routerLocation.search]);

  return (
    <>
      <div className="relative min-h-screen">
        <section className="relative overflow-hidden bg-gradient-to-r from-brand-700 to-brand-500 text-white">
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-white/10 rounded-full" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-white/10 rounded-full" />
          <div className="container max-w-[var(--container)] mx-auto px-6 py-10 md:py-14">
          <h1 className="text-3xl md:text-4xl font-extrabold">Find Your Next Role</h1>
          <p className="mt-2 text-white/90">Search thousands of verified jobs across companies and locations</p>
          <div className="mt-6 bg-white/95 backdrop-blur p-3 md:p-4 rounded-xl flex flex-col md:flex-row gap-3">
            <div className="flex items-center gap-2 flex-1 border rounded-lg px-3 py-2">
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" xmlns="http://www.w3.org/2000/svg"><path d="M21 21l-4.35-4.35"/><circle cx="10" cy="10" r="7"/></svg>
              <input 
                type="text"
                value={title || ''}
                onChange={e => setTitle(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && loadJobs()}
                placeholder="Job title, keywords" 
                className="flex-1 outline-none bg-transparent text-black"
              />
            </div>
            <div className="flex items-center gap-2 flex-1 border rounded-lg px-3 py-2">
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" xmlns="http://www.w3.org/2000/svg"><path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z"/><path d="M20 21a8 8 0 1 0-16 0"/></svg>
              <input 
                type="text"
                value={position || ''}
                onChange={e => setPosition(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && loadJobs()}
                placeholder="Job position" 
                className="flex-1 outline-none bg-transparent text-black"
              />
            </div>
            <div className="flex items-center gap-2 flex-1 border rounded-lg px-3 py-2">
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5Z"/></svg>
              <input 
                type="text"
                value={location || ''}
                onChange={e => setLocation(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && loadJobs()}
                placeholder="Location" 
                className="flex-1 outline-none bg-transparent text-black"
              />
            </div>
            <button 
              onClick={() => loadJobs()} 
              className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Search
            </button>
          </div>
        </div>
      </section>

      <section className="container max-w-[var(--container)] mx-auto px-6 py-8">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">{jobs.length} results</div>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {Array.from({length:6}).map((_,i)=> (
              <div key={i} className="rounded-2xl border bg-white p-5 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gray-200" />
                  <div className="h-4 w-1/2 bg-gray-200 rounded" />
                </div>
                <div className="mt-4 h-6 w-3/4 bg-gray-200 rounded" />
                <div className="mt-3 h-16 w-full bg-gray-200 rounded" />
                <div className="mt-4 h-9 w-24 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {jobs.map(j => (
              <div key={j.id} className="group bg-white p-5 rounded-2xl border shadow-sm hover:shadow-xl transition">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-semibold">
                      {(j.company?.name || 'C').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">{j.company?.name || 'Company'}</div>
                      <div className="text-xs text-gray-500">{j.location || 'Remote'}</div>
                    </div>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-brand-50 text-brand-700 border border-brand-100">{j.type || 'Full-time'}</span>
                </div>
                <h3 className="mt-4 text-lg font-semibold group-hover:text-brand-700">{j.title}</h3>
                <p className="mt-2 text-gray-600 line-clamp-3">{j.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-700">{j.location || 'Remote'}</span>
                    <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-700">Easy Apply</span>
                  </div>
                  <button 
                    onClick={() => handleApplyClick(j)} 
                    className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Apply
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        </section>
      </div>

      {/* Application Modal */}
      {showApplyModal && selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6 pb-4 border-b">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Apply for {selectedJob.title}</h3>
                  <p className="text-gray-600 mt-1">{selectedJob.company?.name || 'Company'}</p>
                </div>
                <button 
                  onClick={() => setShowApplyModal(false)}
                  className="text-gray-400 hover:text-gray-600 p-1 -mr-2"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleSubmitApplication} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={applicationData.name}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                      placeholder="Your full name"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={applicationData.email}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={applicationData.phone}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                      placeholder="+1 (555) 000-0000"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Resume/CV <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1">
                      <div className="flex items-center justify-between px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg">
                        <span className="text-sm text-gray-600 truncate">
                          {applicationData.cv ? applicationData.cv.name : 'No file chosen'}
                        </span>
                        <label className="ml-4 bg-white text-sm font-medium text-brand-600 hover:text-brand-500 cursor-pointer border border-gray-300 rounded-md px-3 py-1.5 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500">
                          Choose File
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="sr-only"
                            required={!applicationData.cv}
                          />
                        </label>
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        Any file type (Max. 10MB)
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="pt-2">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="terms"
                        name="terms"
                        type="checkbox"
                        className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-gray-300 rounded"
                        required
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="terms" className="font-medium text-gray-700">
                        I agree to the <a href="/terms" className="text-brand-600 hover:text-brand-500">Terms</a> and{' '}
                        <a href="/privacy" className="text-brand-600 hover:text-brand-500">Privacy Policy</a>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 flex justify-end space-x-3 border-t">
                  <button
                    type="button"
                    onClick={() => setShowApplyModal(false)}
                    className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-50 flex items-center justify-center min-w-[120px]"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Submitting...
                      </>
                    ) : 'Submit Application'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Jobs;
