import { useState } from 'react';
import { FiDownload, FiX, FiCheck, FiXCircle, FiMail, FiPhone, FiUser, FiExternalLink } from 'react-icons/fi';

const ApplicationDetails = ({ application, onClose, onStatusChange }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  
  const handleStatusChange = async (status) => {
    try {
      setIsLoading(true);
      // Support status as string or object with message
      await onStatusChange(application.id, status);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'ACCEPTED': 'bg-green-100 text-green-800',
      'REJECTED': 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusMap[status] || 'bg-gray-100 text-gray-800'}`}>
        {application.status}
      </span>
    );
  };

const handleViewResume = async (url) => {
  try {
    console.log('Original URL:', url);
    
    if (!url) {
      alert('No resume URL found');
      return;
    }

    let viewUrl = url.trim();
    
    // Fix the specific case where localhost is incorrectly prepended
    if (viewUrl.startsWith('http://localhost:3001https')) {
      console.log('Fixing localhost URL...');
      viewUrl = 'https' + viewUrl.split('https')[1];
    }
    
    // For Cloudinary PDFs, use the direct URL with fl_attachment=false
    if (viewUrl.includes('cloudinary.com') && viewUrl.toLowerCase().endsWith('.pdf')) {
      // Remove any existing query parameters
      const baseUrl = viewUrl.split('?')[0];
      // Add fl_attachment=false to force view in browser
      viewUrl = `${baseUrl}?fl_attachment=false`;
      
      // Open directly in a new tab
      console.log('Opening Cloudinary PDF:', viewUrl);
      window.open(viewUrl, '_blank', 'noopener,noreferrer');
      return;
    }
    
    // For non-Cloudinary PDFs, use Google Docs Viewer
    if (viewUrl.toLowerCase().endsWith('.pdf')) {
      const googleDocsViewer = `https://docs.google.com/viewer?url=${encodeURIComponent(viewUrl)}&embedded=true`;
      console.log('Opening PDF with Google Docs Viewer:', googleDocsViewer);
      window.open(googleDocsViewer, '_blank', 'noopener,noreferrer');
      return;
    }
    
    // For all other files, open directly
    console.log('Opening URL:', viewUrl);
    window.open(viewUrl, '_blank', 'noopener,noreferrer');
    
  } catch (error) {
    console.error('Error viewing resume:', error);
    alert(`Could not open the resume: ${error.message || 'Invalid URL format'}`);
  }
};
  const handleDownloadResume = async (url) => {
    if (!url) return;
    
    setIsDownloading(true);
    try {
      // Clean up the URL first
      let downloadUrl = url.trim();
      
      // Fix the specific case where localhost is incorrectly prepended
      if (downloadUrl.startsWith('http://localhost:3001https')) {
        downloadUrl = 'https' + downloadUrl.split('https')[1];
      }
      
      // For Cloudinary URLs, ensure we're getting the original file
      if (downloadUrl.includes('cloudinary.com')) {
        // Remove any existing query parameters
        downloadUrl = downloadUrl.split('?')[0];
        // Add fl_attachment=true to force download
        downloadUrl += '?fl_attachment=true';
      }
      
      // Create a temporary anchor element
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      
      // Extract filename from URL or use a default name
      let filename = downloadUrl.split('/').pop().split('?')[0] || 'resume';
      
      // Ensure the filename has an extension
      if (!filename.includes('.')) {
        filename += '.pdf'; // Default to .pdf if no extension
      }
      
      // For direct downloads, use the download attribute
      if (downloadUrl.startsWith('blob:') || downloadUrl.startsWith('data:')) {
        link.setAttribute('download', filename);
      }
      
      // Append to body, click and remove
      document.body.appendChild(link);
      link.click();
      
      // Clean up after a short delay
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);
      }, 100);
      
    } catch (error) {
      console.error('Error downloading resume:', error);
      alert('Failed to download the resume. Please try right-clicking the link and selecting "Save link as..."');
    } finally {
      setIsDownloading(false);
    }
  };

  const isImageFile = (url) => {
    if (!url) return false;
    return ['.jpg', '.jpeg', '.png', '.gif'].some(ext => 
      url.toLowerCase().endsWith(ext)
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6 pb-4 border-b">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Application Details</h3>
              <div className="mt-1 text-gray-600">
                For: <span className="font-medium">{application.job.title}</span>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-1 -mr-2"
              disabled={isLoading}
            >
              <FiX className="h-6 w-6" />
            </button>
          </div>

          {/* Main Content */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Applicant Info */}
            <div className="md:col-span-1">
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="flex flex-col items-center">
                  <div className="h-20 w-20 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-2xl font-semibold mb-4">
                    {application.student.user.name.charAt(0).toUpperCase()}
                  </div>
                  <h4 className="text-lg font-semibold">{application.student.user.name}</h4>
                  <div className="mt-1 text-sm text-gray-500">{application.student.college || 'Student'}</div>
                  {getStatusBadge(application.status)}
                </div>

                <div className="mt-6 space-y-3">
                  <div className="flex items-center text-gray-700">
                    <FiMail className="mr-2 text-gray-500" />
                    <span className="truncate">{application.student.user.email}</span>
                  </div>
                  {application.student.phone && (
                    <div className="flex items-center text-gray-700">
                      <FiPhone className="mr-2 text-gray-500" />
                      <span>{application.student.phone}</span>
                    </div>
                  )}
                  {application.student.course && (
                    <div className="text-sm text-gray-600">
                      <div className="font-medium">Course</div>
                      <div>{application.student.course}</div>
                    </div>
                  )}
                  {application.student.graduationYear && (
                    <div className="text-sm text-gray-600">
                      <div className="font-medium">Graduation Year</div>
                      <div>{application.student.graduationYear}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Application Details */}
            <div className="md:col-span-2">
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-2">Cover Letter</h4>
                <div className="bg-gray-50 p-4 rounded-lg min-h-[100px] text-gray-700">
                  {application.coverLetter || 'No cover letter provided.'}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">Resume / CV</h4>
                {application.student?.resumeUrl ? (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="p-2 bg-brand-50 rounded-lg mr-3">
                          <svg className="h-6 w-6 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {application.student.resumeUrl.split('/').pop().split('?')[0] || 'Resume'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {application.student.resumeUrl.toLowerCase().endsWith('.pdf') ? 'PDF Document' : 'Document'}
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewResume(application.student.resumeUrl)}
                          className="p-2 text-gray-400 hover:text-gray-500 disabled:opacity-50"
                          title="View Resume"
                          disabled={isDownloading || !application.student?.resumeUrl}
                        >
                          <FiExternalLink className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDownloadResume(application.student.resumeUrl)}
                          className="p-2 text-gray-400 hover:text-gray-500 disabled:opacity-50"
                          title="Download Resume"
                          disabled={isDownloading || !application.student?.resumeUrl}
                        >
                          <FiDownload className={`h-5 w-5 ${isDownloading ? 'animate-pulse' : ''}`} />
                        </button>
                      </div>
                    </div>
                    
                    {/* PDF Preview */}
                    {application.student?.resumeUrl?.toLowerCase().endsWith('.pdf') && (
                      <div className="mt-4">
                        <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="text-center">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">PDF Document</h3>
                            <p className="mt-1 text-sm text-gray-500">Click the view button above to open the PDF</p>
                            <div className="mt-4">
                              <button
                                type="button"
                                onClick={() => handleViewResume(application.student.resumeUrl)}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
                              >
                                <FiExternalLink className="-ml-1 mr-2 h-5 w-5" />
                                Open PDF
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Image Preview */}
                    {isImageFile(application.student?.resumeUrl) && (
                      <div className="mt-4">
                        <div className="relative">
                          <img 
                            src={application.student.resumeUrl} 
                            alt="Resume Preview" 
                            className="w-full h-auto max-h-96 object-contain border rounded"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/placeholder-document.png';
                            }}
                          />
                        </div>
                      </div>
                    )}
                    
                    {/* Preview Modal for non-PDF files */}
                    {isPreviewing && previewUrl && (
                      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                        <div className="relative bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
                          <div className="sticky top-0 bg-white p-2 flex justify-between items-center border-b">
                            <h3 className="text-lg font-medium">Resume Preview</h3>
                            <button
                              onClick={() => setIsPreviewing(false)}
                              className="text-gray-400 hover:text-gray-600 p-1"
                              title="Close preview"
                            >
                              <FiX className="h-6 w-6" />
                            </button>
                          </div>
                          <div className="p-4">
                            <img 
                              src={previewUrl} 
                              alt="Resume Preview" 
                              className="w-full h-auto max-h-[70vh] object-contain mx-auto"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/placeholder-document.png';
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-lg text-gray-500">
                    No resume uploaded
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-4 border-t flex justify-end space-x-3">
            {application.status === 'PENDING' && (
              <>
                <button
                  type="button"
                  onClick={() => handleStatusChange('REJECTED')}
                  disabled={isLoading}
                  className="px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 flex items-center"
                >
                  <FiXCircle className="mr-2 h-4 w-4" />
                  Reject
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    const note = window.prompt('Add an optional interview message/details (time, link, etc.):', '');
                    await handleStatusChange({ status: 'INTERVIEW', message: note || '' });
                  }}
                  disabled={isLoading}
                  className="px-4 py-2 border border-blue-300 rounded-md shadow-sm text-sm font-medium text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 flex items-center"
                >
                  <FiMail className="mr-2 h-4 w-4" />
                  Invite to Interview
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusChange('ACCEPTED')}
                  disabled={isLoading}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 flex items-center"
                >
                  <FiCheck className="mr-2 h-4 w-4" />
                  Accept
                </button>
              </>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
              disabled={isLoading}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetails;
