"use client"

import { Megaphone } from "lucide-react"

export default function AnnouncementsPage() {
  return (
    <div className="min-h-full">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-4">
          <Megaphone className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Announcements</h1>
            <p className="text-muted-foreground">Create and manage system-wide announcements</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Active Card */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/15 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="text-muted-foreground">Active</div>
            <div className="text-primary">📢</div>
          </div>
          <div className="text-2xl font-bold">0</div>
          <div className="text-xs text-muted-foreground mt-2">Current announcements</div>
        </div>

        {/* Scheduled Card */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/15 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="text-muted-foreground">Scheduled</div>
            <div className="text-secondary">⏰</div>
          </div>
          <div className="text-2xl font-bold">0</div>
          <div className="text-xs text-muted-foreground mt-2">Future announcements</div>
        </div>

        {/* Expired Card */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/15 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="text-muted-foreground">Expired</div>
            <div className="text-muted-foreground">📤</div>
          </div>
          <div className="text-2xl font-bold">0</div>
          <div className="text-xs text-muted-foreground mt-2">Past announcements</div>
        </div>
      </div>

      {/* Announcement Management Section */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
        <h2 className="text-xl font-semibold mb-4">Announcement Management</h2>
        <div className="text-muted-foreground">
          System announcement creation and management will be implemented here.
        </div>
      </div>
    </div>
  )
}