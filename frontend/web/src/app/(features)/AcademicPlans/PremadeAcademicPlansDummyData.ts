export type PremadeAcademicPlan = {
    id: string;
    title: string;
    targetExams: string[];
    academicLevel: string;
    durationInWeeks: number;
    subjects: {
        subject: string;
        weeklyHours: number;
    }[];
    createdBy: string; // admin or educator ID
    notes?: string;
};

const premadeAcademicPlans: PremadeAcademicPlan[] = [
    {
        id: "pap001",
        title: "NEET Fast Track – Biology Focused",
        targetExams: ["NEET"],
        academicLevel: "Senior School",
        durationInWeeks: 12,
        subjects: [
            { subject: "Biology", weeklyHours: 10 },
            { subject: "Chemistry", weeklyHours: 5 },
        ],
        createdBy: "admin002",
        notes: "For revision-oriented learners with prior NEET prep exposure.",
    },
];

export default premadeAcademicPlans;
  