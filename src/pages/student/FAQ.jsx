import React from 'react';

const FAQ = () => {
  const faqs = [
    {
      question: 'How do I apply for jobs?',
      answer: 'Navigate to the Jobs page, browse available positions, and click the "Apply" button on any job listing that interests you.'
    },
    {
      question: 'How can I update my profile?',
      answer: 'Go to your Profile page where you can edit your personal information, skills, and upload your resume.'
    },
    {
      question: 'How will I know if my application is successful?',
      answer: 'You will receive an email notification regarding the status of your application. You can also check the status in your Profile under "My Applications".'
    },
    {
      question: 'Can I apply to multiple jobs?',
      answer: 'Yes, you can apply to as many jobs as you are interested in and qualified for.'
    },
    {
      question: 'How do I prepare for interviews?',
      answer: 'We recommend reviewing the job description thoroughly, researching the company, and preparing to discuss your relevant skills and experiences.'
    }
  ];

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h1>
      <div className="space-y-6">
        {faqs.map((faq, index) => (
          <div key={index} className="border-b border-gray-200 pb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">{faq.question}</h3>
            <p className="text-gray-600">{faq.answer}</p>
          </div>
        ))}
      </div>
      <div className="mt-12 bg-blue-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Still have questions?</h2>
        <p className="text-gray-700 mb-4">If you can't find the answer to your question, please contact our support team.</p>
        <a 
          href="mailto:support@campusrecruitment.com" 
          className="inline-block bg-brand-600 text-white px-6 py-2 rounded-md hover:bg-brand-700 transition-colors"
        >
          Contact Support
        </a>
      </div>
    </div>
  );
};

export default FAQ;
