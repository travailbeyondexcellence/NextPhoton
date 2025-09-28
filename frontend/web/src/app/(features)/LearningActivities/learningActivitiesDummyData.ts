// Learning Activities Dummy Data - Daily Study Plan, Practice, Examinations, Home Tasks

// Helper to get relative dates for dynamic data
const getRelativeDate = (daysOffset: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  return date.toISOString();
};

const getRelativeDateOnly = (daysOffset: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  return date.toISOString().split('T')[0];
};

// Type definitions for all learning activity types
export type DailyStudyPlan = {
  id: string;
  title: string;
  description: string;
  date: string;
  timeSlots: StudyTimeSlot[];
  learnerIds: string[];
  educatorId: string;
  educatorName: string;
  status: "Active" | "Completed" | "Pending" | "Cancelled";
  createdAt: string;
  updatedAt: string;
  totalStudyTime: number; // in minutes
  completedTime: number; // in minutes
  subjects: string[];
  priority: "High" | "Medium" | "Low";
};

export type StudyTimeSlot = {
  id: string;
  startTime: string;
  endTime: string;
  subject: string;
  topic: string;
  activities: string[];
  resources: string[];
  isCompleted: boolean;
  completedAt?: string;
  notes?: string;
};

export type PracticeAssignment = {
  id: string;
  title: string;
  description: string;
  subject: string;
  topic: string;
  assignedTo: string[];
  assignedBy: string;
  educatorName: string;
  createdAt: string;
  dueDate: string;
  submittedAt?: string;
  gradedAt?: string;
  status: "Assigned" | "In Progress" | "Submitted" | "Graded" | "Overdue";
  difficulty: "Easy" | "Medium" | "Hard";
  estimatedTime: number; // in minutes
  actualTime?: number;
  questions: PracticeQuestion[];
  totalMarks: number;
  obtainedMarks?: number;
  feedback?: string;
  attempts: number;
  maxAttempts: number;
};

export type PracticeQuestion = {
  id: string;
  question: string;
  type: "MCQ" | "Short Answer" | "Essay" | "Fill in Blanks" | "True/False";
  options?: string[];
  correctAnswer?: string;
  studentAnswer?: string;
  marks: number;
  obtainedMarks?: number;
  explanation?: string;
};

export type Examination = {
  id: string;
  title: string;
  description: string;
  subject: string;
  examType: "Quiz" | "Unit Test" | "Mid-term" | "Final" | "Practice Test";
  scheduledDate: string;
  duration: number; // in minutes
  totalMarks: number;
  passingMarks: number;
  educatorId: string;
  educatorName: string;
  enrolledStudents: string[];
  status: "Scheduled" | "In Progress" | "Completed" | "Cancelled";
  instructions: string[];
  syllabus: string[];
  examResults?: ExamResult[];
  createdAt: string;
  venue?: string;
  isOnline: boolean;
};

export type ExamResult = {
  studentId: string;
  studentName: string;
  startTime?: string;
  endTime?: string;
  obtainedMarks: number;
  percentage: number;
  grade: string;
  rank?: number;
  timeSpent: number; // in minutes
  answers: StudentAnswer[];
  status: "Completed" | "In Progress" | "Not Started" | "Absent";
};

export type StudentAnswer = {
  questionId: string;
  answer: string;
  isCorrect: boolean;
  marksObtained: number;
  timeTaken: number; // in seconds
};

export type HomeTask = {
  id: string;
  title: string;
  description: string;
  subject: string;
  type: "Homework" | "Assignment" | "Project" | "Reading" | "Research";
  assignedTo: string[];
  assignedBy: string;
  educatorName: string;
  assignedDate: string;
  dueDate: string;
  submittedAt?: string;
  gradedAt?: string;
  status: "Assigned Today" | "Pending" | "Submitted" | "Graded" | "Overdue";
  priority: "High" | "Medium" | "Low";
  estimatedHours: number;
  actualHours?: number;
  resources: string[];
  instructions: string[];
  attachments?: string[];
  submissions?: TaskSubmission[];
  totalMarks: number;
  obtainedMarks?: number;
  grade?: string;
  feedback?: string;
};

export type TaskSubmission = {
  studentId: string;
  studentName: string;
  submittedAt: string;
  files: string[];
  notes?: string;
  lateSubmission: boolean;
  grade?: string;
  marks?: number;
  feedback?: string;
};

