import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';
import { FiEdit2, FiMail, FiPhone, FiMapPin, FiBriefcase, FiAward, FiUser, FiCalendar } from 'react-icons/fi';
import { BsLinkedin, BsGithub, BsGlobe } from 'react-icons/bs';

const StatCard = ({ value, label, icon: Icon }) => (
  <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
    <div className="flex items-center space-x-3">
      <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
        <Icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      </div>
    </div>
  </div>
);

const InfoItem = ({ icon: Icon, label, value, className = '' }) => (
  <div className={`flex items-start space-x-3 ${className}`}>
    <Icon className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      <p className="font-medium text-gray-900 dark:text-white">{value || 'Not specified'}</p>
    </div>
  </div>
);

export default function Profile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    education: '',
    skills: '',
    bio: '',
    linkedin: '',
    github: '',
    website: '',
    experience: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    profileImage: null,
    profileImageUrl: '',
    resume: null,
    resumeUrl: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    applications: 0,
    interviews: 0,
    offers: 0,
    skills: 0
  });

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        // Fetch user profile data from the API
        const response = await api.get('/student/profile');
        const userData = response.data;
        
        // Update form data with user's data
        setFormData(prev => ({
          ...prev,
          name: userData.name || user?.name || '',
          email: userData.email || user?.email || '',
          phone: userData.phone || '',
          location: userData.location || '',
          education: userData.education || '',
          skills: Array.isArray(userData.skills) ? userData.skills.join(', ') : (userData.skills || ''),
          bio: userData.bio || '',
          linkedin: userData.linkedin || '',
          github: userData.github || '',
          website: userData.website || '',
          experience: userData.experience || '',
          profileImageUrl: userData.profileImageUrl || '',
          resumeUrl: userData.resumeUrl || ''
        }));

        // Update stats if available, otherwise use default stats
        if (userData.stats) {
          setStats({
            applications: userData.stats.applications || 0,
            interviews: userData.stats.interviews || 0,
            offers: userData.stats.offers || 0,
            skills: userData.skills ? userData.skills.length : 0
          });
        } else {
          // Set default stats if not provided
          setStats({
            applications: 0,
            interviews: 0,
            offers: 0,
            skills: userData.skills ? userData.skills.length : 0
          });
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        // Fallback to basic user data from auth context
        setFormData(prev => ({
          ...prev,
          name: user?.name || '',
          email: user?.email || ''
        }));
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [user]);

  // Remove demo data effect

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (activeTab === 'password' && formData.newPassword !== formData.confirmPassword) {
      // toast.error('New passwords do not match');
      return;
    }

    try {
      if (activeTab === 'profile') {
        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name);
        formDataToSend.append('phone', formData.phone);
        formDataToSend.append('location', formData.location);
        formDataToSend.append('education', formData.education);
        formDataToSend.append('bio', formData.bio);
        formDataToSend.append('skills', formData.skills);
        formDataToSend.append('linkedin', formData.linkedin);
        formDataToSend.append('github', formData.github);
        formDataToSend.append('website', formData.website);
        formDataToSend.append('experience', formData.experience);
        
        if (formData.profileImage) {
          formDataToSend.append('profileImage', formData.profileImage);
        }
        if (formData.resume) {
          formDataToSend.append('resume', formData.resume);
        }
        await api.put('/student/profile', formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else if (activeTab === 'password') {
        await api.put('/auth/update', {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        });
      }

      setIsEditing(false);
      
      // Reset password fields after successful update
      if (activeTab === 'password') {
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      // toast.error(error.response?.data?.message || 'Failed to update profile');
    }
  };

  const handleSave = () => {
    // In a real app, you would save to the API here
    console.log('Saving profile:', formData);
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between">
            <div className="flex items-center space-x-6">
              <div className="relative group">
                <div className="w-32 h-32 rounded-2xl bg-white/10 backdrop-blur-sm border-2 border-white/20 overflow-hidden">
                  {formData.profileImage ? (
                    <img
                      src={URL.createObjectURL(formData.profileImage)}
                      alt={formData.name}
                      className="w-full h-full object-cover"
                    />
                  ) : formData.profileImageUrl ? (
                    <img
                      src={formData.profileImageUrl}
                      alt={formData.name}
                      className="w-full h-full object-cover"
                    />
                  ) : null}
                </div>
                {isEditing && (
                  <button className="absolute -bottom-2 -right-2 bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-full shadow-lg transition-all duration-200 transform hover:scale-110">
                    <FiEdit2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">{formData.name}</h1>
                
              </div>
            </div>
            <div className="mt-6 md:mt-0 flex space-x-3">
              {!isEditing ? (
                <>
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="px-5 py-2.5 bg-white text-indigo-600 hover:bg-indigo-50 rounded-lg font-medium flex items-center space-x-2 transition-colors"
                  >
                    <FiEdit2 className="w-4 h-4" />
                    <span>Edit Profile</span>
                  </button>
                </>
              ) : (
                <div className="flex space-x-3">
                  <button 
                    onClick={() => setIsEditing(false)}
                    className="px-5 py-2.5 bg-transparent text-white hover:bg-white/10 rounded-lg font-medium border border-white/20 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSubmit}
                    className="px-5 py-2.5 bg-white text-indigo-600 hover:bg-indigo-50 rounded-lg font-medium flex items-center space-x-2 transition-colors"
                  >
                    <span>Save Changes</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <StatCard value={stats.applications} label="Applications" icon={FiBriefcase} />
          <StatCard value={stats.interviews} label="Interviews" icon={FiCalendar} />
          <StatCard value={stats.offers} label="Offers" icon={FiAward} />
          <StatCard value={stats.skills} label="Skills" icon={FiUser} />
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('profile')}
                className={`${
                  activeTab === 'profile'
                    ? 'border-brand-500 text-brand-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
              >
                Profile Information
              </button>
              <button
                onClick={() => setActiveTab('password')}
                className={`${
                  activeTab === 'password'
                    ? 'border-brand-500 text-brand-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
              >
                Change Password
              </button>
            </nav>
          </div>

          {/* Profile Tab Content */}
          {activeTab === 'profile' && (
            <div className="p-6">
              <div className="space-y-6">
                {/* About Section */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">About Me</h2>
                  </div>
                  <div className="p-6">
                    {isEditing ? (
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        className="w-full h-32 p-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400"
                        placeholder="Tell us about yourself..."
                      />
                    ) : (
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        {formData.bio || 'No bio available.'}
                      </p>
                    )}
                  </div>

                {/* Experience Section */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Experience</h2>
                    {isEditing && (
                      <button className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300">
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div className="p-6">
                    {isEditing ? (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Position & Company</label>
                          <input
                            type="text"
                            name="experience"
                            value={formData.experience}
                            onChange={handleInputChange}
                            className="w-full p-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">{formData.experience || 'No experience added'}</h3>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Contact Information</h2>
                  </div>
                  <div className="p-6 space-y-4">
                    <InfoItem 
                      icon={FiMail} 
                      label="Email" 
                      value={formData.email}
                    />
                    
                    <InfoItem 
                      icon={FiPhone} 
                      label="Phone" 
                      value={isEditing ? (
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400"
                        />
                      ) : formData.phone}
                    />
                    
                    <InfoItem 
                      icon={FiMapPin} 
                      label="Location" 
                      value={isEditing ? (
                        <input
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400"
                        />
                      ) : formData.location}
                    />

                    <div className="pt-3 border-t border-gray-100 dark:border-gray-700">
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Social Links</h3>
                      <div className="space-y-3">
                        <InfoItem 
                          icon={BsLinkedin} 
                          label="LinkedIn" 
                          value={isEditing ? (
                            <input
                              type="text"
                              name="linkedin"
                              value={formData.linkedin}
                              onChange={handleInputChange}
                              className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400"
                              placeholder="https://linkedin.com/in/username"
                            />
                          ) : formData.linkedin ? (
                            <a href={`https://${formData.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline dark:text-indigo-400">
                              {formData.linkedin}
                            </a>
                          ) : 'Not specified'}
                        />
                        <InfoItem 
                          icon={BsGithub} 
                          label="GitHub" 
                          value={isEditing ? (
                            <input
                              type="text"
                              name="github"
                              value={formData.github}
                              onChange={handleInputChange}
                              className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400"
                              placeholder="https://github.com/username"
                            />
                          ) : formData.github ? (
                            <a href={`https://${formData.github}`} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline dark:text-indigo-400">
                              {formData.github}
                            </a>
                          ) : 'Not specified'}
                        />
                        <InfoItem 
                          icon={BsGlobe} 
                          label="Website" 
                          value={isEditing ? (
                            <input
                              type="text"
                              name="website"
                              value={formData.website}
                              onChange={handleInputChange}
                              className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400"
                              placeholder="https://yourwebsite.com"
                            />
                          ) : formData.website ? (
                            <a href={`https://${formData.website}`} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline dark:text-indigo-400">
                              {formData.website}
                            </a>
                          ) : 'Not specified'}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                </div>

                {/* Resume Upload */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Resume / CV</h2>
                  </div>
                  <div className="p-6">
                    {isEditing ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-center w-full">
                          <label 
                            htmlFor="resume-upload" 
                            className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                          >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                              </svg>
                              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                <span className="font-semibold">Click to upload</span> or drag and drop
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Any file type (MAX. 10MB)
                              </p>
                            </div>
                            <input 
                              id="resume-upload" 
                              name="resume" 
                              type="file" 
                              className="hidden" 
                              onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                  // Check file size (10MB max)
                                  const maxSize = 10 * 1024 * 1024; // 10MB in bytes
                                  if (file.size > maxSize) {
                                    alert('File size exceeds 10MB limit');
                                    return;
                                  }
                                  
                                  handleChange(e);
                                }
                              }}
                            />
                          </label>
                        </div>
                        {formData.resume && (
                          <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                            Selected file: {formData.resume.name || 'resume'}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center">
                          <svg className="w-8 h-8 text-gray-500 dark:text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                          </svg>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {formData.resume ? (formData.resume.name || 'Resume') : (formData.resumeUrl ? 'Resume' : 'No resume uploaded')}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {formData.resume ? 
                                `${formData.resume.name} • ${(formData.resume.size / 1024 / 1024).toFixed(1)} MB` : 
                                (formData.resumeUrl ? 'Uploaded resume available' : 'Upload your document to apply for jobs')}
                            </p>
                          </div>
                        </div>
                        {(formData.resume || formData.resumeUrl) && (
                          <a 
                            href={formData.resume ? URL.createObjectURL(formData.resume) : formData.resumeUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                          >
                            View
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Education & Skills */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Education</h2>
                    </div>
                    <div className="p-6">
                      {isEditing ? (
                        <textarea
                          name="education"
                          value={formData.education}
                          onChange={handleInputChange}
                          className="w-full h-32 p-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400"
                          placeholder="Your educational background..."
                        />
                      ) : (
                        <p className="text-gray-600 dark:text-gray-300">
                          {formData.education || 'No education information available.'}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Skills</h2>
                    </div>
                    <div className="p-6">
                      {isEditing ? (
                        <textarea
                          name="skills"
                          value={formData.skills}
                          onChange={handleInputChange}
                          className="w-full h-32 p-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400"
                          placeholder="Your skills (comma separated)..."
                        />
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {formData.skills ? (
                            formData.skills.split(',').map((skill, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300"
                              >
                                {skill.trim()}
                              </span>
                            ))
                          ) : (
                            <p className="text-gray-600 dark:text-gray-300">No skills added yet.</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Password Tab Content */}
          {activeTab === 'password' && (
            <div className="p-6">
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Change Password</h2>
                  </div>
                  <div className="p-6 space-y-6">
                    <div>
                      <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Current Password
                      </label>
                      <input
                        type="password"
                        id="current-password"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400"
                        placeholder="Enter current password"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        id="new-password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400"
                        placeholder="New password"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        id="confirm-password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400"
                        placeholder="Confirm new password"
                      />
                    </div>
                    
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={handleSubmit}
                        className="inline-flex justify-center py-2.5 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Update Password
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}