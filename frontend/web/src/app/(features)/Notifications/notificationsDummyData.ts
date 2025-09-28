export type Notification = {
    id: string;
    title: string;
    message: string;
    targetRoles: string[];
    sentAt: string;
    readBy?: string[]; // user IDs
};

const notifications: Notification[] = [
    {
        id: "noti001",
        title: "Maintenance Window",
        message: "Platform will be under maintenance on May 25 from 2–4 PM.",
        targetRoles: ["learner", "educator", "admin"],
        sentAt: "2024-05-15T08:00:00.000Z",
    },
];

export default notifications;
  