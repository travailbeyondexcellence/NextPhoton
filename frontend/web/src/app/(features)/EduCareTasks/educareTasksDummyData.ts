// Helper function to get relative dates
const getRelativeDate = (daysOffset: number): string => {
  const date = new Date()
  date.setDate(date.getDate() + daysOffset)
  return date.toISOString()
}

export interface EduCareTask {
  taskId: string
  title: string
  description: string
  category: 'Academic Support' | 'Behavioral Guidance' | 'Parent Communication' | 'Student Wellness' | 'Career Counseling' | 'Special Needs' | 'Extracurricular'
  priority: 'High' | 'Medium' | 'Low'
  status: 'Active' | 'Pending Review' | 'Completed' | 'In Progress' | 'Overdue'
  assignedTo: {
    id: string
    name: string
    role: 'Educator' | 'Counselor' | 'ECM' | 'Admin'
  }
  assignedBy: {
    id: string
    name: string
    role: string
  }
  studentId: string
  studentName: string
  classId: string
  className: string
  dueDate: string
  createdAt: string
  updatedAt: string
  completedAt?: string
  tags: string[]
  attachments?: {
    name: string
    url: string
    type: string
  }[]
  comments: {
    id: string
    author: string
    role: string
    text: string
    timestamp: string
  }[]
  progress: number // 0-100
  subtasks?: {
    id: string
    title: string
    completed: boolean
    completedBy?: string
    completedAt?: string
  }[]
  impact: 'Critical' | 'High' | 'Medium' | 'Low'
  followUpRequired: boolean
  parentNotificationSent: boolean
}

