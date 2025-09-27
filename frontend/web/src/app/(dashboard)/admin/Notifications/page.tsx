"use client"

import { MessageSquare } from "lucide-react"

export default function NotificationsPage() {
  return (
    <div className="min-h-full">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-4">
          <MessageSquare className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
            <p className="text-muted-foreground">Manage system notifications and alerts</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Unread Card */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/15 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="text-muted-foreground">Unread</div>
            <div className="text-primary">🔔</div>
          </div>
          <div className="text-2xl font-bold">0</div>
          <div className="text-xs text-muted-foreground mt-2">New notifications</div>
        </div>

        {/* Sent Today Card */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/15 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="text-muted-foreground">Sent Today</div>
            <div className="text-success">📤</div>
          </div>
          <div className="text-2xl font-bold">0</div>
          <div className="text-xs text-muted-foreground mt-2">Notifications sent</div>
        </div>

        {/* Scheduled Card */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/15 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="text-muted-foreground">Scheduled</div>
            <div className="text-secondary">⏰</div>
          </div>
          <div className="text-2xl font-bold">0</div>
          <div className="text-xs text-muted-foreground mt-2">Pending delivery</div>
        </div>

        {/* Recipients Card */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/15 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="text-muted-foreground">Recipients</div>
            <div className="text-accent">👥</div>
          </div>
          <div className="text-2xl font-bold">0</div>
          <div className="text-xs text-muted-foreground mt-2">Active users</div>
        </div>
      </div>

      {/* Notification Center Section */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
        <h2 className="text-xl font-semibold mb-4">Notification Center</h2>
        <div className="text-muted-foreground">
          Notification management and delivery system will be implemented here.
        </div>
      </div>
    </div>
  )
}