"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PackageCheck } from "lucide-react"

export default function EduCareTasksPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <PackageCheck className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">EduCare Tasks</h1>
          <p className="text-muted-foreground">Manage educational care and support tasks</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Active Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">0</p>
            <p className="text-sm text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending Review</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">0</p>
            <p className="text-sm text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">0</p>
            <p className="text-sm text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>EduCare Task Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Educational care task assignment and tracking will be implemented here.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}