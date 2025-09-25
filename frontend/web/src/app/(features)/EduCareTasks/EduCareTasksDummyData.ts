export type EduCareTask = {
    id: string;
    learnerId: string;
    assignedBy: string; // employee ID
    title: string;
    description: string;
    dueDate: string;
    status: "open" | "done" | "overdue";
};

const educareTasks: EduCareTask[] = [
    {
        id: "ect001",
        learnerId: "l001",
        assignedBy: "emp003",
        title: "Submit Physics Test Copy",
        description: "Upload scanned test copy by Friday.",
        dueDate: "2024-05-17",
        status: "open",
    },
];

export default educareTasks;
  