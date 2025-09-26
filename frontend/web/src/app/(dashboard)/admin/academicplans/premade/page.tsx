"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen } from "lucide-react"

export default function PremadePlansPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <BookOpen className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Premade Academic Plans</h1>
          <p className="text-muted-foreground">Browse and manage template academic plans</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Available Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Premade academic plan templates will be displayed here.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}