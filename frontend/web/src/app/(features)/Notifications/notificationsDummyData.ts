// Helper function to get relative dates
const getRelativeDate = (daysOffset: number): string => {
  const date = new Date()
  date.setDate(date.getDate() + daysOffset)
  return date.toISOString()
}

export interface Notification {
  id: string
  type: 'message' | 'alert' | 'announcement' | 'reminder' | 'system' | 'achievement'
  title: string
  content: string
  sender: {
    id: string
    name: string
    role: string
    avatar?: string
  }
  recipient: {
    id: string
    name: string
    role: string
    type: 'individual' | 'group' | 'broadcast'
  }
  priority: 'high' | 'medium' | 'low'
  status: 'unread' | 'read' | 'archived'
  category: 'Academic' | 'Administrative' | 'Emergency' | 'General' | 'Personal' | 'System'
  timestamp: string
  scheduledFor?: string
  expiresAt?: string
  attachments?: {
    name: string
    url: string
    type: string
    size: string
  }[]
  actions?: {
    label: string
    action: string
    type: 'primary' | 'secondary' | 'danger'
  }[]
  metadata?: {
    classId?: string
    className?: string
    subjectId?: string
    subjectName?: string
    eventId?: string
    taskId?: string
  }
  readBy?: {
    userId: string
    readAt: string
  }[]
  deliveryStatus: 'sent' | 'delivered' | 'failed' | 'pending' | 'scheduled'
  channel: 'in-app' | 'email' | 'sms' | 'push' | 'all'
}

