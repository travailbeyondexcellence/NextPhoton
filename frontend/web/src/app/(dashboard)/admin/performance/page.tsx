"use client"

import { FileText } from "lucide-react"

export default function PerformancePage() {
  return (
    <div className="min-h-full">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-4">
          <FileText className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Academic Performance</h1>
            <p className="text-muted-foreground">Track and analyze student performance metrics</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Average Grade Card */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/15 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="text-muted-foreground">Average Grade</div>
            <div className="text-primary">📊</div>
          </div>
          <div className="text-2xl font-bold">0%</div>
          <div className="text-xs text-muted-foreground mt-2">Overall average</div>
        </div>

        {/* Top Performers Card */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/15 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="text-muted-foreground">Top Performers</div>
            <div className="text-success">🏆</div>
          </div>
          <div className="text-2xl font-bold">0</div>
          <div className="text-xs text-muted-foreground mt-2">Students above 90%</div>
        </div>

        {/* Need Support Card */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/15 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="text-muted-foreground">Need Support</div>
            <div className="text-warning">⚠️</div>
          </div>
          <div className="text-2xl font-bold">0</div>
          <div className="text-xs text-muted-foreground mt-2">Students below 60%</div>
        </div>

        {/* Improvement Card */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/15 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="text-muted-foreground">Improvement</div>
            <div className="text-accent">📈</div>
          </div>
          <div className="text-2xl font-bold">0%</div>
          <div className="text-xs text-muted-foreground mt-2">Monthly progress</div>
        </div>
      </div>

      {/* Performance Analytics Section */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
        <h2 className="text-xl font-semibold mb-4">Performance Analytics</h2>
        <div className="text-muted-foreground">
          Detailed performance analytics and reports will be displayed here.
        </div>
      </div>
    </div>
  )
}