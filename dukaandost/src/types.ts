export type Role = 'shopkeeper' | 'seeker';

export interface UserProfile {
  id: string;
  role: Role;
  fullName: string;
  contactNumber: string;
  location: string;
  skills?: string;
  experience?: string;
  avatarColor?: string;
}

export interface UserReview {
  id: string;
  fromUserId: string;
  fromUserName: string;
  fromUserRole: Role;
  toUserId: string;
  rating: number; // 1 to 5
  comment: string;
  jobId: string;
  shopName: string;
  createdAt: string;
}

export interface ShopJob {
  id: string;
  shopName: string;
  shopType: string;
  location: string;
  ownerName: string;
  ownerContact: string;
  scale: 'small' | 'medium';
  expectedSkills: string;
  salaryEstimate: string;
  description: string;
  createdBy: string;
  createdAt: string;
  isActive: boolean;
}

export interface JobApplication {
  id: string;
  jobId: string;
  shopName: string;
  shopLocation: string;
  applicantId: string;
  applicantName: string;
  applicantContact: string;
  applicantSkills: string;
  applicantExperience: string;
  coverLetter: string;
  status: 'pending' | 'shortlisted' | 'rejected' | 'hired';
  createdAt: string;
}

export interface InterviewDetails {
  date: string;
  time: string;
  location: string;
  status: 'pending' | 'accepted' | 'declined';
}

export interface OfferDetails {
  salary: string;
  status: 'pending' | 'accepted' | 'declined';
}

export interface Message {
  id: string;
  applicationId: string;
  senderId: string;
  senderRole: Role;
  text: string;
  createdAt: string;
  specialType?: 'interview_proposal' | 'job_offer';
  interviewDetails?: InterviewDetails;
  offerDetails?: OfferDetails;
}
