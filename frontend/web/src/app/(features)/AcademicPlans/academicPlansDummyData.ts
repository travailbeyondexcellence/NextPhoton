// Academic Plans Dummy Data with relationship to existing educators and learners

// Helper to get relative dates for dynamic data
const getRelativeDate = (daysOffset: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  return date.toISOString();
};

// Type definitions for all Academic Plan types
export type PremadePlan = {
  id: string;
  title: string;
  description: string;
  subject: string;
  gradeLevel: string;
  duration: string;
  objectives: string[];
  topics: string[];
  resources: string[];
  assessmentCriteria: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  estimatedHours: number;
  tags: string[];
  isPublic: boolean;
  usageCount: number;
};

export type AssignedPlan = {
  id: string;
  planId: string;
  planTitle: string;
  learnerId: string;
  learnerName: string;
  educatorId: string;
  educatorName: string;
  assignedDate: string;
  dueDate: string;
  status: "Not Started" | "In Progress" | "Completed" | "Overdue";
  progress: number;
  lastAccessedAt?: string;
  completedTopics: string[];
  totalTopics: number;
  notes?: string;
  priority: "Low" | "Medium" | "High";
};

export type ExecutedPlan = {
  id: string;
  assignedPlanId: string;
  planTitle: string;
  learnerId: string;
  learnerName: string;
  educatorId: string;
  educatorName: string;
  startedAt: string;
  completedAt?: string;
  actualHours: number;
  completionRate: number;
  topicsCompleted: {
    topic: string;
    completedAt: string;
    score?: number;
  }[];
  assessmentScores: {
    criteria: string;
    score: number;
    maxScore: number;
  }[];
  feedback?: string;
  overallGrade?: string;
};

export type MindMap = {
  id: string;
  title: string;
  subject: string;
  centralConcept: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  nodes: MindMapNode[];
  connections: MindMapConnection[];
  isPublic: boolean;
  tags: string[];
  viewCount: number;
};

export type MindMapNode = {
  id: string;
  label: string;
  type: "concept" | "example" | "definition" | "question";
  level: number;
  parentId?: string;
  color?: string;
  resources?: string[];
};

export type MindMapConnection = {
  from: string;
  to: string;
  label?: string;
  type: "relates" | "causes" | "contains" | "contradicts";
};

