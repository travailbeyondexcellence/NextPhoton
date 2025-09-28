// Comprehensive Performance Data for Academic Performance Dashboard

// Helper to get relative dates for dynamic data
const getRelativeDate = (daysOffset: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  return date.toISOString();
};

// Type definitions for comprehensive performance tracking
export type StudentPerformance = {
  studentId: string;
  studentName: string;
  overallGrade: string;
  overallPercentage: number;
  subjectPerformances: SubjectPerformance[];
  attendanceRate: number;
  improvementTrend: "Improving" | "Stable" | "Declining";
  monthlyProgress: number;
  lastUpdated: string;
  needsSupport: boolean;
  isTopPerformer: boolean;
  rank: number;
  totalStudents: number;
};

export type SubjectPerformance = {
  subject: string;
  currentGrade: string;
  percentage: number;
  totalTests: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  recentScores: TestScore[];
  trend: "Improving" | "Stable" | "Declining";
  weakAreas: string[];
  strongAreas: string[];
};

export type TestScore = {
  testId: string;
  testName: string;
  date: string;
  score: number;
  maxScore: number;
  percentage: number;
  grade: string;
  difficulty: "Easy" | "Medium" | "Hard";
  topics: string[];
};

export type ClassPerformanceMetrics = {
  classId: string;
  className: string;
  educatorId: string;
  educatorName: string;
  subject: string;
  totalStudents: number;
  averagePerformance: number;
  topPerformers: number;
  needSupport: number;
  improvementRate: number;
  attendanceRate: number;
  performanceDistribution: {
    aGrade: number;
    bGrade: number;
    cGrade: number;
    dGrade: number;
    fGrade: number;
  };
  recentAssessments: {
    testName: string;
    date: string;
    averageScore: number;
    maxScore: number;
    participation: number;
  }[];
};

export type PerformanceTrend = {
  month: string;
  averagePerformance: number;
  totalAssessments: number;
  improvementRate: number;
  attendanceRate: number;
};

export type AlertsAndInsights = {
  id: string;
  type: "Alert" | "Insight" | "Recommendation";
  priority: "High" | "Medium" | "Low";
  title: string;
  description: string;
  studentId?: string;
  studentName?: string;
  subject?: string;
  actionRequired: boolean;
  createdAt: string;
};

