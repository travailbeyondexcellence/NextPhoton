// Type definition for Announcement with all required fields
export type Announcement = {
    id: string;
    title: string;
    content: string;
    type: 'general' | 'academic' | 'administrative' | 'emergency' | 'event' | 'holiday';
    priority: 'urgent' | 'high' | 'medium' | 'low';
    status: 'active' | 'scheduled' | 'expired';
    visibility: 'all' | 'learners' | 'educators' | 'admins' | 'guardians' | 'employees';
    publishDate: string;
    expiryDate: string | null;
    isSticky: boolean;
    emailNotification: boolean;
    pushNotification: boolean;
    createdBy: {
        userId: string;
        userName: string;
    };
    createdAt: string;
    updatedAt: string;
    viewCount: number;
    readReceipts: string[];
    tags: string[];
    attachments?: string[];
};

// Template type for quick announcement creation
export type AnnouncementTemplate = {
    id: string;
    name: string;
    type: Announcement['type'];
    priority: Announcement['priority'];
    contentTemplate: string;
};

// Sample announcements data
export const announcements: Announcement[] = [
    // Active Announcements
    {
        id: "annc001",
        title: "JEE Advanced Bootcamp Starts June 1",
        content: "All JEE learners are expected to attend the intensive bootcamp starting next month. The bootcamp will cover advanced topics in Physics, Chemistry, and Mathematics. Daily attendance is mandatory.",
        type: "academic",
        priority: "high",
        status: "active",
        visibility: "learners",
        publishDate: "2025-09-25T09:00:00Z",
        expiryDate: "2025-11-30T23:59:59Z",
        isSticky: true,
        emailNotification: true,
        pushNotification: true,
        createdBy: {
            userId: "admin002",
            userName: "Dr. Sarah Johnson"
        },
        createdAt: "2025-09-20T10:30:00Z",
        updatedAt: "2025-09-20T10:30:00Z",
        viewCount: 1247,
        readReceipts: ["learner001", "learner002", "learner003"],
        tags: ["jee", "bootcamp", "mandatory"],
        attachments: ["bootcamp-schedule.pdf", "syllabus.pdf"]
    },
    {
        id: "annc002",
        title: "System Maintenance - October 5th",
        content: "Our platform will undergo scheduled maintenance on October 5th from 2:00 AM to 4:00 AM IST. During this time, the system will be unavailable. Please plan your activities accordingly.",
        type: "administrative",
        priority: "medium",
        status: "active",
        visibility: "all",
        publishDate: "2025-09-28T08:00:00Z",
        expiryDate: "2025-10-05T04:00:00Z",
        isSticky: true,
        emailNotification: true,
        pushNotification: true,
        createdBy: {
            userId: "admin001",
            userName: "Tech Support Team"
        },
        createdAt: "2025-09-27T14:20:00Z",
        updatedAt: "2025-09-27T14:20:00Z",
        viewCount: 3421,
        readReceipts: [],
        tags: ["maintenance", "system", "downtime"]
    },
    {
        id: "annc003",
        title: "Emergency: Classes Postponed Due to Weather",
        content: "Due to severe weather conditions, all classes scheduled for today (October 1st) have been postponed. We will notify you once classes resume. Stay safe!",
        type: "emergency",
        priority: "urgent",
        status: "active",
        visibility: "all",
        publishDate: "2025-10-01T06:00:00Z",
        expiryDate: "2025-10-02T23:59:59Z",
        isSticky: true,
        emailNotification: true,
        pushNotification: true,
        createdBy: {
            userId: "admin003",
            userName: "Administration Office"
        },
        createdAt: "2025-10-01T05:45:00Z",
        updatedAt: "2025-10-01T05:45:00Z",
        viewCount: 5632,
        readReceipts: ["learner001", "educator001"],
        tags: ["emergency", "weather", "postponed"],
        attachments: []
    },
    {
        id: "annc004",
        title: "New Course: Data Science Fundamentals",
        content: "We are excited to announce a new course on Data Science Fundamentals starting October 15th. This course is open to all intermediate and advanced learners. Register now!",
        type: "academic",
        priority: "medium",
        status: "active",
        visibility: "learners",
        publishDate: "2025-09-30T10:00:00Z",
        expiryDate: "2025-10-14T23:59:59Z",
        isSticky: false,
        emailNotification: true,
        pushNotification: false,
        createdBy: {
            userId: "educator005",
            userName: "Prof. Michael Chen"
        },
        createdAt: "2025-09-29T16:30:00Z",
        updatedAt: "2025-09-29T16:30:00Z",
        viewCount: 892,
        readReceipts: [],
        tags: ["new-course", "data-science", "registration"],
        attachments: ["course-outline.pdf"]
    },

    // Scheduled Announcements
    {
        id: "annc005",
        title: "Diwali Holiday Notice",
        content: "Our platform will be on holiday from October 20th to October 25th for Diwali celebrations. All classes and activities will resume on October 26th. Happy Diwali!",
        type: "holiday",
        priority: "medium",
        status: "scheduled",
        visibility: "all",
        publishDate: "2025-10-10T00:00:00Z",
        expiryDate: "2025-10-25T23:59:59Z",
        isSticky: false,
        emailNotification: true,
        pushNotification: true,
        createdBy: {
            userId: "admin001",
            userName: "Administration Office"
        },
        createdAt: "2025-09-15T10:00:00Z",
        updatedAt: "2025-09-15T10:00:00Z",
        viewCount: 0,
        readReceipts: [],
        tags: ["holiday", "diwali", "celebration"],
        attachments: []
    },
    {
        id: "annc006",
        title: "Parent-Teacher Meeting - October 12th",
        content: "A parent-teacher meeting is scheduled for October 12th at 4:00 PM. Guardians are requested to attend to discuss student progress and upcoming plans.",
        type: "event",
        priority: "high",
        status: "scheduled",
        visibility: "guardians",
        publishDate: "2025-10-08T08:00:00Z",
        expiryDate: "2025-10-12T18:00:00Z",
        isSticky: false,
        emailNotification: true,
        pushNotification: true,
        createdBy: {
            userId: "admin002",
            userName: "Student Affairs Office"
        },
        createdAt: "2025-09-25T11:20:00Z",
        updatedAt: "2025-09-25T11:20:00Z",
        viewCount: 0,
        readReceipts: [],
        tags: ["meeting", "guardians", "ptm"],
        attachments: ["meeting-agenda.pdf"]
    },
    {
        id: "annc007",
        title: "New Feature Release: Study Progress Tracker",
        content: "We're launching a new Study Progress Tracker on October 15th! This feature will help learners and guardians monitor academic progress in real-time. Stay tuned for more details!",
        type: "general",
        priority: "low",
        status: "scheduled",
        visibility: "all",
        publishDate: "2025-10-14T00:00:00Z",
        expiryDate: null,
        isSticky: false,
        emailNotification: false,
        pushNotification: true,
        createdBy: {
            userId: "admin001",
            userName: "Product Team"
        },
        createdAt: "2025-09-28T09:15:00Z",
        updatedAt: "2025-09-28T09:15:00Z",
        viewCount: 0,
        readReceipts: [],
        tags: ["feature", "update", "progress-tracker"],
        attachments: []
    },

    // Expired Announcements
    {
        id: "annc008",
        title: "Mid-Term Examination Results Published",
        content: "The mid-term examination results for all subjects have been published. Students can view their results in the student portal. For any queries, contact your respective educators.",
        type: "academic",
        priority: "high",
        status: "expired",
        visibility: "learners",
        publishDate: "2025-09-10T10:00:00Z",
        expiryDate: "2025-09-30T23:59:59Z",
        isSticky: false,
        emailNotification: true,
        pushNotification: true,
        createdBy: {
            userId: "admin002",
            userName: "Examination Board"
        },
        createdAt: "2025-09-10T08:30:00Z",
        updatedAt: "2025-09-10T08:30:00Z",
        viewCount: 4521,
        readReceipts: ["learner001", "learner002", "learner003", "learner004"],
        tags: ["exams", "results", "mid-term"],
        attachments: ["results-summary.pdf"]
    },
    {
        id: "annc009",
        title: "Independence Day Celebration Event",
        content: "Join us for the Independence Day celebration on August 15th at 9:00 AM. The event includes cultural performances, speeches, and flag hoisting ceremony.",
        type: "event",
        priority: "medium",
        status: "expired",
        visibility: "all",
        publishDate: "2025-08-10T00:00:00Z",
        expiryDate: "2025-08-15T23:59:59Z",
        isSticky: false,
        emailNotification: true,
        pushNotification: true,
        createdBy: {
            userId: "admin003",
            userName: "Events Committee"
        },
        createdAt: "2025-08-05T10:00:00Z",
        updatedAt: "2025-08-05T10:00:00Z",
        viewCount: 2134,
        readReceipts: [],
        tags: ["independence-day", "celebration", "event"],
        attachments: []
    },
    {
        id: "annc010",
        title: "Summer Batch Registration Closed",
        content: "Registration for the Summer 2025 batch has been closed. Thank you for your overwhelming response. Stay tuned for the Winter batch announcements.",
        type: "administrative",
        priority: "low",
        status: "expired",
        visibility: "all",
        publishDate: "2025-07-01T00:00:00Z",
        expiryDate: "2025-09-30T23:59:59Z",
        isSticky: false,
        emailNotification: false,
        pushNotification: false,
        createdBy: {
            userId: "admin001",
            userName: "Admissions Office"
        },
        createdAt: "2025-06-28T14:00:00Z",
        updatedAt: "2025-06-28T14:00:00Z",
        viewCount: 678,
        readReceipts: [],
        tags: ["registration", "summer-batch", "closed"],
        attachments: []
    }
];