// Premade Plans - Templates available for assignment
export const premadePlans: PremadePlan[] = [
  {
    id: "pp001",
    title: "Introduction to Algebra",
    description: "A comprehensive introduction to algebraic concepts including variables, equations, and functions",
    subject: "Mathematics",
    gradeLevel: "Grade 8-9",
    duration: "6 weeks",
    objectives: [
      "Understand variables and expressions",
      "Solve linear equations",
      "Graph linear functions",
      "Apply algebra to real-world problems"
    ],
    topics: [
      "Variables and Constants",
      "Algebraic Expressions",
      "Linear Equations",
      "Inequalities",
      "Functions and Graphs",
      "Word Problems"
    ],
    resources: [
      "Khan Academy Algebra Basics",
      "Textbook: Algebra Fundamentals",
      "Interactive Equation Solver",
      "Practice Worksheet Set A"
    ],
    assessmentCriteria: [
      "Weekly quizzes on each topic",
      "Mid-term project on real-world applications",
      "Final comprehensive exam"
    ],
    createdBy: "e001",
    createdAt: getRelativeDate(-60),
    updatedAt: getRelativeDate(-5),
    difficulty: "Beginner",
    estimatedHours: 36,
    tags: ["algebra", "mathematics", "equations", "functions"],
    isPublic: true,
    usageCount: 156
  },
  {
    id: "pp002",
    title: "English Literature: Shakespeare's Works",
    description: "Exploring the timeless works of William Shakespeare through critical analysis and performance",
    subject: "English Literature",
    gradeLevel: "Grade 10-11",
    duration: "8 weeks",
    objectives: [
      "Analyze Shakespearean language and themes",
      "Understand historical context",
      "Perform dramatic interpretations",
      "Write critical essays"
    ],
    topics: [
      "Introduction to Shakespeare",
      "Romeo and Juliet",
      "Hamlet",
      "Macbeth",
      "Sonnets Analysis",
      "Theatre and Performance"
    ],
    resources: [
      "Complete Works of Shakespeare",
      "Film Adaptations Collection",
      "Literary Analysis Guide",
      "Performance Workshop Materials"
    ],
    assessmentCriteria: [
      "Character analysis essays",
      "Group performance project",
      "Comparative literature paper",
      "Final examination"
    ],
    createdBy: "e002",
    createdAt: getRelativeDate(-90),
    updatedAt: getRelativeDate(-10),
    difficulty: "Intermediate",
    estimatedHours: 48,
    tags: ["literature", "shakespeare", "drama", "english"],
    isPublic: true,
    usageCount: 203
  },
  {
    id: "pp003",
    title: "Physics: Mechanics and Motion",
    description: "Understanding the fundamental principles of mechanics, forces, and motion",
    subject: "Physics",
    gradeLevel: "Grade 11-12",
    duration: "10 weeks",
    objectives: [
      "Master Newton's Laws of Motion",
      "Calculate force, mass, and acceleration",
      "Understand energy and momentum",
      "Apply physics to engineering problems"
    ],
    topics: [
      "Kinematics",
      "Newton's Laws",
      "Forces and Equilibrium",
      "Work and Energy",
      "Momentum and Collisions",
      "Rotational Motion"
    ],
    resources: [
      "Physics Textbook: Mechanics",
      "PhET Interactive Simulations",
      "Laboratory Equipment Guide",
      "Problem Sets Collection"
    ],
    assessmentCriteria: [
      "Laboratory reports",
      "Problem-solving assignments",
      "Practical demonstrations",
      "Comprehensive final exam"
    ],
    createdBy: "e003",
    createdAt: getRelativeDate(-120),
    updatedAt: getRelativeDate(-3),
    difficulty: "Advanced",
    estimatedHours: 60,
    tags: ["physics", "mechanics", "forces", "motion", "science"],
    isPublic: true,
    usageCount: 89
  },
  {
    id: "pp004",
    title: "World History: Ancient Civilizations",
    description: "Journey through the rise and fall of ancient civilizations from Mesopotamia to Rome",
    subject: "History",
    gradeLevel: "Grade 9-10",
    duration: "12 weeks",
    objectives: [
      "Understand chronological development of civilizations",
      "Analyze cultural achievements",
      "Compare governance systems",
      "Evaluate historical sources"
    ],
    topics: [
      "Mesopotamian Civilizations",
      "Ancient Egypt",
      "Greek City-States",
      "Roman Empire",
      "Ancient China",
      "Indus Valley Civilization"
    ],
    resources: [
      "World History Textbook",
      "Historical Atlas",
      "Documentary Series",
      "Primary Source Documents"
    ],
    assessmentCriteria: [
      "Research projects on civilizations",
      "Timeline creation",
      "Source analysis papers",
      "Final comprehensive exam"
    ],
    createdBy: "e004",
    createdAt: getRelativeDate(-150),
    updatedAt: getRelativeDate(-20),
    difficulty: "Intermediate",
    estimatedHours: 72,
    tags: ["history", "ancient", "civilizations", "world-history"],
    isPublic: true,
    usageCount: 267
  },
  {
    id: "pp005",
    title: "Chemistry: Organic Chemistry Basics",
    description: "Introduction to organic chemistry, carbon compounds, and biological molecules",
    subject: "Chemistry",
    gradeLevel: "Grade 11-12",
    duration: "8 weeks",
    objectives: [
      "Understand carbon bonding",
      "Name organic compounds",
      "Identify functional groups",
      "Study reaction mechanisms"
    ],
    topics: [
      "Carbon and Bonding",
      "Alkanes and Alkenes",
      "Functional Groups",
      "Isomerism",
      "Organic Reactions",
      "Biological Molecules"
    ],
    resources: [
      "Organic Chemistry Textbook",
      "Molecular Model Kit",
      "ChemDraw Software",
      "Laboratory Manual"
    ],
    assessmentCriteria: [
      "Nomenclature tests",
      "Laboratory synthesis projects",
      "Mechanism drawings",
      "Final examination"
    ],
    createdBy: "e005",
    createdAt: getRelativeDate(-80),
    updatedAt: getRelativeDate(-7),
    difficulty: "Advanced",
    estimatedHours: 48,
    tags: ["chemistry", "organic", "molecules", "reactions"],
    isPublic: true,
    usageCount: 124
  },
  {
    id: "pp006",
    title: "Computer Science: Introduction to Programming",
    description: "Learn programming fundamentals using Python with hands-on projects",
    subject: "Computer Science",
    gradeLevel: "Grade 9-12",
    duration: "10 weeks",
    objectives: [
      "Write basic Python programs",
      "Understand data structures",
      "Implement algorithms",
      "Build practical applications"
    ],
    topics: [
      "Variables and Data Types",
      "Control Structures",
      "Functions and Modules",
      "Lists and Dictionaries",
      "File Handling",
      "Object-Oriented Basics"
    ],
    resources: [
      "Python Programming Guide",
      "Online Coding Platform",
      "Project Templates",
      "Debugging Tools"
    ],
    assessmentCriteria: [
      "Weekly coding assignments",
      "Mini projects",
      "Code review sessions",
      "Final project presentation"
    ],
    createdBy: "e001",
    createdAt: getRelativeDate(-100),
    updatedAt: getRelativeDate(-2),
    difficulty: "Beginner",
    estimatedHours: 50,
    tags: ["programming", "python", "coding", "computer-science"],
    isPublic: true,
    usageCount: 342
  }
];

