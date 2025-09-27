// This file contains dummy data for learners (students) in the NextPhoton platform
// It includes realistic learner profiles with academic information, guardian relationships, and progress tracking

type Learner = {
    id: string;
    name: string;
    username: string;
    email: string;
    phone?: string;
    academicLevel: string;
    grade: string;
    school: string;
    board: string; // CBSE, ICSE, State Board, etc.
    targetExams: string[];
    targetExamYear: number;
    batchId: string;
    assignedEducators: {
        educatorId: string;
        educatorName: string;
        subject: string;
    }[];
    enrollmentDate: string;
    profileImage?: string | null;
    guardians: {
        guardianId: string;
        guardianName: string;
        relation: string;
    }[];
    attendance: {
        overall: number;
        lastMonth: number;
    };
    performance: {
        averageScore: number;
        lastTestScore: number;
        trend: "improving" | "stable" | "declining";
    };
    reviewedEducators: {
        educatorId: string;
        educatorName: string;
        exam: string;
        rating: number;
        comment: string;
        date: string;
    }[];
    learnerNotes: {
        author: string;
        timestamp: string;
        note: string;
        type: "academic" | "behavioral" | "general";
    }[];
    remarkTags?: string[];
    status: "active" | "on-break" | "inactive";
    lastActive: string;
};