export const notifications: Notification[] = [
  // Unread Notifications
  {
    id: "notif001",
    type: "message",
    title: "Parent Meeting Request",
    content: "Mrs. Johnson has requested a meeting regarding Emily's recent academic performance. Please confirm your availability for next week.",
    sender: {
      id: "g001",
      name: "Mrs. Sarah Johnson",
      role: "Guardian"
    },
    recipient: {
      id: "e001",
      name: "Dr. Sarah Johnson",
      role: "Educator",
      type: "individual"
    },
    priority: "high",
    status: "unread",
    category: "Academic",
    timestamp: getRelativeDate(-1),
    deliveryStatus: "delivered",
    channel: "in-app",
    actions: [
      { label: "Accept", action: "accept_meeting", type: "primary" },
      { label: "Reschedule", action: "reschedule_meeting", type: "secondary" }
    ],
    metadata: {
      classId: "c001",
      className: "Grade 10A"
    }
  },
  {
    id: "notif002",
    type: "alert",
    title: "Assignment Deadline Tomorrow",
    content: "Mathematics Assignment 5 is due tomorrow at 11:59 PM. 12 students have not yet submitted.",
    sender: {
      id: "system",
      name: "System",
      role: "Automated"
    },
    recipient: {
      id: "e002",
      name: "Prof. Michael Davis",
      role: "Educator",
      type: "individual"
    },
    priority: "high",
    status: "unread",
    category: "Academic",
    timestamp: getRelativeDate(0),
    deliveryStatus: "delivered",
    channel: "all",
    metadata: {
      classId: "c001",
      className: "Grade 10A",
      subjectId: "sub001",
      subjectName: "Mathematics"
    }
  },
  {
    id: "notif003",
    type: "announcement",
    title: "School Sports Day - Registration Open",
    content: "Annual Sports Day is scheduled for next month. Registration is now open for all events. Last date to register: 10th October.",
    sender: {
      id: "a001",
      name: "Robert Brown",
      role: "Admin"
    },
    recipient: {
      id: "all",
      name: "All Users",
      role: "All",
      type: "broadcast"
    },
    priority: "medium",
    status: "unread",
    category: "General",
    timestamp: getRelativeDate(-2),
    expiresAt: getRelativeDate(15),
    deliveryStatus: "delivered",
    channel: "all",
    attachments: [
      {
        name: "Sports_Day_Schedule.pdf",
        url: "#",
        type: "pdf",
        size: "245 KB"
      }
    ],
    actions: [
      { label: "Register Now", action: "register_sports", type: "primary" }
    ]
  },
  {
    id: "notif004",
    type: "reminder",
    title: "Submit Progress Reports",
    content: "Reminder: Mid-term progress reports for all students are due by end of this week. Please ensure all assessments are updated.",
    sender: {
      id: "ecm001",
      name: "Michael Chen",
      role: "EduCare Manager"
    },
    recipient: {
      id: "educators",
      name: "All Educators",
      role: "Educator",
      type: "group"
    },
    priority: "high",
    status: "unread",
    category: "Administrative",
    timestamp: getRelativeDate(0),
    deliveryStatus: "delivered",
    channel: "in-app"
  },
  {
    id: "notif005",
    type: "system",
    title: "System Maintenance Scheduled",
    content: "The platform will undergo scheduled maintenance on Saturday from 2:00 AM to 6:00 AM. Please save your work.",
    sender: {
      id: "system",
      name: "System Administrator",
      role: "System"
    },
    recipient: {
      id: "all",
      name: "All Users",
      role: "All",
      type: "broadcast"
    },
    priority: "medium",
    status: "unread",
    category: "System",
    timestamp: getRelativeDate(-1),
    scheduledFor: getRelativeDate(3),
    deliveryStatus: "delivered",
    channel: "all"
  },

  // Read Notifications
  {
    id: "notif006",
    type: "message",
    title: "Class Schedule Change",
    content: "Tomorrow's Physics class has been rescheduled from 10:00 AM to 2:00 PM due to lab availability.",
    sender: {
      id: "e003",
      name: "Ms. Emily Thompson",
      role: "Educator"
    },
    recipient: {
      id: "class_10a",
      name: "Grade 10A Students",
      role: "Learner",
      type: "group"
    },
    priority: "high",
    status: "read",
    category: "Academic",
    timestamp: getRelativeDate(-3),
    deliveryStatus: "delivered",
    channel: "all",
    readBy: [
      { userId: "l001", readAt: getRelativeDate(-2) },
      { userId: "l002", readAt: getRelativeDate(-2) },
      { userId: "l003", readAt: getRelativeDate(-1) }
    ],
    metadata: {
      classId: "c001",
      className: "Grade 10A",
      subjectId: "sub002",
      subjectName: "Physics"
    }
  },
  {
    id: "notif007",
    type: "achievement",
    title: "Student Achievement: John Smith",
    content: "Congratulations! John Smith scored 95% in the Mathematics Olympiad preliminary round and qualified for finals.",
    sender: {
      id: "e002",
      name: "Prof. Michael Davis",
      role: "Educator"
    },
    recipient: {
      id: "g001",
      name: "John's Parents",
      role: "Guardian",
      type: "individual"
    },
    priority: "low",
    status: "read",
    category: "Personal",
    timestamp: getRelativeDate(-5),
    deliveryStatus: "delivered",
    channel: "all",
    readBy: [
      { userId: "g001", readAt: getRelativeDate(-4) }
    ]
  },
  {
    id: "notif008",
    type: "alert",
    title: "Low Attendance Warning",
    content: "Sarah Thompson's attendance has dropped below 75%. Immediate intervention required.",
    sender: {
      id: "system",
      name: "Attendance System",
      role: "Automated"
    },
    recipient: {
      id: "e001",
      name: "Dr. Sarah Johnson",
      role: "Educator",
      type: "individual"
    },
    priority: "high",
    status: "read",
    category: "Academic",
    timestamp: getRelativeDate(-7),
    deliveryStatus: "delivered",
    channel: "in-app",
    actions: [
      { label: "View Report", action: "view_attendance", type: "primary" },
      { label: "Contact Parent", action: "contact_parent", type: "secondary" }
    ],
    readBy: [
      { userId: "e001", readAt: getRelativeDate(-6) }
    ]
  },
  {
    id: "notif009",
    type: "announcement",
    title: "New Library Resources Available",
    content: "New digital textbooks and reference materials have been added to the online library. Access them through the Resources section.",
    sender: {
      id: "a002",
      name: "Library Admin",
      role: "Admin"
    },
    recipient: {
      id: "all",
      name: "All Users",
      role: "All",
      type: "broadcast"
    },
    priority: "low",
    status: "read",
    category: "General",
    timestamp: getRelativeDate(-10),
    deliveryStatus: "delivered",
    channel: "in-app",
    readBy: [
      { userId: "e001", readAt: getRelativeDate(-9) },
      { userId: "e002", readAt: getRelativeDate(-8) },
      { userId: "l001", readAt: getRelativeDate(-7) }
    ]
  },
  {
    id: "notif010",
    type: "reminder",
    title: "Parent-Teacher Meeting Tomorrow",
    content: "Reminder: Parent-Teacher meetings are scheduled for tomorrow starting at 9:00 AM. Please check your time slots.",
    sender: {
      id: "a001",
      name: "Robert Brown",
      role: "Admin"
    },
    recipient: {
      id: "educators",
      name: "All Educators",
      role: "Educator",
      type: "group"
    },
    priority: "medium",
    status: "read",
    category: "Administrative",
    timestamp: getRelativeDate(-2),
    deliveryStatus: "delivered",
    channel: "all",
    readBy: [
      { userId: "e001", readAt: getRelativeDate(-1) },
      { userId: "e002", readAt: getRelativeDate(-1) },
      { userId: "e003", readAt: getRelativeDate(-1) }
    ]
  },

  // Scheduled Notifications
  {
    id: "notif011",
    type: "announcement",
    title: "Mid-Term Exam Schedule Released",
    content: "The mid-term examination schedule has been released. Exams will begin from 15th October. Download the complete schedule from the portal.",
    sender: {
      id: "a001",
      name: "Robert Brown",
      role: "Admin"
    },
    recipient: {
      id: "all",
      name: "All Users",
      role: "All",
      type: "broadcast"
    },
    priority: "high",
    status: "unread",
    category: "Academic",
    timestamp: getRelativeDate(0),
    scheduledFor: getRelativeDate(2),
    deliveryStatus: "scheduled",
    channel: "all",
    attachments: [
      {
        name: "Exam_Schedule.pdf",
        url: "#",
        type: "pdf",
        size: "180 KB"
      }
    ]
  },
  {
    id: "notif012",
    type: "reminder",
    title: "Weekly Performance Review",
    content: "Weekly performance review meeting scheduled for Friday at 3:00 PM. Please prepare your class reports.",
    sender: {
      id: "ecm001",
      name: "Michael Chen",
      role: "EduCare Manager"
    },
    recipient: {
      id: "educators",
      name: "All Educators",
      role: "Educator",
      type: "group"
    },
    priority: "medium",
    status: "unread",
    category: "Administrative",
    timestamp: getRelativeDate(0),
    scheduledFor: getRelativeDate(4),
    deliveryStatus: "scheduled",
    channel: "in-app"
  },

  // Failed/Pending Notifications
  {
    id: "notif013",
    type: "message",
    title: "Assignment Feedback",
    content: "Your recent assignment has been graded. Click here to view detailed feedback and areas for improvement.",
    sender: {
      id: "e002",
      name: "Prof. Michael Davis",
      role: "Educator"
    },
    recipient: {
      id: "l001",
      name: "John Smith",
      role: "Learner",
      type: "individual"
    },
    priority: "medium",
    status: "unread",
    category: "Academic",
    timestamp: getRelativeDate(-1),
    deliveryStatus: "failed",
    channel: "email",
    actions: [
      { label: "View Feedback", action: "view_feedback", type: "primary" }
    ]
  },
  {
    id: "notif014",
    type: "alert",
    title: "Emergency: School Closure",
    content: "Due to severe weather conditions, school will remain closed tomorrow. Online classes will continue as scheduled.",
    sender: {
      id: "a001",
      name: "Robert Brown",
      role: "Admin"
    },
    recipient: {
      id: "all",
      name: "All Users",
      role: "All",
      type: "broadcast"
    },
    priority: "high",
    status: "unread",
    category: "Emergency",
    timestamp: getRelativeDate(0),
    deliveryStatus: "pending",
    channel: "all"
  }
]