// Assigned Plans - Plans assigned to specific learners
export const assignedPlans: AssignedPlan[] = [
  {
    id: "ap001",
    planId: "pp001",
    planTitle: "Introduction to Algebra",
    learnerId: "l001",
    learnerName: "Alice Johnson",
    educatorId: "e001",
    educatorName: "Dr. Sarah Smith",
    assignedDate: getRelativeDate(-14),
    dueDate: getRelativeDate(28),
    status: "In Progress",
    progress: 45,
    lastAccessedAt: getRelativeDate(-1),
    completedTopics: ["Variables and Constants", "Algebraic Expressions"],
    totalTopics: 6,
    notes: "Student showing good progress with expressions",
    priority: "Medium"
  },
  {
    id: "ap002",
    planId: "pp002",
    planTitle: "English Literature: Shakespeare's Works",
    learnerId: "l002",
    learnerName: "Bob Chen",
    educatorId: "e002",
    educatorName: "Prof. Michael Johnson",
    assignedDate: getRelativeDate(-21),
    dueDate: getRelativeDate(35),
    status: "In Progress",
    progress: 30,
    lastAccessedAt: getRelativeDate(-2),
    completedTopics: ["Introduction to Shakespeare", "Romeo and Juliet"],
    totalTopics: 6,
    notes: "Excellent analysis of Romeo and Juliet themes",
    priority: "High"
  },
  {
    id: "ap003",
    planId: "pp003",
    planTitle: "Physics: Mechanics and Motion",
    learnerId: "l003",
    learnerName: "Charlie Davis",
    educatorId: "e003",
    educatorName: "Dr. Emily Brown",
    assignedDate: getRelativeDate(-7),
    dueDate: getRelativeDate(63),
    status: "In Progress",
    progress: 15,
    lastAccessedAt: getRelativeDate(0),
    completedTopics: ["Kinematics"],
    totalTopics: 6,
    notes: "Strong mathematical foundation, progressing well",
    priority: "Medium"
  },
  {
    id: "ap004",
    planId: "pp004",
    planTitle: "World History: Ancient Civilizations",
    learnerId: "l004",
    learnerName: "Diana Martinez",
    educatorId: "e004",
    educatorName: "Mr. James Wilson",
    assignedDate: getRelativeDate(-30),
    dueDate: getRelativeDate(54),
    status: "In Progress",
    progress: 50,
    lastAccessedAt: getRelativeDate(-1),
    completedTopics: ["Mesopotamian Civilizations", "Ancient Egypt", "Greek City-States"],
    totalTopics: 6,
    priority: "Low"
  },
  {
    id: "ap005",
    planId: "pp001",
    planTitle: "Introduction to Algebra",
    learnerId: "l005",
    learnerName: "Eve Anderson",
    educatorId: "e001",
    educatorName: "Dr. Sarah Smith",
    assignedDate: getRelativeDate(-10),
    dueDate: getRelativeDate(32),
    status: "Not Started",
    progress: 0,
    completedTopics: [],
    totalTopics: 6,
    notes: "Scheduled to begin next week",
    priority: "High"
  },
  {
    id: "ap006",
    planId: "pp005",
    planTitle: "Chemistry: Organic Chemistry Basics",
    learnerId: "l006",
    learnerName: "Frank Thompson",
    educatorId: "e005",
    educatorName: "Dr. Linda Davis",
    assignedDate: getRelativeDate(-45),
    dueDate: getRelativeDate(-5),
    status: "Completed",
    progress: 100,
    lastAccessedAt: getRelativeDate(-5),
    completedTopics: [
      "Carbon and Bonding",
      "Alkanes and Alkenes",
      "Functional Groups",
      "Isomerism",
      "Organic Reactions",
      "Biological Molecules"
    ],
    totalTopics: 6,
    notes: "Excellent completion with high scores",
    priority: "Low"
  },
  {
    id: "ap007",
    planId: "pp006",
    planTitle: "Computer Science: Introduction to Programming",
    learnerId: "l007",
    learnerName: "Grace Wilson",
    educatorId: "e001",
    educatorName: "Dr. Sarah Smith",
    assignedDate: getRelativeDate(-5),
    dueDate: getRelativeDate(65),
    status: "In Progress",
    progress: 20,
    lastAccessedAt: getRelativeDate(0),
    completedTopics: ["Variables and Data Types"],
    totalTopics: 6,
    notes: "Quick learner, enjoying the practical exercises",
    priority: "Medium"
  },
  {
    id: "ap008",
    planId: "pp002",
    planTitle: "English Literature: Shakespeare's Works",
    learnerId: "l008",
    learnerName: "Henry Brown",
    educatorId: "e002",
    educatorName: "Prof. Michael Johnson",
    assignedDate: getRelativeDate(-60),
    dueDate: getRelativeDate(-4),
    status: "Overdue",
    progress: 75,
    lastAccessedAt: getRelativeDate(-10),
    completedTopics: [
      "Introduction to Shakespeare",
      "Romeo and Juliet",
      "Hamlet",
      "Macbeth",
      "Sonnets Analysis"
    ],
    totalTopics: 6,
    notes: "Need to complete final performance project",
    priority: "High"
  }
];