// Daily Study Plans
export const dailyStudyPlans: DailyStudyPlan[] = [
  {
    id: "dsp001",
    title: "Mathematics Focus Week",
    description: "Intensive mathematics study schedule focusing on algebra and geometry",
    date: getRelativeDateOnly(0),
    timeSlots: [
      {
        id: "ts001",
        startTime: "09:00",
        endTime: "10:30",
        subject: "Mathematics",
        topic: "Linear Equations",
        activities: ["Solve practice problems", "Review formulas", "Work through examples"],
        resources: ["Algebra Textbook Ch. 5", "Khan Academy Videos", "Practice Worksheet"],
        isCompleted: true,
        completedAt: getRelativeDate(0),
        notes: "Completed all practice problems successfully"
      },
      {
        id: "ts002",
        startTime: "11:00",
        endTime: "12:00",
        subject: "Physics",
        topic: "Newton's Laws",
        activities: ["Read chapter", "Take notes", "Solve numerical problems"],
        resources: ["Physics Textbook Ch. 3", "Lab Manual", "Online Simulations"],
        isCompleted: true,
        completedAt: getRelativeDate(0)
      },
      {
        id: "ts003",
        startTime: "14:00",
        endTime: "15:30",
        subject: "English",
        topic: "Essay Writing",
        activities: ["Practice essay structure", "Vocabulary building", "Grammar exercises"],
        resources: ["Writing Guide", "Vocabulary List", "Sample Essays"],
        isCompleted: false
      }
    ],
    learnerIds: ["l001", "l002", "l003"],
    educatorId: "e001",
    educatorName: "Dr. Sarah Smith",
    status: "Active",
    createdAt: getRelativeDate(-1),
    updatedAt: getRelativeDate(0),
    totalStudyTime: 270,
    completedTime: 150,
    subjects: ["Mathematics", "Physics", "English"],
    priority: "High"
  },
  {
    id: "dsp002",
    title: "Science Review Session",
    description: "Comprehensive science review covering chemistry and biology",
    date: getRelativeDateOnly(1),
    timeSlots: [
      {
        id: "ts004",
        startTime: "10:00",
        endTime: "11:30",
        subject: "Chemistry",
        topic: "Organic Compounds",
        activities: ["Study molecular structures", "Practice naming", "Review reactions"],
        resources: ["Chemistry Textbook", "Molecular Models", "Reaction Charts"],
        isCompleted: false
      },
      {
        id: "ts005",
        startTime: "13:00",
        endTime: "14:30",
        subject: "Biology",
        topic: "Cell Biology",
        activities: ["Study cell organelles", "Review functions", "Diagram practice"],
        resources: ["Biology Textbook Ch. 2", "Cell Diagrams", "Interactive Models"],
        isCompleted: false
      }
    ],
    learnerIds: ["l004", "l005", "l006"],
    educatorId: "e002",
    educatorName: "Prof. Michael Johnson",
    status: "Pending",
    createdAt: getRelativeDate(-2),
    updatedAt: getRelativeDate(-1),
    totalStudyTime: 180,
    completedTime: 0,
    subjects: ["Chemistry", "Biology"],
    priority: "Medium"
  },
  {
    id: "dsp003",
    title: "Literature Analysis Day",
    description: "Deep dive into Shakespeare's works and literary analysis techniques",
    date: getRelativeDateOnly(-1),
    timeSlots: [
      {
        id: "ts006",
        startTime: "09:30",
        endTime: "11:00",
        subject: "English Literature",
        topic: "Hamlet Analysis",
        activities: ["Character analysis", "Theme identification", "Quote analysis"],
        resources: ["Hamlet Text", "Literary Analysis Guide", "Critical Essays"],
        isCompleted: true,
        completedAt: getRelativeDate(-1),
        notes: "Excellent progress on character development analysis"
      }
    ],
    learnerIds: ["l007", "l008"],
    educatorId: "e002",
    educatorName: "Prof. Michael Johnson",
    status: "Completed",
    createdAt: getRelativeDate(-3),
    updatedAt: getRelativeDate(-1),
    totalStudyTime: 90,
    completedTime: 90,
    subjects: ["English Literature"],
    priority: "High"
  }
];