// Student Performance Data
export const studentPerformances: StudentPerformance[] = [
  {
    studentId: "l001",
    studentName: "Alice Johnson",
    overallGrade: "A",
    overallPercentage: 92,
    subjectPerformances: [
      {
        subject: "Mathematics",
        currentGrade: "A+",
        percentage: 95,
        totalTests: 8,
        averageScore: 95,
        highestScore: 100,
        lowestScore: 85,
        recentScores: [
          {
            testId: "test001",
            testName: "Algebra Quiz",
            date: getRelativeDate(-3),
            score: 22,
            maxScore: 25,
            percentage: 88,
            grade: "A-",
            difficulty: "Medium",
            topics: ["Linear Equations", "Quadratic Equations"]
          },
          {
            testId: "test002",
            testName: "Geometry Test",
            date: getRelativeDate(-10),
            score: 48,
            maxScore: 50,
            percentage: 96,
            grade: "A+",
            difficulty: "Hard",
            topics: ["Triangles", "Coordinate Geometry"]
          }
        ],
        trend: "Improving",
        weakAreas: ["Word Problems"],
        strongAreas: ["Algebraic Manipulation", "Geometric Proofs"]
      },
      {
        subject: "Physics",
        currentGrade: "A",
        percentage: 90,
        totalTests: 6,
        averageScore: 90,
        highestScore: 98,
        lowestScore: 82,
        recentScores: [
          {
            testId: "test003",
            testName: "Mechanics Test",
            date: getRelativeDate(-5),
            score: 44,
            maxScore: 50,
            percentage: 88,
            grade: "A-",
            difficulty: "Hard",
            topics: ["Newton's Laws", "Forces"]
          }
        ],
        trend: "Stable",
        weakAreas: ["Numerical Problems"],
        strongAreas: ["Conceptual Understanding", "Problem Analysis"]
      },
      {
        subject: "Chemistry",
        currentGrade: "A-",
        percentage: 87,
        totalTests: 5,
        averageScore: 87,
        highestScore: 95,
        lowestScore: 78,
        recentScores: [
          {
            testId: "test004",
            testName: "Organic Chemistry Quiz",
            date: getRelativeDate(-7),
            score: 38,
            maxScore: 40,
            percentage: 95,
            grade: "A+",
            difficulty: "Medium",
            topics: ["Hydrocarbons", "Functional Groups"]
          }
        ],
        trend: "Improving",
        weakAreas: ["Chemical Calculations"],
        strongAreas: ["Organic Reactions", "Nomenclature"]
      }
    ],
    attendanceRate: 96,
    improvementTrend: "Improving",
    monthlyProgress: 8,
    lastUpdated: getRelativeDate(-1),
    needsSupport: false,
    isTopPerformer: true,
    rank: 1,
    totalStudents: 25
  },
  {
    studentId: "l002",
    studentName: "Bob Chen",
    overallGrade: "A-",
    overallPercentage: 88,
    subjectPerformances: [
      {
        subject: "English Literature",
        currentGrade: "A",
        percentage: 92,
        totalTests: 7,
        averageScore: 92,
        highestScore: 98,
        lowestScore: 85,
        recentScores: [
          {
            testId: "test005",
            testName: "Shakespeare Analysis",
            date: getRelativeDate(-2),
            score: 42,
            maxScore: 50,
            percentage: 84,
            grade: "B+",
            difficulty: "Hard",
            topics: ["Character Analysis", "Themes"]
          }
        ],
        trend: "Stable",
        weakAreas: ["Poetry Analysis"],
        strongAreas: ["Essay Writing", "Character Development"]
      },
      {
        subject: "History",
        currentGrade: "B+",
        percentage: 85,
        totalTests: 6,
        averageScore: 85,
        highestScore: 92,
        lowestScore: 76,
        recentScores: [
          {
            testId: "test006",
            testName: "Ancient Civilizations",
            date: getRelativeDate(-8),
            score: 34,
            maxScore: 40,
            percentage: 85,
            grade: "B+",
            difficulty: "Medium",
            topics: ["Roman Empire", "Greek City-States"]
          }
        ],
        trend: "Improving",
        weakAreas: ["Date Memorization"],
        strongAreas: ["Historical Analysis", "Cause and Effect"]
      }
    ],
    attendanceRate: 94,
    improvementTrend: "Stable",
    monthlyProgress: 3,
    lastUpdated: getRelativeDate(-1),
    needsSupport: false,
    isTopPerformer: true,
    rank: 3,
    totalStudents: 25
  },
  {
    studentId: "l003",
    studentName: "Charlie Davis",
    overallGrade: "B",
    overallPercentage: 78,
    subjectPerformances: [
      {
        subject: "Mathematics",
        currentGrade: "B-",
        percentage: 75,
        totalTests: 8,
        averageScore: 75,
        highestScore: 88,
        lowestScore: 62,
        recentScores: [
          {
            testId: "test007",
            testName: "Trigonometry Test",
            date: getRelativeDate(-4),
            score: 28,
            maxScore: 40,
            percentage: 70,
            grade: "B-",
            difficulty: "Hard",
            topics: ["Trigonometric Ratios", "Identities"]
          }
        ],
        trend: "Improving",
        weakAreas: ["Complex Problem Solving", "Trigonometry"],
        strongAreas: ["Basic Calculations", "Algebraic Operations"]
      },
      {
        subject: "Physics",
        currentGrade: "B",
        percentage: 82,
        totalTests: 6,
        averageScore: 82,
        highestScore: 90,
        lowestScore: 72,
        recentScores: [
          {
            testId: "test008",
            testName: "Optics Quiz",
            date: getRelativeDate(-6),
            score: 32,
            maxScore: 40,
            percentage: 80,
            grade: "B",
            difficulty: "Medium",
            topics: ["Reflection", "Refraction"]
          }
        ],
        trend: "Stable",
        weakAreas: ["Mathematical Applications"],
        strongAreas: ["Conceptual Physics", "Laboratory Work"]
      }
    ],
    attendanceRate: 89,
    improvementTrend: "Improving",
    monthlyProgress: 12,
    lastUpdated: getRelativeDate(-1),
    needsSupport: false,
    isTopPerformer: false,
    rank: 8,
    totalStudents: 25
  },
  {
    studentId: "l004",
    studentName: "Diana Martinez",
    overallGrade: "C+",
    overallPercentage: 68,
    subjectPerformances: [
      {
        subject: "Biology",
        currentGrade: "B-",
        percentage: 72,
        totalTests: 7,
        averageScore: 72,
        highestScore: 85,
        lowestScore: 58,
        recentScores: [
          {
            testId: "test009",
            testName: "Cell Biology Test",
            date: getRelativeDate(-9),
            score: 28,
            maxScore: 40,
            percentage: 70,
            grade: "B-",
            difficulty: "Medium",
            topics: ["Cell Structure", "Cell Division"]
          }
        ],
        trend: "Stable",
        weakAreas: ["Molecular Biology", "Genetics"],
        strongAreas: ["Plant Biology", "Human Anatomy"]
      },
      {
        subject: "Chemistry",
        currentGrade: "C",
        percentage: 65,
        totalTests: 5,
        averageScore: 65,
        highestScore: 78,
        lowestScore: 52,
        recentScores: [
          {
            testId: "test010",
            testName: "Acids and Bases",
            date: getRelativeDate(-12),
            score: 24,
            maxScore: 40,
            percentage: 60,
            grade: "C",
            difficulty: "Medium",
            topics: ["pH Scale", "Neutralization"]
          }
        ],
        trend: "Declining",
        weakAreas: ["Chemical Equations", "Stoichiometry"],
        strongAreas: ["Laboratory Techniques", "Observation Skills"]
      }
    ],
    attendanceRate: 85,
    improvementTrend: "Declining",
    monthlyProgress: -5,
    lastUpdated: getRelativeDate(-1),
    needsSupport: true,
    isTopPerformer: false,
    rank: 15,
    totalStudents: 25
  },
  {
    studentId: "l005",
    studentName: "Eve Anderson",
    overallGrade: "D+",
    overallPercentage: 58,
    subjectPerformances: [
      {
        subject: "Mathematics",
        currentGrade: "D",
        percentage: 55,
        totalTests: 8,
        averageScore: 55,
        highestScore: 68,
        lowestScore: 42,
        recentScores: [
          {
            testId: "test011",
            testName: "Basic Algebra Test",
            date: getRelativeDate(-11),
            score: 18,
            maxScore: 35,
            percentage: 51,
            grade: "D",
            difficulty: "Easy",
            topics: ["Linear Equations", "Basic Operations"]
          }
        ],
        trend: "Stable",
        weakAreas: ["Problem Solving", "Mathematical Reasoning", "Algebraic Concepts"],
        strongAreas: ["Basic Arithmetic", "Following Instructions"]
      },
      {
        subject: "English",
        currentGrade: "C-",
        percentage: 62,
        totalTests: 6,
        averageScore: 62,
        highestScore: 72,
        lowestScore: 48,
        recentScores: [
          {
            testId: "test012",
            testName: "Grammar and Composition",
            date: getRelativeDate(-14),
            score: 22,
            maxScore: 35,
            percentage: 63,
            grade: "C-",
            difficulty: "Easy",
            topics: ["Grammar Rules", "Essay Structure"]
          }
        ],
        trend: "Improving",
        weakAreas: ["Vocabulary", "Complex Sentence Structure"],
        strongAreas: ["Basic Grammar", "Reading Comprehension"]
      }
    ],
    attendanceRate: 78,
    improvementTrend: "Stable",
    monthlyProgress: 2,
    lastUpdated: getRelativeDate(-1),
    needsSupport: true,
    isTopPerformer: false,
    rank: 22,
    totalStudents: 25
  }
];

