type Guardian = {
    id: string;
    name: string;
    relation: string;
    email: string;
    phone?: string;
    assignedLearners: string[];
    notes?: string[];
};
  


const guardians: Guardian[] = [
    {
        id: "g001",
        name: "Rajesh Patel",
        relation: "Father",
        email: "rajeshpatel@example.com",
        phone: "+91-9898989898",
        assignedLearners: ["l001"],
        notes: ["Wants regular academic updates via WhatsApp."],
    },
    {
        id: "g002",
        name: "Sneha Patel",
        relation: "Mother",
        email: "snehapatel@example.com",
        phone: "+91-9797979797",
        assignedLearners: ["l001"],
        notes: ["Available only in the evenings."],
    },
    {
        id: "g003",
        name: "Anil Reddy",
        relation: "Father",
        email: "anilreddy@example.com",
        phone: "+91-9676767676",
        assignedLearners: ["l002"],
        notes: ["Prefers email communication."],
    },
];

export default guardians;
  