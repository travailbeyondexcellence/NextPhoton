import {
  Home,
  Users,
  GraduationCap,
  User,
  BookOpen,
  Building2,
  NotebookPen,
  FileText,
  ClipboardList,
  Calendar,
  MessageSquare,
  Megaphone,
  UserCircle,
  Settings,
  LogOut,
  LucideIcon,
  PackageCheck,
  Wallet,
  CreditCard,
} from "lucide-react";

export interface SidebarItem {
  icon: LucideIcon;
  label: string;
  href: string;
}

export interface SidebarGroup {
  title: string;
  items: SidebarItem[];
}

export const adminMenu: SidebarGroup[] = [
  {
    title: "MENU",
    items: [
    
      // ________________________Dashboards, Lists and OverView_______________________________
    
    
      { icon: Home, label: "Home", href: "/" },
      { icon: Users, label: "Educators", href: "/admin/educators" },
      { icon: GraduationCap, label: "Learners", href: "/admin/learners" },
      { icon: User, label: "Guardians", href: "/admin/guardians" },
    
      { icon: Building2, label: "ClassSessions", href: "/admin/classSessions" },
      { icon: Calendar, label: "Attendance", href: "/admin/studentAttendance" },

      // ________________________________Features for Learners________________________________


      { icon: NotebookPen, label: "Academic Plans", href: "/admin/AcademicPlans" },
      { icon: NotebookPen, label: "Class Sessions", href: "/admin/ClassSessions" },
      { icon: NotebookPen, label: "Daily Study Plan", href: "/admin/dailyStudyPlan" },
  
      { icon: FileText, label: "Practise", href: "/TRAVAIL-PRACTISE-EXAMS/admin/TRAVAIL-PRACTISE" }, // This will open travail.photonecademy.com/practise for the student, and the student will be able to see the practice assignments that are assigned to them.
      // For the admin, it will populate the dashboard with all the practise assignments that are assigned to the students and the practise that the students have done recently.Admin can view perstudent performance and the practise that the students have done recently.
      { icon: FileText, label: "Exams", href: "/TRAVAIL-PRACTISE-EXAMS/admin/TRAVAIL-EXAMS" }, // This will open travail.photonecademy.com/exams for the student, and the student will be able to see the exams that are assigned to them.
      // For the admin, it will populate the dashboard with all the exams that are assigned to the students, the exams the students have given recently and the practise that the students have done recently.
      { icon: ClipboardList, label: "Home Tasks", href: "/admin/HomeTasks" },
      { icon: FileText, label: "Performance", href: "/admin/performance" },
      // For the academic performance of the students+

      // __________________________________Messaging________________________________________
   
      { icon: PackageCheck, label: "EduCare Tasks", href: "/admin/EducareTasks" },
      { icon: MessageSquare, label: "Notifications", href: "/admin/Notifications" },
      { icon: Megaphone, label: "Announcements", href: "/admin/announcements" },
      { icon: Settings, label: "NextPhoton Settings", href: "/NextPhotonSettings" },
    ],
  },
  {
    title: "OTHER",
    items: [
      { icon: Wallet, label: "Profile", href: "/admin/feesManagement" },
      { icon: UserCircle, label: "Profile", href: "/profile" },
      { icon: Settings, label: "Settings", href: "/settings" },
      { icon: LogOut, label: "Logout", href: "/logout" },
    ],
  },
];


