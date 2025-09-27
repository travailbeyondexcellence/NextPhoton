"use client"

import { PackageCheck } from "lucide-react"

export default function EduCareTasksPage() {
  return (
    <div className="min-h-full">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-4">
          <PackageCheck className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">EduCare Tasks</h1>
            <p className="text-muted-foreground">Manage educational care and support tasks</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Active Tasks Card */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/15 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="text-muted-foreground">Active Tasks</div>
            <div className="text-primary">📋</div>
          </div>
          <div className="text-2xl font-bold">0</div>
          <div className="text-xs text-muted-foreground mt-2">Currently active</div>
        </div>

        {/* Pending Review Card */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/15 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="text-muted-foreground">Pending Review</div>
            <div className="text-warning">⏳</div>
          </div>
          <div className="text-2xl font-bold">0</div>
          <div className="text-xs text-muted-foreground mt-2">Awaiting approval</div>
        </div>

        {/* Completed Card */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/15 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="text-muted-foreground">Completed</div>
            <div className="text-success">✅</div>
          </div>
          <div className="text-2xl font-bold">0</div>
          <div className="text-xs text-muted-foreground mt-2">This month</div>
        </div>
      </div>

      {/* Task Management Section */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
        <h2 className="text-xl font-semibold mb-4">EduCare Task Management</h2>
        <div className="text-muted-foreground">
          Educational care task assignment and tracking will be implemented here.
        </div>
      </div>
    </div>
  )
}