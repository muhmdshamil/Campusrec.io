import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import s3png from '../../assets/user/s3.png';
import motta from '../../assets/user/you.png';
import ab from '../../assets/about/ab.jpg';



export default function StudentDashboard(){
  const [q, setQ] = useState('');
  const [location, setLocation] = useState('');
  const [keyword, setKeyword] = useState('');
  const [carouselIdx, setCarouselIdx] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);
  const navigate = useNavigate();
  const studentImages = [
    motta,
    s3png,
  ];

  const testimonials = [
    { name: 'Abid Cherukalan', date: 'Apr 2025', text: 'Designer ornaments and lightweight collection.', avatar: motta },
    { name: 'Mohamed Shakir', date: 'Dec 2024', text: 'Variety collections of gold and diamond. Best in town.', avatar: s3png },
    { name: 'Fathima Nayeema C', date: 'Nov 2024', text: 'Very good and varied collections.', avatar: motta },
    { name: 'Irshad Rahman', date: 'Sep 2024', text: 'Amazing collection and friendly staff.', avatar: s3png },
    { name: 'Nishad Rahman', date: 'Aug 2024', text: 'Good collection.', avatar: motta },
    { name: 'Asnifa K', date: 'Jul 2024', text: 'This has been our family’s go-to store for years.', avatar: s3png },
    { name: 'Shifin N', date: 'Jun 2024', text: 'Very good atmosphere and comfortable service.', avatar: motta },
    { name: 'Niyas MK', date: 'Feb 2024', text: 'Spacious showroom, great collection, friendly staff.', avatar: s3png },
  ];
  
  const faqs = [
    {
      q: 'How do I create an employer account?',
      a: 'Go to Register, choose Company, fill in your details, and our team will verify your account within 24 hours.'
    },
    {
      q: 'How do I start hiring?',
      a: 'Post a job with your requirements. You will start receiving relevant candidates soon after verification.'
    },
    {
      q: 'How do you ensure only matching candidates contact me?',
      a: 'We use profile signals and filters (skills, experience, location) so only suitable candidates can apply or contact.'
    },
    {
      q: 'When will I start receiving candidate responses?',
      a: 'Typically within hours of posting. High-demand roles may receive responses even faster.'
    },
    {
      q: 'What types of payment do you accept?',
      a: 'We support major cards, UPI, and bank transfers. Contact support for invoicing options.'
    },
    {
      q: 'What types of payment do you accept?',
      a: 'We support major cards, UPI, and bank transfers. Contact support for invoicing options.'
    },
  ];

  function goToJobs(){
    const params = new URLSearchParams();
    if (q) params.set('title', q);
    if (keyword) params.set('position', keyword);
    if (location) params.set('location', location);
    navigate(`/student/jobs${params.toString() ? `?${params.toString()}` : ''}`);
  }

  useEffect(() => {
    if (!studentImages.length) return;
    const t = setInterval(() => {
      setCarouselIdx(i => (i + 1) % studentImages.length);
    }, 3500);
    return () => clearInterval(t);
  }, [studentImages.length]);

  // no jobs loading on home

  return (
    <div className="space-y-12">
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-700 to-brand-500 text-white">
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-white/10 rounded-full" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-white/10 rounded-full" />
        <div className="px-6 py-14 md:py-20">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <motion.h1 initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:.5}} className="text-4xl md:text-6xl font-extrabold leading-tight">Create Job Posting Website Job Board</motion.h1>
              <p className="mt-4 text-white/90">Find Jobs, Employment & Career Opportunities</p>
              <div className="mt-8 bg-white p-3 flex flex-col md:flex-row gap-3">
                <input value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=> e.key==='Enter' && goToJobs()} placeholder="Job title, keywords" className="flex-1 border px-3 py-2 text-gray-900" />
                <input value={keyword} onChange={e=>setKeyword(e.target.value)} onKeyDown={e=> e.key==='Enter' && goToJobs()} placeholder="Job type, keywords" className="flex-1 border px-3 py-2 text-gray-900" />
                <input value={location} onChange={e=>setLocation(e.target.value)} onKeyDown={e=> e.key==='Enter' && goToJobs()} placeholder="Location" className="flex-1 border px-3 py-2 text-gray-900" />
                <button onClick={goToJobs} className="bg-black text-white px-6 py-2">Find Jobs</button>
              </div>
              <div className="mt-4 text-sm text-white/90">Popular Searches: Designer, Developer, Web, iOS, PHP, Senior, Engineer</div>
            </div>
            <motion.div initial={{opacity:0,scale:0.98}} animate={{opacity:1,scale:1}} transition={{duration:.6}} className="block mt-8 md:mt-0">
              <div className="relative w-full h-64 md:h-[460px]">
                {studentImages.length > 0 ? (
                  <>
                    <motion.img
                      key={studentImages[carouselIdx]}
                      src={studentImages[carouselIdx]}
                      alt="Student"
                      className="absolute inset-0 w-full h-full object-contain drop-shadow-xl"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                    />
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                      {studentImages.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCarouselIdx(i)}
                          className={`h-2.5 w-2.5 rounded-full transition-colors ${i === carouselIdx ? 'bg-white' : 'bg-white/50'}`}
                          aria-label={`Go to slide ${i + 1}`}
                        />
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-white/80 text-sm">Add student images to show here</div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="about" className="px-6 py-12 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold">About Campus Recruitment</h2>
              <p className="mt-4 text-gray-700 text-lg">We connect students with verified companies through a modern, fast and secure platform. Search roles, apply in one click, and track your application status in real-time. Our mission is to simplify the first step in your career.</p>
              <p className="mt-4 text-gray-700 text-xl leading-relaxed">Campus Recruitment bridges the gap between college talent and top employers with curated listings, verified company profiles, and powerful search filters. Build your profile once, apply in one click, and track every stage of your application in real time. From internships to full‑time roles and on‑campus drives, our matching signals surface opportunities aligned to your skills and interests—secure, fast, and free for students.</p>
            </div>
            <div className="hidden md:block">
              <img src={ab} alt="Students" className="w-full max-h-[420px] object-contain drop-shadow-xl rounded-xl" />
            </div>
          </div>
          <div className="grid sm:grid-cols-3 gap-6 mt-12">
            <div className="flex items-start gap-4 p-5 rounded-lg border shadow-sm bg-white">
              <div className="h-16 w-16 rounded-full bg-brand-100 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="h-8 w-8 text-brand-600" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 14c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5Z" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M4 20c0-3.314 3.582-6 8-6s8 2.686 8 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <div>
                <div className="text-4xl font-extrabold text-brand-700">10k+</div>
                <div className="text-gray-600">Candidates</div>
              </div>
            </div>
            <div className="flex items-start gap-4 p-5 rounded-lg border shadow-sm bg-white">
              <div className="h-16 w-16 rounded-full bg-brand-100 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="h-8 w-8 text-brand-600" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 21h16V7H4v14Z" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M9 10h2v2H9v-2Zm4 0h2v2h-2v-2ZM9 14h2v2H9v-2Zm4 0h2v2h-2v-2Z" fill="currentColor"/>
                  <path d="M2 7l10-5 10 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <div>
                <div className="text-4xl font-extrabold text-brand-700">500+</div>
                <div className="text-gray-600">Companies</div>
              </div>
            </div>
            <div className="flex items-start gap-4 p-5 rounded-lg border shadow-sm bg-white">
              <div className="h-16 w-16 rounded-full bg-brand-100 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="h-8 w-8 text-brand-600" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="7" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M7 7V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
              </div>
              <div>
                <div className="text-4xl font-extrabold text-brand-700">2k+</div>
                <div className="text-gray-600">Jobs Posted</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="steps" className="px-6 py-14 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Get started in 3 easy steps</h2>
          <div className="h-1 w-24 bg-brand-600 mt-2 rounded" />

          <div className="mt-10 grid gap-10 md:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="relative">
                <div className="absolute -top-3 -left-3 h-9 w-9 rounded-full bg-brand-600 text-white flex items-center justify-center font-semibold">1</div>
                <div className="h-40 w-40 rounded-3xl bg-brand-50 flex items-center justify-center">
                  <svg viewBox="0 0 64 64" className="h-24 w-24 text-brand-700" fill="none" stroke="currentColor" strokeWidth="2" xmlns="http://www.w3.org/2000/svg">
                    <rect x="18" y="6" width="28" height="52" rx="6"/>
                    <rect x="22" y="14" width="20" height="24" rx="3"/>
                    <circle cx="32" cy="47" r="2" fill="currentColor" stroke="none"/>
                    <rect x="25" y="18" width="6" height="6" rx="3"/>
                    <rect x="33" y="22" width="7" height="3" rx="1.5"/>
                  </svg>
                </div>
              </div>
              <h3 className="mt-6 text-xl font-semibold text-gray-900">Post a Job</h3>
              <p className="mt-2 text-gray-600 text-lg">Tell us what you need in a candidate in just 5 minutes.</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="relative">
                <div className="absolute -top-3 -left-3 h-9 w-9 rounded-full bg-brand-600 text-white flex items-center justify-center font-semibold">2</div>
                <div className="h-40 w-40 rounded-3xl bg-brand-50 flex items-center justify-center">
                  <svg viewBox="0 0 64 64" className="h-24 w-24 text-brand-700" fill="none" stroke="currentColor" strokeWidth="2" xmlns="http://www.w3.org/2000/svg">
                    <rect x="18" y="6" width="28" height="52" rx="6"/>
                    <circle cx="32" cy="28" r="8"/>
                    <path d="M28 28l2 2 6-6" strokeWidth="3"/>
                  </svg>
                </div>
              </div>
              <h3 className="mt-6 text-xl font-semibold text-gray-900">Get Verified</h3>
              <p className="mt-2 text-gray-600 text-lg">Our team will call to verify your employer account.</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="relative">
                <div className="absolute -top-3 -left-3 h-9 w-9 rounded-full bg-brand-600 text-white flex items-center justify-center font-semibold">3</div>
                <div className="h-40 w-40 rounded-3xl bg-brand-50 flex items-center justify-center">
                  <svg viewBox="0 0 64 64" className="h-24 w-24 text-brand-700" fill="none" stroke="currentColor" strokeWidth="2" xmlns="http://www.w3.org/2000/svg">
                    <rect x="18" y="6" width="28" height="52" rx="6"/>
                    <path d="M22 32h20M22 38h20M22 44h14"/>
                    <circle cx="44" cy="44" r="6"/>
                    <path d="M41 44l2 2 4-4" strokeWidth="3"/>
                  </svg>
                </div>
              </div>
              <h3 className="mt-6 text-xl font-semibold text-gray-900">Get calls. Hire.</h3>
              <p className="mt-2 text-gray-600 text-lg">Receive calls from relevant candidates or reach them directly.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="testimonials" className="px-6 py-14 bg-gradient-to-br from-brand-700 to-brand-500 text-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center">Hear From Our Happy Employers</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {testimonials.map((t, idx) => (
              <div key={idx} className="rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 p-5 flex flex-col justify-between min-h-[160px]">
                <div>
                  <div className="flex items-center justify-between text-xs text-white/80">
                    <div className="flex items-center gap-1 text-yellow-300">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} viewBox="0 0 20 20" className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg">
                          <path d="M10 15l-5.878 3.09L5.5 11.545.5 7.41l6.061-.88L10 1l3.439 5.53 6.061.88-5 4.136 1.378 6.545z" />
                        </svg>
                      ))}
                    </div>
                    <div>{t.date}</div>
                  </div>
                  <p className="mt-4 text-white/90 text-sm">{t.text}</p>
                </div>
                <div className="mt-5 flex items-center gap-3">
                  <img src={t.avatar} alt={t.name} className="h-8 w-8 rounded-full object-cover ring-2 ring-white/30" />
                  <div className="text-sm font-medium">{t.name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="px-6 py-14 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Frequently Asked Questions (Employer)</h2>
          <div className="h-1 w-24 bg-brand-600 mt-2 rounded" />
          <div className="mt-6 divide-y divide-gray-200">
            {faqs.map((f, i) => (
              <div key={i} className="py-4">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center gap-3 text-left text-brand-700 hover:text-brand-800"
                  aria-expanded={openFaq === i}
                >
                  <svg
                    viewBox="0 0 24 24"
                    className={`h-5 w-5 transition-transform ${openFaq === i ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                  <span className="text-base md:text-lg">{f.q}</span>
                </button>
                {openFaq === i && (
                  <p className="mt-3 text-gray-600 text-sm md:text-base">{f.a}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      
    </div>
  );
}
