"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen } from "lucide-react"

export default function MindmapsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <BookOpen className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Academic Mindmaps</h1>
          <p className="text-muted-foreground">Visual learning pathways and concept maps</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Learning Mindmaps</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Interactive mindmaps for academic planning will be displayed here.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}