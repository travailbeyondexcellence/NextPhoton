import {
    Home,
    User,
    FileText,
    ClipboardList,
    Calendar,
    MessageSquare,
    Megaphone,
    UserCircle,
    Settings,
    LogOut,
} from "lucide-react";

export const parentMenu = [
    {
        title: "MENU",
        items: [
            { icon: <Home size={ 20} />, label: "Home", href: "/" },
    { icon: <User size={ 20} />, label: "Parents", href: "/list/parents" },
{
    icon: <FileText size={ 20 } />, label: "Exams", href: "/list / exams" },
    {
        icon: <ClipboardList size={ 20 } />, label: "Assignments", href: "/list / assignments" },
        {
            icon: <FileText size={ 20 } />, label: "Results", href: "/list / results" },
            {
                icon: <ClipboardList size={ 20 } />, label: "Attendance", href: "/list / attendance" },
                {
                    icon: <Calendar size={ 20 } />, label: "Events", href: "/list / events" },
                    {
                        icon: <MessageSquare size={ 20 } />, label: "Messages", href: "/list / messages" },
                        {
                            icon: <Megaphone size={ 20 } />, label: "Announcements", href: "/list / announcements" },
        ],
                        },
                        {
                            title: "OTHER",
                                items: [
                                    { icon: <UserCircle size={ 20} />, label: "Profile", href: "/profile" },
                        {
                            icon: <Settings size={ 20 } />, label: "Settings", href: "/settings" },
                            {
                                icon: <LogOut size={ 20 } />, label: "Logout", href: "/logout" },
        ],
                            },
]; 