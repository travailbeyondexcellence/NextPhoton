// This file contains dummy data for educator reviews and admin notes.
// It is used for testing and development purposes only.

const educator = {
    id: "12345",
    name: "Dr. Meera Sharma",
    username: "@meera.physics",
    emailFallback: "meerasharma@nextphoton.com",
    intro: "Passionate Physics & Maths educator who simplifies the toughest topics. lorem20 years of experience in teaching JEE and NEET aspirants. I believe in making learning fun and engaging.",
    qualification: "Ph.D. in Theoretical Physics, IIT Bombay",
    subjects: ["Physics", "Mathematics"],
    levels: ["Senior School", "Junior College", "JEE Advanced"],
    exams: ["10th Boards", "JEE Main", "NEET", "Olympiads"],
    priceTier: "intermediate-2",
    yearsWithNextPhoton: 5,
    studentsTaught: 1800,
    hoursTaught: 3200,
    profileImage: "/educators/edumeerasharma.png",
};
  


const educatorReviews = [
    {
        studentName: "Aarav Patel",
        exam: "JEE Main",
        rating: 5,
        comment: "Dr. Meera’s classes are crystal clear. Her Physics explanations helped me crack tough problems easily!",
        date: "2024-03-10"
    },
    {
        studentName: "Ishita Reddy",
        exam: "NEET",
        rating: 4,
        comment: "Her analogies made complex biology topics so simple. Just wish classes were a bit longer.",
        date: "2024-02-25"
    },
    {
        studentName: "Kunal Sethi",
        exam: "10th Boards",
        rating: 5,
        comment: "Very approachable and makes learning fun. Truly a great teacher.",
        date: "2023-12-12"
    },
    {
        studentName: "Riya Kapoor",
        exam: "Olympiads",
        rating: 4,
        comment: "Her mentoring helped me qualify stage 2. Notes were exceptional.",
        date: "2024-01-03"
    }
];



const adminNotes = [
    {
        author: "Admin – Priya Singh",
        timestamp: "2023-08-12",
        note: "Highly requested by top batches. Consistently rated high in feedback forms."
    },
    {
        author: "Admin – Arjun Mehta",
        timestamp: "2022-11-05",
        note: "Tends to prefer evening slots. Avoid scheduling back-to-back sessions for her."
    },
    {
        author: "Admin – Rohan D.",
        timestamp: "2021-06-22",
        note: "Promoted to handle advanced JEE batches due to excellent results in previous term."
    }
];
  
export { adminNotes, educator, educatorReviews };