// Message Templates
export interface MessageTemplate {
  id: string
  name: string
  category: string
  subject: string
  content: string
  variables: string[]
  tags: string[]
  createdAt: string
  updatedAt: string
  usageCount: number
}

export const messageTemplates: MessageTemplate[] = [
  {
    id: "temp001",
    name: "Parent Meeting Request",
    category: "Communication",
    subject: "Meeting Request - {{studentName}}",
    content: "Dear {{parentName}},\n\nI would like to schedule a meeting to discuss {{studentName}}'s progress in {{subject}}. Please let me know your availability.\n\nBest regards,\n{{senderName}}",
    variables: ["parentName", "studentName", "subject", "senderName"],
    tags: ["meeting", "parent", "academic"],
    createdAt: getRelativeDate(-30),
    updatedAt: getRelativeDate(-5),
    usageCount: 45
  },
  {
    id: "temp002",
    name: "Assignment Reminder",
    category: "Academic",
    subject: "Assignment Due - {{assignmentName}}",
    content: "Dear Students,\n\nThis is a reminder that {{assignmentName}} is due on {{dueDate}}. Please ensure timely submission.\n\nThank you,\n{{senderName}}",
    variables: ["assignmentName", "dueDate", "senderName"],
    tags: ["assignment", "reminder", "academic"],
    createdAt: getRelativeDate(-25),
    updatedAt: getRelativeDate(-3),
    usageCount: 78
  },
  {
    id: "temp003",
    name: "Attendance Warning",
    category: "Administrative",
    subject: "Attendance Alert - {{studentName}}",
    content: "Dear {{parentName}},\n\n{{studentName}}'s attendance has dropped to {{attendancePercentage}}%. Please ensure regular attendance.\n\nRegards,\n{{senderName}}",
    variables: ["parentName", "studentName", "attendancePercentage", "senderName"],
    tags: ["attendance", "warning", "parent"],
    createdAt: getRelativeDate(-20),
    updatedAt: getRelativeDate(-7),
    usageCount: 23
  },
  {
    id: "temp004",
    name: "Achievement Notification",
    category: "Recognition",
    subject: "Congratulations - {{achievement}}",
    content: "Dear {{recipientName}},\n\nCongratulations on {{achievement}}! We are proud of your accomplishment.\n\nBest wishes,\n{{senderName}}",
    variables: ["recipientName", "achievement", "senderName"],
    tags: ["achievement", "congratulations", "positive"],
    createdAt: getRelativeDate(-15),
    updatedAt: getRelativeDate(-2),
    usageCount: 56
  },
  {
    id: "temp005",
    name: "Event Announcement",
    category: "General",
    subject: "{{eventName}} - {{eventDate}}",
    content: "Dear All,\n\nWe are pleased to announce {{eventName}} on {{eventDate}} at {{eventTime}}. {{eventDetails}}\n\nLooking forward to your participation.\n\n{{senderName}}",
    variables: ["eventName", "eventDate", "eventTime", "eventDetails", "senderName"],
    tags: ["event", "announcement", "general"],
    createdAt: getRelativeDate(-18),
    updatedAt: getRelativeDate(-4),
    usageCount: 34
  }
]

