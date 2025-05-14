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
      { icon: Users, label: "Teachers", href: "/list/teachers" },
      { icon: GraduationCap, label: "Students", href: "/list/students" },
      { icon: User, label: "Parents", href: "/list/parents" },
      { icon: BookOpen, label: "Subjects", href: "/list/subjects" },
      { icon: Building2, label: "Classes", href: "/list/classes" },
      { icon: NotebookPen, label: "Lessons", href: "/list/lessons" },
      { icon: FileText, label: "Exams", href: "/list/exams" },
      { icon: ClipboardList, label: "Assignments", href: "/list/assignments" },
      { icon: FileText, label: "Results", href: "/list/results" },
      { icon: ClipboardList, label: "Attendance", href: "/list/attendance" },
      { icon: Calendar, label: "Events", href: "/list/events" },
      { icon: MessageSquare, label: "Messages", href: "/list/messages" },
      { icon: Megaphone, label: "Announcements", href: "/list/announcements" },
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
