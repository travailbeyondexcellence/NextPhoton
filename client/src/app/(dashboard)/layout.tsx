"use client";

import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { DashboardNavbar } from "@/components/DashboardNavbar";

import { useTheme } from "next-themes";

import { useState, useEffect } from "react";

// ✅ Outer wrapper
export default function Layout({ children }: { children: React.ReactNode }) {

  const { theme, setTheme } = useTheme(); // Use next-themes for theme management, theres are destructured from useTheme, they are NOt local state variables
  
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);



  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark' || storedTheme === 'light') {
      setTheme(storedTheme);
      // document.documentElement.classList.toggle('dark', stored === 'dark'); // not needed with next-themes
    }

  } , []);


  if (!mounted) return null; // ✅ Prevent hydration mismatch

  return (
    <SidebarProvider>
      <LayoutWithSidebar>{children}</LayoutWithSidebar>
    </SidebarProvider>
  );
}

// ✅ Actual layout logic using sidebar context
function LayoutWithSidebar({ children }: { children: React.ReactNode }) {


  const { open } = useSidebar();


  // import { useTheme } from "next-themes";
  const themeObject = useTheme();
  const asideBackground = themeObject.theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100';
  const asideText = themeObject.theme === 'dark' ? 'text-gray-400' : 'text-gray-700';


  // console.log("Current theme:", themeObject);
  // console.log("Sidebar open state:", open);

  return (
    <div className="flex w-screen h-screen overflow-hidden">
      <aside
        className={`sidebar fixed top-0 left-0 h-screen p-0 pl-0 w-56 z-50 transition-transform duration-300 ease-in-out border-transparent dark:border-transparent overflow-hidden
   
        ${asideBackground} ${asideText} shadow-lg
        ${open ? "translate-x-0" : "-translate-x-full"}
  `}
      >
        {/* <DashboardSidebar /> */}
      </aside>

      {/* <DashboardSidebar /> */}

      <div
        className={`w-screen flex flex-col min-h-screen transition-all duration-300 bg-background  ${open ? "ml-56" : "ml-0 pl-0"
          }`}
      >
        {/* <DashboardNavbar /> */}
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
