import React, { useState } from 'react';
import { UserProfile, ShopJob, JobApplication, UserReview } from '../types';
import { Search, MapPin, Star, User, Store, ArrowRight, MessageSquare } from 'lucide-react';

interface ProfilesAndReviewsProps {
  profiles: UserProfile[];
  reviews: UserReview[];
  jobs: ShopJob[];
  applications: JobApplication[];
  currentProfile: UserProfile;
  onViewProfile: (profileId: string) => void;
}

export default function ProfilesAndReviews({
  profiles,
  reviews,
  jobs,
  applications,
  currentProfile,
  onViewProfile
}: ProfilesAndReviewsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'shopkeeper' | 'seeker'>('all');
  const [locationFilter, setLocationFilter] = useState('all');

  // Compute average rating and count for each profile
  const getProfileStats = (userId: string) => {
    const userReviews = reviews.filter((r) => r.toUserId === userId);
    const count = userReviews.length;
    const avg =
      count > 0
        ? parseFloat((userReviews.reduce((acc, r) => acc + r.rating, 0) / count).toFixed(1))
        : 0;
    return { avg, count };
  };

  // Get locations list
  const uniqueLocations = Array.from(new Set(profiles.map((p) => p.location)));

  // Filter profiles
  const filteredProfiles = profiles.filter((p) => {
    // Exclude current logged in user from directory to prevent self-review/clutter, but keep other profiles
    if (p.id === currentProfile.id) return true; // Keep in list but maybe flag as "You"

    const matchesSearch =
      p.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.skills && p.skills.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.experience && p.experience.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesRole = roleFilter === 'all' ? true : p.role === roleFilter;
    const matchesLocation = locationFilter === 'all' ? true : p.location === locationFilter;

    return matchesSearch && matchesRole && matchesLocation;
  });

  // Check relationship badge
  const getRelationshipBadge = (profile: UserProfile) => {
    if (profile.id === currentProfile.id) {
      return (
        <span className="text-[10px] bg-slate-100 text-gray-600 font-extrabold px-2.5 py-1 rounded-full border border-gray-200 uppercase">
          You
        </span>
      );
    }

    // Is there a hired relationship?
    let isHiredRelation = false;
    let shopName = '';

    if (currentProfile.role === 'shopkeeper' && profile.role === 'seeker') {
      const hiredApp = applications.find(
        (app) =>
          app.applicantId === profile.id &&
          app.status === 'hired' &&
          jobs.find((j) => j.id === app.jobId)?.createdBy === currentProfile.id
      );
      if (hiredApp) {
        isHiredRelation = true;
        shopName = hiredApp.shopName;
      }
    } else if (currentProfile.role === 'seeker' && profile.role === 'shopkeeper') {
      const hiredApp = applications.find(
        (app) =>
          app.applicantId === currentProfile.id &&
          app.status === 'hired' &&
          jobs.find((j) => j.id === app.jobId && j.createdBy === profile.id)
      );
      if (hiredApp) {
        isHiredRelation = true;
        shopName = hiredApp.shopName;
      }
    }

    if (isHiredRelation) {
      return (
        <span className="text-[10.5px] bg-[#EEF2FF] text-[#4F46E5] font-black px-3 py-1 rounded-full border border-indigo-200 flex items-center gap-1">
          <MessageSquare className="w-3.5 h-3.5 text-[#4F46E5]" />
          Hired Status ({shopName.split(' ')[0]})
        </span>
      );
    }

    return null;
  };

  return (
    <div className="space-y-6" id="profiles-reviews-hub-container">
      <div>
        <h2 className="text-xl font-extrabold text-gray-900">
          🇮🇳 Local Community Ratings & Directory
        </h2>
        <p className="text-xs text-gray-500 font-semibold">
          Explore registered partners, view background skills, check neighborhood ratings, and leave workspace evaluations.
        </p>
      </div>

      {/* Directory Filter controls bar */}
      <div className="bg-white border-2 border-slate-100 p-5 rounded-3xl shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Searching */}
          <div className="relative md:col-span-5">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
              <Search className="w-4 h-4 text-gray-400" />
            </span>
            <input
              type="text"
              placeholder="Search by name, key skills, or history..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent rounded-xl pl-10 pr-3 py-2 text-xs text-gray-800 font-semibold"
            />
          </div>

          {/* Role selection dropdown */}
          <div className="md:col-span-3">
            <select
              value={roleFilter}
              onChange={(e: any) => setRoleFilter(e.target.value)}
              className="w-full bg-slate-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent rounded-xl px-3 py-2 text-xs text-gray-750 font-bold appearance-none cursor-pointer"
            >
              <option value="all">👨‍👩‍👧‍👦 All Categories (Everyone)</option>
              <option value="shopkeeper">🏪 Shop Owners (Employers)</option>
              <option value="seeker">🧑 Job Seekers (Workers)</option>
            </select>
          </div>

          {/* Location selector dropdown */}
          <div className="md:col-span-4">
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="w-full bg-slate-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent rounded-xl px-3 py-2 text-xs text-gray-750 font-bold appearance-none cursor-pointer"
            >
              <option value="all">📍 All Locations / Areas</option>
              {uniqueLocations.map((loc) => (
                <option key={loc} value={loc}>
                  🇮🇳 {loc}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Directory Profiles Grid list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" id="profiles-directory-grid">
        {filteredProfiles.length > 0 ? (
          filteredProfiles.map((p) => {
            const { avg, count } = getProfileStats(p.id);
            const isMe = p.id === currentProfile.id;

            return (
              <div
                key={p.id}
                onClick={() => onViewProfile(p.id)}
                className={`bg-white border-2 rounded-3xl p-5 hover:shadow-md transition-all cursor-pointer relative flex flex-col justify-between group ${
                  isMe ? 'border-dashed border-indigo-200 bg-slate-50/20' : 'border-slate-100 hover:border-[#4F46E5]/40'
                }`}
                id={`directory-profile-card-${p.id}`}
              >
                <div className="space-y-4">
                  {/* Card Header Profile Details */}
                  <div className="flex gap-3">
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 font-extrabold text-white text-xs ${
                        p.avatarColor || 'bg-slate-500'
                      }`}
                    >
                      {p.fullName.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="truncate">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h3 className="font-extrabold text-gray-900 group-hover:text-[#4F46E5] transition-colors text-sm">
                          {p.fullName}
                        </h3>
                        {p.role === 'shopkeeper' ? (
                          <span className="text-[9px] font-black uppercase text-indigo-700 bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded">
                            Merchant
                          </span>
                        ) : (
                          <span className="text-[9px] font-black uppercase text-emerald-800 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded">
                            Helper
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-gray-400 font-bold flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        {p.location}
                      </p>
                    </div>
                  </div>

                  {/* Ratings Display Panel */}
                  <div className="bg-[#F9FAFB] rounded-2xl p-3 flex items-center gap-2 border border-gray-50">
                    <div className="flex text-amber-400">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${
                            s <= Math.round(avg) ? 'fill-current' : 'text-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-extrabold text-gray-800 mt-0.5">
                      {count > 0 ? `${avg} out of 5` : 'No rating'}
                    </span>
                    <span className="text-[10px] text-gray-400 font-semibold mt-0.5">
                      ({count} {count === 1 ? 'review' : 'reviews'})
                    </span>
                  </div>

                  {/* Specific features for seeker vs merchant */}
                  <div className="text-xs space-y-1.5 text-gray-650 min-h-[48px] line-clamp-3">
                    {p.role === 'seeker' ? (
                      <>
                        <p className="font-bold flex items-start gap-1">
                          <span className="text-gray-400 text-[10px] uppercase. shrink-0 mt-0.5">Skills:</span>
                          <span className="text-gray-800 font-semibold truncate text-[11px]">
                            {p.skills || 'Basic worker skill sets'}
                          </span>
                        </p>
                        <p className="font-bold flex items-start gap-1">
                          <span className="text-gray-400 text-[10px] uppercase shrink-0 mt-0.5">Exp:</span>
                          <span className="text-gray-700 font-semibold truncate text-[11px]">
                            {p.experience || 'Fresher'}
                          </span>
                        </p>
                      </>
                    ) : (
                      <p className="font-bold flex items-start gap-1">
                        <span className="text-gray-400 text-[10px] uppercase shrink-0 mt-0.5">Dukaan:</span>
                        <span className="text-gray-800 font-semibold text-[11px]">
                          {jobs.filter((j) => j.createdBy === p.id).map((j) => j.shopName).join(', ') ||
                            'Local Dukaan Merchant'}
                        </span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Card footer CTA */}
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between mt-4">
                  <div className="flex-1 shrink-0">
                    {getRelationshipBadge(p)}
                  </div>
                  <span className="text-[#4F46E5] font-extrabold text-xs flex items-center gap-1 group-hover:translate-x-1 transition-transform pl-2">
                    Profile Details
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-16 text-center bg-white rounded-3xl border-2 border-dashed border-gray-100">
            <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h4 className="font-bold text-gray-700">No matching profiles found</h4>
            <p className="text-xs text-gray-400 mt-1 font-semibold">
              Try to change your search keywords or clear city filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