export const eduCareTasks: EduCareTask[] = [
  // Active Tasks
  {
    taskId: "ECT001",
    title: "Academic Performance Review - John Smith",
    description: "Conduct a comprehensive review of John's recent academic performance decline in Mathematics. Meet with the student to discuss challenges and create an improvement plan.",
    category: "Academic Support",
    priority: "High",
    status: "Active",
    assignedTo: {
      id: "e001",
      name: "Dr. Sarah Johnson",
      role: "Educator"
    },
    assignedBy: {
      id: "ecm001",
      name: "Michael Chen",
      role: "EduCare Manager"
    },
    studentId: "l001",
    studentName: "John Smith",
    classId: "c001",
    className: "Grade 10A",
    dueDate: getRelativeDate(3),
    createdAt: getRelativeDate(-2),
    updatedAt: getRelativeDate(-1),
    tags: ["Math Support", "Performance Review", "Urgent"],
    comments: [
      {
        id: "com001",
        author: "Michael Chen",
        role: "EduCare Manager",
        text: "Please prioritize this. Parents have expressed concern about recent test scores.",
        timestamp: getRelativeDate(-2)
      },
      {
        id: "com002",
        author: "Dr. Sarah Johnson",
        role: "Educator",
        text: "I've scheduled a meeting with John for tomorrow afternoon.",
        timestamp: getRelativeDate(-1)
      }
    ],
    progress: 25,
    subtasks: [
      {
        id: "st001",
        title: "Review test scores and assignments",
        completed: true,
        completedBy: "Dr. Sarah Johnson",
        completedAt: getRelativeDate(-1)
      },
      {
        id: "st002",
        title: "Schedule one-on-one meeting",
        completed: false
      },
      {
        id: "st003",
        title: "Create improvement plan",
        completed: false
      },
      {
        id: "st004",
        title: "Share plan with parents",
        completed: false
      }
    ],
    impact: "High",
    followUpRequired: true,
    parentNotificationSent: true
  },
  {
    taskId: "ECT002",
    title: "Behavioral Intervention - Emily Davis",
    description: "Address repeated disruptive behavior in class. Implement behavior modification strategies and monitor progress over the next two weeks.",
    category: "Behavioral Guidance",
    priority: "High",
    status: "Active",
    assignedTo: {
      id: "c001",
      name: "Lisa Martinez",
      role: "Counselor"
    },
    assignedBy: {
      id: "a001",
      name: "Robert Brown",
      role: "Admin"
    },
    studentId: "l002",
    studentName: "Emily Davis",
    classId: "c002",
    className: "Grade 9B",
    dueDate: getRelativeDate(7),
    createdAt: getRelativeDate(-3),
    updatedAt: getRelativeDate(0),
    tags: ["Behavior", "Intervention", "Monitor"],
    comments: [
      {
        id: "com003",
        author: "Robert Brown",
        role: "Admin",
        text: "Multiple teachers have reported issues. Please create a comprehensive behavior plan.",
        timestamp: getRelativeDate(-3)
      }
    ],
    progress: 40,
    subtasks: [
      {
        id: "st005",
        title: "Initial assessment meeting",
        completed: true,
        completedBy: "Lisa Martinez",
        completedAt: getRelativeDate(-2)
      },
      {
        id: "st006",
        title: "Create behavior contract",
        completed: true,
        completedBy: "Lisa Martinez",
        completedAt: getRelativeDate(-1)
      },
      {
        id: "st007",
        title: "Daily behavior monitoring",
        completed: false
      },
      {
        id: "st008",
        title: "Weekly progress review",
        completed: false
      }
    ],
    impact: "Critical",
    followUpRequired: true,
    parentNotificationSent: false
  },
  {
    taskId: "ECT003",
    title: "Parent-Teacher Conference Preparation",
    description: "Prepare comprehensive progress reports for upcoming parent-teacher conferences. Include academic performance, behavioral observations, and recommendations.",
    category: "Parent Communication",
    priority: "Medium",
    status: "Active",
    assignedTo: {
      id: "e002",
      name: "Prof. Michael Davis",
      role: "Educator"
    },
    assignedBy: {
      id: "ecm001",
      name: "Michael Chen",
      role: "EduCare Manager"
    },
    studentId: "l003",
    studentName: "Sophia Wilson",
    classId: "c001",
    className: "Grade 10A",
    dueDate: getRelativeDate(5),
    createdAt: getRelativeDate(-4),
    updatedAt: getRelativeDate(-1),
    tags: ["Conference", "Parent Meeting", "Progress Report"],
    comments: [],
    progress: 60,
    subtasks: [
      {
        id: "st009",
        title: "Compile grade reports",
        completed: true,
        completedBy: "Prof. Michael Davis",
        completedAt: getRelativeDate(-2)
      },
      {
        id: "st010",
        title: "Document behavioral observations",
        completed: true,
        completedBy: "Prof. Michael Davis",
        completedAt: getRelativeDate(-1)
      },
      {
        id: "st011",
        title: "Prepare recommendation list",
        completed: false
      }
    ],
    impact: "Medium",
    followUpRequired: false,
    parentNotificationSent: true
  },
  {
    taskId: "ECT004",
    title: "Mental Health Check-in - David Martinez",
    description: "Conduct wellness check following reported signs of anxiety. Provide support resources and coordinate with school counselor.",
    category: "Student Wellness",
    priority: "High",
    status: "In Progress",
    assignedTo: {
      id: "c001",
      name: "Lisa Martinez",
      role: "Counselor"
    },
    assignedBy: {
      id: "e003",
      name: "Ms. Emily Thompson",
      role: "Educator"
    },
    studentId: "l004",
    studentName: "David Martinez",
    classId: "c003",
    className: "Grade 11C",
    dueDate: getRelativeDate(1),
    createdAt: getRelativeDate(-5),
    updatedAt: getRelativeDate(0),
    tags: ["Mental Health", "Urgent", "Wellness"],
    comments: [
      {
        id: "com004",
        author: "Ms. Emily Thompson",
        role: "Educator",
        text: "David has been showing signs of stress and anxiety. Please prioritize this check-in.",
        timestamp: getRelativeDate(-5)
      },
      {
        id: "com005",
        author: "Lisa Martinez",
        role: "Counselor",
        text: "Initial meeting completed. Will follow up with additional resources.",
        timestamp: getRelativeDate(-2)
      }
    ],
    progress: 75,
    subtasks: [
      {
        id: "st012",
        title: "Initial wellness assessment",
        completed: true,
        completedBy: "Lisa Martinez",
        completedAt: getRelativeDate(-2)
      },
      {
        id: "st013",
        title: "Provide coping strategies",
        completed: true,
        completedBy: "Lisa Martinez",
        completedAt: getRelativeDate(-1)
      },
      {
        id: "st014",
        title: "Schedule follow-up session",
        completed: true,
        completedBy: "Lisa Martinez",
        completedAt: getRelativeDate(0)
      },
      {
        id: "st015",
        title: "Parent consultation",
        completed: false
      }
    ],
    impact: "Critical",
    followUpRequired: true,
    parentNotificationSent: true
  },
  {
    taskId: "ECT005",
    title: "Career Guidance Session - Group Workshop",
    description: "Organize and conduct career guidance workshop for Grade 12 students. Include college application assistance and career path exploration.",
    category: "Career Counseling",
    priority: "Medium",
    status: "Active",
    assignedTo: {
      id: "c002",
      name: "James Wilson",
      role: "Counselor"
    },
    assignedBy: {
      id: "a001",
      name: "Robert Brown",
      role: "Admin"
    },
    studentId: "group",
    studentName: "Grade 12 Students",
    classId: "c004",
    className: "Grade 12",
    dueDate: getRelativeDate(10),
    createdAt: getRelativeDate(-7),
    updatedAt: getRelativeDate(-2),
    tags: ["Career", "Workshop", "College Prep"],
    comments: [],
    progress: 30,
    subtasks: [
      {
        id: "st016",
        title: "Book workshop venue",
        completed: true,
        completedBy: "James Wilson",
        completedAt: getRelativeDate(-3)
      },
      {
        id: "st017",
        title: "Prepare presentation materials",
        completed: false
      },
      {
        id: "st018",
        title: "Invite guest speakers",
        completed: false
      },
      {
        id: "st019",
        title: "Send invitations to students",
        completed: false
      }
    ],
    impact: "Medium",
    followUpRequired: false,
    parentNotificationSent: false
  },

  // Pending Review Tasks
  {
    taskId: "ECT006",
    title: "Special Education Assessment - Michael Brown",
    description: "Complete comprehensive assessment for special education services eligibility. Review learning difficulties and recommend appropriate support.",
    category: "Special Needs",
    priority: "High",
    status: "Pending Review",
    assignedTo: {
      id: "e004",
      name: "Dr. Robert Anderson",
      role: "Educator"
    },
    assignedBy: {
      id: "ecm001",
      name: "Michael Chen",
      role: "EduCare Manager"
    },
    studentId: "l005",
    studentName: "Michael Brown",
    classId: "c002",
    className: "Grade 9B",
    dueDate: getRelativeDate(-1),
    createdAt: getRelativeDate(-10),
    updatedAt: getRelativeDate(-1),
    tags: ["Special Ed", "Assessment", "IEP"],
    comments: [
      {
        id: "com006",
        author: "Dr. Robert Anderson",
        role: "Educator",
        text: "Assessment completed. Recommending additional support services. Awaiting approval.",
        timestamp: getRelativeDate(-1)
      }
    ],
    progress: 90,
    subtasks: [
      {
        id: "st020",
        title: "Conduct learning assessment",
        completed: true,
        completedBy: "Dr. Robert Anderson",
        completedAt: getRelativeDate(-3)
      },
      {
        id: "st021",
        title: "Review academic records",
        completed: true,
        completedBy: "Dr. Robert Anderson",
        completedAt: getRelativeDate(-2)
      },
      {
        id: "st022",
        title: "Prepare IEP recommendations",
        completed: true,
        completedBy: "Dr. Robert Anderson",
        completedAt: getRelativeDate(-1)
      },
      {
        id: "st023",
        title: "Submit for approval",
        completed: true,
        completedBy: "Dr. Robert Anderson",
        completedAt: getRelativeDate(-1)
      }
    ],
    impact: "High",
    followUpRequired: true,
    parentNotificationSent: true
  },
  {
    taskId: "ECT007",
    title: "Extracurricular Activity Coordination",
    description: "Organize science fair participation for interested students. Coordinate with science department and arrange mentorship.",
    category: "Extracurricular",
    priority: "Low",
    status: "Pending Review",
    assignedTo: {
      id: "e005",
      name: "Ms. Jennifer White",
      role: "Educator"
    },
    assignedBy: {
      id: "ecm001",
      name: "Michael Chen",
      role: "EduCare Manager"
    },
    studentId: "group",
    studentName: "Science Club Members",
    classId: "multi",
    className: "Multiple Classes",
    dueDate: getRelativeDate(15),
    createdAt: getRelativeDate(-8),
    updatedAt: getRelativeDate(-2),
    tags: ["Science Fair", "Extracurricular", "Competition"],
    comments: [
      {
        id: "com007",
        author: "Ms. Jennifer White",
        role: "Educator",
        text: "15 students have shown interest. Awaiting budget approval for materials.",
        timestamp: getRelativeDate(-2)
      }
    ],
    progress: 85,
    subtasks: [
      {
        id: "st024",
        title: "Gauge student interest",
        completed: true,
        completedBy: "Ms. Jennifer White",
        completedAt: getRelativeDate(-5)
      },
      {
        id: "st025",
        title: "Create project guidelines",
        completed: true,
        completedBy: "Ms. Jennifer White",
        completedAt: getRelativeDate(-3)
      },
      {
        id: "st026",
        title: "Arrange mentors",
        completed: true,
        completedBy: "Ms. Jennifer White",
        completedAt: getRelativeDate(-2)
      },
      {
        id: "st027",
        title: "Get budget approval",
        completed: false
      }
    ],
    impact: "Low",
    followUpRequired: false,
    parentNotificationSent: false
  },
  {
    taskId: "ECT008",
    title: "Academic Probation Review - Sarah Thompson",
    description: "Review progress of student on academic probation. Determine if additional support or intervention is needed.",
    category: "Academic Support",
    priority: "High",
    status: "Pending Review",
    assignedTo: {
      id: "e001",
      name: "Dr. Sarah Johnson",
      role: "Educator"
    },
    assignedBy: {
      id: "a001",
      name: "Robert Brown",
      role: "Admin"
    },
    studentId: "l006",
    studentName: "Sarah Thompson",
    classId: "c003",
    className: "Grade 11C",
    dueDate: getRelativeDate(0),
    createdAt: getRelativeDate(-14),
    updatedAt: getRelativeDate(-1),
    tags: ["Probation", "Academic Review", "Support"],
    comments: [
      {
        id: "com008",
        author: "Dr. Sarah Johnson",
        role: "Educator",
        text: "Significant improvement shown. Recommending removal from probation.",
        timestamp: getRelativeDate(-1)
      }
    ],
    progress: 95,
    impact: "High",
    followUpRequired: true,
    parentNotificationSent: true
  },

  // Completed Tasks
  {
    taskId: "ECT009",
    title: "Attendance Improvement Plan - James Wilson",
    description: "Addressed chronic attendance issues. Implemented attendance contract and monitoring system.",
    category: "Student Wellness",
    priority: "High",
    status: "Completed",
    assignedTo: {
      id: "ecm001",
      name: "Michael Chen",
      role: "ECM"
    },
    assignedBy: {
      id: "a001",
      name: "Robert Brown",
      role: "Admin"
    },
    studentId: "l007",
    studentName: "James Wilson",
    classId: "c001",
    className: "Grade 10A",
    dueDate: getRelativeDate(-5),
    createdAt: getRelativeDate(-20),
    updatedAt: getRelativeDate(-5),
    completedAt: getRelativeDate(-5),
    tags: ["Attendance", "Completed", "Success"],
    comments: [
      {
        id: "com009",
        author: "Michael Chen",
        role: "ECM",
        text: "Attendance has improved from 60% to 95%. Plan successful.",
        timestamp: getRelativeDate(-5)
      }
    ],
    progress: 100,
    subtasks: [
      {
        id: "st028",
        title: "Parent meeting",
        completed: true,
        completedBy: "Michael Chen",
        completedAt: getRelativeDate(-15)
      },
      {
        id: "st029",
        title: "Create attendance contract",
        completed: true,
        completedBy: "Michael Chen",
        completedAt: getRelativeDate(-14)
      },
      {
        id: "st030",
        title: "Daily monitoring",
        completed: true,
        completedBy: "Michael Chen",
        completedAt: getRelativeDate(-5)
      },
      {
        id: "st031",
        title: "Final review",
        completed: true,
        completedBy: "Michael Chen",
        completedAt: getRelativeDate(-5)
      }
    ],
    impact: "High",
    followUpRequired: false,
    parentNotificationSent: true
  },
  {
    taskId: "ECT010",
    title: "Peer Tutoring Setup - Mathematics",
    description: "Successfully established peer tutoring program for struggling math students.",
    category: "Academic Support",
    priority: "Medium",
    status: "Completed",
    assignedTo: {
      id: "e002",
      name: "Prof. Michael Davis",
      role: "Educator"
    },
    assignedBy: {
      id: "ecm001",
      name: "Michael Chen",
      role: "EduCare Manager"
    },
    studentId: "group",
    studentName: "Multiple Students",
    classId: "multi",
    className: "Grades 9-10",
    dueDate: getRelativeDate(-7),
    createdAt: getRelativeDate(-21),
    updatedAt: getRelativeDate(-7),
    completedAt: getRelativeDate(-7),
    tags: ["Tutoring", "Math", "Peer Support"],
    comments: [
      {
        id: "com010",
        author: "Prof. Michael Davis",
        role: "Educator",
        text: "10 tutors matched with 15 students. Program running smoothly.",
        timestamp: getRelativeDate(-7)
      }
    ],
    progress: 100,
    impact: "Medium",
    followUpRequired: false,
    parentNotificationSent: false
  },
  {
    taskId: "ECT011",
    title: "Bullying Incident Resolution",
    description: "Successfully resolved bullying incident. Implemented restorative justice practices and ongoing monitoring.",
    category: "Behavioral Guidance",
    priority: "High",
    status: "Completed",
    assignedTo: {
      id: "c001",
      name: "Lisa Martinez",
      role: "Counselor"
    },
    assignedBy: {
      id: "a001",
      name: "Robert Brown",
      role: "Admin"
    },
    studentId: "l008",
    studentName: "Robert Anderson",
    classId: "c002",
    className: "Grade 9B",
    dueDate: getRelativeDate(-10),
    createdAt: getRelativeDate(-25),
    updatedAt: getRelativeDate(-10),
    completedAt: getRelativeDate(-10),
    tags: ["Bullying", "Resolution", "Safety"],
    comments: [
      {
        id: "com011",
        author: "Lisa Martinez",
        role: "Counselor",
        text: "All parties have participated in mediation. Situation resolved positively.",
        timestamp: getRelativeDate(-10)
      }
    ],
    progress: 100,
    subtasks: [
      {
        id: "st032",
        title: "Investigate incident",
        completed: true,
        completedBy: "Lisa Martinez",
        completedAt: getRelativeDate(-22)
      },
      {
        id: "st033",
        title: "Meet with all parties",
        completed: true,
        completedBy: "Lisa Martinez",
        completedAt: getRelativeDate(-20)
      },
      {
        id: "st034",
        title: "Conduct mediation session",
        completed: true,
        completedBy: "Lisa Martinez",
        completedAt: getRelativeDate(-15)
      },
      {
        id: "st035",
        title: "Follow-up monitoring",
        completed: true,
        completedBy: "Lisa Martinez",
        completedAt: getRelativeDate(-10)
      }
    ],
    impact: "Critical",
    followUpRequired: false,
    parentNotificationSent: true
  },
  {
    taskId: "ECT012",
    title: "Study Skills Workshop Completion",
    description: "Successfully conducted study skills and time management workshop for Grade 10 students.",
    category: "Academic Support",
    priority: "Low",
    status: "Completed",
    assignedTo: {
      id: "c002",
      name: "James Wilson",
      role: "Counselor"
    },
    assignedBy: {
      id: "ecm001",
      name: "Michael Chen",
      role: "EduCare Manager"
    },
    studentId: "group",
    studentName: "Grade 10 Students",
    classId: "c001",
    className: "Grade 10A",
    dueDate: getRelativeDate(-12),
    createdAt: getRelativeDate(-30),
    updatedAt: getRelativeDate(-12),
    completedAt: getRelativeDate(-12),
    tags: ["Workshop", "Study Skills", "Success"],
    comments: [
      {
        id: "com012",
        author: "James Wilson",
        role: "Counselor",
        text: "45 students attended. Positive feedback received.",
        timestamp: getRelativeDate(-12)
      }
    ],
    progress: 100,
    impact: "Low",
    followUpRequired: false,
    parentNotificationSent: false
  },

  // Overdue Tasks
  {
    taskId: "ECT013",
    title: "IEP Annual Review - Multiple Students",
    description: "Conduct annual review of Individualized Education Programs for special needs students. Update goals and accommodations.",
    category: "Special Needs",
    priority: "High",
    status: "Overdue",
    assignedTo: {
      id: "e004",
      name: "Dr. Robert Anderson",
      role: "Educator"
    },
    assignedBy: {
      id: "a001",
      name: "Robert Brown",
      role: "Admin"
    },
    studentId: "group",
    studentName: "Special Ed Students",
    classId: "multi",
    className: "Multiple Classes",
    dueDate: getRelativeDate(-3),
    createdAt: getRelativeDate(-15),
    updatedAt: getRelativeDate(-1),
    tags: ["IEP", "Overdue", "Urgent"],
    comments: [
      {
        id: "com013",
        author: "Robert Brown",
        role: "Admin",
        text: "This is now overdue. Please prioritize immediately.",
        timestamp: getRelativeDate(-1)
      }
    ],
    progress: 60,
    subtasks: [
      {
        id: "st036",
        title: "Review current IEPs",
        completed: true,
        completedBy: "Dr. Robert Anderson",
        completedAt: getRelativeDate(-7)
      },
      {
        id: "st037",
        title: "Schedule parent meetings",
        completed: true,
        completedBy: "Dr. Robert Anderson",
        completedAt: getRelativeDate(-5)
      },
      {
        id: "st038",
        title: "Conduct assessments",
        completed: false
      },
      {
        id: "st039",
        title: "Update documentation",
        completed: false
      }
    ],
    impact: "Critical",
    followUpRequired: true,
    parentNotificationSent: true
  }
]

