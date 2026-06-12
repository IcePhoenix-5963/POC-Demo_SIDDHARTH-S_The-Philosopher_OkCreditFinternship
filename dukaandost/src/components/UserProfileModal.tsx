import React, { useState } from 'react';
import { UserProfile, ShopJob, JobApplication, UserReview } from '../types';
import { X, Star, FileText, MapPin, Award, Store, Phone, Clock, Highlighter, ShieldAlert } from 'lucide-react';

interface UserProfileModalProps {
  targetProfileId: string;
  currentProfile: UserProfile;
  profiles: UserProfile[];
  reviews: UserReview[];
  jobs: ShopJob[];
  applications: JobApplication[];
  onClose: () => void;
  onAddReview: (review: Omit<UserReview, 'id' | 'createdAt'>) => void;
}

export default function UserProfileModal({
  targetProfileId,
  currentProfile,
  profiles,
  reviews,
  jobs,
  applications,
  onClose,
  onAddReview
}: UserProfileModalProps) {
  const targetProfile = profiles.find((p) => p.id === targetProfileId);

  if (!targetProfile) return null;

  // Form states
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter reviews for target user
  const targetReviews = reviews.filter((r) => r.toUserId === targetProfile.id);

  // Compute average rating and count
  const count = targetReviews.length;
  const avg =
    count > 0
      ? parseFloat((targetReviews.reduce((acc, r) => acc + r.rating, 0) / count).toFixed(1))
      : 0;

  // Compute standard dynamic eligibility:
  // Is hired relation present?
  let eligibleHiredApps: JobApplication[] = [];

  if (currentProfile.role === 'shopkeeper' && targetProfile.role === 'seeker') {
    // Current shopkeeper has hired this target seeker
    eligibleHiredApps = applications.filter(
      (app) =>
        app.applicantId === targetProfile.id &&
        app.status === 'hired' &&
        jobs.find((j) => j.id === app.jobId)?.createdBy === currentProfile.id
    );
  } else if (currentProfile.role === 'seeker' && targetProfile.role === 'shopkeeper') {
    // Current seeker was hired by this target shopkeeper
    eligibleHiredApps = applications.filter(
      (app) =>
        app.applicantId === currentProfile.id &&
        app.status === 'hired' &&
        jobs.find((j) => j.id === app.jobId && j.createdBy === targetProfile.id)
    );
  }

  // Filter out hired apps that have ALREADY been reviewed by current user
  const unreviewedHiredApps = eligibleHiredApps.filter(
    (app) => !reviews.some((r) => r.fromUserId === currentProfile.id && r.jobId === app.jobId)
  );

  const [selectedAppId, setSelectedAppId] = useState(
    unreviewedHiredApps.length > 0 ? unreviewedHiredApps[0].id : ''
  );

  // Select first eligible hired app automatically if state becomes empty
  React.useEffect(() => {
    if (unreviewedHiredApps.length > 0 && !selectedAppId) {
      setSelectedAppId(unreviewedHiredApps[0].id);
    }
  }, [unreviewedHiredApps, selectedAppId]);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppId) return;

    const chosenApp = applications.find((app) => app.id === selectedAppId);
    if (!chosenApp) return;

    onAddReview({
      fromUserId: currentProfile.id,
      fromUserName: currentProfile.fullName,
      fromUserRole: currentProfile.role,
      toUserId: targetProfile.id,
      rating,
      comment,
      jobId: chosenApp.jobId,
      shopName: chosenApp.shopName
    });

    // Reset Form
    setComment('');
    setRating(5);
    // Modal will stay open, letting them read the newly posted review in list
  };

  return (
    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl border border-indigo-50 shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto flex flex-col relative"
        id="user-profile-modal-container"
      >
        {/* Modal Sticky Header row */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10 rounded-t-3xl">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-150 px-2.5 py-1 rounded-full">
              DukaanDost Card
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-650 cursor-pointer font-extrabold text-sm transition-colors"
          >
            ✕ Close
          </button>
        </div>

        {/* Modal body contents */}
        <div className="p-6 space-y-6 flex-1">
          {/* Main User Card Head Banner */}
          <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between border-b border-gray-100 pb-5">
            <div className="flex gap-4 items-center">
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 font-black text-white text-base shadow-sm ${
                  targetProfile.avatarColor || 'bg-indigo-600'
                }`}
              >
                {targetProfile.fullName.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-extrabold text-gray-950 text-xl font-sans tracking-tight">
                    {targetProfile.fullName}
                  </h3>
                  <span
                    className={`text-[9.5px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                      targetProfile.role === 'shopkeeper'
                        ? 'bg-indigo-100 text-indigo-800 border border-indigo-150'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}
                  >
                    {targetProfile.role === 'shopkeeper' ? 'Merchant' : 'Helper'}
                  </span>
                </div>
                <p className="text-xs text-gray-500 font-bold flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" />
                  {targetProfile.location}
                </p>
              </div>
            </div>

            {/* Quick Average star block */}
            <div className="bg-[#EEF2FF]/50 border border-[#E0E7FF] rounded-2xl p-3 text-center min-w-[120px]">
              <div className="flex items-center gap-1 justify-center">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span className="text-lg font-black text-[#1F2937]">
                  {count > 0 ? avg : '0.0'}
                </span>
              </div>
              <p className="text-[10px] text-[#4F46E5] font-black uppercase tracking-wider mt-0.5">
                {count} {count === 1 ? 'review' : 'reviews'}
              </p>
            </div>
          </div>

          {/* Details Body */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider">
                Profile Registration
              </h4>
              <div className="bg-slate-50 rounded-2xl p-4 text-xs space-y-3 font-semibold text-gray-750">
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#4F46E5] shrink-0" />
                  <span>
                    <strong>Mobile Contact:</strong> <span className="font-mono">{targetProfile.contactNumber}</span>
                  </span>
                </p>

                {targetProfile.role === 'seeker' ? (
                  <>
                    <div>
                      <p className="flex items-center gap-1.5 text-gray-450 text-[10px] uppercase font-black tracking-wider mb-1">
                        <Award className="w-3.5 h-3.5 text-emerald-600" /> Key Skills:
                      </p>
                      <p className="text-gray-800 pl-5 font-medium">{targetProfile.skills || 'General manual labor helper'}</p>
                    </div>

                    <div>
                      <p className="flex items-center gap-1.5 text-gray-450 text-[10px] uppercase font-black tracking-wider mb-1">
                        <FileText className="w-3.5 h-3.5 text-emerald-600" /> Job History:
                      </p>
                      <p className="text-gray-800 pl-5 font-medium">{targetProfile.experience || 'Fresher helper'}</p>
                    </div>
                  </>
                ) : (
                  <div>
                    <p className="flex items-center gap-1.5 text-gray-450 text-[10px] uppercase font-black tracking-wider mb-1">
                      <Store className="w-3.5 h-3.5 text-[#4F46E5]" /> Listed Shops:
                    </p>
                    <div className="pl-5 space-y-1 text-gray-800">
                      {jobs
                        .filter((j) => j.createdBy === targetProfile.id)
                        .map((j) => (
                          <div key={j.id} className="font-bold flex items-center gap-1 text-[11px]">
                            <span>🏪 {j.shopName}</span>
                            <span className="text-gray-400 font-normal">({j.shopType})</span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* REVIEW FORM DOCK */}
            <div className="space-y-4">
              <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider">
                Workspace Feedback Form
              </h4>

              {/* Check if user can review */}
              {unreviewedHiredApps.length > 0 ? (
                <form
                  onSubmit={handleSubmitReview}
                  className="bg-indigo-50/40 border border-indigo-100 rounded-3xl p-4.5 space-y-3.5"
                >
                  <div>
                    <h5 className="font-extrabold text-indigo-900 text-xs flex items-center gap-1">
                      <Highlighter className="w-3.5 h-3.5 text-[#4F46E5]" /> Leave a Rating & Review!
                    </h5>
                    <p className="text-[10px] text-gray-400 mt-0.5 font-semibold">
                      You are eligible to review because you worked together!
                    </p>
                  </div>

                  {/* Which job selection dropdown */}
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">
                      Select Shop / Hired Duty:
                    </label>
                    <select
                      value={selectedAppId}
                      onChange={(e) => setSelectedAppId(e.target.value)}
                      className="w-full bg-white border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#4F46E5] rounded-lg p-1.5 text-xs text-gray-700 font-bold"
                    >
                      {unreviewedHiredApps.map((app) => (
                        <option key={app.id} value={app.id}>
                          Vacancy: {app.shopName}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Star selection rating bar */}
                  <div>
                    <span className="block text-[10px] font-bold text-gray-500 mb-1">Star rating:</span>
                    <div className="flex gap-1.5 items-center">
                      {[1, 2, 3, 4, 5].map((starsCount) => (
                        <button
                          key={starsCount}
                          type="button"
                          onClick={() => setRating(starsCount)}
                          className="p-1 focus:outline-none shrink-0"
                        >
                          <Star
                            className={`w-6 h-6 transition-transform hover:scale-110 cursor-pointer ${
                              starsCount <= rating
                                ? 'text-amber-500 fill-amber-500'
                                : 'text-gray-300'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="text-[11px] font-black text-indigo-950 uppercase ml-2 select-none">
                        {rating} Star{rating > 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>

                  {/* written commentary */}
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1">
                      Brief Comment / Feedback:
                    </label>
                    <textarea
                      required
                      rows={2.5}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="e.g. He was very punctual and learned computer billing fast!"
                      className="w-full bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent rounded-xl p-2.5 text-xs text-gray-800 leading-normal"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#4F46E5] hover:bg-[#4338ca] text-white font-extrabold text-xs py-2 rounded-xl text-center shadow-xs transition-colors cursor-pointer"
                  >
                    Submit Dukaan Review
                  </button>
                </form>
              ) : eligibleHiredApps.length > 0 ? (
                <div className="bg-emerald-50 border border-emerald-150 p-4.5 rounded-3xl flex gap-2 text-xs text-emerald-900">
                  <span className="text-xl shrink-0">✔️</span>
                  <div>
                    <p className="font-extrabold">All reviewed!</p>
                    <p className="text-[11px] text-emerald-800 font-semibold mt-1">
                      You have already submitted ratings and feedback for all shared hired transactions with {targetProfile.fullName}.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 border border-gray-200 p-4 rounded-3xl flex gap-2 text-xs text-gray-550 font-semibold leading-relaxed">
                  <ShieldAlert className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-extrabold text-gray-700">Not Eligible to Review</p>
                    <p className="text-[10.5px] mt-0.5 font-medium">
                      Reviews can only be written between shop owners and seekers who share a <strong>"Hired"</strong> job status. Apply to jobs or hire this worker to review!
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* REVIEWS FEED LIST */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider flex items-center justify-between">
              <span>Reviews Feed ({targetReviews.length})</span>
            </h4>

            {targetReviews.length > 0 ? (
              <div className="space-y-3.5">
                {targetReviews.map((rev) => {
                  const revProfile = profiles.find((pr) => pr.id === rev.fromUserId);

                  return (
                    <div
                      key={rev.id}
                      className="border-2 border-slate-50 rounded-2xl p-4 bg-[#FDFCF8]/40 space-y-2 text-xs shadow-xs"
                      id={`review-item-${rev.id}`}
                    >
                      {/* header info */}
                      <div className="flex items-center justify-between gap-1 border-b border-gray-50 pb-2">
                        <div className="flex gap-2 items-center">
                          <div
                            className={`w-7 h-7 rounded-lg text-[10px] font-black text-white flex items-center justify-center shrink-0 ${
                              revProfile?.avatarColor || 'bg-slate-400'
                            }`}
                          >
                            {rev.fromUserName.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-extrabold text-gray-900 pr-1 select-none">
                              {rev.fromUserName}
                            </span>
                            <span
                              className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${
                                rev.fromUserRole === 'shopkeeper'
                                  ? 'bg-indigo-50 text-indigo-700'
                                  : 'bg-emerald-50 text-emerald-800'
                              }`}
                            >
                              {rev.fromUserRole === 'shopkeeper' ? 'Employer' : 'Worker'}
                            </span>
                          </div>
                        </div>

                        {/* Stars */}
                        <div className="flex items-center gap-1bg-[#FFFBEB] px-2 py-0.5 rounded-lg border border-amber-100">
                          <span className="text-[11px] font-black text-amber-900 mt-0.5 pr-1">⭐ {rev.rating}</span>
                        </div>
                      </div>

                      {/* commentary review */}
                      <p className="text-gray-700 italic leading-relaxed font-sans text-xs">
                        "{rev.comment}"
                      </p>

                      {/* source context */}
                      <div className="pt-2 text-[10px] text-gray-400 flex items-center justify-between font-bold flex-wrap gap-2">
                        <span className="flex items-center gap-1">
                          🗃️ <strong>Hired Context:</strong> {rev.shopName}
                        </span>
                        <span className="text-[9px] font-mono text-gray-400">
                          Reviewed: {new Date(rev.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-10 bg-slate-50 border border-dashed border-gray-200 rounded-3xl">
                <p className="text-xs text-gray-400 font-bold">No feedback reviews recorded yet.</p>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Complete a mock hired transaction and be the first to record feedback!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
