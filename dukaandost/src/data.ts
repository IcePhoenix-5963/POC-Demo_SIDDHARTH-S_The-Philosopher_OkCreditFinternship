import { UserProfile, ShopJob, JobApplication, Message, UserReview } from './types';

export const INDIAN_LOCATIONS = [
  'Sector 62, Noida',
  'Koramangala, Bengaluru',
  'Kalbadevi, Mumbai',
  'Sadashiv Peth, Pune',
  'Chandni Chowk, Delhi',
  'Salt Lake, Kolkata',
  'T. Nagar, Chennai',
  'Gachibowli, Hyderabad'
];

export const SHOP_TYPES = [
  'Kirana & General Store',
  'Chai & Snacks Stall',
  'Sweet Shop & Farsan (Mithai)',
  'Saree & Clothing Boutique',
  'Mobile & Electronics Repair',
  'Kirana & Grocery',
  'Bakery & Dairy Products',
  'Hardware & Electricals',
  'Medical & Pharmacy'
];

export const INITIAL_PROFILES: UserProfile[] = [
  // Shopkeepers
  {
    id: 'user-shop-1',
    role: 'shopkeeper',
    fullName: 'Ramesh Gupta',
    contactNumber: '+91 98765 43210',
    location: 'Sector 62, Noida',
    avatarColor: 'bg-orange-500'
  },
  {
    id: 'user-shop-2',
    role: 'shopkeeper',
    fullName: 'Rajesh Kumar',
    contactNumber: '+91 91234 56789',
    location: 'Koramangala, Bengaluru',
    avatarColor: 'bg-green-600'
  },
  {
    id: 'user-shop-3',
    role: 'shopkeeper',
    fullName: 'Aarav Patel',
    contactNumber: '+91 88888 77777',
    location: 'Kalbadevi, Mumbai',
    avatarColor: 'bg-blue-600'
  },
  {
    id: 'user-shop-4',
    role: 'shopkeeper',
    fullName: 'Sunita Sharma',
    contactNumber: '+91 76543 21098',
    location: 'Sadashiv Peth, Pune',
    avatarColor: 'bg-pink-600'
  },
  // Seekers
  {
    id: 'user-seeker-1',
    role: 'seeker',
    fullName: 'Priya Sharma',
    contactNumber: '+91 99988 87776',
    location: 'Sector 62, Noida',
    skills: 'Computer Billing, Fast Calculator, Fluent Hindi, Basic English',
    experience: '6 months helper at Sharma General Store',
    avatarColor: 'bg-purple-600'
  },
  {
    id: 'user-seeker-2',
    role: 'seeker',
    fullName: 'Sunil Kumar',
    contactNumber: '+91 88776 65544',
    location: 'Kalbadevi, Mumbai',
    skills: 'Stock Loading, Courier Packaging, Marathi & Hindi Speaking',
    experience: 'Helper at local logistics warehouse for 1 year',
    avatarColor: 'bg-teal-600'
  },
  {
    id: 'user-seeker-3',
    role: 'seeker',
    fullName: 'Rahul Verma',
    contactNumber: '+91 77665 54433',
    location: 'Koramangala, Bengaluru',
    skills: 'Tea & Coffee Maker, Snacks Helper, Quick Learner',
    experience: 'Fresher, eager to learn tea-making techniques',
    avatarColor: 'bg-amber-600'
  },
  {
    id: 'user-seeker-4',
    role: 'seeker',
    fullName: 'Meera Nair',
    contactNumber: '+91 91122 33445',
    location: 'Sadashiv Peth, Pune',
    skills: 'Saree Draping, polite communication, Marathi & Hindi',
    experience: '1 year girl volunteer at apparel boutique',
    avatarColor: 'bg-indigo-600'
  }
];

