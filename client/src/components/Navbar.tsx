"use client"

import { Bell, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import ThemeToggle from "@/components/ThemeToggle"
import { UserButton } from "@clerk/nextjs"

interface NavbarProps {
  onMenuClick?: () => void
}

export function Navbar({ onMenuClick }: NavbarProps) {
  return (
    <div className="flex h-16 items-center border-b bg-background px-4">
      <Button
        variant="ghost"
        size="icon"
        className="mr-2 md:hidden"
        onClick={onMenuClick}
      >
        <Menu className="h-5 w-5" />
      </Button>
      <div className="flex flex-1 items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold">Dashboard</h2>
        </div>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <UserButton 
            afterSignOutUrl="/"
            signInUrl="/sign-in"
            appearance={{
              elements: {
                avatarBox: "h-8 w-8"
              }
            }}
          />
        </div>
      </div>
    </div>
  )
} 