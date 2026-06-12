import React, { useState } from 'react';
import { ShopJob, JobApplication, UserProfile } from '../types';
import { INDIAN_LOCATIONS, SHOP_TYPES } from '../data';
import { Search, MapPin, Briefcase, IndianRupee, Store, Check, Info, FileText, Send, Building, Tag, Compass } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface JobSearchProps {
  jobs: ShopJob[];
  applications: JobApplication[];
  currentProfile: UserProfile;
  onApply: (application: Omit<JobApplication, 'id' | 'createdAt'>) => void;
  onSelectChat: (applicationId: string) => void;
  onViewOwnerProfile?: (ownerId: string) => void;
}

export default function JobSearch({ jobs, applications, currentProfile, onApply, onSelectChat, onViewOwnerProfile }: JobSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedScale, setSelectedScale] = useState('');
  
  // Application modal state
  const [applyingJob, setApplyingJob] = useState<ShopJob | null>(null);
  
  // Form fields
  const [applicantName, setApplicantName] = useState(currentProfile.fullName || '');
  const [applicantContact, setApplicantContact] = useState(currentProfile.contactNumber || '');
  const [applicantSkills, setApplicantSkills] = useState(currentProfile.skills || '');
  const [applicantExperience, setApplicantExperience] = useState(currentProfile.experience || '');
  const [coverLetter, setCoverLetter] = useState('');

  // Update form whenever current seeker profile changes
  React.useEffect(() => {
    if (currentProfile.role === 'seeker') {
      setApplicantName(currentProfile.fullName || '');
      setApplicantContact(currentProfile.contactNumber || '');
      setApplicantSkills(currentProfile.skills || '');
      setApplicantExperience(currentProfile.experience || '');
    }
  }, [currentProfile]);

  const handleOpenModal = (job: ShopJob) => {
    setApplyingJob(job);
    // Auto populate cover letter in warm Indian Hinglish/English tone
    setCoverLetter(`Namaste ${job.ownerName} ji,\nI read about your hiring requirements at "${job.shopName}". I believe my skills match what you are looking for. I am hard-working, punctual, and live nearby. Please let me know if we can coordinate!`);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyingJob) return;

    onApply({
      jobId: applyingJob.id,
      shopName: applyingJob.shopName,
      shopLocation: applyingJob.location,
      applicantId: currentProfile.id,
      applicantName,
      applicantContact,
      applicantSkills,
      applicantExperience,
      coverLetter,
      status: 'pending'
    });

    setApplyingJob(null);
  };

  // Filter logic
  const filteredJobs = jobs.filter((job) => {
    if (!job.isActive) return false;
    
    const matchesSearch = 
      job.shopName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.expectedSkills.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesLocation = selectedLocation ? job.location === selectedLocation : true;
    const matchesType = selectedType ? job.shopType === selectedType : true;
    const matchesScale = selectedScale ? job.scale === selectedScale : true;

    return matchesSearch && matchesLocation && matchesType && matchesScale;
  });

  // Check if current user already applied
  const getAppliedStatus = (jobId: string) => {
    const app = applications.find(
      (a) => a.jobId === jobId && a.applicantId === currentProfile.id
    );
    return app;
  };

  return (
    <div className="space-y-6" id="job-search-section">
      {/* Search Header Banner */}
      <div className="bg-[#EEF2FF] border-2 border-[#E0E7FF] p-5 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div className="space-y-1">
          <h2 className="text-xl font-extrabold text-[#1F2937] flex items-center gap-2">
            <Compass className="w-5 h-5 text-[#4F46E5]" />
            Find Local Jobs in Your Area!
          </h2>
          <p className="text-sm text-gray-600 font-medium">
            Search small to medium shops near you. Apply directly to get a daily wage or monthly salary.
          </p>
        </div>
        <div className="flex items-center space-x-2 text-xs bg-white text-[#4F46E5] font-extrabold px-3 py-1.5 rounded-full border border-[#E0E7FF] shadow-xs self-start md:self-auto">
          <span>Active listings inside: Noida, Pune, Mumbai & Bangalore</span>
        </div>
      </div>

      {/* Filter and Query controls */}
      <div className="bg-white border-2 border-slate-100 rounded-2xl p-4 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Text Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by shop or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent hover:border-gray-300 rounded-lg pl-9 pr-3 py-2 text-sm text-gray-800"
              id="search-term-input"
            />
          </div>

          {/* Location Dropdown Selection */}
          <div className="relative">
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full bg-slate-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent hover:border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 appearance-none cursor-pointer"
              id="location-filter"
            >
              <option value="">🗺️ All Locations</option>
              {INDIAN_LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
              ▼
            </div>
          </div>

          {/* Shop Type Selection */}
          <div className="relative">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full bg-slate-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent hover:border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 appearance-none cursor-pointer"
              id="shoptype-filter"
            >
              <option value="">🏪 Shop Types (All)</option>
              {SHOP_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
              ▼
            </div>
          </div>

          {/* Shop Scale Choice */}
          <div className="relative">
            <select
              value={selectedScale}
              onChange={(e) => setSelectedScale(e.target.value)}
              className="w-full bg-slate-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent hover:border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 appearance-none cursor-pointer"
              id="shopscale-filter"
            >
              <option value="">🏢 Shop Scale (All)</option>
              <option value="small">Small Scale (Stall/Tiny Store)</option>
              <option value="medium">Medium Scale (Structured Shop)</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
              ▼
            </div>
          </div>
        </div>

        {/* Quick helper filters */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-50">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Quick Filters:</span>
          <button
            onClick={() => { setSearchTerm(''); setSelectedLocation(''); setSelectedType(''); setSelectedScale(''); }}
            className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-650 font-bold px-2.5 py-1 rounded-md transition-colors"
          >
            Clear All
          </button>
          <button
            onClick={() => { setSelectedType('Kirana & Grocery'); }}
            className={`text-xs px-2.5 py-1 rounded-md transition-colors font-bold border ${selectedType === 'Kirana & Grocery' ? 'bg-[#EEF2FF] border-[#E0E7FF] text-[#4F46E5]' : 'bg-[#F9FAFB] border-gray-200 text-gray-600 hover:bg-slate-50'}`}
          >
            Grocery / Kirana 🍎
          </button>
          <button
            onClick={() => { setSelectedScale('small'); }}
            className={`text-xs px-2.5 py-1 rounded-md transition-colors font-bold border ${selectedScale === 'small' ? 'bg-violet-100 border-violet-200 text-violet-800' : 'bg-[#F9FAFB] border-gray-200 text-gray-600 hover:bg-slate-50'}`}
          >
            Small Stalls 🍵
          </button>
        </div>
      </div>

      {/* Main Grid View */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => {
            const alreadyApplied = getAppliedStatus(job.id);
            return (
              <div
                key={job.id}
                className="bg-white border-2 border-slate-100 rounded-3xl hover:border-indigo-150 hover:shadow-md transition-all p-6 flex flex-col justify-between relative group"
                id={`job-card-${job.id}`}
              >
                {/* Scale Ribbon Indicator */}
                <span className={`absolute top-4 right-4 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${job.scale === 'small' ? 'bg-violet-50 text-violet-800 border-violet-100' : 'bg-blue-50 text-blue-800 border-blue-100'}`}>
                  {job.scale === 'small' ? 'Small Scale' : 'Medium Scale'}
                </span>

                <div className="space-y-4">
                  {/* Shop & Heading Title */}
                  <div className="flex gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center shrink-0 border border-[#E0E7FF] group-hover:scale-105 transition-transform">
                      <Store className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-gray-900 font-sans text-base leading-tight">
                        {job.shopName}
                      </h3>
                      <p className="text-xs text-gray-500 font-medium flex items-center gap-1 mt-0.5">
                        <Tag className="w-3 h-3" />
                        {job.shopType}
                      </p>
                    </div>
                  </div>

                  {/* Highlights section: Location & Expected Salary */}
                  <div className="bg-[#F9FAFB] rounded-xl p-3 grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center text-gray-700 gap-1.5 font-semibold">
                      <MapPin className="w-4 h-4 text-[#4F46E5] shrink-0" />
                      <span className="truncate">{job.location}</span>
                    </div>
                    <div className="flex items-center text-emerald-700 gap-1.5 font-black">
                      <IndianRupee className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{job.salaryEstimate}</span>
                    </div>
                  </div>

                  {/* Detailed Description */}
                  <div className="space-y-1.5">
                    <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                      {job.description}
                    </p>
                    <div className="text-[11px] bg-[#EEF2FF]/40 border border-[#E0E7FF]/60 p-2.5 rounded-xl">
                      <p className="font-bold text-[#4F46E5] text-[10px] uppercase tracking-wider mb-0.5">Expected Skills:</p>
                      <p className="text-gray-800 font-semibold">{job.expectedSkills}</p>
                    </div>
                  </div>
                </div>

                {/* Card CTA Actions */}
                <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between">
                  <div className="text-[11px] text-gray-450 hover:text-[#4F46E5] transition-colors">
                    Posted by:{' '}
                    <button
                      type="button"
                      onClick={() => onViewOwnerProfile?.(job.createdBy)}
                      className="font-black text-[#4F46E5] hover:underline cursor-pointer focus:outline-none"
                    >
                      {job.ownerName} ⭐️
                    </button>
                  </div>

                  {alreadyApplied ? (
                    <div className="flex gap-2.5 items-center">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-md flex items-center gap-1 ${
                        alreadyApplied.status === 'hired' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                        alreadyApplied.status === 'shortlisted' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                        alreadyApplied.status === 'rejected' ? 'bg-red-100 text-red-800 border border-red-200' :
                        'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}>
                        <Check className="w-3.5 h-3.5" />
                        Applied ({alreadyApplied.status})
                      </span>
                      <button
                        onClick={() => onSelectChat(alreadyApplied.id)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                        id={`chat-seeker-btn-${job.id}`}
                      >
                        Ask Details (Chat)
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleOpenModal(job)}
                      className="bg-[#4F46E5] hover:bg-[#4338ca] text-white font-extrabold text-xs px-5 py-2.5 rounded-xl transition-all shadow-xs hover:shadow-md cursor-pointer"
                      id={`apply-job-btn-${job.id}`}
                    >
                      Apply Now
                    </button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-16 text-center bg-white rounded-3xl border-2 border-dashed border-gray-100">
            <Store className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h4 className="font-bold text-gray-700">No active shop jobs found</h4>
            <p className="text-xs text-gray-400 mt-1 font-medium">Try to clear filters or search for another term.</p>
          </div>
        )}
      </div>

      {/* Slide-Up Application Form Drawer / Popup */}
      <AnimatePresence>
        {applyingJob && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl border border-indigo-100 shadow-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
              id="apply-job-modal"
            >
              <div className="flex justify-between items-start pb-4 border-b border-gray-100 mb-4">
                <div>
                  <span className="text-[10px] font-black uppercase text-[#4F46E5] px-2.5 py-1 rounded-full bg-[#EEF2FF] border border-[#E0E7FF]">
                    Application Form
                  </span>
                  <h3 className="text-lg font-extrabold text-gray-900 mt-1.5">
                    Apply to "{applyingJob.shopName}"
                  </h3>
                  <p className="text-xs text-gray-500 font-semibold mt-0.5">
                    Owner: {applyingJob.ownerName} • Offered: {applyingJob.salaryEstimate}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setApplyingJob(null)}
                  className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 text-sm font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      My Full Name:
                    </label>
                    <input
                      type="text"
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                      required
                      className="w-full bg-slate-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent rounded-xl px-3 py-2 text-xs text-gray-800 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Contact Mobile Number:
                    </label>
                    <input
                      type="text"
                      value={applicantContact}
                      onChange={(e) => setApplicantContact(e.target.value)}
                      required
                      placeholder="+91 XXXXX XXXXX"
                      className="w-full bg-slate-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent rounded-xl px-3 py-2 text-xs text-gray-800 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    My Skills & Language (Split by commas):
                  </label>
                  <input
                    type="text"
                    value={applicantSkills}
                    onChange={(e) => setApplicantSkills(e.target.value)}
                    placeholder="e.g., Fast billing, polite nature, Hindi speaking"
                    required
                    className="w-full bg-slate-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent rounded-xl px-3 py-2 text-xs text-gray-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Work Experience (Brief Summary):
                  </label>
                  <textarea
                    value={applicantExperience}
                    onChange={(e) => setApplicantExperience(e.target.value)}
                    placeholder="e.g., Fresher or worked as tea helper at Ramesh Stall for 8 months"
                    required
                    rows={2}
                    className="w-full bg-slate-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent rounded-xl px-3 py-2 text-xs text-gray-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Warm Message / Cover Letter for the Owner:
                  </label>
                  <textarea
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    required
                    rows={4}
                    className="w-full bg-slate-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent rounded-xl p-3 text-xs text-gray-850 leading-relaxed font-sans"
                  />
                </div>

                <div className="bg-[#EEF2FF] border border-[#E0E7FF] rounded-2xl p-3.5 flex gap-2.5 items-start text-xs text-indigo-900">
                  <Info className="w-4 h-4 text-[#4F46E5] shrink-0 mt-0.5" />
                  <p className="font-semibold">
                    <strong>Note:</strong> Submitting will instantly connect you with the shopkeeper and initialize a chat thread where you can discuss details.
                  </p>
                </div>

                <div className="flex justify-end gap-2.5 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setApplyingJob(null)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs px-4 py-2 rounded-xl font-extrabold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-5 py-2.5 rounded-xl font-extrabold flex items-center gap-1 shadow-md hover:shadow-lg transition-transform hover:-translate-y-0.5"
                    id="submit-application-btn"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Submit Application
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