export const INITIAL_JOBS: ShopJob[] = [
  {
    id: 'job-1',
    shopName: 'Gupta Kirana & General Store',
    shopType: 'Kirana & Grocery',
    location: 'Sector 62, Noida',
    ownerName: 'Ramesh Gupta',
    ownerContact: '+91 98765 43210',
    scale: 'medium',
    expectedSkills: 'Hindi speaking, Simple math, billing machine operation, local area delivery knowledge',
    salaryEstimate: '₹14,500 / month',
    description: 'Looking for a reliable counter-assistant who can help in managing general grocery items, invoicing customers, and attending to walk-in requests. Sunday of every week is a half-day. Friendly staff and tea will be provided.',
    createdBy: 'user-shop-1',
    createdAt: '2026-06-01T10:00:00Z',
    isActive: true
  },
  {
    id: 'job-2',
    shopName: 'Rajesh Chai & Snack Counter',
    shopType: 'Chai & Snacks Stall',
    location: 'Koramangala, Bengaluru',
    ownerName: 'Rajesh Kumar',
    ownerContact: '+91 91234 56789',
    scale: 'small',
    expectedSkills: 'Chai brewing, hot snacks preparation (samosa, bread pakoda), Kannada/Hindi conversation',
    salaryEstimate: '₹11,500 / month',
    description: 'Urgent helper required for daily operations of a premium chai outlet in Koramangala. Duty: making and brewing fresh ginger-cardamom tea and serving snacks. Morning shift starting at 6:30 AM is mandatory.',
    createdBy: 'user-shop-2',
    createdAt: '2026-06-02T11:30:00Z',
    isActive: true
  },
  {
    id: 'job-3',
    shopName: 'Krishna Sweets & Farsan',
    shopType: 'Sweet Shop & Farsan (Mithai)',
    location: 'Kalbadevi, Mumbai',
    ownerName: 'Aarav Patel',
    ownerContact: '+91 88888 77777',
    scale: 'medium',
    expectedSkills: 'Sweet box packing, fast cash register operations, Gujarati/Hindi conversation, hygiene habit',
    salaryEstimate: '₹17,000 / month',
    description: 'We need an experienced sweet stall sales partner. Tasks include decorating the mithai counters, wrapping gift boxes neatly, and recording sales. Food and evening sweets are on us.',
    createdBy: 'user-shop-3',
    createdAt: '2026-06-03T09:00:00Z',
    isActive: true
  },
  {
    id: 'job-4',
    shopName: 'Sai Saree & Boutique',
    shopType: 'Saree & Clothing Boutique',
    location: 'Sadashiv Peth, Pune',
    ownerName: 'Sunita Sharma',
    ownerContact: '+91 76543 21098',
    scale: 'small',
    expectedSkills: 'Polite presentation, draping assistance, managing clothing racks, Marathi speaker preferred',
    salaryEstimate: '₹13,000 / month',
    description: 'We require a friendly girl or boy to showcase ethnic sarees & suits to local female customers. High festival bonuses and overtime pay for Pune festival season (Ganesh Utsav).',
    createdBy: 'user-shop-4',
    createdAt: '2026-06-04T15:15:00Z',
    isActive: true
  }
];

export const INITIAL_APPLICATIONS: JobApplication[] = [
  {
    id: 'app-1',
    jobId: 'job-1',
    shopName: 'Gupta Kirana & General Store',
    shopLocation: 'Sector 62, Noida',
    applicantId: 'user-seeker-1',
    applicantName: 'Priya Sharma',
    applicantContact: '+91 99988 87776',
    applicantSkills: 'Computer Billing, Fast Calculator, Fluent Hindi, Basic English',
    applicantExperience: '6 months helper at Sharma General Store',
    coverLetter: 'Namaste Ramesh Uncle, I live nearby in Sector 63. I recently finished my school education and need to work side-by-side to fund my college degree. I am very honest and can calculate bills extremely fast. Hope to talk to you soon!',
    status: 'shortlisted',
    createdAt: '2026-06-04T12:00:00Z'
  },
  {
    id: 'app-2',
    jobId: 'job-3',
    shopName: 'Krishna Sweets & Farsan',
    shopLocation: 'Kalbadevi, Mumbai',
    applicantId: 'user-seeker-2',
    applicantName: 'Sunil Kumar',
    applicantContact: '+91 88776 65544',
    applicantSkills: 'Stock Loading, Courier Packaging, Marathi & Hindi Speaking',
    applicantExperience: 'Helper at local logistics warehouse for 1 year',
    coverLetter: 'Pranam Aarav ji, I have packaging experience of sweet tins and snacks box. I live walking distance from Kalbadevi and can work full-time hours without any delay. Highly dedicated and clean person.',
    status: 'pending',
    createdAt: '2026-06-04T14:45:00Z'
  },
  {
    id: 'app-prev-1',
    jobId: 'job-1',
    shopName: 'Gupta Kirana & General Store',
    shopLocation: 'Sector 62, Noida',
    applicantId: 'user-seeker-3',
    applicantName: 'Rahul Verma',
    applicantContact: '+91 77665 54433',
    applicantSkills: 'Tea & Coffee Maker, Snacks Helper, Quick Learner',
    applicantExperience: 'Fresher, eager to learn tea-making techniques',
    coverLetter: 'I am interested in working at your grocery store. I can work hard and do delivery also.',
    status: 'hired',
    createdAt: '2026-05-10T09:00:00Z'
  },
  {
    id: 'app-prev-2',
    jobId: 'job-2',
    shopName: 'Rajesh Chai & Snack Counter',
    shopLocation: 'Koramangala, Bengaluru',
    applicantId: 'user-seeker-4',
    applicantName: 'Meera Nair',
    applicantContact: '+91 91122 33445',
    applicantSkills: 'Saree Draping, polite communication, Marathi & Hindi',
    applicantExperience: '1 year girl volunteer at apparel boutique',
    coverLetter: 'Namaste Rajesh bhaiya, I can assist in sales and handle the snack counter.',
    status: 'hired',
    createdAt: '2026-05-18T14:00:00Z'
  }
];

