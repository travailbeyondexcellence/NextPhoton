export type LearnerScore = {
    id: string;
    learnerId: string;
    examId: string;
    subject: string;
    score: number;
    total: number;
    remarks?: string;
};

const learnerScores: LearnerScore[] = [
    {
        id: "score001",
        learnerId: "l002",
        examId: "exam001",
        subject: "Biology",
        score: 162,
        total: 180,
        remarks: "Excellent grasp of NCERT",
    },
];

export default learnerScores;
  