// adminsDummyData.tsx

export type Admin = {
    id: string;
    name: string;
    email: string;
    phone?: string;
    superAdmin: boolean; // If true, has full system access (including billing, deletion)
    role: "operations" | "hr" | "superadmin" | "tech-admin";
    department?: string;
    joinDate: string;
    managesEmployees?: string[]; // list of employee IDs
    managesInterns?: string[]; // list of intern IDs
    profileImage?: string;
    tags?: string[];
    notes?: {
      author: string;
      timestamp: string;
      note: string;
    }[];
  };
  
  const admins: Admin[] = [
    {
      id: "admin001",
      name: "Zenith Patil",
      email: "zenith@nextphoton.com",
      phone: "+91-9000000000",
      role: "superadmin",
      superAdmin: true,
      department: "Executive",
      joinDate: "2021-01-01",
      profileImage: "/admins/zenith.png",
      tags: ["Founder", "Full Access", "DevOps"],
      notes: [
        {
          author: "System",
          timestamp: "2023-01-01",
          note: "Root access enabled across all services and apps.",
        },
      ],
    },
    {
      id: "admin002",
      name: "Shruti Bhave",
      email: "shruti@nextphoton.com",
      role: "operations",
      superAdmin: false,
      department: "Academic Operations",
      joinDate: "2022-07-10",
      managesEmployees: ["emp001", "emp003"],
      managesInterns: ["int001", "int002"],
      profileImage: "/admins/shruti.png",
      tags: ["Shift Manager", "Rosters", "Employee Onboarding"],
      notes: [
        {
          author: "Zenith Patil",
          timestamp: "2024-02-12",
          note: "Delegated hiring and scheduling responsibilities.",
        },
      ],
    },
    {
      id: "admin003",
      name: "Karan Jaiswal",
      email: "karanj@nextphoton.com",
      role: "tech-admin",
      superAdmin: false,
      department: "Platform & Tools",
      joinDate: "2023-03-15",
      managesEmployees: ["emp004"],
      profileImage: "/admins/karan.png",
      tags: ["NextJS Admin", "Infra Lead", "Support Dashboards"],
      notes: [
        {
          author: "Zenith Patil",
          timestamp: "2024-01-22",
          note: "Responsible for provisioning and revoking platform access.",
        },
      ],
    },
  ];
  
  export default admins;
  