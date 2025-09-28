// This file contains dummy data for system-wide announcements in the NextPhoton platform
// It includes announcements with different statuses, priorities, and target audiences

export interface Announcement {
  id: string
  title: string
  content: string
  type: 'general' | 'academic' | 'administrative' | 'emergency' | 'event' | 'holiday'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'draft' | 'active' | 'scheduled' | 'expired' | 'archived'
  visibility: 'public' | 'students' | 'educators' | 'guardians' | 'staff' | 'selected-groups'
  targetAudience: string[]
  createdBy: {
    userId: string
    userName: string
    role: string
  }
  createdAt: string
  publishDate: string
  expiryDate: string | null
  lastModified: string
  viewCount: number
  attachments?: string[]
  tags: string[]
  isSticky: boolean // Pin to top
  showOnHomepage: boolean
  emailNotification: boolean
  pushNotification: boolean
  readReceipts: {
    userId: string
    userName: string
    readAt: string
  }[]
}

export const announcements: Announcement[] = [
  {
    id: 'ann001',
    title: 'Winter Break Holiday Schedule',
    content: 'Dear students and parents,\n\nWe are pleased to announce the winter break schedule for 2024-25. Classes will be suspended from December 23, 2024, to January 6, 2025. Regular classes will resume on January 7, 2025.\n\nDuring this period, the administrative office will remain closed except for emergency situations. We wish everyone a wonderful winter break and happy holidays!',
    type: 'holiday',
    priority: 'medium',
    status: 'active',
    visibility: 'public',
    targetAudience: ['all'],
    createdBy: {
      userId: 'admin001',
      userName: 'Dr. Rajesh Sharma',
      role: 'Principal'
    },
    createdAt: '2024-12-15T09:00:00.000Z',
    publishDate: '2024-12-15T09:00:00.000Z',
    expiryDate: '2025-01-07T23:59:59.000Z',
    lastModified: '2024-12-15T09:00:00.000Z',
    viewCount: 245,
    tags: ['holiday', 'winter-break', 'schedule'],
    isSticky: true,
    showOnHomepage: true,
    emailNotification: true,
    pushNotification: true,
    readReceipts: [
      { userId: 'l001', userName: 'Aarav Patel', readAt: '2024-12-15T10:30:00.000Z' },
      { userId: 'g001', userName: 'Rajesh Patel', readAt: '2024-12-15T11:15:00.000Z' }
    ]
  },
  {
    id: 'ann002',
    title: 'JEE Main Mock Test Series - Registration Open',
    content: 'Attention JEE aspirants!\n\nRegistration is now open for our comprehensive JEE Main Mock Test Series. This series includes:\n\n• 15 full-length mock tests\n• Detailed performance analysis\n• Subject-wise practice sessions\n• Doubt clearing sessions with expert faculty\n\nRegistration deadline: December 25, 2024\nTest series starts: January 8, 2025\n\nRegister through the student portal or contact the academic office.',
    type: 'academic',
    priority: 'high',
    status: 'active',
    visibility: 'students',
    targetAudience: ['l001', 'l002', 'l004', 'l009'], // JEE students
    createdBy: {
      userId: 'e001',
      userName: 'Dr. Meera Sharma',
      role: 'Academic Coordinator'
    },
    createdAt: '2024-12-14T14:30:00.000Z',
    publishDate: '2024-12-14T14:30:00.000Z',
    expiryDate: '2024-12-25T23:59:59.000Z',
    lastModified: '2024-12-14T14:30:00.000Z',
    viewCount: 89,
    attachments: ['jee-mock-test-syllabus.pdf', 'registration-form.pdf'],
    tags: ['jee', 'mock-test', 'registration', 'academic'],
    isSticky: true,
    showOnHomepage: true,
    emailNotification: true,
    pushNotification: true,
    readReceipts: [
      { userId: 'l001', userName: 'Aarav Patel', readAt: '2024-12-14T15:45:00.000Z' },
      { userId: 'l004', userName: 'Ananya Desai', readAt: '2024-12-14T16:20:00.000Z' }
    ]
  },
  {
    id: 'ann003',
    title: 'New Science Laboratory Equipment Installation',
    content: 'We are excited to announce the installation of state-of-the-art equipment in our Physics and Chemistry laboratories. The new equipment includes:\n\n• Advanced microscopes with digital imaging\n• Spectrophotometers for chemistry analysis\n• Modern physics apparatus for demonstration\n• Safety equipment upgrades\n\nStudents will be oriented on the new equipment starting December 20, 2024.',
    type: 'general',
    priority: 'medium',
    status: 'scheduled',
    visibility: 'public',
    targetAudience: ['all'],
    createdBy: {
      userId: 'admin002',
      userName: 'Ms. Priya Rao',
      role: 'Facility Manager'
    },
    createdAt: '2024-12-12T11:00:00.000Z',
    publishDate: '2024-12-20T08:00:00.000Z',
    expiryDate: null,
    lastModified: '2024-12-12T11:00:00.000Z',
    viewCount: 0,
    tags: ['laboratory', 'equipment', 'science', 'facility'],
    isSticky: false,
    showOnHomepage: true,
    emailNotification: true,
    pushNotification: false,
    readReceipts: []
  },
  {
    id: 'ann004',
    title: 'Fee Payment Reminder - Q3 2024-25',
    content: 'Dear parents and guardians,\n\nThis is a friendly reminder that the third quarter fees for academic year 2024-25 are due by December 31, 2024.\n\nPayment options:\n• Online through student portal\n• Bank transfer\n• Cheque/DD in favor of NextPhoton EduTech\n\nFor any payment-related queries, please contact the accounts department.\n\nLate payment charges apply after the due date.',
    type: 'administrative',
    priority: 'high',
    status: 'active',
    visibility: 'guardians',
    targetAudience: ['g001', 'g002', 'g003', 'g004', 'g005', 'g006', 'g007', 'g008', 'g009', 'g010', 'g011', 'g012', 'g013'],
    createdBy: {
      userId: 'admin003',
      userName: 'Mr. Suresh Kumar',
      role: 'Accounts Manager'
    },
    createdAt: '2024-12-10T09:30:00.000Z',
    publishDate: '2024-12-10T09:30:00.000Z',
    expiryDate: '2025-01-05T23:59:59.000Z',
    lastModified: '2024-12-10T09:30:00.000Z',
    viewCount: 156,
    attachments: ['fee-structure-q3.pdf', 'payment-instructions.pdf'],
    tags: ['fees', 'payment', 'reminder', 'administrative'],
    isSticky: true,
    showOnHomepage: false,
    emailNotification: true,
    pushNotification: true,
    readReceipts: [
      { userId: 'g001', userName: 'Rajesh Patel', readAt: '2024-12-10T12:15:00.000Z' },
      { userId: 'g003', userName: 'Anil Reddy', readAt: '2024-12-10T14:30:00.000Z' }
    ]
  },
  {
    id: 'ann005',
    title: 'Parent-Teacher Meeting Schedule',
    content: 'We are pleased to announce the schedule for Parent-Teacher meetings for December 2024:\n\nDate: December 21, 2024 (Saturday)\nTime: 9:00 AM to 5:00 PM\nVenue: School Campus - Main Building\n\nAppointment slots are available through the parent portal. Each meeting is allocated 15 minutes per student.\n\nTopics for discussion:\n• Academic progress review\n• Behavioral assessment\n• Future academic planning\n• Individual student concerns\n\nPlease book your slots by December 19, 2024.',
    type: 'event',
    priority: 'high',
    status: 'active',
    visibility: 'guardians',
    targetAudience: ['g001', 'g002', 'g003', 'g004', 'g005', 'g006', 'g007', 'g008', 'g009', 'g010', 'g011', 'g012', 'g013'],
    createdBy: {
      userId: 'e002',
      userName: 'Prof. Anand Iyer',
      role: 'Academic Head'
    },
    createdAt: '2024-12-08T16:00:00.000Z',
    publishDate: '2024-12-08T16:00:00.000Z',
    expiryDate: '2024-12-21T18:00:00.000Z',
    lastModified: '2024-12-08T16:00:00.000Z',
    viewCount: 187,
    tags: ['ptm', 'meeting', 'parents', 'academic'],
    isSticky: true,
    showOnHomepage: true,
    emailNotification: true,
    pushNotification: true,
    readReceipts: [
      { userId: 'g001', userName: 'Rajesh Patel', readAt: '2024-12-08T17:30:00.000Z' },
      { userId: 'g002', userName: 'Sneha Patel', readAt: '2024-12-08T18:15:00.000Z' }
    ]
  },
  {
    id: 'ann006',
    title: 'Emergency Contact Update Required',
    content: 'URGENT: All students and guardians are required to update their emergency contact information in the system.\n\nDue to recent policy changes, we need verified emergency contacts including:\n• Primary guardian contact\n• Secondary emergency contact\n• Medical emergency contact\n• Local guardian details (if applicable)\n\nDeadline: December 22, 2024\n\nFailure to update may result in temporary access restrictions.\n\nUpdate through: Student/Parent Portal → Profile → Emergency Contacts',
    type: 'administrative',
    priority: 'urgent',
    status: 'active',
    visibility: 'public',
    targetAudience: ['all'],
    createdBy: {
      userId: 'admin001',
      userName: 'Dr. Rajesh Sharma',
      role: 'Principal'
    },
    createdAt: '2024-12-13T08:00:00.000Z',
    publishDate: '2024-12-13T08:00:00.000Z',
    expiryDate: '2024-12-22T23:59:59.000Z',
    lastModified: '2024-12-13T08:00:00.000Z',
    viewCount: 312,
    tags: ['urgent', 'emergency-contact', 'update', 'policy'],
    isSticky: true,
    showOnHomepage: true,
    emailNotification: true,
    pushNotification: true,
    readReceipts: [
      { userId: 'l001', userName: 'Aarav Patel', readAt: '2024-12-13T09:20:00.000Z' },
      { userId: 'g001', userName: 'Rajesh Patel', readAt: '2024-12-13T09:25:00.000Z' }
    ]
  },
  {
    id: 'ann007',
    title: 'NEET Biology Special Crash Course',
    content: 'Exclusive announcement for NEET aspirants!\n\nWe are launching a special Biology crash course to boost your NEET preparation:\n\nDuration: January 10 - March 15, 2025\nTimings: 6:00 AM - 8:00 AM (Daily)\nInstructor: Dr. Farah Qureshi\nFee: ₹15,000 (Early bird: ₹12,000 if registered by Dec 25)\n\nCourse highlights:\n• Comprehensive syllabus coverage\n• Daily practice tests\n• Doubt clearing sessions\n• Study materials included\n\nLimited seats: 30 students only\nRegistration: Academic office or online portal',
    type: 'academic',
    priority: 'medium',
    status: 'scheduled',
    visibility: 'students',
    targetAudience: ['l002', 'l005', 'l009'], // NEET students
    createdBy: {
      userId: 'e007',
      userName: 'Dr. Farah Qureshi',
      role: 'Biology Faculty'
    },
    createdAt: '2024-12-11T13:45:00.000Z',
    publishDate: '2024-12-18T10:00:00.000Z',
    expiryDate: '2025-01-09T23:59:59.000Z',
    lastModified: '2024-12-11T13:45:00.000Z',
    viewCount: 0,
    attachments: ['neet-biology-syllabus.pdf'],
    tags: ['neet', 'biology', 'crash-course', 'registration'],
    isSticky: false,
    showOnHomepage: true,
    emailNotification: true,
    pushNotification: true,
    readReceipts: []
  },
  {
    id: 'ann008',
    title: 'Digital Library Access Enhancement',
    content: 'We are pleased to announce significant enhancements to our digital library platform:\n\nNew Features:\n• 24/7 access to 10,000+ academic books\n• Interactive study materials\n• Video lectures library\n• Research paper database\n• Mobile app for offline reading\n\nAll students now have premium access included in their enrollment.\n\nTraining sessions on new features:\nDecember 19, 2024 - 2:00 PM to 4:00 PM\nDecember 20, 2024 - 10:00 AM to 12:00 PM\n\nLogin credentials have been sent via email.',
    type: 'general',
    priority: 'medium',
    status: 'active',
    visibility: 'public',
    targetAudience: ['all'],
    createdBy: {
      userId: 'admin004',
      userName: 'Ms. Kavita Singh',
      role: 'Library Manager'
    },
    createdAt: '2024-12-09T10:20:00.000Z',
    publishDate: '2024-12-09T10:20:00.000Z',
    expiryDate: null,
    lastModified: '2024-12-09T10:20:00.000Z',
    viewCount: 198,
    attachments: ['digital-library-guide.pdf', 'mobile-app-download.pdf'],
    tags: ['library', 'digital', 'access', 'enhancement'],
    isSticky: false,
    showOnHomepage: true,
    emailNotification: true,
    pushNotification: false,
    readReceipts: [
      { userId: 'l003', userName: 'Rohan Verma', readAt: '2024-12-09T14:30:00.000Z' },
      { userId: 'l007', userName: 'Priya Mehta', readAt: '2024-12-09T15:45:00.000Z' }
    ]
  },
  {
    id: 'ann009',
    title: 'Campus Security Protocol Update',
    content: 'Important security update for all campus users:\n\nEffective December 20, 2024, new security protocols will be implemented:\n\n• RFID card access for all entry points\n• Visitor registration mandatory\n• Enhanced CCTV monitoring\n• Emergency response system upgrade\n\nAll students and staff will receive new RFID cards by December 19, 2024.\n\nSecurity briefing session:\nDate: December 19, 2024\nTime: 11:00 AM\nVenue: Main Auditorium\n\nAttendance is mandatory for all staff members.',
    type: 'administrative',
    priority: 'high',
    status: 'expired',
    visibility: 'public',
    targetAudience: ['all'],
    createdBy: {
      userId: 'admin005',
      userName: 'Mr. Vikram Singh',
      role: 'Security Head'
    },
    createdAt: '2024-12-05T14:00:00.000Z',
    publishDate: '2024-12-05T14:00:00.000Z',
    expiryDate: '2024-12-19T23:59:59.000Z',
    lastModified: '2024-12-05T14:00:00.000Z',
    viewCount: 278,
    tags: ['security', 'protocol', 'rfid', 'mandatory'],
    isSticky: false,
    showOnHomepage: false,
    emailNotification: true,
    pushNotification: true,
    readReceipts: [
      { userId: 'e001', userName: 'Dr. Meera Sharma', readAt: '2024-12-05T15:30:00.000Z' },
      { userId: 'admin001', userName: 'Dr. Rajesh Sharma', readAt: '2024-12-05T15:45:00.000Z' }
    ]
  },
  {
    id: 'ann010',
    title: 'Annual Sports Day 2025 - Registration Open',
    content: 'Get ready for NextPhoton Annual Sports Day 2025!\n\nDate: February 15, 2025\nVenue: Campus Sports Complex\nTime: 8:00 AM to 6:00 PM\n\nEvents include:\n• Track and Field\n• Basketball Tournament\n• Chess Championship\n• Swimming Competition\n• Cricket Match\n• Badminton Singles/Doubles\n\nRegistration deadline: January 31, 2025\nParticipation certificates for all\nCash prizes for winners\n\nRegister through student portal or sports department.',
    type: 'event',
    priority: 'low',
    status: 'scheduled',
    visibility: 'public',
    targetAudience: ['all'],
    createdBy: {
      userId: 'staff001',
      userName: 'Mr. Ravi Sharma',
      role: 'Sports Coordinator'
    },
    createdAt: '2024-12-07T12:30:00.000Z',
    publishDate: '2025-01-05T08:00:00.000Z',
    expiryDate: '2025-01-31T23:59:59.000Z',
    lastModified: '2024-12-07T12:30:00.000Z',
    viewCount: 0,
    attachments: ['sports-day-schedule.pdf', 'registration-form.pdf'],
    tags: ['sports', 'annual', 'registration', 'competition'],
    isSticky: false,
    showOnHomepage: true,
    emailNotification: false,
    pushNotification: false,
    readReceipts: []
  }
]