// Practice Assignments
export const practiceAssignments: PracticeAssignment[] = [
  {
    id: "pa001",
    title: "Algebra Practice Set A",
    description: "Comprehensive practice problems covering linear equations and inequalities",
    subject: "Mathematics",
    topic: "Linear Equations",
    assignedTo: ["l001", "l002", "l003"],
    assignedBy: "e001",
    educatorName: "Dr. Sarah Smith",
    createdAt: getRelativeDate(-5),
    dueDate: getRelativeDate(2),
    submittedAt: getRelativeDate(-1),
    gradedAt: getRelativeDate(0),
    status: "Graded",
    difficulty: "Medium",
    estimatedTime: 60,
    actualTime: 75,
    questions: [
      {
        id: "q001",
        question: "Solve for x: 2x + 5 = 15",
        type: "Short Answer",
        correctAnswer: "x = 5",
        studentAnswer: "x = 5",
        marks: 5,
        obtainedMarks: 5,
        explanation: "Subtract 5 from both sides, then divide by 2"
      },
      {
        id: "q002",
        question: "Which of the following is a linear equation?",
        type: "MCQ",
        options: ["x² + 2x = 5", "2x + 3y = 7", "xy = 10", "x³ = 8"],
        correctAnswer: "2x + 3y = 7",
        studentAnswer: "2x + 3y = 7",
        marks: 3,
        obtainedMarks: 3
      }
    ],
    totalMarks: 25,
    obtainedMarks: 22,
    feedback: "Good work! Focus on checking your arithmetic in word problems.",
    attempts: 1,
    maxAttempts: 2
  },
  {
    id: "pa002",
    title: "Physics Mechanics Quiz",
    description: "Practice problems on Newton's laws and force calculations",
    subject: "Physics",
    topic: "Mechanics",
    assignedTo: ["l003", "l004"],
    assignedBy: "e003",
    educatorName: "Dr. Emily Brown",
    createdAt: getRelativeDate(-3),
    dueDate: getRelativeDate(1),
    status: "In Progress",
    difficulty: "Hard",
    estimatedTime: 90,
    questions: [
      {
        id: "q003",
        question: "Calculate the force required to accelerate a 10kg mass at 5m/s²",
        type: "Short Answer",
        correctAnswer: "50N",
        marks: 10
      }
    ],
    totalMarks: 50,
    attempts: 0,
    maxAttempts: 3
  },
  {
    id: "pa003",
    title: "Chemistry Bonding Practice",
    description: "Practice identifying chemical bonds and molecular structures",
    subject: "Chemistry",
    topic: "Chemical Bonding",
    assignedTo: ["l005", "l006"],
    assignedBy: "e005",
    educatorName: "Dr. Linda Davis",
    createdAt: getRelativeDate(-7),
    dueDate: getRelativeDate(-2),
    status: "Overdue",
    difficulty: "Medium",
    estimatedTime: 45,
    questions: [
      {
        id: "q004",
        question: "H₂O has which type of bonding?",
        type: "MCQ",
        options: ["Ionic", "Covalent", "Metallic", "Hydrogen"],
        correctAnswer: "Covalent",
        marks: 5
      }
    ],
    totalMarks: 30,
    attempts: 0,
    maxAttempts: 2
  },
  {
    id: "pa004",
    title: "English Grammar Exercise",
    description: "Practice identifying parts of speech and sentence structure",
    subject: "English",
    topic: "Grammar",
    assignedTo: ["l007", "l008", "l009"],
    assignedBy: "e002",
    educatorName: "Prof. Michael Johnson",
    createdAt: getRelativeDate(-2),
    dueDate: getRelativeDate(3),
    status: "Assigned",
    difficulty: "Easy",
    estimatedTime: 30,
    questions: [
      {
        id: "q005",
        question: "Identify the verb in: 'The cat ran quickly'",
        type: "Short Answer",
        correctAnswer: "ran",
        marks: 2
      }
    ],
    totalMarks: 20,
    attempts: 0,
    maxAttempts: 3
  }
];

