// nextPhotonSettings.ts

// Actually the following settings have to live inside the database!


export type NextPhotonSettings = {
    subjects: string[];
    academicLevels: string[];
    exams: string[];
    priceTiers: string[];
    classDurations: number[]; // in minutes
    educatorTags: string[];
    learnerTags: string[];
    departments: string[];
};

const nextPhotonSettings: NextPhotonSettings = {
    subjects: [
        "Physics",
        "Mathematics",
        "Chemistry",
        "Biology",
        "English",
        "Computer Science",
        "Mental Ability",
        "Social Studies",
        "Economics",
    ],
    academicLevels: [
        "Middle School",
        "Senior School",
        "Junior College",
        "Foundation (6-10)",
        "Olympiad/NTSE",
        "JEE Prep",
        "NEET Prep",
    ],
    exams: [
        "JEE Main",
        "JEE Advanced",
        "NEET",
        "10th Boards",
        "12th Boards",
        "Olympiads",
        "NTSE",
        "CUET",
        "KVPY",
    ],
    priceTiers: [
        "basic",
        "intermediate-1",
        "intermediate-2",
        "premium",
        "elite",
    ],
    classDurations: [30, 45, 60, 75, 90],
    educatorTags: [
        "Top Rated",
        "New Joiner",
        "Prefers Evenings",
        "Doubt Expert",
        "Board Specialist",
        "Advanced Level",
    ],
    learnerTags: [
        "Needs Mentoring",
        "High Potential",
        "Top Performer",
        "Absent Frequently",
        "Asks Good Questions",
    ],
    departments: [
        "Physics",
        "Mathematics",
        "Chemistry",
        "Biology",
        "Admissions",
        "Academic Operations",
        "Tech Support",
        "Finance",
        "HR",
    ],
};

export default nextPhotonSettings;
  