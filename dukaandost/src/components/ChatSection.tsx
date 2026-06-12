import React, { useState, useRef, useEffect } from 'react';
import { Message, JobApplication, UserProfile, ShopJob, InterviewDetails, OfferDetails } from '../types';
import { Send, MapPin, Calendar, DollarSign, Store, User, Phone, Check, X, Sparkles, Smile, MessageSquareCode, Award } from 'lucide-react';

interface ChatSectionProps {
  messages: Message[];
  applications: JobApplication[];
  currentProfile: UserProfile;
  jobs: ShopJob[];
  selectedAppId: string | null;
  onSelectAppId: (appId: string | null) => void;
  onSendMessage: (applicationId: string, text: string, specialType?: Message['specialType'], interviewDetails?: InterviewDetails, offerDetails?: OfferDetails) => void;
  onUpdateApplicationStatus: (applicationId: string, status: JobApplication['status']) => void;
  onUpdateMessageAction: (messageId: string, type: 'interview' | 'offer', status: 'accepted' | 'declined') => void;
}

export default function ChatSection({
  messages,
  applications,
  currentProfile,
  jobs,
  selectedAppId,
  onSelectAppId,
  onSendMessage,
  onUpdateApplicationStatus,
  onUpdateMessageAction
}: ChatSectionProps) {
  const isShopkeeper = currentProfile.role === 'shopkeeper';
  
  // Local tool forms toggle
  const [showInterviewForm, setShowInterviewForm] = useState(false);
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [inputText, setInputText] = useState('');

  // Interview Form inputs
  const [intDate, setIntDate] = useState('2026-06-10');
  const [intTime, setIntTime] = useState('11:00 AM');
  const [intLocation, setIntLocation] = useState('');

  // Offer Form inputs
  const [offerSalary, setOfferSalary] = useState('₹15,000 / month');

  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto Scroll message container
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedAppId]);

  // Filters application channels matching current profile
  const chatChannels = applications.filter((app) => {
    if (isShopkeeper) {
      // Show apps sent to shopkeeper's shops
      const myJobIds = jobs.filter((j) => j.createdBy === currentProfile.id).map((j) => j.id);
      return myJobIds.includes(app.jobId);
    } else {
      // Seekers see their own applied chats
      return app.applicantId === currentProfile.id;
    }
  });

  // Pick active channel
  const activeChannel = chatChannels.find((ch) => ch.id === selectedAppId) || chatChannels[0] || null;

  // Use channel selectedAppId hook if specified, else default to first channel
  useEffect(() => {
    if (activeChannel && selectedAppId !== activeChannel.id) {
      onSelectAppId(activeChannel.id);
    }
  }, [activeChannel, selectedAppId, onSelectAppId]);

  // Corresponding Job details
  const activeJob = activeChannel ? jobs.find((j) => j.id === activeChannel.jobId) : null;

  // Filter messages for current active channel
  const currentChatMessages = activeChannel ? messages.filter((m) => m.applicationId === activeChannel.id) : [];

  const handleSendText = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !activeChannel) return;

    onSendMessage(activeChannel.id, inputText);
    setInputText('');
  };

  const submitProposeInterview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeChannel) return;

    onSendMessage(
      activeChannel.id,
      `Namaste, I want to invite you for a physical face-to-face meeting at the shop counter. Please review the details below.`,
      'interview_proposal',
      {
        date: intDate,
        time: intTime,
        location: intLocation || activeJob?.location || 'At our shop location',
        status: 'pending'
      }
    );

    setShowInterviewForm(false);
  };

  const submitHiringOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeChannel) return;

    onSendMessage(
      activeChannel.id,
      `Congratulations! We really liked your profile. I am officially offering you the role with the salary package declared below. Welcome to our shop!`,
      'job_offer',
      undefined,
      {
        salary: offerSalary,
        status: 'pending'
      }
    );

    setShowOfferForm(false);
  };

  const handleActionClick = (msgId: string, type: 'interview' | 'offer', outcome: 'accepted' | 'declined') => {
    onUpdateMessageAction(msgId, type, outcome);

    if (!activeChannel) return;

    if (type === 'interview') {
      if (outcome === 'accepted') {
        onSendMessage(activeChannel.id, `Ji Uncle, I accept your interview call! I will see you on the scheduled date. Thank you!`);
        onUpdateApplicationStatus(activeChannel.id, 'shortlisted');
      } else {
        onSendMessage(activeChannel.id, `Sorry back, those timings are not suitable. Can you schedule to some other day?`);
      }
    } else {
      if (outcome === 'accepted') {
        onSendMessage(activeChannel.id, `Aparichit dhanyavaad Bhaiya! I feel extremely happy to accept the job offer! I will work with honesty and join from next Monday.`);
        onUpdateApplicationStatus(activeChannel.id, 'hired');
      } else {
        onSendMessage(activeChannel.id, `Thank you for the offer. However, I am looking for a higher salary bracket/different timings, so I cannot accept.`);
      }
    }
  };

  // Quick reply Hinglish Indian suggestions
  const quickRepliesSeeker = [
    'Namaste Bhaiya, please tell me the shop address.',
    'Are tomorrow\'s timings okay for an interview meeting?',
    'Is there helper lunch/food provided by the shop?',
    'Ji Uncle, I will reach the shop on time.'
  ];

  const quickRepliesShopkeeper = [
    'Please bring your Aadhar Card copy and one photo.',
    'Come tomorrow morning at 11 AM at the shop kitchen.',
    'Yes, can you start working with us from next Monday?',
    'Your behavior is very polite. Call me directly.'
  ];

  const activeQuickReplies = isShopkeeper ? quickRepliesShopkeeper : quickRepliesSeeker;

  return (
    <div className="bg-white border-2 border-slate-100 rounded-3xl overflow-hidden h-[630px] flex flex-col md:flex-row" id="chat-section-container">
      {/* LEFT PANEL: Channels/Application chats List */}
      <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-slate-100 flex flex-col h-1/3 md:h-full shrink-0">
        <div className="p-4 bg-[#EEF2FF]/40 border-b border-indigo-50/80 flex items-center justify-between">
          <span className="font-extrabold text-gray-900 text-xs flex items-center gap-1.5 uppercase tracking-wider">
            <Smile className="w-4.5 h-4.5 text-[#4F46E5]" />
            Active Chat Threads
          </span>
          <span className="bg-[#EEF2FF] text-[#4F46E5] px-2.5 py-0.5 rounded-full text-[10px] font-black">
            {chatChannels.length} Threads
          </span>
        </div>

        <div className="overflow-y-auto divide-y divide-gray-50 flex-1">
          {chatChannels.length > 0 ? (
            chatChannels.map((ch) => {
              const active = ch.id === selectedAppId;
              const chJob = jobs.find((j) => j.id === ch.jobId);
              return (
                <button
                  key={ch.id}
                  onClick={() => onSelectAppId(ch.id)}
                  className={`w-full p-4 text-left flex items-center gap-3 transition-colors ${
                    active ? 'bg-[#EEF2FF]/60 border-l-4 border-[#4F46E5]' : 'hover:bg-slate-50'
                  }`}
                  id={`chat-channel-item-${ch.id}`}
                >
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 font-black text-white text-xs ${isShopkeeper ? 'bg-violet-600' : 'bg-indigo-600'}`}>
                    {isShopkeeper ? ch.applicantName.substring(0, 2).toUpperCase() : chJob?.shopName.substring(0, 2).toUpperCase() || '🏪'}
                  </div>
                  <div className="truncate flex-1 min-w-0">
                    <p className="font-black text-gray-905 text-xs">
                      {isShopkeeper ? ch.applicantName : chJob?.shopName || ch.shopName}
                    </p>
                    <p className="text-[10px] text-gray-400 truncate mt-0.5 font-bold">
                      {isShopkeeper ? `${chJob?.shopName || ch.shopName}` : `Owner: ${chJob?.ownerName}`}
                    </p>
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded mt-1.5 inline-block ${
                      ch.status === 'hired' ? 'bg-emerald-100 text-emerald-800' :
                      ch.status === 'shortlisted' ? 'bg-blue-100 text-blue-800' :
                      'bg-indigo-50 text-indigo-800'
                    }`}>
                      {ch.status}
                    </span>
                  </div>
                </button>
              );
            })
          ) : (
            <div className="py-12 px-4 text-center text-gray-450 text-xs font-semibold">
              No messaging channels active. Apply for a job or get candidates to unlock chat rooms!
            </div>
          )}
        </div>
      </div>

      {/* RIGHT PANEL: Chat box conversation */}
      <div className="flex-1 flex flex-col h-2/3 md:h-full relative overflow-hidden bg-[#FDFCF8]/60">
        {activeChannel ? (
          <>
            {/* Thread Header details */}
            <div className="p-4 bg-white border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center border border-[#E0E7FF] shrink-0">
                  <Store className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-extrabold text-gray-900 text-sm">
                    {isShopkeeper ? activeChannel.applicantName : activeJob?.shopName}
                  </h3>
                  <p className="text-xs text-gray-400 font-bold mt-0.5">
                    {isShopkeeper 
                      ? `Candidate Mobile: ${activeChannel.applicantContact}` 
                      : `Owner Contact: ${activeJob?.ownerContact} (${activeJob?.ownerName})`}
                  </p>
                </div>
              </div>

              {/* Application Details overlay button */}
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full text-indigo-800 bg-[#EEF2FF] border border-[#E0E7FF]`}>
                  {activeChannel.status === 'hired' ? '🎉 HIRED!' : activeChannel.status.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Message Stream */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Application Header Meta */}
              <div className="text-center my-2 max-w-sm mx-auto">
                <div className="bg-[#EEF2FF] border border-[#E0E7FF] rounded-2xl p-3.5 text-center text-[11px] text-indigo-950 shadow-xs">
                  <p className="font-black tracking-wider uppercase text-[#4F46E5]">✨ DUKAANDOST CHATROOM ✨</p>
                  <p className="mt-1 font-semibold text-gray-650">Worker applied for <strong>{activeJob?.shopName}</strong> offering monthly salary of <strong>{activeJob?.salaryEstimate}</strong>.</p>
                </div>
              </div>

              {/* Message bubbles list */}
              {currentChatMessages.map((msg) => {
                const isMe = msg.senderId === currentProfile.id;
                
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col max-w-[85%] sm:max-w-[70%] space-y-1 ${
                      isMe ? 'ml-auto items-end' : 'mr-auto items-start'
                    }`}
                  >
                    {/* User display header */}
                    <span className="text-[9px] text-gray-400 font-bold px-1 uppercase tracking-wider">
                      {msg.senderRole === 'shopkeeper' ? 'Shopkeeper' : 'Candidate'}
                    </span>

                    {/* Standard bubble text */}
                    <div
                      className={`rounded-3xl p-3.5 text-xs leading-relaxed font-sans ${
                        isMe
                          ? 'bg-[#4F46E5] text-white rounded-tr-none shadow-xs'
                          : 'bg-white border-2 border-slate-50 text-gray-800 rounded-tl-none shadow-xs'
                      }`}
                    >
                      <div className="font-semibold">{msg.text}</div>

                      {/* Custom Special Card in-stream: INTERVIEW PROPOSAL */}
                      {msg.specialType === 'interview_proposal' && msg.interviewDetails && (
                        <div className="mt-3.5 bg-indigo-50 border border-indigo-150 rounded-2xl p-3.5 text-gray-850 space-y-2.5">
                          <div className="flex items-center gap-1.5 pb-2 border-b border-indigo-100/50">
                            <Calendar className="w-5 h-5 text-[#4F46E5] shrink-0" />
                            <div>
                              <p className="text-[10px] font-black uppercase text-indigo-800 tracking-wider">Interview Proposal Meeting</p>
                              <p className="font-bold text-gray-900 text-xs mt-0.5">Let's meet face-to-face!</p>
                            </div>
                          </div>
                          
                          <div className="space-y-1.5 text-xs text-slate-800 font-semibold">
                            <p>🗓️ <strong>Date Proposed:</strong> {msg.interviewDetails.date}</p>
                            <p>🕒 <strong>Convenient Time:</strong> {msg.interviewDetails.time}</p>
                            <p className="flex items-start gap-1 pb-1">
                              <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                              <span><strong>Shop Counter:</strong> {msg.interviewDetails.location}</span>
                            </p>
                          </div>

                          {/* Action decision buttons for seeker */}
                          <div className="pt-2 border-t border-gray-150/45 flex items-center justify-between gap-2 font-semibold">
                            {msg.interviewDetails.status === 'pending' ? (
                              currentProfile.role === 'seeker' ? (
                                <>
                                  <button
                                    onClick={() => handleActionClick(msg.id, 'interview', 'declined')}
                                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-extrabold px-2.5 py-1.5 rounded-xl text-[11px] flex-1 transition-colors"
                                  >
                                    Decline Details
                                  </button>
                                  <button
                                    onClick={() => handleActionClick(msg.id, 'interview', 'accepted')}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-3 py-1.5 rounded-xl text-[11px] flex-1 text-center shadow-xs transition-colors"
                                  >
                                    Accept Meeting ✔
                                  </button>
                                </>
                              ) : (
                                <span className="text-[10px] font-black text-indigo-700 italic animate-pulse">
                                  ⏳ Waiting for candidate response...
                                </span>
                              )
                            ) : (
                              <div className="w-full flex items-center justify-center p-1.5 bg-emerald-50 text-emerald-800 rounded-xl text-[10px] font-black gap-1">
                                <Check className="w-3.5 h-3.5" />
                                Meeting status: {msg.interviewDetails.status.toUpperCase()}ED
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Custom Special Card in-stream: HIRING OFFER */}
                      {msg.specialType === 'job_offer' && msg.offerDetails && (
                        <div className="mt-3.5 bg-gradient-to-r from-[#EEF2FF] to-indigo-50/50 border border-indigo-150 rounded-2xl p-3.5 text-slate-900 space-y-2.5">
                          <div className="flex items-center gap-1.5 pb-2 border-b border-indigo-100/50">
                            <Sparkles className="w-5 h-5 text-[#4F46E5] shrink-0 animate-bounce" />
                            <div>
                              <p className="text-[10px] font-black uppercase text-indigo-800 tracking-wider">Official Shop Hiring Offer 🎉</p>
                              <p className="font-extrabold text-slate-900 text-xs mt-0.5">Welcome To Our Dukaan Family!</p>
                            </div>
                          </div>
                          
                          <div className="space-y-1 text-xs text-slate-800 font-semibold">
                            <p className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4 text-[#4F46E5]" />
                              <span><strong>Agreed Package:</strong> {msg.offerDetails.salary}</span>
                            </p>
                            <p>🏢 <strong>Shop:</strong> {activeJob?.shopName}</p>
                          </div>

                          {/* Action decision buttons for seeker */}
                          <div className="pt-2 border-t border-indigo-150/50 flex items-center justify-between gap-2 font-semibold">
                            {msg.offerDetails.status === 'pending' ? (
                              currentProfile.role === 'seeker' ? (
                                <>
                                  <button
                                    onClick={() => handleActionClick(msg.id, 'offer', 'declined')}
                                    className="bg-gray-150 text-gray-700 font-extrabold px-2.5 py-1.5 rounded-xl text-[11px] flex-1"
                                  >
                                    Reject Job
                                  </button>
                                  <button
                                    onClick={() => handleActionClick(msg.id, 'offer', 'accepted')}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-3.5 py-1.5 rounded-xl text-[11px] flex-1 text-center shadow-xs animate-bounce"
                                  >
                                    Accept job offer ✔
                                  </button>
                                </>
                              ) : (
                                <span className="text-[10px] font-black text-emerald-700 italic animate-pulse">
                                  ⏳ Awaiting worker acceptance...
                                </span>
                              )
                            ) : (
                              <div className="w-full flex items-center justify-center p-1.5 bg-emerald-600 text-white rounded-xl text-[10.5px] font-bold gap-1">
                                <Award className="w-4 h-4 text-amber-300" />
                                OFFER {msg.offerDetails.status.toUpperCase()}ED! 🎉
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Time meta */}
                    <span className="text-[8px] text-gray-400 font-mono px-1 font-bold">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>

            {/* Quick replies block */}
            <div className="px-4 py-2 bg-white overflow-x-auto flex gap-1.5 border-t border-gray-100 whitespace-nowrap scrollbar-none shrink-0 z-10 select-none">
              <span className="text-[10px] font-black text-gray-450 self-center uppercase mr-1">Suggested replies:</span>
              {activeQuickReplies.map((qr) => (
                <button
                  key={qr}
                  onClick={() => setInputText(qr)}
                  className="text-[10px] bg-slate-50 hover:bg-[#EEF2FF] hover:text-[#4F46E5] text-gray-600 border border-gray-200 px-3 py-1 rounded-full cursor-pointer transition-colors font-bold"
                >
                  {qr}
                </button>
              ))}
            </div>

            {/* Toolbox Controls shown purely for Shopkeepers to initiate hiring/interview cards */}
            {isShopkeeper && (
              <div className="px-4 py-2.5 border-t border-gray-100 bg-[#EEF2FF]/40 flex flex-wrap gap-2 shrink-0 z-10">
                <span className="text-[10px] font-black uppercase text-indigo-905 self-center">💼 Shopkeeper Pro Actions:</span>
                
                <button
                  onClick={() => { setShowInterviewForm(!showInterviewForm); setShowOfferForm(false); }}
                  className={`text-[10.5px] font-extrabold px-3 py-1.5 rounded-lg border-2 cursor-pointer transition-all ${
                    showInterviewForm ? 'bg-[#4F46E5] text-white border-transparent' : 'bg-white hover:bg-[#EEF2FF] text-[#4F46E5] border-indigo-100'
                  }`}
                >
                  Propose Interview 📅
                </button>

                <button
                  onClick={() => { setShowOfferForm(!showOfferForm); setShowInterviewForm(false); }}
                  className={`text-[10.5px] font-extrabold px-3 py-1.5 rounded-lg border-2 cursor-pointer transition-all ${
                    showOfferForm ? 'bg-emerald-600 text-white border-transparent' : 'bg-white hover:bg-emerald-50 text-emerald-800 border-emerald-100'
                  }`}
                >
                  Extend Hiring Offer 💰
                </button>
              </div>
            )}

            {/* Pop-up Mini Forms for Shopkeeper interactions inside chat */}
            {isShopkeeper && showInterviewForm && (
              <form onSubmit={submitProposeInterview} className="absolute bottom-[60px] left-4 right-4 bg-white border-2 border-indigo-100 rounded-2xl p-4 shadow-xl space-y-3 z-30 animate-in slide-in-from-bottom-2">
                <div className="flex justify-between items-center pb-2 border-b border-indigo-50">
                  <h4 className="text-xs font-black text-gray-900">📋 Set Interview Schedule Details</h4>
                  <button type="button" onClick={() => setShowInterviewForm(false)} className="text-gray-400 hover:text-gray-650 text-xs font-bold">✕</button>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-0.5">Date Proposed:</label>
                    <input type="date" required value={intDate} onChange={(e) => setIntDate(e.target.value)} className="w-full bg-slate-50 border border-gray-200 p-1.5 rounded-xl font-bold focus:ring-2 focus:ring-[#4F46E5] focus:outline-none focus:border-transparent text-xs" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-0.5">Time Period:</label>
                    <input type="text" required value={intTime} onChange={(e) => setIntTime(e.target.value)} className="w-full bg-slate-50 border border-gray-200 p-1.5 rounded-xl focus:ring-2 focus:ring-[#4F46E5] focus:outline-none focus:border-transparent font-bold text-xs" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-0.5 font-sans">Shop Address Location:</label>
                  <input type="text" value={intLocation} onChange={(e) => setIntLocation(e.target.value)} placeholder={activeJob?.location || 'At shop location'} className="w-full bg-slate-50 border border-gray-200 p-1.5 rounded-xl text-xs focus:ring-2 focus:ring-[#4F46E5] focus:outline-none focus:border-transparent font-semibold" />
                </div>
                <div className="flex justify-end gap-2 text-xs pt-1">
                  <button type="button" onClick={() => setShowInterviewForm(false)} className="bg-gray-100 px-3 py-1.5 rounded-xl font-bold">Cancel</button>
                  <button type="submit" className="bg-[#4F46E5] text-white font-extrabold px-4 py-1.5 rounded-xl shadow-xs hover:bg-[#4338ca]">Send Call Details</button>
                </div>
              </form>
            )}

            {isShopkeeper && showOfferForm && (
              <form onSubmit={submitHiringOffer} className="absolute bottom-[60px] left-4 right-4 bg-white border-2 border-emerald-100 rounded-2xl p-4 shadow-xl space-y-3 z-30 animate-in slide-in-from-bottom-2">
                <div className="flex justify-between items-center pb-2 border-b border-emerald-100">
                  <h4 className="text-xs font-black text-emerald-950">🎉 Send Job Joining Offer</h4>
                  <button type="button" onClick={() => setShowOfferForm(false)} className="text-gray-400 hover:text-gray-650 text-xs font-bold">✕</button>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-0.5">Monthly Salary Offered Package:</label>
                  <input type="text" required value={offerSalary} onChange={(e) => setOfferSalary(e.target.value)} placeholder="₹14,000 / month" className="w-full bg-slate-50 border border-gray-200 p-2.5 rounded-xl text-xs focus:ring-2 focus:ring-[#4F46E5] focus:outline-none focus:border-transparent font-black text-emerald-800" />
                </div>
                <div className="flex justify-end gap-2 text-xs pt-1 font-semibold">
                  <button type="button" onClick={() => setShowOfferForm(false)} className="bg-gray-100 px-3 py-1.5 rounded-xl font-bold">Cancel</button>
                  <button type="submit" className="bg-emerald-600 text-white font-extrabold px-4 py-1.5 rounded-xl shadow-xs hover:bg-emerald-700">Send Selection Offer</button>
                </div>
              </form>
            )}

            {/* Standard input text bar */}
            <form onSubmit={handleSendText} className="p-3 bg-white border-t border-gray-150 flex items-center gap-2 shrink-0 z-10">
              <input
                type="text"
                placeholder="Type your message details..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 bg-slate-100 border border-transparent focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent rounded-2xl px-4 py-3 text-xs text-gray-800 font-semibold"
                id="message-input-textbox"
              />
              <button
                type="submit"
                className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border transition-all ${
                  inputText.trim() 
                    ? 'bg-[#4F46E5] text-white hover:scale-105 border-transparent shadow-md' 
                    : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                }`}
                disabled={!inputText.trim()}
                id="send-message-bubble-btn"
              >
                <Send className="w-4.5 h-4.5 ml-0.5" />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-slate-50/50">
            <MessageSquareCode className="w-12 h-12 text-gray-300 mb-2" />
            <h4 className="font-bold text-gray-600">No active shop conversations selected</h4>
            <p className="text-xs text-gray-400 mt-1 max-w-sm font-semibold">
              Use the sidebar panel on the left to click on any candidate application to open up standard messaging.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