const learners: Learner[] = [
    {
        id: "l001",
        name: "Aarav Patel",
        username: "@aarav.jee2026",
        email: "aarav.patel@student.nextphoton.com",
        phone: "+91-9876543210",
        academicLevel: "Junior College",
        grade: "11th Standard",
        school: "DPS International School",
        board: "CBSE",
        targetExams: ["JEE Main", "JEE Advanced"],
        targetExamYear: 2026,
        batchId: "batch_jee_2026_01",
        assignedEducators: [
            { educatorId: "e001", educatorName: "Dr. Meera Sharma", subject: "Physics" },
            { educatorId: "e002", educatorName: "Prof. Anand Iyer", subject: "Chemistry" },
            { educatorId: "e004", educatorName: "Mr. Ramesh Kulkarni", subject: "Mathematics" }
        ],
        enrollmentDate: "2023-06-15",
        profileImage: "/learners/aarav.png",
        guardians: [
            { guardianId: "g001", guardianName: "Rajesh Patel", relation: "Father" },
            { guardianId: "g002", guardianName: "Sneha Patel", relation: "Mother" }
        ],
        attendance: {
            overall: 92,
            lastMonth: 88
        },
        performance: {
            averageScore: 78,
            lastTestScore: 82,
            trend: "improving"
        },
        reviewedEducators: [
            {
                educatorId: "e001",
                educatorName: "Dr. Meera Sharma",
                exam: "JEE Main Mock",
                rating: 5,
                comment: "Dr. Meera's classes are crystal clear. Her Physics explanations helped me crack tough problems easily!",
                date: "2024-03-10",
            },
            {
                educatorId: "e002",
                educatorName: "Prof. Anand Iyer",
                exam: "Chemistry Unit Test",
                rating: 4,
                comment: "Great teacher, but sometimes goes too fast in organic chemistry.",
                date: "2024-02-15",
            }
        ],
        learnerNotes: [
            {
                author: "ECM – Priya Singh",
                timestamp: "2024-03-20",
                note: "Aarav is showing excellent progress in Physics. Needs more practice in Organic Chemistry.",
                type: "academic"
            },
            {
                author: "Dr. Meera Sharma",
                timestamp: "2024-03-05",
                note: "Very attentive in class. Shows great problem-solving skills.",
                type: "behavioral"
            }
        ],
        remarkTags: ["High Potential", "Physics Star", "Needs Chemistry Support"],
        status: "active",
        lastActive: "2024-03-22"
    },
    {
        id: "l002",
        name: "Ishita Reddy",
        username: "@ishita.neet2025",
        email: "ishita.reddy@student.nextphoton.com",
        phone: "+91-9123456780",
        academicLevel: "Senior School",
        grade: "12th Standard",
        school: "St. Mary's Convent School",
        board: "ICSE",
        targetExams: ["NEET"],
        targetExamYear: 2025,
        batchId: "batch_neet_2025_02",
        assignedEducators: [
            { educatorId: "e003", educatorName: "Ms. Nisha Rao", subject: "Biology" },
            { educatorId: "e001", educatorName: "Dr. Meera Sharma", subject: "Physics" },
            { educatorId: "e002", educatorName: "Prof. Anand Iyer", subject: "Chemistry" }
        ],
        enrollmentDate: "2023-07-01",
        profileImage: null,
        guardians: [
            { guardianId: "g003", guardianName: "Anil Reddy", relation: "Father" },
            { guardianId: "g004", guardianName: "Priya Reddy", relation: "Mother" }
        ],
        attendance: {
            overall: 95,
            lastMonth: 98
        },
        performance: {
            averageScore: 85,
            lastTestScore: 87,
            trend: "stable"
        },
        reviewedEducators: [
            {
                educatorId: "e003",
                educatorName: "Ms. Nisha Rao",
                exam: "NEET Biology Mock",
                rating: 5,
                comment: "Amazing teacher! Her visual explanations make complex topics easy to understand.",
                date: "2024-02-25",
            }
        ],
        learnerNotes: [
            {
                author: "ECM – Arjun Mehta",
                timestamp: "2024-03-15",
                note: "Ishita is very consistent and disciplined. Top performer in Biology.",
                type: "academic"
            }
        ],
        remarkTags: ["Consistent Performer", "Biology Excellence", "NEET Focused"],
        status: "active",
        lastActive: "2024-03-22"
    },
    {
        id: "l003",
        name: "Rohan Verma",
        username: "@rohan.boards2024",
        email: "rohan.verma@student.nextphoton.com",
        phone: "+91-9988776655",
        academicLevel: "Senior School",
        grade: "10th Standard",
        school: "Delhi Public School",
        board: "CBSE",
        targetExams: ["10th Boards", "NTSE"],
        targetExamYear: 2024,
        batchId: "batch_10th_cbse_03",
        assignedEducators: [
            { educatorId: "e004", educatorName: "Mr. Ramesh Kulkarni", subject: "Mathematics" },
            { educatorId: "e005", educatorName: "Ms. Tanya Kapoor", subject: "English" },
            { educatorId: "e006", educatorName: "Mr. Vivek Deshmukh", subject: "Physics" }
        ],
        enrollmentDate: "2023-08-01",
        profileImage: "/learners/rohan.png",
        guardians: [
            { guardianId: "g005", guardianName: "Vikram Verma", relation: "Father" }
        ],
        attendance: {
            overall: 88,
            lastMonth: 85
        },
        performance: {
            averageScore: 72,
            lastTestScore: 75,
            trend: "improving"
        },
        reviewedEducators: [],
        learnerNotes: [
            {
                author: "Ms. Tanya Kapoor",
                timestamp: "2024-03-10",
                note: "Rohan has shown significant improvement in English grammar and comprehension.",
                type: "academic"
            }
        ],
        remarkTags: ["Board Exam Prep", "Improving", "NTSE Candidate"],
        status: "active",
        lastActive: "2024-03-21"
    },
    {
        id: "l004",
        name: "Ananya Desai",
        username: "@ananya.jee2025",
        email: "ananya.desai@student.nextphoton.com",
        phone: "+91-9876123456",
        academicLevel: "Junior College",
        grade: "12th Standard",
        school: "Vidya Valley School",
        board: "State Board",
        targetExams: ["JEE Main", "MHT-CET"],
        targetExamYear: 2025,
        batchId: "batch_jee_2025_01",
        assignedEducators: [
            { educatorId: "e001", educatorName: "Dr. Meera Sharma", subject: "Physics" },
            { educatorId: "e004", educatorName: "Mr. Ramesh Kulkarni", subject: "Mathematics" }
        ],
        enrollmentDate: "2023-05-20",
        profileImage: "",
        guardians: [
            { guardianId: "g006", guardianName: "Suresh Desai", relation: "Father" },
            { guardianId: "g007", guardianName: "Kavita Desai", relation: "Mother" }
        ],
        attendance: {
            overall: 96,
            lastMonth: 100
        },
        performance: {
            averageScore: 91,
            lastTestScore: 94,
            trend: "improving"
        },
        reviewedEducators: [
            {
                educatorId: "e004",
                educatorName: "Mr. Ramesh Kulkarni",
                exam: "JEE Main",
                rating: 5,
                comment: "His problem-solving techniques are top notch.",
                date: "2024-01-08",
            }
        ],
        learnerNotes: [
            {
                author: "ECM – Rohan D.",
                timestamp: "2024-03-18",
                note: "Exceptional student. Likely to score in top percentile.",
                type: "academic"
            }
        ],
        remarkTags: ["Top Performer", "JEE Advanced Ready", "100% Attendance"],
        status: "active",
        lastActive: "2024-03-22"
    },
    {
        id: "l005",
        name: "Sana Sheikh",
        username: "@sana.bio2026",
        email: "sana.sheikh@student.nextphoton.com",
        phone: "+91-9765432101",
        academicLevel: "Junior College",
        grade: "11th Standard",
        school: "Sophia College",
        board: "ICSE",
        targetExams: ["NEET", "Biology Olympiad"],
        targetExamYear: 2026,
        batchId: "batch_neet_2026_01",
        assignedEducators: [
            { educatorId: "e003", educatorName: "Ms. Nisha Rao", subject: "Biology" },
            { educatorId: "e007", educatorName: "Dr. Farah Qureshi", subject: "Biology (Advanced)" }
        ],
        enrollmentDate: "2023-06-10",
        profileImage: "/learners/sana.png",
        guardians: [
            { guardianId: "g008", guardianName: "Imran Sheikh", relation: "Father" },
            { guardianId: "g009", guardianName: "Fatima Sheikh", relation: "Mother" }
        ],
        attendance: {
            overall: 90,
            lastMonth: 92
        },
        performance: {
            averageScore: 82,
            lastTestScore: 85,
            trend: "stable"
        },
        reviewedEducators: [
            {
                educatorId: "e007",
                educatorName: "Dr. Farah Qureshi",
                exam: "Olympiads",
                rating: 5,
                comment: "Cracked stage 2 because of her prep material.",
                date: "2024-03-01",
            }
        ],
        learnerNotes: [
            {
                author: "Dr. Farah Qureshi",
                timestamp: "2024-02-28",
                note: "Shows exceptional aptitude for Biology research. Recommend for advanced program.",
                type: "academic"
            }
        ],
        remarkTags: ["Olympiad Aspirant", "Research Oriented", "Biology Excellence"],
        status: "active",
        lastActive: "2024-03-22"
    },
    {
        id: "l006",
        name: "Arjun Nair",
        username: "@arjun.tech2024",
        email: "arjun.nair@student.nextphoton.com",
        phone: "+91-9654321098",
        academicLevel: "Senior School",
        grade: "12th Standard",
        school: "Kendriya Vidyalaya",
        board: "CBSE",
        targetExams: ["12th Boards", "JEE Main"],
        targetExamYear: 2024,
        batchId: "batch_12th_cbse_02",
        assignedEducators: [
            { educatorId: "e009", educatorName: "Ms. Shruti Desai", subject: "Computer Science" },
            { educatorId: "e004", educatorName: "Mr. Ramesh Kulkarni", subject: "Mathematics" }
        ],
        enrollmentDate: "2023-07-15",
        profileImage: null,
        guardians: [
            { guardianId: "g010", guardianName: "Krishnan Nair", relation: "Father" }
        ],
        attendance: {
            overall: 75,
            lastMonth: 70
        },
        performance: {
            averageScore: 68,
            lastTestScore: 65,
            trend: "declining"
        },
        reviewedEducators: [
            {
                educatorId: "e009",
                educatorName: "Ms. Shruti Desai",
                exam: "12th Boards",
                rating: 5,
                comment: "Her Python problem sheets are gold!",
                date: "2024-01-18",
            }
        ],
        learnerNotes: [
            {
                author: "ECM – Priya Singh",
                timestamp: "2024-03-15",
                note: "Attendance has been irregular. Parents have been informed.",
                type: "behavioral"
            },
            {
                author: "Ms. Shruti Desai",
                timestamp: "2024-03-10",
                note: "Excellent in programming but needs to focus on theory.",
                type: "academic"
            }
        ],
        remarkTags: ["Attendance Issue", "Strong in Coding", "Needs Monitoring"],
        status: "active",
        lastActive: "2024-03-20"
    },
    {
        id: "l007",
        name: "Priya Mehta",
        username: "@priya.arts2025",
        email: "priya.mehta@student.nextphoton.com",
        phone: "+91-9543210987",
        academicLevel: "Senior School",
        grade: "11th Standard",
        school: "Mount Carmel School",
        board: "State Board",
        targetExams: ["State Boards", "CLAT"],
        targetExamYear: 2025,
        batchId: "batch_11th_state_01",
        assignedEducators: [
            { educatorId: "e008", educatorName: "Mr. Arvind Menon", subject: "Political Science" },
            { educatorId: "e005", educatorName: "Ms. Tanya Kapoor", subject: "English" }
        ],
        enrollmentDate: "2023-08-20",
        profileImage: "/learners/priya.png",
        guardians: [
            { guardianId: "g011", guardianName: "Deepak Mehta", relation: "Father" },
            { guardianId: "g012", guardianName: "Sunita Mehta", relation: "Mother" }
        ],
        attendance: {
            overall: 94,
            lastMonth: 96
        },
        performance: {
            averageScore: 88,
            lastTestScore: 90,
            trend: "improving"
        },
        reviewedEducators: [
            {
                educatorId: "e008",
                educatorName: "Mr. Arvind Menon",
                exam: "12th Boards",
                rating: 4,
                comment: "Helps develop perspectives, not just memorize.",
                date: "2023-12-01",
            }
        ],
        learnerNotes: [
            {
                author: "Mr. Arvind Menon",
                timestamp: "2024-03-05",
                note: "Excellent analytical skills. Shows promise for law entrance exams.",
                type: "academic"
            }
        ],
        remarkTags: ["Humanities Star", "CLAT Aspirant", "Consistent"],
        status: "active",
        lastActive: "2024-03-22"
    },
    {
        id: "l008",
        name: "Nikhil Rao",
        username: "@nikhil.basics2024",
        email: "nikhil.rao@student.nextphoton.com",
        phone: "+91-9432109876",
        academicLevel: "Middle School",
        grade: "10th Standard",
        school: "Ryan International School",
        board: "CBSE",
        targetExams: ["10th Boards"],
        targetExamYear: 2024,
        batchId: "batch_10th_cbse_01",
        assignedEducators: [
            { educatorId: "e005", educatorName: "Ms. Tanya Kapoor", subject: "English" },
            { educatorId: "e004", educatorName: "Mr. Ramesh Kulkarni", subject: "Mathematics" }
        ],
        enrollmentDate: "2023-09-01",
        profileImage: "",
        guardians: [
            { guardianId: "g003", guardianName: "Anil Reddy", relation: "Uncle" }
        ],
        attendance: {
            overall: 82,
            lastMonth: 80
        },
        performance: {
            averageScore: 76,
            lastTestScore: 78,
            trend: "stable"
        },
        reviewedEducators: [
            {
                educatorId: "e005",
                educatorName: "Ms. Tanya Kapoor",
                exam: "10th Boards",
                rating: 5,
                comment: "My grammar improved a lot! Highly recommend.",
                date: "2024-02-05",
            }
        ],
        learnerNotes: [
            {
                author: "ECM – Neha Shah",
                timestamp: "2024-03-12",
                note: "Needs extra support in Mathematics. Additional sessions recommended.",
                type: "academic"
            }
        ],
        remarkTags: ["Board Prep", "English Improvement", "Math Support Needed"],
        status: "active",
        lastActive: "2024-03-21"
    },
    {
        id: "l009",
        name: "Rehan Khan",
        username: "@rehan.pcmb2025",
        email: "rehan.khan@student.nextphoton.com",
        phone: "+91-9321098765",
        academicLevel: "Junior College",
        grade: "12th Standard",
        school: "St. Xavier's College",
        board: "State Board",
        targetExams: ["JEE Main", "NEET", "State CET"],
        targetExamYear: 2025,
        batchId: "batch_pcmb_2025_01",
        assignedEducators: [
            { educatorId: "e001", educatorName: "Dr. Meera Sharma", subject: "Physics" },
            { educatorId: "e002", educatorName: "Prof. Anand Iyer", subject: "Chemistry" },
            { educatorId: "e003", educatorName: "Ms. Nisha Rao", subject: "Biology" },
            { educatorId: "e004", educatorName: "Mr. Ramesh Kulkarni", subject: "Mathematics" }
        ],
        enrollmentDate: "2023-06-01",
        profileImage: "/learners/rehan.png",
        guardians: [
            { guardianId: "g013", guardianName: "Salman Khan", relation: "Father" }
        ],
        attendance: {
            overall: 78,
            lastMonth: 75
        },
        performance: {
            averageScore: 70,
            lastTestScore: 72,
            trend: "stable"
        },
        reviewedEducators: [
            {
                educatorId: "e008",
                educatorName: "Mr. Arvind Menon",
                exam: "12th Boards",
                rating: 4,
                comment: "Helps develop perspectives, not just memorize.",
                date: "2023-12-01",
            }
        ],
        learnerNotes: [
            {
                author: "ECM – Arjun Mehta",
                timestamp: "2024-03-14",
                note: "Taking both JEE and NEET. Needs to decide focus area soon.",
                type: "general"
            }
        ],
        remarkTags: ["PCMB Student", "Dual Track", "Decision Pending"],
        status: "on-break",
        lastActive: "2024-03-15"
    }
];

export { learners };
export type { Learner };