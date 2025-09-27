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
  Palette,
} from "lucide-react";

export interface SidebarItem {
  icon: LucideIcon;
  label: string;
  href: string;
  children?: SidebarItem[];
  hasSecondaryDrawer?: boolean;
  secondaryDrawerKey?: string;
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
    
    
      { icon: Home, label: "Home", href: "/admin" },
      { icon: Users, label: "Educators", href: "/admin/educators" },
      { icon: GraduationCap, label: "Learners", href: "/admin/learners" },
      { icon: User, label: "Guardians", href: "/admin/guardians" },
    
      { icon: Building2, label: "ClassSessions", href: "/admin/classSessions" },
      { icon: Calendar, label: "Attendance", href: "/admin/studentAttendance" },

      // ________________________________Features for Learners________________________________


      {
        icon: BookOpen, label: "Academic Plans", href: "/admin/academicplans", children: [
          { icon: BookOpen, label: "Premade Plans", href: "/admin/academicplans/premade" },
          { icon: BookOpen, label: "Assigned Plans", href: "/admin/academicplans/assigned" },
          { icon: BookOpen, label: "Executed Plans", href: "/admin/academicplans/executed" },
          { icon: BookOpen, label: "Mindmaps", href: "/admin/academicplans/mindmaps" },
      ], },
      { icon: NotebookPen, label: "Daily Study Plan", href: "/admin/dailyStudyPlan" },
  
      { icon: FileText, label: "Practise", href: "/TRAVAIL-PRACTISE-EXAMS/admin/TRAVAIL-PRACTISE" }, // This will open travail.photonecademy.com/practise for the student, and the student will be able to see the practice assignments that are assigned to them.
      // For the admin, it will populate the dashboard with all the practise assignments that are assigned to the students and the practise that the students have done recently.Admin can view perstudent performance and the practise that the students have done recently.
      { icon: FileText, label: "Exams", href: "/TRAVAIL-PRACTISE-EXAMS/admin/TRAVAIL-EXAMS" }, // This will open travail.photonecademy.com/exams for the student, and the student will be able to see the exams that are assigned to them.
      // For the admin, it will populate the dashboard with all the exams that are assigned to the students, the exams the students have given recently and the practise that the students have done recently.
      { icon: ClipboardList, label: "Home Tasks", href: "/admin/HomeTasks" },
      { icon: FileText, label: "Performance", href: "/admin/performance", hasSecondaryDrawer: true, secondaryDrawerKey: "analytics" },
      // For the academic performance of the students+

      // __________________________________Messaging________________________________________
   
      { icon: PackageCheck, label: "EduCare Tasks", href: "/admin/EducareTasks" },
      { icon: MessageSquare, label: "Notifications", href: "/admin/Notifications", hasSecondaryDrawer: true, secondaryDrawerKey: "messaging" },
      { icon: Megaphone, label: "Announcements", href: "/admin/announcements" },
      { icon: Settings, label: "NextPhoton Settings", href: "/NextPhotonSettings" },
      { icon: Palette, label: "Test Themes", href: "/test-themes" },
    ],
  },
  {
    title: "OTHER",
    items: [
      { icon: Wallet, label: "Fees", href: "/admin/feesManagement" },
      { icon: UserCircle, label: "Profile", href: "/profile" },
      { icon: Settings, label: "Settings", href: "/settings" },
      { icon: LogOut, label: "Logout", href: "/logout" },
    ],
  },
];


