"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen } from "lucide-react"

export default function ExecutedPlansPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <BookOpen className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Executed Academic Plans</h1>
          <p className="text-muted-foreground">Track completed academic plans and progress</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Completed Plans</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Executed academic plans and completion reports will be displayed here.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}