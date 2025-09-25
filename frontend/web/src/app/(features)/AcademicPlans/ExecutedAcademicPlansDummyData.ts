export type ExecutedAcademicPlan = {
    id: string;
    assignedPlanId: string;
    learnerId: string;
    week: number;
    status: "on-track" | "behind" | "ahead" | "skipped";
    actualHours: {
        subject: string;
        hoursSpent: number;
    }[];
    remarks?: string;
};

const executedAcademicPlans: ExecutedAcademicPlan[] = [
    {
        id: "eap001",
        assignedPlanId: "aap001",
        learnerId: "l001",
        week: 1,
        status: "on-track",
        actualHours: [
            { subject: "Biology", hoursSpent: 11 },
            { subject: "Chemistry", hoursSpent: 4 },
        ],
        remarks: "Missed 1 Chemistry session but compensated with extra Biology reading.",
    },
];

export default executedAcademicPlans;
  