// Executed Plans - Completed or in-progress executions
export const executedPlans: ExecutedPlan[] = [
  {
    id: "ep001",
    assignedPlanId: "ap006",
    planTitle: "Chemistry: Organic Chemistry Basics",
    learnerId: "l006",
    learnerName: "Frank Thompson",
    educatorId: "e005",
    educatorName: "Dr. Linda Davis",
    startedAt: getRelativeDate(-45),
    completedAt: getRelativeDate(-5),
    actualHours: 46,
    completionRate: 100,
    topicsCompleted: [
      { topic: "Carbon and Bonding", completedAt: getRelativeDate(-40), score: 95 },
      { topic: "Alkanes and Alkenes", completedAt: getRelativeDate(-35), score: 88 },
      { topic: "Functional Groups", completedAt: getRelativeDate(-28), score: 92 },
      { topic: "Isomerism", completedAt: getRelativeDate(-20), score: 87 },
      { topic: "Organic Reactions", completedAt: getRelativeDate(-12), score: 90 },
      { topic: "Biological Molecules", completedAt: getRelativeDate(-5), score: 94 }
    ],
    assessmentScores: [
      { criteria: "Nomenclature tests", score: 92, maxScore: 100 },
      { criteria: "Laboratory synthesis projects", score: 88, maxScore: 100 },
      { criteria: "Mechanism drawings", score: 95, maxScore: 100 },
      { criteria: "Final examination", score: 91, maxScore: 100 }
    ],
    feedback: "Excellent understanding of organic chemistry fundamentals. Strong laboratory skills demonstrated.",
    overallGrade: "A"
  },
  {
    id: "ep002",
    assignedPlanId: "ap001",
    planTitle: "Introduction to Algebra",
    learnerId: "l001",
    learnerName: "Alice Johnson",
    educatorId: "e001",
    educatorName: "Dr. Sarah Smith",
    startedAt: getRelativeDate(-14),
    actualHours: 16,
    completionRate: 45,
    topicsCompleted: [
      { topic: "Variables and Constants", completedAt: getRelativeDate(-12), score: 88 },
      { topic: "Algebraic Expressions", completedAt: getRelativeDate(-7), score: 85 }
    ],
    assessmentScores: [
      { criteria: "Weekly quizzes on each topic", score: 86, maxScore: 100 }
    ],
    feedback: "Good progress so far. Focus on practice problems for linear equations."
  },
  {
    id: "ep003",
    assignedPlanId: "ap002",
    planTitle: "English Literature: Shakespeare's Works",
    learnerId: "l002",
    learnerName: "Bob Chen",
    educatorId: "e002",
    educatorName: "Prof. Michael Johnson",
    startedAt: getRelativeDate(-21),
    actualHours: 14,
    completionRate: 30,
    topicsCompleted: [
      { topic: "Introduction to Shakespeare", completedAt: getRelativeDate(-18), score: 92 },
      { topic: "Romeo and Juliet", completedAt: getRelativeDate(-10), score: 95 }
    ],
    assessmentScores: [
      { criteria: "Character analysis essays", score: 93, maxScore: 100 }
    ],
    feedback: "Exceptional literary analysis skills. Looking forward to Hamlet discussion."
  },
  {
    id: "ep004",
    assignedPlanId: "ap008",
    planTitle: "English Literature: Shakespeare's Works",
    learnerId: "l008",
    learnerName: "Henry Brown",
    educatorId: "e002",
    educatorName: "Prof. Michael Johnson",
    startedAt: getRelativeDate(-60),
    actualHours: 38,
    completionRate: 75,
    topicsCompleted: [
      { topic: "Introduction to Shakespeare", completedAt: getRelativeDate(-55), score: 82 },
      { topic: "Romeo and Juliet", completedAt: getRelativeDate(-48), score: 85 },
      { topic: "Hamlet", completedAt: getRelativeDate(-40), score: 88 },
      { topic: "Macbeth", completedAt: getRelativeDate(-30), score: 84 },
      { topic: "Sonnets Analysis", completedAt: getRelativeDate(-20), score: 90 }
    ],
    assessmentScores: [
      { criteria: "Character analysis essays", score: 86, maxScore: 100 },
      { criteria: "Comparative literature paper", score: 88, maxScore: 100 }
    ],
    feedback: "Good progress but need to complete performance project for full credit."
  },
  {
    id: "ep005",
    assignedPlanId: "ap003",
    planTitle: "Physics: Mechanics and Motion",
    learnerId: "l003",
    learnerName: "Charlie Davis",
    educatorId: "e003",
    educatorName: "Dr. Emily Brown",
    startedAt: getRelativeDate(-7),
    actualHours: 9,
    completionRate: 15,
    topicsCompleted: [
      { topic: "Kinematics", completedAt: getRelativeDate(-2), score: 91 }
    ],
    assessmentScores: [
      { criteria: "Laboratory reports", score: 89, maxScore: 100 }
    ],
    feedback: "Strong start with kinematics. Mathematical approach is excellent."
  }
];

