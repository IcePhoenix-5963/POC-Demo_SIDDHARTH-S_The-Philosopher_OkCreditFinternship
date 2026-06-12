import React, { useState } from 'react';
import { ShopJob, UserProfile } from '../types';
import { INDIAN_LOCATIONS, SHOP_TYPES } from '../data';
import { PlusCircle, Store, Eye, EyeOff, Plus, FileText, Check, DollarSign, MapPin, Tag } from 'lucide-react';

interface ManageJobsProps {
  jobs: ShopJob[];
  currentProfile: UserProfile;
  currentApplicationsCount: (jobId: string) => number;
  onAddJob: (job: Omit<ShopJob, 'id' | 'createdBy' | 'createdAt'>) => void;
  onToggleStatus: (jobId: string) => void;
}

export default function ManageJobs({ jobs, currentProfile, currentApplicationsCount, onAddJob, onToggleStatus }: ManageJobsProps) {
  const [isPosting, setIsPosting] = useState(false);
  
  // New Job State Form
  const [shopName, setShopName] = useState('');
  const [shopType, setShopType] = useState('Kirana & Grocery');
  const [location, setLocation] = useState(currentProfile.location || 'Sector 62, Noida');
  const [ownerName, setOwnerName] = useState(currentProfile.fullName || '');
  const [ownerContact, setOwnerContact] = useState(currentProfile.contactNumber || '');
  const [scale, setScale] = useState<'small' | 'medium'>('small');
  const [expectedSkills, setExpectedSkills] = useState('');
  const [salaryEstimate, setSalaryEstimate] = useState('₹12,000 / month');
  const [description, setDescription] = useState('');

  // Filter jobs created by this shopkeeper
  const myJobs = jobs.filter((job) => job.createdBy === currentProfile.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddJob({
      shopName,
      shopType,
      location,
      ownerName,
      ownerContact,
      scale,
      expectedSkills,
      salaryEstimate,
      description,
      isActive: true
    });

    // Reset Form
    setIsPosting(false);
    setShopName('');
    setExpectedSkills('');
    setDescription('');
  };

  return (
    <div className="space-y-6" id="manage-jobs-section">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-gray-900">
            Dukaan Postings & Openings
          </h2>
          <p className="text-xs text-gray-500 font-semibold">
            Create or edit mock vacancy postings for your shops. Walk-in and online helpers can apply.
          </p>
        </div>
        <button
          onClick={() => setIsPosting(!isPosting)}
          className="bg-[#4F46E5] hover:bg-[#4338ca] text-white font-extrabold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-md hover:shadow-lg transition-transform hover:-translate-y-0.5 cursor-pointer"
          id="toggle-post-vacancy-form"
        >
          {isPosting ? '✕ Close Form' : '+ Post New Vacancy'}
        </button>
      </div>

      {/* Post a Job Form Section */}
      {isPosting && (
        <form
          onSubmit={handleSubmit}
          className="bg-white border-2 border-indigo-50 rounded-3xl p-6 shadow-sm space-y-4 animate-in fade-in slide-in-from-top-4 duration-200"
          id="job-posting-form"
        >
          <div className="border-b border-indigo-50 pb-3">
            <h3 className="font-bold text-[#4F46E5] text-sm flex items-center gap-1.5">
              <Store className="w-4 h-4 text-[#4F46E5]" />
              Declare Your Shop & Hiring Needs
            </h3>
            <p className="text-[11px] text-gray-400 mt-0.5 font-semibold">
              Fill in all fields. This is advertised to job hunters in your area.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Shop (Dukaan) Name:
              </label>
              <input
                type="text"
                required
                placeholder="e.g., Gupta Kirana Store"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                className="w-full bg-slate-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent rounded-xl px-3 py-1.5 text-xs text-gray-800 font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Shop Category:
              </label>
              <select
                value={shopType}
                onChange={(e) => setShopType(e.target.value)}
                className="w-full bg-slate-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent rounded-xl px-2 py-1.5 text-xs text-gray-750 appearance-none cursor-pointer font-semibold"
              >
                {SHOP_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Shop Location City/Area:
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-slate-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent rounded-xl px-2 py-1.5 text-xs text-gray-750 appearance-none cursor-pointer font-semibold"
              >
                {INDIAN_LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Owner/Manager Name:
              </label>
              <input
                type="text"
                required
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                className="w-full bg-slate-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent rounded-xl px-3 py-1.5 text-xs text-gray-800 font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Owner Contact Number:
              </label>
              <input
                type="text"
                required
                value={ownerContact}
                onChange={(e) => setOwnerContact(e.target.value)}
                className="w-full bg-slate-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent rounded-xl px-3 py-1.5 text-xs text-gray-800 font-mono font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Monthly Salary Offered (Rupees):
              </label>
              <input
                type="text"
                required
                placeholder="e.g., ₹14,000 / month"
                value={salaryEstimate}
                onChange={(e) => setSalaryEstimate(e.target.value)}
                className="w-full bg-slate-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent rounded-xl px-3 py-1.5 text-xs text-gray-800 font-semibold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-1">
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Scale of Shop:
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setScale('small')}
                  className={`flex-1 text-xs py-2 px-3 border rounded-xl font-bold capitalize transition-colors cursor-pointer ${
                    scale === 'small'
                      ? 'bg-[#EEF2FF] border-[#E0E7FF] text-[#4F46E5]'
                      : 'bg-slate-50 border-gray-200 text-gray-600 hover:bg-slate-100'
                  }`}
                >
                  🍵 Small Scale
                </button>
                <button
                  type="button"
                  onClick={() => setScale('medium')}
                  className={`flex-1 text-xs py-2 px-3 border rounded-xl font-bold capitalize transition-colors cursor-pointer ${
                    scale === 'medium'
                      ? 'bg-[#EEF2FF] border-[#E0E7FF] text-[#4F46E5]'
                      : 'bg-slate-50 border-gray-200 text-gray-600 hover:bg-slate-100'
                  }`}
                >
                  🏢 Medium Scale
                </button>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Expected Worker Skills / Language:
              </label>
              <input
                type="text"
                placeholder="e.g., Basic calculations, Hindi conversations, Tally helper"
                required
                value={expectedSkills}
                onChange={(e) => setExpectedSkills(e.target.value)}
                className="w-full bg-slate-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent rounded-xl px-3 py-1.5 text-xs text-gray-800 font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Detailed Job Duties & Shop Timings:
            </label>
            <textarea
              required
              rows={3}
              placeholder="Provide timings, what are the responsibilities at the counter, any benefits like food or tea..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent rounded-xl p-3 text-xs text-gray-805 font-semibold"
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-gray-50 font-semibold">
            <button
              type="button"
              onClick={() => setIsPosting(false)}
              className="bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs px-4 py-2 rounded-xl font-extrabold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-5 py-2 rounded-xl font-extrabold shadow-md hover:shadow-lg transition-transform"
              id="submit-job-vacancy-btn"
            >
              Post Job Listing
            </button>
          </div>
        </form>
      )}

      {/* active jobs catalog for this manager */}
      <div className="space-y-4">
        <h3 className="text-xs font-extrabold text-gray-550 uppercase tracking-wider">
          Your Listed Openings ({myJobs.length})
        </h3>

        {myJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myJobs.map((job) => {
              const appCount = currentApplicationsCount(job.id);
              return (
                <div
                  key={job.id}
                  className={`bg-white border-2 rounded-3xl p-5 flex flex-col justify-between transition-all ${
                    job.isActive ? 'border-indigo-50/80 shadow-xs' : 'border-dashed border-gray-200 opacity-65'
                  }`}
                  id={`my-job-card-${job.id}`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-extrabold text-gray-900 text-sm flex items-center gap-1.5">
                          <Store className="w-4 h-4 text-[#4F46E5] shrink-0" />
                          {job.shopName}
                        </h4>
                        <span className="text-[10px] bg-slate-100 text-gray-650 px-2 py-0.5 rounded font-extrabold">
                          {job.shopType}
                        </span>
                      </div>

                      {/* Active/Closed state badge */}
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                        job.isActive ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'
                      }`}>
                        {job.isActive ? 'Active & Hiring' : 'Filled / Closed'}
                      </span>
                    </div>

                    <div className="text-xs space-y-1 text-gray-650 font-medium">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-bold text-[#1F2937]">
                        <DollarSign className="w-3.5 h-3.5 text-[#4F46E5] shrink-0" />
                        <span>{job.salaryEstimate}</span>
                      </div>
                    </div>

                    {/* Applications tracking counters */}
                    <div className="bg-[#EEF2FF] rounded-xl p-2.5 flex items-center justify-between text-xs border border-indigo-100/50">
                      <span className="text-[#4F46E5] font-bold">Candidates Applied:</span>
                      <span className="bg-[#4F46E5] text-white font-extrabold px-2.5 py-0.5 rounded-md text-xs">
                        {appCount}
                      </span>
                    </div>
                  </div>

                  <div className="pt-3.5 mt-3 border-t border-gray-100 flex items-center justify-between">
                    <button
                      onClick={() => onToggleStatus(job.id)}
                      className={`text-xs font-extrabold px-3 py-1.5 rounded-xl flex items-center gap-1.5 cursor-pointer ${
                        job.isActive 
                          ? 'bg-violet-50 hover:bg-violet-100 text-[#4F46E5]' 
                          : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-850'
                      }`}
                      id={`toggle-active-btn-${job.id}`}
                    >
                      {job.isActive ? (
                        <>
                          <EyeOff className="w-3.5 h-3.5" />
                          Mark as Filled
                        </>
                      ) : (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          Mark as Active
                        </>
                      )}
                    </button>

                    <span className="text-[10px] text-gray-400 font-semibold">
                      Posted: {new Date(job.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-12 text-center bg-white rounded-3xl border-2 border-dashed border-gray-100">
            <Store className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <h4 className="font-bold text-gray-600">You haven't listed any shops yet</h4>
            <p className="text-xs text-gray-400 mt-0.5 font-semibold">Click the "+ Post New Vacancy" button at the top to list your helper needs.</p>
          </div>
        )}
      </div>
    </div>
  );
}
