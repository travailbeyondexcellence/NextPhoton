// classSessionsDummyData.ts

export type ClassSession = {
    id: string;
    title: string;
    educatorId: string;
    classId: string;
    scheduledAt: string; // ISO string
    durationMinutes: number;
    meetingLink: string;
    recordingUrl?: string;
    status: "scheduled" | "live" | "completed" | "cancelled";
    topicsCovered?: string[];
    learnersPresent?: string[]; // learner IDs
    notes?: string;
    createdBy: string; // Admin or Educator ID
};

const classSessions: ClassSession[] = [
    {
        id: "cs001",
        title: "Kinematics – Displacement, Velocity & Acceleration",
        educatorId: "e001",
        classId: "class_jc_01",
        scheduledAt: "2024-05-20T17:00:00.000Z",
        durationMinutes: 90,
        meetingLink: "https://meet.nextphoton.com/session/cs001",
        status: "scheduled",
        topicsCovered: ["Displacement", "Average Velocity", "Instantaneous Acceleration"],
        createdBy: "admin002",
    },
    {
        id: "cs002",
        title: "Chemical Bonding – Hybridization",
        educatorId: "e002",
        classId: "class_neet_batch02",
        scheduledAt: "2024-05-19T09:00:00.000Z",
        durationMinutes: 60,
        meetingLink: "https://meet.nextphoton.com/session/cs002",
        recordingUrl: "https://recordings.nextphoton.com/cs002.mp4",
        status: "completed",
        topicsCovered: ["sp3 Hybridization", "Bond Angle", "Molecular Shape"],
        learnersPresent: ["l002", "l005", "l006"],
        notes: "Session went well. Learners asked questions about methane geometry.",
        createdBy: "admin002",
    },
    {
        id: "cs003",
        title: "Calculus – Limits & Continuity",
        educatorId: "e003",
        classId: "class_jee_batch01",
        scheduledAt: "2024-05-21T13:30:00.000Z",
        durationMinutes: 75,
        meetingLink: "https://meet.nextphoton.com/session/cs003",
        status: "scheduled",
        topicsCovered: ["Limit Laws", "Left-hand & Right-hand Limits", "Continuity"],
        createdBy: "admin001",
    },
    {
        id: "cs004",
        title: "NEET Doubt Clearing – Physics",
        educatorId: "e001",
        classId: "class_neet_batch02",
        scheduledAt: "2024-05-18T14:00:00.000Z",
        durationMinutes: 60,
        meetingLink: "https://meet.nextphoton.com/session/cs004",
        recordingUrl: "https://recordings.nextphoton.com/cs004.mp4",
        status: "completed",
        learnersPresent: ["l002", "l007"],
        notes: "Focused mostly on projectile motion doubts.",
        createdBy: "admin003",
    },
    {
        id: "cs005",
        title: "Biology – Plant Kingdom (Cancelled)",
        educatorId: "e004",
        classId: "class_neet_batch01",
        scheduledAt: "2024-05-18T07:00:00.000Z",
        durationMinutes: 60,
        meetingLink: "https://meet.nextphoton.com/session/cs005",
        status: "cancelled",
        notes: "Educator reported internet outage. To be rescheduled.",
        createdBy: "admin002",
    },
];

export default classSessions;
  