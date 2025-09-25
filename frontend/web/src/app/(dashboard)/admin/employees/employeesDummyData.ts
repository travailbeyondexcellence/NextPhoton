// employeeDummyData.ts

export type Employee = {
    id: string;
    name: string;
    email: string;
    phone?: string;
    role: "admin" | "counsellor" | "educare-manager" | "support";
    department?: string;
    assignedClasses?: string[]; // class IDs
    reportsTo?: string; // another employee ID
    profileImage?: string;
    joinDate: string;
    tags?: string[]; // e.g., "Shift A", "NEET Desk"
    notes?: {
        author: string;
        timestamp: string;
        note: string;
    }[];
};

const employees: Employee[] = [
    {
        id: "emp001",
        name: "Priya Singh",
        email: "priyasingh@nextphoton.com",
        phone: "+91-9812345678",
        role: "admin",
        department: "Academic Operations",
        joinDate: "2022-03-01",
        profileImage: "/employees/priyasingh.png",
        tags: ["Shift Lead", "Scheduler"],
        notes: [
            {
                author: "Founder – Zenith Patil",
                timestamp: "2023-11-12",
                note: "Efficient in managing educator schedules and internal reporting.",
            },
        ],
    },
    {
        id: "emp002",
        name: "Arjun Mehta",
        email: "arjunmehta@nextphoton.com",
        role: "educare-manager",
        department: "Learner Success",
        joinDate: "2021-08-10",
        assignedClasses: ["class_jc_01", "class_neet_batch02"],
        profileImage: "/employees/arjunmehta.png",
        tags: ["Batch Mentor", "Parent Liaison"],
        notes: [
            {
                author: "Admin – Priya Singh",
                timestamp: "2024-01-05",
                note: "Follows up proactively with learners and guardians.",
            },
        ],
    },
    {
        id: "emp003",
        name: "Sonal Deshpande",
        email: "sonald@nextphoton.com",
        role: "counsellor",
        department: "Admissions",
        joinDate: "2023-05-20",
        profileImage: "/employees/sonaldeshpande.png",
        tags: ["NEET Desk", "Warm Leads"],
        notes: [
            {
                author: "Head – Admissions",
                timestamp: "2024-02-11",
                note: "Maintains excellent rapport with walk-ins and referrals.",
            },
        ],
    },
    {
        id: "emp004",
        name: "Ravi Nair",
        email: "ravinair@nextphoton.com",
        role: "support",
        department: "Tech Support",
        joinDate: "2022-12-01",
        tags: ["Hardware", "Classroom Setup"],
        profileImage: "/employees/ravinair.png",
        notes: [
            {
                author: "Admin – Arjun Mehta",
                timestamp: "2023-10-15",
                note: "Handles urgent class tech issues promptly.",
            },
        ],
    },
];

export default employees;
  