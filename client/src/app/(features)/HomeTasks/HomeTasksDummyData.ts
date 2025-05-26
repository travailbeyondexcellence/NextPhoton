export type HomeTask = {
    id: string;
    title: string;
    learnerId: string;
    subject: string;
    description: string;
    dueDate: string;
    status: "pending" | "submitted" | "reviewed";
};

const homeTasks: HomeTask[] = [
    {
        id: "ht001",
        title: "Numerical Practice – Kinematics",
        learnerId: "l001",
        subject: "Physics",
        description: "Solve Q1–Q10 from sheet.",
        dueDate: "2024-05-20",
        status: "pending",
    },
];

export default homeTasks;
  