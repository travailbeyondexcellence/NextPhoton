// internsDummyData.ts

export type Intern = {
    id: string;
    name: string;
    email: string;
    phone?: string;
    department?: string;
    role: "content" | "support" | "marketing" | "tech" | "counselling-assist";
    mentorId?: string; // references an Employee ID
    assignedClasses?: string[]; // optional if helping in sessions
    profileImage?: string;
    startDate: string;
    endDate: string;
    stipend?: string; // e.g., "₹5,000/month"
    tags?: string[];
    notes?: {
        author: string;
        timestamp: string;
        note: string;
    }[];
};

const interns: Intern[] = [
    {
        id: "int001",
        name: "Ritika Bansal",
        email: "ritikab@nextphoton.com",
        phone: "+91-9876543211",
        role: "content",
        department: "Academic Content",
        mentorId: "emp001",
        startDate: "2024-03-01",
        endDate: "2024-05-31",
        stipend: "₹7,000/month",
        profileImage: "/interns/ritika.png",
        tags: ["NEET Flashcards", "DPP Typing"],
        notes: [
            {
                author: "Mentor – Priya Singh",
                timestamp: "2024-03-15",
                note: "Fast learner. Needs some guidance on formatting consistency.",
            },
        ],
    },
    {
        id: "int002",
        name: "Kunal Joshi",
        email: "kunalj@nextphoton.com",
        role: "support",
        department: "IT Infrastructure",
        mentorId: "emp004",
        startDate: "2024-04-10",
        endDate: "2024-06-10",
        stipend: "₹5,000/month",
        tags: ["Mic Testing", "Device Logs"],
        profileImage: "/interns/kunal.png",
        notes: [
            {
                author: "Mentor – Ravi Nair",
                timestamp: "2024-04-20",
                note: "Quick with device swaps. Needs improvement in documentation.",
            },
        ],
    },
    {
        id: "int003",
        name: "Sara D’Costa",
        email: "sarad@nextphoton.com",
        role: "counselling-assist",
        department: "Admissions",
        mentorId: "emp003",
        startDate: "2024-02-01",
        endDate: "2024-04-30",
        stipend: "₹6,000/month",
        tags: ["Lead Tracker", "Walk-in Data"],
        profileImage: "/interns/sara.png",
        notes: [
            {
                author: "Mentor – Sonal Deshpande",
                timestamp: "2024-02-18",
                note: "Very warm communicator. Can improve in CRM tagging accuracy.",
            },
        ],
    },
];

export default interns;
  