// Helper functions to filter announcements by status
export const getActiveAnnouncements = (): Announcement[] => {
    return announcements.filter(announcement => announcement.status === 'active');
};

export const getScheduledAnnouncements = (): Announcement[] => {
    return announcements.filter(announcement => announcement.status === 'scheduled');
};

export const getExpiredAnnouncements = (): Announcement[] => {
    return announcements.filter(announcement => announcement.status === 'expired');
};

// Quick templates for creating announcements
export const announcementTemplates: AnnouncementTemplate[] = [
    {
        id: "template001",
        name: "System Maintenance",
        type: "administrative",
        priority: "medium",
        contentTemplate: "Our platform will undergo scheduled maintenance on [DATE] from [START_TIME] to [END_TIME]. During this time, the system will be unavailable."
    },
    {
        id: "template002",
        name: "Emergency Alert",
        type: "emergency",
        priority: "urgent",
        contentTemplate: "[EMERGENCY_DESCRIPTION]. Please take necessary precautions and follow the instructions provided."
    },
    {
        id: "template003",
        name: "Exam Schedule",
        type: "academic",
        priority: "high",
        contentTemplate: "The [EXAM_NAME] examination is scheduled for [DATE] at [TIME]. Students are required to [INSTRUCTIONS]."
    },
    {
        id: "template004",
        name: "Holiday Notice",
        type: "holiday",
        priority: "medium",
        contentTemplate: "Our platform will be on holiday from [START_DATE] to [END_DATE] for [HOLIDAY_NAME]. All classes will resume on [RESUME_DATE]."
    },
    {
        id: "template005",
        name: "New Course Launch",
        type: "academic",
        priority: "medium",
        contentTemplate: "We are excited to announce a new course on [COURSE_NAME] starting [START_DATE]. [COURSE_DESCRIPTION]."
    },
    {
        id: "template006",
        name: "General Event",
        type: "event",
        priority: "low",
        contentTemplate: "Join us for [EVENT_NAME] on [DATE] at [TIME]. [EVENT_DESCRIPTION]."
    }
];

export default announcements;
  