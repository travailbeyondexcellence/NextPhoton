"use client"

import { Bell, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import ThemeToggle from "@/components/ThemeToggle"
import { UserButton } from "@clerk/nextjs"

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { useState } from "react"

interface NavbarProps {
  
}

export function DashboardNavbar() {
  return (
    <header className="w-full h-16 border-b light:bg-gray-300 light:text-gray-900 dark:bg-gray-900 dark:border-gray-800 px-4 flex items-center justify-between">
      {/* Left: Sidebar trigger + title */}
      <div className="flex items-center gap-4 min-w-0">
      
        {/* SidebarTrigger with dark mode styles */}
        <div className="dark:bg-gray-800 dark:text-gray-100 rounded-md">
          <SidebarTrigger className="text-foreground dark:text-gray-100" />
        </div>
        <h2 className="text-lg font-semibold truncate text-foreground dark:text-gray-100">Dashboard</h2>
      </div>

      {/* Right: Theme, notifications, profile */}
      <div className="flex items-center gap-4 shrink-0">
        <ThemeToggle />
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5 text-foreground dark:text-gray-100" />
        </Button>
        <UserButton 
          afterSignOutUrl="/"
          signInUrl="/sign-in"
          appearance={{ elements: { avatarBox: "h-8 w-8" } }}
        />
      </div>
    </header>
  );
}
