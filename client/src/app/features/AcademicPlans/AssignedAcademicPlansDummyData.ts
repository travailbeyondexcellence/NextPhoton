export type AssignedAcademicPlan = {
    id: string;
    learnerId: string;
    baseTemplateId: string; // from PremadeAcademicPlans
    assignedDate: string;
    startDate: string;
    endDate: string;
    customAdjustments?: string;
    assignedBy: string;
    status: "active" | "paused" | "completed";
};

const assignedAcademicPlans: AssignedAcademicPlan[] = [
    {
        id: "aap001",
        learnerId: "l001",
        baseTemplateId: "pap001",
        assignedDate: "2024-05-10",
        startDate: "2024-05-13",
        endDate: "2024-08-05",
        assignedBy: "admin002",
        customAdjustments: "Increased Biology hours from 10 to 12",
        status: "active",
    },
];

export default assignedAcademicPlans;
  