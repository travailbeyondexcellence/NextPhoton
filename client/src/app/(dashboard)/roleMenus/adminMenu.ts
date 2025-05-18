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
      { icon: Home, label: "Home", href: "/" },
      { icon: Users, label: "Educators", href: "/admin/educators" },
      { icon: GraduationCap, label: "Learners", href: "/admin/learners" },
      { icon: User, label: "Guardians", href: "/admin/parents" },
    
      { icon: Building2, label: "ClassSessions", href: "/admin/classSessions" },
      { icon: ClipboardList, label: "Attendance", href: "/admin/studentAttendance" },


      { icon: NotebookPen, label: "Daily Study Plan", href: "/admin/dailyStudyPlan" },
      { icon: FileText, label: "Exams", href: "/admin/exams" },
      { icon: ClipboardList, label: "Assignments", href: "/admin/assignments" },
      { icon: FileText, label: "Performance", href: "/admin/performance" },
   
      { icon: Calendar, label: "Tasks", href: "/admin/tasks" },
      { icon: MessageSquare, label: "Notifications", href: "/admin/Notifications" },
      { icon: Megaphone, label: "Announcements", href: "/admin/announcements" },
    ],
  },
  {
    title: "OTHER",
    items: [
      { icon: UserCircle, label: "Profile", href: "/profile" },
      { icon: Settings, label: "Settings", href: "/settings" },
      { icon: LogOut, label: "Logout", href: "/logout" },
    ],
  },
];