// Recipient Groups
export interface RecipientGroup {
  id: string
  name: string
  description: string
  members: {
    id: string
    name: string
    role: string
    email: string
  }[]
  createdBy: string
  createdAt: string
  updatedAt: string
}

export const recipientGroups: RecipientGroup[] = [
  {
    id: "grp001",
    name: "Grade 10A Parents",
    description: "All parents/guardians of Grade 10A students",
    members: [
      { id: "g001", name: "Mrs. Sarah Johnson", role: "Guardian", email: "sarah.j@email.com" },
      { id: "g002", name: "Mr. Robert Davis", role: "Guardian", email: "robert.d@email.com" },
      { id: "g003", name: "Mrs. Emily Wilson", role: "Guardian", email: "emily.w@email.com" }
    ],
    createdBy: "Admin",
    createdAt: getRelativeDate(-60),
    updatedAt: getRelativeDate(-10)
  },
  {
    id: "grp002",
    name: "Mathematics Department",
    description: "All mathematics educators",
    members: [
      { id: "e002", name: "Prof. Michael Davis", role: "Educator", email: "michael.d@school.edu" },
      { id: "e006", name: "Dr. Lisa Chen", role: "Educator", email: "lisa.c@school.edu" }
    ],
    createdBy: "Admin",
    createdAt: getRelativeDate(-45),
    updatedAt: getRelativeDate(-5)
  },
  {
    id: "grp003",
    name: "Class Representatives",
    description: "Student representatives from all classes",
    members: [
      { id: "l001", name: "John Smith", role: "Learner", email: "john.s@student.edu" },
      { id: "l004", name: "David Martinez", role: "Learner", email: "david.m@student.edu" },
      { id: "l007", name: "James Wilson", role: "Learner", email: "james.w@student.edu" }
    ],
    createdBy: "Admin",
    createdAt: getRelativeDate(-30),
    updatedAt: getRelativeDate(-8)
  },
  {
    id: "grp004",
    name: "Emergency Contacts",
    description: "Key personnel for emergency communications",
    members: [
      { id: "a001", name: "Robert Brown", role: "Admin", email: "robert.b@school.edu" },
      { id: "ecm001", name: "Michael Chen", role: "ECM", email: "michael.c@school.edu" },
      { id: "e001", name: "Dr. Sarah Johnson", role: "Educator", email: "sarah.j@school.edu" }
    ],
    createdBy: "System",
    createdAt: getRelativeDate(-90),
    updatedAt: getRelativeDate(-15)
  }
]

// Helper functions
export const getNotificationStats = () => {
  const unread = notifications.filter(n => n.status === 'unread').length
  const read = notifications.filter(n => n.status === 'read').length
  const archived = notifications.filter(n => n.status === 'archived').length
  const sent = notifications.filter(n => n.deliveryStatus === 'sent' || n.deliveryStatus === 'delivered').length
  const scheduled = notifications.filter(n => n.deliveryStatus === 'scheduled').length
  const failed = notifications.filter(n => n.deliveryStatus === 'failed').length

  const byType = notifications.reduce((acc, n) => {
    acc[n.type] = (acc[n.type] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const byCategory = notifications.reduce((acc, n) => {
    acc[n.category] = (acc[n.category] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return {
    unread,
    read,
    archived,
    sent,
    scheduled,
    failed,
    total: notifications.length,
    byType,
    byCategory
  }
}

export const getUnreadNotifications = () => {
  return notifications.filter(n => n.status === 'unread')
}

export const getScheduledNotifications = () => {
  return notifications.filter(n => n.deliveryStatus === 'scheduled')
}

export const getNotificationsByRecipient = (recipientId: string) => {
  return notifications.filter(n => n.recipient.id === recipientId)
}

export const getNotificationsByCategory = (category: string) => {
  return notifications.filter(n => n.category === category)
}