// Examinations
export const examinations: Examination[] = [
  {
    id: "exam001",
    title: "Mathematics Mid-term Examination",
    description: "Comprehensive assessment covering algebra, geometry, and trigonometry",
    subject: "Mathematics",
    examType: "Mid-term",
    scheduledDate: getRelativeDate(7),
    duration: 120,
    totalMarks: 100,
    passingMarks: 40,
    educatorId: "e001",
    educatorName: "Dr. Sarah Smith",
    enrolledStudents: ["l001", "l002", "l003", "l004"],
    status: "Scheduled",
    instructions: [
      "Use only black or blue pen",
      "Show all working clearly",
      "Calculators are allowed",
      "Answer all questions"
    ],
    syllabus: [
      "Linear Equations and Inequalities",
      "Quadratic Equations",
      "Basic Trigonometry",
      "Coordinate Geometry"
    ],
    createdAt: getRelativeDate(-14),
    venue: "Room 101",
    isOnline: false
  },
  {
    id: "exam002",
    title: "Physics Unit Test - Mechanics",
    description: "Assessment on Newton's laws, forces, and motion",
    subject: "Physics",
    examType: "Unit Test",
    scheduledDate: getRelativeDate(3),
    duration: 90,
    totalMarks: 75,
    passingMarks: 30,
    educatorId: "e003",
    educatorName: "Dr. Emily Brown",
    enrolledStudents: ["l002", "l003", "l004", "l005"],
    status: "Scheduled",
    instructions: [
      "Formula sheet provided",
      "Show all calculations",
      "Diagrams must be labeled"
    ],
    syllabus: [
      "Newton's Laws of Motion",
      "Force and Acceleration",
      "Work, Energy and Power",
      "Momentum and Collisions"
    ],
    createdAt: getRelativeDate(-10),
    venue: "Physics Lab",
    isOnline: false
  },
  {
    id: "exam003",
    title: "English Literature Quiz",
    description: "Assessment on Shakespeare's Hamlet",
    subject: "English Literature",
    examType: "Quiz",
    scheduledDate: getRelativeDate(-2),
    duration: 45,
    totalMarks: 50,
    passingMarks: 20,
    educatorId: "e002",
    educatorName: "Prof. Michael Johnson",
    enrolledStudents: ["l006", "l007", "l008"],
    status: "Completed",
    instructions: [
      "Quote references required",
      "Support answers with evidence"
    ],
    syllabus: [
      "Hamlet Characters",
      "Major Themes",
      "Plot Analysis"
    ],
    examResults: [
      {
        studentId: "l006",
        studentName: "Frank Thompson",
        startTime: getRelativeDate(-2),
        endTime: getRelativeDate(-2),
        obtainedMarks: 42,
        percentage: 84,
        grade: "A",
        rank: 1,
        timeSpent: 40,
        answers: [],
        status: "Completed"
      },
      {
        studentId: "l007",
        studentName: "Grace Wilson",
        startTime: getRelativeDate(-2),
        endTime: getRelativeDate(-2),
        obtainedMarks: 38,
        percentage: 76,
        grade: "B+",
        rank: 2,
        timeSpent: 43,
        answers: [],
        status: "Completed"
      }
    ],
    createdAt: getRelativeDate(-7),
    isOnline: true
  },
  {
    id: "exam004",
    title: "Chemistry Final Examination",
    description: "Comprehensive final exam covering organic and inorganic chemistry",
    subject: "Chemistry",
    examType: "Final",
    scheduledDate: getRelativeDate(21),
    duration: 180,
    totalMarks: 150,
    passingMarks: 60,
    educatorId: "e005",
    educatorName: "Dr. Linda Davis",
    enrolledStudents: ["l001", "l004", "l005", "l006", "l008"],
    status: "Scheduled",
    instructions: [
      "Periodic table provided",
      "Use chemical formulas correctly",
      "Balance all equations",
      "Show all working"
    ],
    syllabus: [
      "Atomic Structure",
      "Chemical Bonding",
      "Organic Chemistry Basics",
      "Acid-Base Reactions",
      "Electrochemistry"
    ],
    createdAt: getRelativeDate(-30),
    venue: "Chemistry Lab",
    isOnline: false
  }
];

