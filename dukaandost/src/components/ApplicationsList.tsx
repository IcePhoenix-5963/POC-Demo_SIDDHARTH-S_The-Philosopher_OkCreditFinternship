import React from 'react';
import { JobApplication, UserProfile, ShopJob } from '../types';
import { FileText, MapPin, User, MessageSquare, Check, X, ShieldAlert, Award, Phone } from 'lucide-react';

interface ApplicationsListProps {
  applications: JobApplication[];
  currentProfile: UserProfile;
  jobs: ShopJob[];
  onUpdateStatus: (applicationId: string, status: JobApplication['status']) => void;
  onSelectChat: (applicationId: string) => void;
  onViewApplicantProfile?: (profileId: string) => void;
}

export default function ApplicationsList({ applications, currentProfile, jobs, onUpdateStatus, onSelectChat, onViewApplicantProfile }: ApplicationsListProps) {
  const isShopkeeper = currentProfile.role === 'shopkeeper';

  // Filter application list based on role
  let filteredApplications: JobApplication[] = [];
  if (isShopkeeper) {
    // Collect all jobIds created by this shopkeeper
    const myJobIds = jobs.filter((j) => j.createdBy === currentProfile.id).map((j) => j.id);
    filteredApplications = applications.filter((app) => myJobIds.includes(app.jobId));
  } else {
    // Seekers see their own applications
    filteredApplications = applications.filter((app) => app.applicantId === currentProfile.id);
  }

  return (
    <div className="space-y-6" id="applications-list-section">
      <div>
        <h2 className="text-xl font-extrabold text-gray-900">
          {isShopkeeper ? 'Incoming Job Applications' : 'My Applied Positions'}
        </h2>
        <p className="text-xs text-gray-500 font-semibold">
          {isShopkeeper
            ? 'Review helper cover letters, update application status, and start chat to finalize hiring.'
            : 'Track the status of applications sent to local shops. Start chat with owners to confirm timings.'}
        </p>
      </div>

      <div className="space-y-4">
        {filteredApplications.length > 0 ? (
          filteredApplications.map((app) => {
            const correspondingJob = jobs.find((j) => j.id === app.jobId);
            return (
              <div
                key={app.id}
                className="bg-white border-2 border-slate-100 rounded-3xl p-5 hover:shadow-xs transition-shadow space-y-4"
                id={`application-card-${app.id}`}
              >
                {/* Top bar header: Candidate / Shop & Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-50 pb-3">
                  <div>
                    {isShopkeeper ? (
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-full">
                          Job Vacancy: {correspondingJob?.shopName || app.shopName}
                        </span>
                        <h3 className="font-extrabold text-gray-900 text-base flex items-center gap-1.5 mt-2">
                          <User className="w-5 h-5 text-[#4F46E5]" />
                          <button
                            type="button"
                            onClick={() => onViewApplicantProfile?.(app.applicantId)}
                            className="text-[#4F46E5] hover:underline hover:text-[#4338ca] text-left cursor-pointer font-extrabold focus:outline-none"
                          >
                            {app.applicantName} ⭐️
                          </button>
                        </h3>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full">
                          Dukaan Applied
                        </span>
                        <h3 className="font-extrabold text-gray-950 text-base flex items-center gap-1.5 mt-1">
                          🏪{' '}
                          <button
                            type="button"
                            onClick={() => {
                              const jobOwnerId = correspondingJob?.createdBy;
                              if (jobOwnerId) {
                                onViewApplicantProfile?.(jobOwnerId);
                              }
                            }}
                            className="text-[#4F46E5] hover:underline hover:text-[#4338ca] text-left cursor-pointer font-extrabold focus:outline-none"
                          >
                            {app.shopName} ⭐️
                          </button>
                        </h3>
                        <p className="text-xs text-gray-400 font-bold flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                          {app.shopLocation}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Status indicator style */}
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Status:</span>
                    <span className={`text-xs font-black uppercase px-3 py-1 rounded-full border ${
                      app.status === 'hired' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                      app.status === 'shortlisted' ? 'bg-blue-50 text-blue-800 border-blue-200' :
                      app.status === 'rejected' ? 'bg-rose-50 text-rose-800 border-rose-200' :
                      'bg-indigo-50 text-indigo-800 border-indigo-150'
                    }`}>
                      {app.status === 'hired' ? '🎉 Selected & Hired!' :
                       app.status === 'shortlisted' ? '📋 Candidate Shortlisted' :
                       app.status === 'rejected' ? '❌ Filled / Closed' :
                       '⏳ Pending Review'}
                    </span>
                  </div>
                </div>

                {/* Candidate qualifications details (Only visible or emphasized on applications summary) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs bg-[#FDFCF8] p-4 rounded-2xl border border-slate-100">
                  <div className="space-y-2">
                    <p className="text-gray-400 font-bold uppercase text-[9px] tracking-wider">Candidate Profile:</p>
                    <div className="space-y-1.5 text-gray-650 font-bold">
                      <p className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-[#4F46E5] shrink-0" />
                        <span><strong>Skills:</strong> <span className="font-semibold text-gray-800">{app.applicantSkills || 'Simple manual labor helper'}</span></span>
                      </p>
                      <p className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-[#4F46E5] shrink-0" />
                        <span><strong>History/Exp:</strong> <span className="font-semibold text-gray-800">{app.applicantExperience || 'Fresher and willing to learn'}</span></span>
                      </p>
                      <p className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-[#4F46E5] shrink-0" />
                        <span className="font-mono"><strong>Call Seeker:</strong> <span className="font-semibold text-gray-850">{app.applicantContact}</span></span>
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1.5 border-t md:border-t-0 md:border-l border-gray-100 pt-3 md:pt-0 md:pl-4">
                    <p className="text-gray-400 font-bold uppercase text-[9px] tracking-wider">Intro Cover Letter / Request:</p>
                    <p className="text-gray-650 italic leading-relaxed font-sans text-xs font-medium">
                      "{app.coverLetter}"
                    </p>
                  </div>
                </div>

                {/* Action CTA drawer */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <span className="text-[10px] text-gray-400 font-bold">
                    Applied: {new Date(app.createdAt).toLocaleDateString()}
                  </span>

                  <div className="flex flex-wrap gap-2">
                    {/* Actions for Shopkeeper to change applicant status */}
                    {isShopkeeper && (
                      <>
                        {app.status === 'pending' && (
                          <button
                            onClick={() => onUpdateStatus(app.id, 'shortlisted')}
                            className="bg-indigo-50 hover:bg-indigo-100 text-[#4F46E5] border border-indigo-200 font-extrabold text-xs px-3.5 py-1.5 rounded-xl transition-colors cursor-pointer"
                            id={`shortlist-btn-${app.id}`}
                          >
                            Shortlist Candidate
                          </button>
                        )}
                        {app.status !== 'hired' && (
                          <button
                            onClick={() => onUpdateStatus(app.id, 'hired')}
                            className="bg-emerald-100 hover:bg-emerald-200 text-emerald-950 border border-emerald-200 font-extrabold text-xs px-3.5 py-1.5 rounded-xl transition-colors cursor-pointer"
                            id={`hire-btn-${app.id}`}
                          >
                            Mark as Hired
                          </button>
                        )}
                        {app.status !== 'rejected' && (
                          <button
                            onClick={() => onUpdateStatus(app.id, 'rejected')}
                            className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-100 font-extrabold text-xs px-3.5 py-1.5 rounded-xl transition-colors cursor-pointer"
                            id={`reject-btn-${app.id}`}
                          >
                            Reject / Close
                          </button>
                        )}
                      </>
                    )}

                    {/* Direct Chat button is always present for both! */}
                    <button
                      onClick={() => onSelectChat(app.id)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-xs hover:shadow-md transition-all cursor-pointer"
                      id={`chat-action-btn-${app.id}`}
                    >
                      <MessageSquare className="w-4 h-4" />
                      Discuss Details (In-App Chat)
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-16 text-center bg-white rounded-3xl border-2 border-dashed border-gray-100">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h4 className="font-bold text-gray-700">No applications listed here</h4>
            <p className="text-xs text-gray-400 mt-1 font-semibold">
              {isShopkeeper
                ? 'Check your active job postings. Applications from seekers will appear here.'
                : "Submit an application by clicking 'Apply Now' on any shop vacancy."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
