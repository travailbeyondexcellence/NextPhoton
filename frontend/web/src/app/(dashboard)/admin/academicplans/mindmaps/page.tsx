"use client"

import { BookOpen } from "lucide-react"

export default function MindmapsPage() {
  return (
    <div className="min-h-full">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-4">
          <BookOpen className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Academic Mindmaps</h1>
            <p className="text-muted-foreground">Visual learning pathways and concept maps</p>
          </div>
        </div>
      </div>

      {/* Mindmaps Section */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
        <h2 className="text-xl font-semibold mb-4">Learning Mindmaps</h2>
        <div className="text-muted-foreground">
          Interactive mindmaps for academic planning will be displayed here.
        </div>
      </div>
    </div>
  )
}