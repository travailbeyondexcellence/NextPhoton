export type Notification = {
    id: string;
    title: string;
    content: string;
    message?: string; // for backward compatibility
    type: 'announcement' | 'task' | 'event' | 'alert' | 'reminder';
    category: 'academic' | 'administrative' | 'personal' | 'system';
    priority: 'urgent' | 'high' | 'normal' | 'low';
    status: 'read' | 'unread';
    deliveryStatus: 'scheduled' | 'sent' | 'delivered' | 'failed';
    targetRoles: string[];
    sentAt: string;
    readBy?: string[]; // user IDs
    sender: {
        id: string;
        name: string;
        role: string;
        avatar?: string;
    };
    attachments?: {
        name: string;
        type: string;
        size: string;
    }[];
    channels?: ('email' | 'sms' | 'push')[];
    scheduledFor?: string;
};

export const notifications: Notification[] = [
    {
        id: "noti001",
        title: "Maintenance Window",
        content: "Platform will be under maintenance on May 25 from 2–4 PM. Please save your work before this time.",
        message: "Platform will be under maintenance on May 25 from 2–4 PM.",
        type: "alert",
        category: "system",
        priority: "high",
        status: "unread",
        deliveryStatus: "delivered",
        targetRoles: ["learner", "educator", "admin"],
        sentAt: "2024-05-15T08:00:00.000Z",
        sender: {
            id: "system",
            name: "System Administrator",
            role: "admin"
        },
        channels: ["email", "push"]
    },
    {
        id: "noti002",
        title: "New Assignment Posted",
        content: "A new assignment 'Mathematics Problem Set 5' has been posted. Due date: May 30, 2024.",
        type: "task",
        category: "academic",
        priority: "normal",
        status: "unread",
        deliveryStatus: "delivered",
        targetRoles: ["learner"],
        sentAt: "2024-05-20T10:30:00.000Z",
        sender: {
            id: "edu001",
            name: "John Smith",
            role: "educator"
        },
        attachments: [
            {
                name: "problem_set_5.pdf",
                type: "application/pdf",
                size: "1.2 MB"
            }
        ],
        channels: ["email", "push"]
    },
    {
        id: "noti003",
        title: "Parent-Teacher Meeting Scheduled",
        content: "A parent-teacher meeting has been scheduled for June 5, 2024 at 3:00 PM. Please confirm your attendance.",
        type: "event",
        category: "administrative",
        priority: "high",
        status: "read",
        deliveryStatus: "delivered",
        targetRoles: ["guardian", "educator"],
        sentAt: "2024-05-22T14:00:00.000Z",
        sender: {
            id: "admin001",
            name: "School Admin",
            role: "admin"
        },
        channels: ["email", "sms"]
    },
    {
        id: "noti004",
        title: "Upcoming Quiz Reminder",
        content: "Reminder: You have a Chemistry quiz tomorrow at 10:00 AM. Good luck!",
        type: "reminder",
        category: "academic",
        priority: "normal",
        status: "read",
        deliveryStatus: "scheduled",
        targetRoles: ["learner"],
        sentAt: "2024-05-24T18:00:00.000Z",
        scheduledFor: "2024-05-25T08:00:00.000Z",
        sender: {
            id: "edu002",
            name: "Sarah Johnson",
            role: "educator"
        },
        channels: ["push"]
    }
];

export const getNotificationStats = () => {
    const total = notifications.length;
    const unread = notifications.filter(n => n.status === 'unread').length;
    const sent = notifications.filter(n => n.deliveryStatus === 'sent' || n.deliveryStatus === 'delivered').length;
    const scheduled = notifications.filter(n => n.deliveryStatus === 'scheduled').length;
    const failed = notifications.filter(n => n.deliveryStatus === 'failed').length;
    
    return {
        total,
        unread,
        sent,
        scheduled,
        failed,
        byType: {
            announcement: notifications.filter(n => n.type === 'announcement').length,
            task: notifications.filter(n => n.type === 'task').length,
            event: notifications.filter(n => n.type === 'event').length,
            alert: notifications.filter(n => n.type === 'alert').length,
            reminder: notifications.filter(n => n.type === 'reminder').length,
        },
        byCategory: {
            academic: notifications.filter(n => n.category === 'academic').length,
            administrative: notifications.filter(n => n.category === 'administrative').length,
            personal: notifications.filter(n => n.category === 'personal').length,
            system: notifications.filter(n => n.category === 'system').length,
        }
    };
};

export const messageTemplates = [
    {
        id: "temp001",
        name: "Assignment Reminder",
        content: "Dear {{studentName}}, this is a reminder that {{assignmentName}} is due on {{dueDate}}.",
        category: "academic",
        variables: ["studentName", "assignmentName", "dueDate"]
    },
    {
        id: "temp002",
        name: "Meeting Invitation",
        content: "You are invited to a {{meetingType}} on {{date}} at {{time}}. Location: {{location}}",
        category: "administrative",
        variables: ["meetingType", "date", "time", "location"]
    },
    {
        id: "temp003",
        name: "System Maintenance",
        content: "The system will be under maintenance from {{startTime}} to {{endTime}} on {{date}}.",
        category: "system",
        variables: ["startTime", "endTime", "date"]
    }
];

export const recipientGroups = [
    {
        id: "group001",
        name: "All Students",
        description: "All enrolled students",
        memberCount: 150,
        roles: ["learner"]
    },
    {
        id: "group002",
        name: "All Teachers",
        description: "All teaching staff",
        memberCount: 25,
        roles: ["educator"]
    },
    {
        id: "group003",
        name: "Parents & Guardians",
        description: "All registered parents and guardians",
        memberCount: 120,
        roles: ["guardian"]
    },
    {
        id: "group004",
        name: "Grade 10 Students",
        description: "Students enrolled in Grade 10",
        memberCount: 30,
        roles: ["learner"],
        filters: { grade: "10" }
    }
];

export default notifications;