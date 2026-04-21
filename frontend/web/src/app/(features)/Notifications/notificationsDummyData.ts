export type Notification = {
    id: string;
    title: string;
    message: string;
    content: string;
    type: string;
    targetRoles: string[];
    sentAt: string;
    timestamp: string;
    recipientCount: number;
    deliveryStatus: string;
    channel: string;
    readCount?: number;
    attachments?: { name: string; type: string; size: string }[];
    readBy?: string[]; // user IDs
};

export type MessageTemplate = {
    id: string;
    name: string;
    subject: string;
    body: string;
    category: string;
    variables?: string[];
    usageCount: number;
    lastModified: string;
};

export type RecipientGroup = {
    id: string;
    name: string;
    members: string[];
    memberCount: number;
    category: string;
    description: string;
    createdAt: string;
};

const notifications: Notification[] = [
    {
        id: "noti001",
        title: "Maintenance Window",
        message: "Platform will be under maintenance on May 25 from 2–4 PM.",
        content: "Platform will be under maintenance on May 25 from 2–4 PM.",
        type: "system",
        targetRoles: ["learner", "educator", "admin"],
        sentAt: "2024-05-15T08:00:00.000Z",
        timestamp: "2024-05-15T08:00:00.000Z",
        recipientCount: 100,
        deliveryStatus: "Delivered",
        channel: "email",
        readCount: 75,
    },
];

export const messageTemplates: MessageTemplate[] = [
    {
        id: "tmpl001",
        name: "Welcome Message",
        subject: "Welcome to NextPhoton",
        body: "Welcome to our platform!",
        category: "General",
        variables: ["userName"],
        usageCount: 42,
        lastModified: "2024-05-01T00:00:00.000Z",
    },
];

export const recipientGroups: RecipientGroup[] = [
    {
        id: "group001",
        name: "All Learners",
        members: [],
        memberCount: 0,
        category: "General",
        description: "All learners in the platform",
        createdAt: "2024-05-01T00:00:00.000Z",
    },
];

export default notifications;
export { notifications };
  