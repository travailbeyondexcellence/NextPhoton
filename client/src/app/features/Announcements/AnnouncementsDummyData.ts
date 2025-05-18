export type Announcement = {
    id: string;
    title: string;
    content: string;
    authorId: string;
    date: string;
    visibility: "all" | "learners" | "educators" | "admins";
};

const announcements: Announcement[] = [
    {
        id: "annc001",
        title: "JEE Advanced Bootcamp Starts June 1",
        content: "All JEE learners are expected to attend the bootcamp starting next month.",
        authorId: "admin002",
        date: "2024-05-16",
        visibility: "learners",
    },
];

export default announcements;
  