// Home Tasks
export const homeTasks: HomeTask[] = [
  {
    id: "ht001",
    title: "Algebra Problem Set",
    description: "Complete exercises 1-20 from Chapter 5 on linear equations",
    subject: "Mathematics",
    type: "Homework",
    assignedTo: ["l001", "l002", "l003"],
    assignedBy: "e001",
    educatorName: "Dr. Sarah Smith",
    assignedDate: getRelativeDate(0),
    dueDate: getRelativeDate(2),
    status: "Assigned Today",
    priority: "High",
    estimatedHours: 2,
    resources: [
      "Textbook Chapter 5",
      "Online Practice Platform",
      "Formula Reference Sheet"
    ],
    instructions: [
      "Show all working steps",
      "Check answers using substitution",
      "If stuck, review worked examples first"
    ],
    totalMarks: 20
  },
  {
    id: "ht002",
    title: "Physics Lab Report",
    description: "Write a detailed report on the pendulum experiment conducted in class",
    subject: "Physics",
    type: "Assignment",
    assignedTo: ["l003", "l004", "l005"],
    assignedBy: "e003",
    educatorName: "Dr. Emily Brown",
    assignedDate: getRelativeDate(-3),
    dueDate: getRelativeDate(4),
    submittedAt: getRelativeDate(-1),
    status: "Submitted",
    priority: "Medium",
    estimatedHours: 4,
    actualHours: 3.5,
    resources: [
      "Lab Manual",
      "Experimental Data Sheet",
      "Report Template"
    ],
    instructions: [
      "Include all measurements and calculations",
      "Analyze sources of error",
      "Conclude with real-world applications"
    ],
    submissions: [
      {
        studentId: "l003",
        studentName: "Charlie Davis",
        submittedAt: getRelativeDate(-1),
        files: ["pendulum_report_charlie.pdf"],
        notes: "Included additional analysis on air resistance",
        lateSubmission: false
      }
    ],
    totalMarks: 25
  },
  {
    id: "ht003",
    title: "Hamlet Character Analysis",
    description: "Write a 1000-word essay analyzing the character development of Hamlet",
    subject: "English Literature",
    type: "Assignment",
    assignedTo: ["l006", "l007", "l008"],
    assignedBy: "e002",
    educatorName: "Prof. Michael Johnson",
    assignedDate: getRelativeDate(-7),
    dueDate: getRelativeDate(-1),
    submittedAt: getRelativeDate(-1),
    gradedAt: getRelativeDate(0),
    status: "Graded",
    priority: "High",
    estimatedHours: 6,
    actualHours: 7,
    resources: [
      "Hamlet Full Text",
      "Character Analysis Guide",
      "Critical Essays Collection"
    ],
    instructions: [
      "Use MLA citation format",
      "Include at least 5 quotes with analysis",
      "Focus on character development throughout the play"
    ],
    submissions: [
      {
        studentId: "l007",
        studentName: "Grace Wilson",
        submittedAt: getRelativeDate(-1),
        files: ["hamlet_analysis_grace.docx"],
        lateSubmission: false,
        grade: "A-",
        marks: 22,
        feedback: "Excellent analysis with strong textual evidence. Consider exploring the psychological aspects further."
      }
    ],
    totalMarks: 25,
    obtainedMarks: 22,
    grade: "A-"
  },
  {
    id: "ht004",
    title: "Chemistry Research Project",
    description: "Research and present on a modern application of organic chemistry",
    subject: "Chemistry",
    type: "Project",
    assignedTo: ["l005", "l006"],
    assignedBy: "e005",
    educatorName: "Dr. Linda Davis",
    assignedDate: getRelativeDate(-14),
    dueDate: getRelativeDate(7),
    status: "Pending",
    priority: "Medium",
    estimatedHours: 10,
    resources: [
      "Scientific Journal Access",
      "Presentation Template",
      "Research Guidelines"
    ],
    instructions: [
      "Choose a specific application (pharmaceuticals, materials, etc.)",
      "Include chemical structures and reactions",
      "Prepare a 10-minute presentation",
      "Cite at least 5 peer-reviewed sources"
    ],
    totalMarks: 50
  },
  {
    id: "ht005",
    title: "History Timeline Project",
    description: "Create an interactive timeline of Ancient Roman Empire events",
    subject: "History",
    type: "Project",
    assignedTo: ["l004", "l008", "l009"],
    assignedBy: "e004",
    educatorName: "Mr. James Wilson",
    assignedDate: getRelativeDate(-10),
    dueDate: getRelativeDate(-3),
    status: "Overdue",
    priority: "High",
    estimatedHours: 8,
    resources: [
      "History Textbook Chapters 8-12",
      "Online Timeline Tools",
      "Primary Source Documents"
    ],
    instructions: [
      "Include major political, military, and cultural events",
      "Add images and maps where relevant",
      "Minimum 20 significant events",
      "Include impact analysis for each event"
    ],
    totalMarks: 40
  },
  {
    id: "ht006",
    title: "Weekly Math Practice",
    description: "Daily practice problems to reinforce concepts learned this week",
    subject: "Mathematics",
    type: "Homework",
    assignedTo: ["l001", "l002"],
    assignedBy: "e001",
    educatorName: "Dr. Sarah Smith",
    assignedDate: getRelativeDate(-2),
    dueDate: getRelativeDate(0),
    submittedAt: getRelativeDate(0),
    status: "Submitted",
    priority: "Medium",
    estimatedHours: 1.5,
    actualHours: 2,
    resources: [
      "Practice Problem Set",
      "Solution Manual (for checking)"
    ],
    instructions: [
      "Complete 5 problems daily",
      "Check solutions and note any difficulties"
    ],
    submissions: [
      {
        studentId: "l001",
        studentName: "Alice Johnson",
        submittedAt: getRelativeDate(0),
        files: ["weekly_practice_alice.pdf"],
        lateSubmission: false
      }
    ],
    totalMarks: 15
  }
];

// Export all collections
export default {
  dailyStudyPlans,
  practiceAssignments,
  examinations,
  homeTasks
};