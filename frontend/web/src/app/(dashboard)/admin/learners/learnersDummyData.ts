type Learner = {
    id: string;
    name: string;
    username: string;
    emailFallback: string;
    phone?: string;
    academicLevel: string;
    targetExams: string[];
    targetExamYear: number;
    batchId: string;
    assignedEducators: string[];
    enrollmentDate: string;
    profileImage?: string;
    guardians: string[];
    reviewedEducators: {
        educatorId: string;
        exam: string;
        rating: number;
        comment: string;
        date: string;
    }[];
    learnerNotes: {
        author: string;
        timestamp: string;
        note: string;
    }[];
    remarkTags?: string[];
};
  


const learners: Learner[] = [
    {
        id: "l001",
        name: "Aarav Patel",
        username: "@aarav.jee2024",
        emailFallback: "aaravpatel@nextphoton.com",
        phone: "+91-9876543210",
        academicLevel: "Junior College",
        targetExams: ["JEE Main", "JEE Advanced"],
        targetExamYear: 2026,
        batchId: "batch_jc_01",
        assignedEducators: ["e001"],
        enrollmentDate: "2023-06-15",
        profileImage: "/learners/aarav.png",
        guardians: ["Rajesh Patel", "Sneha Patel"],
        reviewedEducators: [
            {
                educatorId: "e001",
                exam: "JEE Main",
                rating: 5,
                comment:
                    "Dr. Meera’s classes are crystal clear. Her Physics explanations helped me crack tough problems easily!",
                date: "2024-03-10",
            },
        ],
        learnerNotes: [
            {
                author: "Educare – Priya Singh",
                timestamp: "2023-08-20",
                note: "Aarav is a high-potential learner. Needs mentorship in Chemistry.",
            },
        ],
        remarkTags: ["Top scorer in Physics", "Needs support in Organic Chemistry"],
    },
    {
        id: "l002",
        name: "Ishita Reddy",
        username: "@ishita.neet2024",
        emailFallback: "ishitareddy@nextphoton.com",
        phone: "+91-9123456780",
        academicLevel: "Senior School",
        targetExams: ["NEET"],
        targetExamYear: 2024,
        batchId: "class_sch_02",
        assignedEducators: ["e001"],
        enrollmentDate: "2023-07-01",
        profileImage: "/learners/ishita.png",
        guardians: ["Anil Reddy"],
        reviewedEducators: [
            {
                educatorId: "e001",
                exam: "NEET",
                rating: 4,
                comment:
                    "Her analogies made complex topics simple. Just wish classes were a bit longer.",
                date: "2024-02-25",
            },
        ],
        learnerNotes: [
            {
                author: "Educare – Arjun Mehta",
                timestamp: "2023-10-05",
                note: "She prefers weekend batches. Very inquisitive in Biology classes.",
            },
        ],
        remarkTags: ["Consistent in tests", "Prefers visual aids"],
    },
];

export default learners;
  