// Mind Maps - Visual learning tools
export const mindMaps: MindMap[] = [
  {
    id: "mm001",
    title: "Algebra Concepts Map",
    subject: "Mathematics",
    centralConcept: "Algebra",
    createdBy: "e001",
    createdAt: getRelativeDate(-30),
    updatedAt: getRelativeDate(-5),
    nodes: [
      { id: "n1", label: "Algebra", type: "concept", level: 0 },
      { id: "n2", label: "Variables", type: "concept", level: 1, parentId: "n1" },
      { id: "n3", label: "Equations", type: "concept", level: 1, parentId: "n1" },
      { id: "n4", label: "Functions", type: "concept", level: 1, parentId: "n1" },
      { id: "n5", label: "x, y, z", type: "example", level: 2, parentId: "n2" },
      { id: "n6", label: "Linear", type: "definition", level: 2, parentId: "n3" },
      { id: "n7", label: "Quadratic", type: "definition", level: 2, parentId: "n3" },
      { id: "n8", label: "f(x) = mx + b", type: "example", level: 2, parentId: "n4" }
    ],
    connections: [
      { from: "n1", to: "n2", type: "contains" },
      { from: "n1", to: "n3", type: "contains" },
      { from: "n1", to: "n4", type: "contains" },
      { from: "n2", to: "n3", type: "relates", label: "used in" },
      { from: "n3", to: "n4", type: "relates", label: "represents" }
    ],
    isPublic: true,
    tags: ["algebra", "mathematics", "visual-learning"],
    viewCount: 234
  },
  {
    id: "mm002",
    title: "Shakespeare's Themes",
    subject: "English Literature",
    centralConcept: "Shakespeare's Major Themes",
    createdBy: "e002",
    createdAt: getRelativeDate(-45),
    updatedAt: getRelativeDate(-10),
    nodes: [
      { id: "n1", label: "Shakespeare's Themes", type: "concept", level: 0 },
      { id: "n2", label: "Love", type: "concept", level: 1, parentId: "n1" },
      { id: "n3", label: "Power", type: "concept", level: 1, parentId: "n1" },
      { id: "n4", label: "Tragedy", type: "concept", level: 1, parentId: "n1" },
      { id: "n5", label: "Romeo & Juliet", type: "example", level: 2, parentId: "n2" },
      { id: "n6", label: "Macbeth", type: "example", level: 2, parentId: "n3" },
      { id: "n7", label: "Hamlet", type: "example", level: 2, parentId: "n4" },
      { id: "n8", label: "Forbidden Love", type: "definition", level: 3, parentId: "n5" }
    ],
    connections: [
      { from: "n1", to: "n2", type: "contains" },
      { from: "n1", to: "n3", type: "contains" },
      { from: "n1", to: "n4", type: "contains" },
      { from: "n2", to: "n4", type: "relates", label: "often leads to" },
      { from: "n3", to: "n4", type: "causes" }
    ],
    isPublic: true,
    tags: ["shakespeare", "literature", "themes"],
    viewCount: 456
  },
  {
    id: "mm003",
    title: "Forces and Motion",
    subject: "Physics",
    centralConcept: "Newton's Laws",
    createdBy: "e003",
    createdAt: getRelativeDate(-20),
    updatedAt: getRelativeDate(-3),
    nodes: [
      { id: "n1", label: "Newton's Laws", type: "concept", level: 0 },
      { id: "n2", label: "First Law", type: "concept", level: 1, parentId: "n1" },
      { id: "n3", label: "Second Law", type: "concept", level: 1, parentId: "n1" },
      { id: "n4", label: "Third Law", type: "concept", level: 1, parentId: "n1" },
      { id: "n5", label: "Inertia", type: "definition", level: 2, parentId: "n2" },
      { id: "n6", label: "F = ma", type: "definition", level: 2, parentId: "n3" },
      { id: "n7", label: "Action-Reaction", type: "definition", level: 2, parentId: "n4" }
    ],
    connections: [
      { from: "n1", to: "n2", type: "contains" },
      { from: "n1", to: "n3", type: "contains" },
      { from: "n1", to: "n4", type: "contains" },
      { from: "n2", to: "n3", type: "relates" },
      { from: "n3", to: "n4", type: "relates" }
    ],
    isPublic: true,
    tags: ["physics", "newton", "mechanics"],
    viewCount: 189
  },
  {
    id: "mm004",
    title: "Ancient Civilizations Timeline",
    subject: "History",
    centralConcept: "Ancient World",
    createdBy: "e004",
    createdAt: getRelativeDate(-60),
    updatedAt: getRelativeDate(-15),
    nodes: [
      { id: "n1", label: "Ancient World", type: "concept", level: 0 },
      { id: "n2", label: "Mesopotamia", type: "concept", level: 1, parentId: "n1" },
      { id: "n3", label: "Egypt", type: "concept", level: 1, parentId: "n1" },
      { id: "n4", label: "Greece", type: "concept", level: 1, parentId: "n1" },
      { id: "n5", label: "Rome", type: "concept", level: 1, parentId: "n1" },
      { id: "n6", label: "3500 BCE", type: "example", level: 2, parentId: "n2" },
      { id: "n7", label: "3100 BCE", type: "example", level: 2, parentId: "n3" },
      { id: "n8", label: "800 BCE", type: "example", level: 2, parentId: "n4" },
      { id: "n9", label: "753 BCE", type: "example", level: 2, parentId: "n5" }
    ],
    connections: [
      { from: "n2", to: "n3", type: "relates", label: "influenced" },
      { from: "n3", to: "n4", type: "relates", label: "inspired" },
      { from: "n4", to: "n5", type: "relates", label: "conquered by" }
    ],
    isPublic: true,
    tags: ["history", "ancient", "timeline", "civilizations"],
    viewCount: 567
  },
  {
    id: "mm005",
    title: "Organic Chemistry Functional Groups",
    subject: "Chemistry",
    centralConcept: "Functional Groups",
    createdBy: "e005",
    createdAt: getRelativeDate(-25),
    updatedAt: getRelativeDate(-8),
    nodes: [
      { id: "n1", label: "Functional Groups", type: "concept", level: 0 },
      { id: "n2", label: "Hydroxyl", type: "concept", level: 1, parentId: "n1" },
      { id: "n3", label: "Carbonyl", type: "concept", level: 1, parentId: "n1" },
      { id: "n4", label: "Carboxyl", type: "concept", level: 1, parentId: "n1" },
      { id: "n5", label: "-OH", type: "example", level: 2, parentId: "n2" },
      { id: "n6", label: "C=O", type: "example", level: 2, parentId: "n3" },
      { id: "n7", label: "-COOH", type: "example", level: 2, parentId: "n4" },
      { id: "n8", label: "Alcohols", type: "definition", level: 2, parentId: "n2" },
      { id: "n9", label: "Ketones/Aldehydes", type: "definition", level: 2, parentId: "n3" }
    ],
    connections: [
      { from: "n1", to: "n2", type: "contains" },
      { from: "n1", to: "n3", type: "contains" },
      { from: "n1", to: "n4", type: "contains" },
      { from: "n3", to: "n4", type: "relates", label: "part of" }
    ],
    isPublic: true,
    tags: ["chemistry", "organic", "functional-groups"],
    viewCount: 298
  },
  {
    id: "mm006",
    title: "Programming Concepts",
    subject: "Computer Science",
    centralConcept: "Programming Fundamentals",
    createdBy: "e001",
    createdAt: getRelativeDate(-15),
    updatedAt: getRelativeDate(-1),
    nodes: [
      { id: "n1", label: "Programming", type: "concept", level: 0 },
      { id: "n2", label: "Variables", type: "concept", level: 1, parentId: "n1" },
      { id: "n3", label: "Control Flow", type: "concept", level: 1, parentId: "n1" },
      { id: "n4", label: "Functions", type: "concept", level: 1, parentId: "n1" },
      { id: "n5", label: "Data Types", type: "concept", level: 2, parentId: "n2" },
      { id: "n6", label: "If/Else", type: "example", level: 2, parentId: "n3" },
      { id: "n7", label: "Loops", type: "example", level: 2, parentId: "n3" },
      { id: "n8", label: "Parameters", type: "definition", level: 2, parentId: "n4" },
      { id: "n9", label: "Return Values", type: "definition", level: 2, parentId: "n4" }
    ],
    connections: [
      { from: "n1", to: "n2", type: "contains" },
      { from: "n1", to: "n3", type: "contains" },
      { from: "n1", to: "n4", type: "contains" },
      { from: "n2", to: "n4", type: "relates", label: "passed to" },
      { from: "n3", to: "n4", type: "relates", label: "calls" }
    ],
    isPublic: true,
    tags: ["programming", "computer-science", "python", "basics"],
    viewCount: 412
  }
];

// Export all collections
export default {
  premadePlans,
  assignedPlans,
  executedPlans,
  mindMaps
};