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
  } from "lucide-react";
  
  export const adminMenu = [
    {
      title: "MENU",
      items: [
        { icon: <Home size={20} />, label: "Home", href: "/" },
        { icon: <Users size={20} />, label: "Teachers", href: "/list/teachers" },
        { icon: <GraduationCap size={20} />, label: "Students", href: "/list/students" },
        { icon: <User size={20} />, label: "Parents", href: "/list/parents" },
        { icon: <BookOpen size={20} />, label: "Subjects", href: "/list/subjects" },
        { icon: <Building2 size={20} />, label: "Classes", href: "/list/classes" },
        { icon: <NotebookPen size={20} />, label: "Lessons", href: "/list/lessons" },
        { icon: <FileText size={20} />, label: "Exams", href: "/list/exams" },
        { icon: <ClipboardList size={20} />, label: "Assignments", href: "/list/assignments" },
        { icon: <FileText size={20} />, label: "Results", href: "/list/results" },
        { icon: <ClipboardList size={20} />, label: "Attendance", href: "/list/attendance" },
        { icon: <Calendar size={20} />, label: "Events", href: "/list/events" },
        { icon: <MessageSquare size={20} />, label: "Messages", href: "/list/messages" },
        { icon: <Megaphone size={20} />, label: "Announcements", href: "/list/announcements" },
      ],
    },
    {
      title: "OTHER",
      items: [
        { icon: <UserCircle size={20} />, label: "Profile", href: "/profile" },
        { icon: <Settings size={20} />, label: "Settings", href: "/settings" },
        { icon: <LogOut size={20} />, label: "Logout", href: "/logout" },
      ],
    },
  ];
  