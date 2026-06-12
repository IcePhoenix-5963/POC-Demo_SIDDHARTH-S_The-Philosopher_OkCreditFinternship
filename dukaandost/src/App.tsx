import React, { useState, useEffect } from 'react';
import { UserProfile, ShopJob, JobApplication, Message, InterviewDetails, OfferDetails, UserReview } from './types';
import {
  INITIAL_PROFILES,
  INITIAL_JOBS,
  INITIAL_APPLICATIONS,
  INITIAL_MESSAGES,
  INITIAL_REVIEWS
} from './data';
import RoleSwitch from './components/RoleSwitch';
import JobSearch from './components/JobSearch';
import ManageJobs from './components/ManageJobs';
import ApplicationsList from './components/ApplicationsList';
import ChatSection from './components/ChatSection';
import ProfilesAndReviews from './components/ProfilesAndReviews';
import UserProfileModal from './components/UserProfileModal';
import { Search, FileText, MessageCircle, Store, HeartHandshake, Briefcase, IndianRupee, Sparkles, Building2, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  // Load initial states from localStorage if available, else use pre-seeds
  const [profiles] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('dd_profiles');
    return saved ? JSON.parse(saved) : INITIAL_PROFILES;
  });

  const [currentProfileId, setCurrentProfileId] = useState<string>(() => {
    return localStorage.getItem('dd_current_profile_id') || 'user-seeker-1';
  });

  const [jobs, setJobs] = useState<ShopJob[]>(() => {
    const saved = localStorage.getItem('dd_jobs');
    return saved ? JSON.parse(saved) : INITIAL_JOBS;
  });

  const [applications, setApplications] = useState<JobApplication[]>(() => {
    const saved = localStorage.getItem('dd_applications');
    return saved ? JSON.parse(saved) : INITIAL_APPLICATIONS;
  });

  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('dd_messages');
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  });

  const [reviews, setReviews] = useState<UserReview[]>(() => {
    const saved = localStorage.getItem('dd_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  // UI state controllers
  const [activeTab, setActiveTab] = useState<string>('search');
  const [selectedAppChatId, setSelectedAppChatId] = useState<string | null>(null);
  const [viewUserProfileId, setViewUserProfileId] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('dd_current_profile_id', currentProfileId);
    // Whenever profile changes, sync active tab correctly so we don't end up on a broken tab
    const p = profiles.find((x) => x.id === currentProfileId);
    if (p) {
      if (activeTab === 'chat' || activeTab === 'reviews') {
        return;
      }
      if (p.role === 'shopkeeper') {
        setActiveTab('manage_jobs');
      } else {
        setActiveTab('search');
      }
    }
  }, [currentProfileId, profiles, activeTab]);

  useEffect(() => {
    localStorage.setItem('dd_jobs', JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    localStorage.setItem('dd_applications', JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem('dd_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('dd_reviews', JSON.stringify(reviews));
  }, [reviews]);

  // Current User context helper
  const currentProfile = profiles.find((p) => p.id === currentProfileId) || profiles[0];
  const isShopkeeper = currentProfile.role === 'shopkeeper';

  // Handler: Add a job vacancy
  const handleAddJob = (newJobData: Omit<ShopJob, 'id' | 'createdBy' | 'createdAt'>) => {
    const newJob: ShopJob = {
      ...newJobData,
      id: `job-${Date.now()}`,
      createdBy: currentProfile.id,
      createdAt: new Date().toISOString()
    };
    setJobs((prev) => [newJob, ...prev]);
  };

  // Handler: Toggle job vacancy status active/filled
  const handleToggleJobStatus = (jobId: string) => {
    setJobs((prev) =>
      prev.map((job) =>
        job.id === jobId ? { ...job, isActive: !job.isActive } : job
      )
    );
  };

  // Handler: Apply for a job opening
  const handleApplyJob = (appData: Omit<JobApplication, 'id' | 'createdAt'>) => {
    const appId = `app-${Date.now()}`;
    const newApplication: JobApplication = {
      ...appData,
      id: appId,
      createdAt: new Date().toISOString()
    };

    setApplications((prev) => [newApplication, ...prev]);

    // Send an automatic initial cover letter message inside the newly created chat!
    const initMessage: Message = {
      id: `msg-first-${Date.now()}`,
      applicationId: appId,
      senderId: currentProfile.id,
      senderRole: 'seeker',
      text: appData.coverLetter || "Namaste, I am interested in this shop vacancy.",
      createdAt: new Date().toISOString()
    };
    setMessages((prev) => [...prev, initMessage]);

    // Automatically transition to the Messaging Tab and select this active app!
    setSelectedAppChatId(appId);
    setActiveTab('chat');
  };

  // Handler: Update application status
  const handleUpdateApplicationStatus = (appId: string, status: JobApplication['status']) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === appId ? { ...app, status } : app))
    );

    // If marked as hired, trigger-close the job post (mark isActive as false)
    if (status === 'hired') {
      const appInst = applications.find((a) => a.id === appId);
      if (appInst) {
        setJobs((prev) =>
          prev.map((j) => (j.id === appInst.jobId ? { ...j, isActive: false } : j))
        );
      }
    }
  };

  // Handler: Emit a chat message
  const handleSendMessage = (
    applicationId: string,
    text: string,
    specialType?: Message['specialType'],
    interviewDetails?: InterviewDetails,
    offerDetails?: OfferDetails
  ) => {
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      applicationId,
      senderId: currentProfile.id,
      senderRole: currentProfile.role,
      text,
      createdAt: new Date().toISOString(),
      specialType,
      interviewDetails,
      offerDetails
    };

    setMessages((prev) => [...prev, newMsg]);
  };

  // Handler: Add candidate/employer review
  const handleAddReview = (newReviewData: Omit<UserReview, 'id' | 'createdAt'>) => {
    const newReview: UserReview = {
      ...newReviewData,
      id: `rev-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setReviews((prev) => [newReview, ...prev]);
  };

  // Handler: Accept/Decline embedded interactive state cards
  const handleUpdateMessageAction = (msgId: string, type: 'interview' | 'offer', outcome: 'accepted' | 'declined') => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === msgId) {
          if (type === 'interview' && msg.interviewDetails) {
            return {
              ...msg,
              interviewDetails: { ...msg.interviewDetails, status: outcome }
            };
          }
          if (type === 'offer' && msg.offerDetails) {
            return {
              ...msg,
              offerDetails: { ...msg.offerDetails, status: outcome }
            };
          }
        }
        return msg;
      })
    );
  };

  const currentApplicationsCount = (jobId: string) => {
    return applications.filter((app) => app.jobId === jobId).length;
  };

  // Count unread message simulation or active chats count
  const myJobIds = jobs.filter((j) => j.createdBy === currentProfile.id).map((j) => j.id);
  const myApplicationsIds = isShopkeeper
    ? applications.filter((a) => myJobIds.includes(a.jobId)).map((a) => a.id)
    : applications.filter((a) => a.applicantId === currentProfile.id).map((a) => a.id);

  const myChatsCount = myApplicationsIds.length;

  return (
    <div className="min-h-screen bg-[#FDFCF8] flex flex-col font-sans antialiased text-gray-800 pb-12" id="dukaandost-root">
      
      {/* 1. Header & Active Role Manager Switcher */}
      <RoleSwitch
        profiles={profiles}
        currentProfile={currentProfile}
        onProfileChange={(uid) => {
          setCurrentProfileId(uid);
          setSelectedAppChatId(null);
        }}
      />

      {/* 2. Slogan Banner Grid - Indigo/Violet Gradient representing Vibrant Palette */}
      <div className="bg-gradient-to-r from-[#4F46E5] to-indigo-700 py-7 px-4 text-white text-center shadow-xs">
        <div className="max-w-4xl mx-auto space-y-2">
          <span className="bg-white/15 text-white/95 font-extrabold text-[10px] uppercase tracking-widest px-3 py-1 rounded-full border border-white/10">
            ShopSync Hiring Network
          </span>
          <h2 className="text-xl md:text-2xl font-black font-sans leading-tight">
            Connecting Local Shop Owners with Trusted Help
          </h2>
          <p className="text-xs text-indigo-100 max-w-xl mx-auto font-medium">
            Post vacancies, find reliable workers for local retail businesses (Groceries, Bakeries, Tech Outlets), and discuss hours over instant chat.
          </p>
        </div>
      </div>

      {/* Main Core Area Container */}
      <div className="max-w-7xl mx-auto px-4 w-full mt-6 flex-1">
        
        {/* Dynamic Context Dashboard greeting summaries */}
        <div className="bg-white border-2 border-slate-100 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 shadow-sm" id="quick-status-stats">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${isShopkeeper ? 'bg-[#EEF2FF] text-[#4F46E5]' : 'bg-emerald-50 text-emerald-600'}`}>
              {isShopkeeper ? <Building2 className="w-6 h-6" /> : <HeartHandshake className="w-6 h-6" />}
            </div>
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Welcome,</p>
              <h3 className="font-extrabold text-[#1F2937] text-lg leading-tight">
                {currentProfile.fullName} {isShopkeeper ? '(Merchant)' : ''}
              </h3>
              <p className="text-xs text-gray-500 mt-0.5 font-medium">
                {isShopkeeper 
                  ? `General store details loaded for ${currentProfile.location}`
                  : `Looking for local helper jobs in ${currentProfile.location}`}
              </p>
            </div>
          </div>

          {/* Quick numbers summary board */}
          <div className="flex gap-6 border-t md:border-t-0 md:border-l border-gray-100 pt-3 md:pt-0 md:pl-6">
            {isShopkeeper ? (
              <>
                <div className="text-center md:text-left">
                  <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Listed Jobs</span>
                  <p className="text-2xl font-black text-[#4F46E5]">{jobs.filter(j => j.createdBy === currentProfile.id).length}</p>
                </div>
                <div className="text-center md:text-left">
                  <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Total Applicants</span>
                  <p className="text-2xl font-black text-emerald-600">{myApplicationsIds.length}</p>
                </div>
              </>
            ) : (
              <>
                <div className="text-center md:text-left">
                  <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Applied</span>
                  <p className="text-2xl font-black text-[#4F46E5]">
                    {applications.filter(a => a.applicantId === currentProfile.id).length}
                  </p>
                </div>
                <div className="text-center md:text-left">
                  <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Approved</span>
                  <p className="text-2xl font-black text-emerald-600">
                    {applications.filter(a => a.applicantId === currentProfile.id && a.status === 'shortlisted').length}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* 3. Tab controllers */}
        <div className="flex flex-wrap border-2 border-gray-150/70 mb-6 bg-white rounded-2xl p-1.5 shadow-sm gap-1" id="main-navigation-tabs">
          {/* SEEKER TABS */}
          {!isShopkeeper && (
            <>
              <button
                onClick={() => setActiveTab('search')}
                className={`flex-1 min-w-[200px] flex items-center justify-center gap-2 py-3 px-4 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  activeTab === 'search'
                    ? 'bg-[#4F46E5] text-white shadow-md'
                    : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100/50'
                }`}
              >
                <Search className="w-4 h-4" />
                Explore Shop Jobs (Dukaan Listing)
              </button>

              <button
                onClick={() => setActiveTab('my_applications')}
                className={`flex-1 min-w-[180px] flex items-center justify-center gap-2 py-3 px-4 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  activeTab === 'my_applications'
                    ? 'bg-[#4F46E5] text-white shadow-md'
                    : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100/50'
                }`}
              >
                <FileText className="w-4 h-4" />
                My Sent Applications
              </button>
            </>
          )}

          {/* SHOPKEEPER TABS */}
          {isShopkeeper && (
            <>
              <button
                onClick={() => setActiveTab('manage_jobs')}
                className={`flex-1 min-w-[180px] flex items-center justify-center gap-2 py-3 px-4 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  activeTab === 'manage_jobs'
                    ? 'bg-[#4F46E5] text-white shadow-md'
                    : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100/50'
                }`}
              >
                <Store className="w-4 h-4" />
                Post & Manage Vacancies
              </button>

              <button
                onClick={() => setActiveTab('my_applications')}
                className={`flex-1 min-w-[180px] flex items-center justify-center gap-2 py-3 px-4 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  activeTab === 'my_applications'
                    ? 'bg-[#4F46E5] text-white shadow-md'
                    : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100/50'
                }`}
              >
                <FileText className="w-4 h-4" />
                Review Candidate Appls
              </button>
            </>
          )}

          {/* SHARED RATINGS & REVIEWS TAB */}
          <button
            onClick={() => setActiveTab('reviews')}
            className={`flex-1 min-w-[180px] flex items-center justify-center gap-2 py-3 px-4 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'reviews'
                ? 'bg-[#4F46E5] text-white shadow-md'
                : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100/50'
            }`}
          >
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            Ratings & Reviews Hub
          </button>

          {/* SHARED CHAT TAB */}
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex-1 min-w-[150px] flex items-center justify-center gap-2 py-3 px-4 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'chat'
                ? 'bg-[#4F46E5] text-white shadow-md'
                : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100/50'
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            Direct Messaging ({myChatsCount})
          </button>
        </div>

        {/* 4. Tab Contents Viewport switcher with subtle fade transitions */}
        <div className="bg-[#FDFCF8] min-h-[500px]" id="tab-content-viewport">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeTab}-${currentProfileId}`}
              initial={{ opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -3 }}
              transition={{ duration: 0.12 }}
            >
              {activeTab === 'search' && !isShopkeeper && (
                <JobSearch
                  jobs={jobs}
                  applications={applications}
                  currentProfile={currentProfile}
                  onApply={handleApplyJob}
                  onSelectChat={(appId) => {
                    setSelectedAppChatId(appId);
                    setActiveTab('chat');
                  }}
                  onViewOwnerProfile={(ownerId) => setViewUserProfileId(ownerId)}
                />
              )}

              {activeTab === 'manage_jobs' && isShopkeeper && (
                <ManageJobs
                  jobs={jobs}
                  currentProfile={currentProfile}
                  currentApplicationsCount={currentApplicationsCount}
                  onAddJob={handleAddJob}
                  onToggleStatus={handleToggleJobStatus}
                />
              )}

              {activeTab === 'my_applications' && (
                <ApplicationsList
                  applications={applications}
                  currentProfile={currentProfile}
                  jobs={jobs}
                  onUpdateStatus={handleUpdateApplicationStatus}
                  onSelectChat={(appId) => {
                    setSelectedAppChatId(appId);
                    setActiveTab('chat');
                  }}
                  onViewApplicantProfile={(profileId) => setViewUserProfileId(profileId)}
                />
              )}

              {activeTab === 'chat' && (
                <ChatSection
                  messages={messages}
                  applications={applications}
                  currentProfile={currentProfile}
                  jobs={jobs}
                  selectedAppId={selectedAppChatId}
                  onSelectAppId={(appId) => setSelectedAppChatId(appId)}
                  onSendMessage={handleSendMessage}
                  onUpdateApplicationStatus={handleUpdateApplicationStatus}
                  onUpdateMessageAction={handleUpdateMessageAction}
                />
              )}

              {activeTab === 'reviews' && (
                <ProfilesAndReviews
                  profiles={profiles}
                  reviews={reviews}
                  jobs={jobs}
                  applications={applications}
                  currentProfile={currentProfile}
                  onViewProfile={(profileId) => setViewUserProfileId(profileId)}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

      </div>

      {/* Styled Footer Block Info */}
      <footer className="mt-16 border-t border-gray-200 pt-8" id="dukaandost-footer">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-3">
          <div className="flex justify-center items-center gap-1.5 text-gray-500 font-extrabold text-xs">
            <span className="p-1 rounded bg-amber-100 text-amber-800">🏪</span>
            DukaanDost Helper Hub India
          </div>
          <p className="text-[11px] text-gray-400 max-w-md mx-auto">
            Designated for small scale chai stalls, boutique apparel counters, kirana shops, and other local business families. Facilitating instant chats, map listings, offline persistence, and direct call coordination.
          </p>
          <div className="text-[10px] text-gray-350">
            © 2026 DukaanDost Co. All Rights Reserved. Made for Indian Dukaan Commerce.
          </div>
        </div>
      </footer>

      {viewUserProfileId !== null && (
        <UserProfileModal
          targetProfileId={viewUserProfileId}
          currentProfile={currentProfile}
          profiles={profiles}
          reviews={reviews}
          jobs={jobs}
          applications={applications}
          onClose={() => setViewUserProfileId(null)}
          onAddReview={handleAddReview}
        />
      )}

    </div>
  );
}
