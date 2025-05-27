"use client"

import { Bell, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import ThemeToggle from "@/components/ThemeToggle"


import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { useState } from "react"

import { useTheme } from "next-themes";

// Clerk has been remoed from the Application UI

interface NavbarProps {
  
}

export function DashboardNavbar() {


  const themeObject = useTheme();
  const dashboardBackground = themeObject.theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100';
  const dashboardText = themeObject.theme === 'dark' ? 'text-gray-400' : 'text-gray-700';



  return (
    <header className={`w-full h-16  light:bg-gray-300 light:text-gray-900 px-4 flex items-center justify-between ${dashboardBackground} ${dashboardText}`}>
      {/* Left: Sidebar trigger + title */}
      <div className="flex items-center gap-4 min-w-0">
      
        {/* SidebarTrigger with dark mode styles */}
        <div className=" rounded-md">
          <SidebarTrigger className="text-foreground" />
        </div>
        <h2 className="text-lg font-semibold truncate text-foreground">Dashboard</h2>
      </div>

      {/* Right: Theme, notifications, profile */}
      <div className="flex items-center gap-4 shrink-0">
        <ThemeToggle />
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5 text-foreground" />
        </Button>
    
      </div>
    </header>
  );
}
