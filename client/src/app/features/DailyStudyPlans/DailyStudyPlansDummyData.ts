export type DailyStudyPlan = {
    id: string;
    learnerId: string;
    date: string;
    subject: string;
    topic: string;
    expectedDuration: number; // in minutes
    status: "pending" | "done" | "skipped";
};

const dailyStudyPlans: DailyStudyPlan[] = [
    {
        id: "dsp001",
        learnerId: "l001",
        date: "2024-05-18",
        subject: "Physics",
        topic: "Laws of Motion",
        expectedDuration: 90,
        status: "pending",
    },
];

export default dailyStudyPlans;
  