export const INITIAL_MESSAGES: Message[] = [
  // Application 1 messages
  {
    id: 'm1-1',
    applicationId: 'app-1',
    senderId: 'user-seeker-1',
    senderRole: 'seeker',
    text: 'Namaste Ramesh Uncle, I have submitted my application for the billing assistant role.',
    createdAt: '2026-06-04T12:15:00Z'
  },
  {
    id: 'm1-2',
    applicationId: 'app-1',
    senderId: 'user-shop-1',
    senderRole: 'shopkeeper',
    text: 'Pranam Priya beta. Your application is very impressive. Tell me, do you have any experience with computer billing systems?',
    createdAt: '2026-06-04T14:20:00Z'
  },
  {
    id: 'm1-3',
    applicationId: 'app-1',
    senderId: 'user-seeker-1',
    senderRole: 'seeker',
    text: 'Ji Uncle, I know basic computers and am fast with mobile calculators. I can learn any software system in just one day!',
    createdAt: '2026-06-04T14:30:00Z'
  },
  {
    id: 'm1-4',
    applicationId: 'app-1',
    senderId: 'user-shop-1',
    senderRole: 'shopkeeper',
    text: 'That sounds perfect. I would like to lock in an interview to meet you in person.',
    createdAt: '2026-06-04T15:00:00Z'
  },
  {
    id: 'm1-5',
    applicationId: 'app-1',
    senderId: 'user-shop-1',
    senderRole: 'shopkeeper',
    text: 'Please look at my proposal below and accept if timings are favorable.',
    createdAt: '2026-06-04T15:01:00Z',
    specialType: 'interview_proposal',
    interviewDetails: {
      date: '2026-06-08',
      time: '11:00 AM',
      location: 'Gupta Kirana Store, Block C-5, Noida Sector 62',
      status: 'pending'
    }
  }
];

export const INITIAL_REVIEWS: UserReview[] = [
  {
    id: 'rev-1',
    fromUserId: 'user-shop-1',
    fromUserName: 'Ramesh Gupta',
    fromUserRole: 'shopkeeper',
    toUserId: 'user-seeker-3',
    rating: 5,
    comment: 'Rahul is highly energetic and learned billing procedures very quickly! Extremely polite to our local neighborhood customers. Perfect helper.',
    jobId: 'job-prev-1',
    shopName: 'Gupta Kirana Store',
    createdAt: '2026-05-15T12:00:00Z'
  },
  {
    id: 'rev-2',
    fromUserId: 'user-seeker-3',
    fromUserName: 'Rahul Verma',
    fromUserRole: 'seeker',
    toUserId: 'user-shop-1',
    rating: 5,
    comment: 'Ramesh Uncle is very humble and friendly. He paid my monthly wages on time and also provided daily hot samosa and chai. Great learning experience for a fresher.',
    jobId: 'job-prev-1',
    shopName: 'Gupta Kirana Store',
    createdAt: '2026-05-16T10:00:00Z'
  },
  {
    id: 'rev-3',
    fromUserId: 'user-shop-2',
    fromUserName: 'Rajesh Kumar',
    fromUserRole: 'shopkeeper',
    toUserId: 'user-seeker-4',
    rating: 4,
    comment: 'Meera handled the crowds at our snack counter very well. She has basic computer knowledge and did accurate cash handling. Highly respectable behavior.',
    jobId: 'job-prev-2',
    shopName: 'Rajesh Chai & Snack Counter',
    createdAt: '2026-05-20T17:00:00Z'
  },
  {
    id: 'rev-4',
    fromUserId: 'user-seeker-4',
    fromUserName: 'Meera Nair',
    fromUserRole: 'seeker',
    toUserId: 'user-shop-2',
    rating: 4,
    comment: 'Good working setup and energetic environment. Work got slightly busy during evening festival rushes, but Rajesh Bhaiya always supported and paid overtime bonuses too.',
    jobId: 'job-prev-2',
    shopName: 'Rajesh Chai & Snack Counter',
    createdAt: '2026-05-21T18:30:00Z'
  }
];