// Helper functions for statistics
export const getTaskStatistics = () => {
  const active = eduCareTasks.filter(task => task.status === 'Active' || task.status === 'In Progress').length
  const pending = eduCareTasks.filter(task => task.status === 'Pending Review').length
  const completed = eduCareTasks.filter(task => task.status === 'Completed').length
  const overdue = eduCareTasks.filter(task => task.status === 'Overdue').length

  const byCategory = eduCareTasks.reduce((acc, task) => {
    acc[task.category] = (acc[task.category] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const byPriority = eduCareTasks.reduce((acc, task) => {
    acc[task.priority] = (acc[task.priority] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const averageProgress = Math.round(
    eduCareTasks.reduce((sum, task) => sum + task.progress, 0) / eduCareTasks.length
  )

  return {
    active,
    pending,
    completed,
    overdue,
    total: eduCareTasks.length,
    byCategory,
    byPriority,
    averageProgress
  }
}

// Get tasks by status
export const getTasksByStatus = (status: EduCareTask['status']) => {
  return eduCareTasks.filter(task => task.status === status)
}

// Get tasks by priority
export const getTasksByPriority = (priority: EduCareTask['priority']) => {
  return eduCareTasks.filter(task => task.priority === priority)
}

// Get tasks by category
export const getTasksByCategory = (category: EduCareTask['category']) => {
  return eduCareTasks.filter(task => task.category === category)
}

// Get tasks for specific educator/counselor
export const getTasksByAssignee = (assigneeId: string) => {
  return eduCareTasks.filter(task => task.assignedTo.id === assigneeId)
}

// Get tasks for specific student
export const getTasksByStudent = (studentId: string) => {
  return eduCareTasks.filter(task => task.studentId === studentId)
}