// Helper functions to filter announcements
export const getActiveAnnouncements = () => {
  return announcements.filter(ann => ann.status === 'active')
}

export const getScheduledAnnouncements = () => {
  return announcements.filter(ann => ann.status === 'scheduled')
}

export const getExpiredAnnouncements = () => {
  return announcements.filter(ann => ann.status === 'expired')
}

export const getStickyAnnouncements = () => {
  return announcements.filter(ann => ann.isSticky && ann.status === 'active')
}

export const getAnnouncementsByType = (type: string) => {
  return announcements.filter(ann => ann.type === type)
}

export const getAnnouncementsByPriority = (priority: string) => {
  return announcements.filter(ann => ann.priority === priority)
}

// Sample announcement templates for quick creation
export const announcementTemplates = [
  {
    id: 'template001',
    name: 'Holiday Announcement',
    type: 'holiday',
    priority: 'medium',
    template: 'Dear students and parents,\n\nWe are pleased to announce the [HOLIDAY_NAME] schedule for [YEAR]. Classes will be suspended from [START_DATE] to [END_DATE]. Regular classes will resume on [RESUME_DATE].\n\nDuring this period, the administrative office will remain [OFFICE_STATUS]. We wish everyone a wonderful [HOLIDAY_NAME]!'
  },
  {
    id: 'template002',
    name: 'Exam Schedule',
    type: 'academic',
    priority: 'high',
    template: 'Attention students!\n\nThe [EXAM_TYPE] examination schedule has been released:\n\nExam Period: [START_DATE] to [END_DATE]\nTime: [EXAM_TIME]\nVenue: [VENUE]\n\nPlease check the detailed schedule on the student portal and prepare accordingly.'
  },
  {
    id: 'template003',
    name: 'Fee Reminder',
    type: 'administrative',
    priority: 'high',
    template: 'Dear parents and guardians,\n\nThis is a friendly reminder that the [QUARTER] fees for academic year [YEAR] are due by [DUE_DATE].\n\nPayment options:\n• Online through student portal\n• Bank transfer\n• Cheque/DD\n\nFor payment-related queries, please contact the accounts department.'
  },
  {
    id: 'template004',
    name: 'Event Invitation',
    type: 'event',
    priority: 'medium',
    template: 'We are excited to invite you to [EVENT_NAME]!\n\nDate: [EVENT_DATE]\nTime: [EVENT_TIME]\nVenue: [VENUE]\n\n[EVENT_DESCRIPTION]\n\nRegistration: [REGISTRATION_DETAILS]\n\nLooking forward to your participation!'
  },
  {
    id: 'template005',
    name: 'Emergency Notice',
    type: 'emergency',
    priority: 'urgent',
    template: 'URGENT NOTICE:\n\n[EMERGENCY_DETAILS]\n\nImmediate action required: [ACTION_REQUIRED]\n\nDeadline: [DEADLINE]\n\nFor assistance, contact: [CONTACT_INFO]'
  }
]