// Class Performance Metrics
export const classPerformanceMetrics: ClassPerformanceMetrics[] = [
  {
    classId: "class001",
    className: "Grade 10 - Mathematics",
    educatorId: "e001",
    educatorName: "Dr. Sarah Smith",
    subject: "Mathematics",
    totalStudents: 25,
    averagePerformance: 82,
    topPerformers: 8,
    needSupport: 3,
    improvementRate: 15,
    attendanceRate: 91,
    performanceDistribution: {
      aGrade: 8,
      bGrade: 10,
      cGrade: 5,
      dGrade: 2,
      fGrade: 0
    },
    recentAssessments: [
      {
        testName: "Linear Equations Test",
        date: getRelativeDate(-3),
        averageScore: 84,
        maxScore: 100,
        participation: 24
      },
      {
        testName: "Geometry Quiz",
        date: getRelativeDate(-10),
        averageScore: 79,
        maxScore: 100,
        participation: 25
      }
    ]
  },
  {
    classId: "class002",
    className: "Grade 11 - Physics",
    educatorId: "e003",
    educatorName: "Dr. Emily Brown",
    subject: "Physics",
    totalStudents: 22,
    averagePerformance: 76,
    topPerformers: 5,
    needSupport: 4,
    improvementRate: 8,
    attendanceRate: 88,
    performanceDistribution: {
      aGrade: 5,
      bGrade: 8,
      cGrade: 6,
      dGrade: 3,
      fGrade: 0
    },
    recentAssessments: [
      {
        testName: "Mechanics Test",
        date: getRelativeDate(-5),
        averageScore: 72,
        maxScore: 100,
        participation: 21
      },
      {
        testName: "Optics Quiz",
        date: getRelativeDate(-12),
        averageScore: 78,
        maxScore: 100,
        participation: 22
      }
    ]
  },
  {
    classId: "class003",
    className: "Grade 10 - English Literature",
    educatorId: "e002",
    educatorName: "Prof. Michael Johnson",
    subject: "English Literature",
    totalStudents: 28,
    averagePerformance: 85,
    topPerformers: 12,
    needSupport: 2,
    improvementRate: 12,
    attendanceRate: 93,
    performanceDistribution: {
      aGrade: 12,
      bGrade: 11,
      cGrade: 4,
      dGrade: 1,
      fGrade: 0
    },
    recentAssessments: [
      {
        testName: "Shakespeare Analysis",
        date: getRelativeDate(-2),
        averageScore: 88,
        maxScore: 100,
        participation: 27
      },
      {
        testName: "Poetry Interpretation",
        date: getRelativeDate(-9),
        averageScore: 81,
        maxScore: 100,
        participation: 28
      }
    ]
  }
];

