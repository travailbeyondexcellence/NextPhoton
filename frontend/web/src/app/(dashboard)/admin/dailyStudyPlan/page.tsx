"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { NotebookPen } from "lucide-react"

export default function DailyStudyPlanPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <NotebookPen className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Daily Study Plan</h1>
          <p className="text-muted-foreground">Manage daily study schedules and activities</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Today's Plans</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">0</p>
            <p className="text-sm text-muted-foreground">Active study plans</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">0</p>
            <p className="text-sm text-muted-foreground">Plans completed today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">0</p>
            <p className="text-sm text-muted-foreground">Plans pending review</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Study Plan Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Daily study plan scheduling and tracking will be implemented here.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}