// Performance Trends (last 6 months)
export const performanceTrends: PerformanceTrend[] = [
  {
    month: "April 2024",
    averagePerformance: 75,
    totalAssessments: 45,
    improvementRate: 5,
    attendanceRate: 87
  },
  {
    month: "May 2024",
    averagePerformance: 78,
    totalAssessments: 52,
    improvementRate: 8,
    attendanceRate: 89
  },
  {
    month: "June 2024",
    averagePerformance: 80,
    totalAssessments: 48,
    improvementRate: 10,
    attendanceRate: 91
  },
  {
    month: "July 2024",
    averagePerformance: 79,
    totalAssessments: 41,
    improvementRate: 7,
    attendanceRate: 88
  },
  {
    month: "August 2024",
    averagePerformance: 82,
    totalAssessments: 56,
    improvementRate: 12,
    attendanceRate: 92
  },
  {
    month: "September 2024",
    averagePerformance: 84,
    totalAssessments: 49,
    improvementRate: 15,
    attendanceRate: 93
  }
];

// Alerts and Insights
export const alertsAndInsights: AlertsAndInsights[] = [
  {
    id: "alert001",
    type: "Alert",
    priority: "High",
    title: "Student Needs Immediate Support",
    description: "Eve Anderson's performance has dropped significantly in Mathematics. Requires intervention.",
    studentId: "l005",
    studentName: "Eve Anderson",
    subject: "Mathematics",
    actionRequired: true,
    createdAt: getRelativeDate(-1)
  },
  {
    id: "insight001",
    type: "Insight",
    priority: "Medium",
    title: "Improvement in Physics Class",
    description: "Overall class performance in Physics has improved by 8% this month.",
    subject: "Physics",
    actionRequired: false,
    createdAt: getRelativeDate(-2)
  },
  {
    id: "recommendation001",
    type: "Recommendation",
    priority: "Medium",
    title: "Focus on Trigonometry Concepts",
    description: "Multiple students struggling with trigonometry. Consider additional practice sessions.",
    subject: "Mathematics",
    actionRequired: true,
    createdAt: getRelativeDate(-3)
  },
  {
    id: "alert002",
    type: "Alert",
    priority: "Medium",
    title: "Declining Attendance Pattern",
    description: "Diana Martinez's attendance has dropped to 85%. Monitor for potential issues.",
    studentId: "l004",
    studentName: "Diana Martinez",
    actionRequired: true,
    createdAt: getRelativeDate(-4)
  },
  {
    id: "insight002",
    type: "Insight",
    priority: "Low",
    title: "Top Performer Recognition",
    description: "Alice Johnson maintains consistent top performance across all subjects.",
    studentId: "l001",
    studentName: "Alice Johnson",
    actionRequired: false,
    createdAt: getRelativeDate(-5)
  }
];

// Overall Academic Performance Stats
export const overallStats = {
  totalStudents: 75,
  averageGrade: 84,
  topPerformers: 25, // Students above 90%
  needSupport: 9, // Students below 60%
  monthlyImprovement: 12,
  attendanceRate: 91,
  totalAssessments: 156,
  subjectDistribution: {
    Mathematics: 25,
    Physics: 22,
    Chemistry: 18,
    Biology: 20,
    English: 28,
    History: 15
  }
};

// Export all data
export default {
  studentPerformances,
  classPerformanceMetrics,
  performanceTrends,
  alertsAndInsights,
  overallStats
};