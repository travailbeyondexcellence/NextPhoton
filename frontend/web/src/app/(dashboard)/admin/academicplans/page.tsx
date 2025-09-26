"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen } from "lucide-react"
import Link from "next/link"

export default function AcademicPlansPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <BookOpen className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Academic Plans</h1>
          <p className="text-muted-foreground">Manage student academic plans and curriculum</p>
        </div>
      </div>

      {/* Navigation Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link href="/admin/academicplans/premade">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle>Premade Plans</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Browse and manage template plans</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/academicplans/assigned">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle>Assigned Plans</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">View plans assigned to students</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/academicplans/executed">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle>Executed Plans</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Track completed academic plans</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/academicplans/mindmaps">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle>Mindmaps</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Visual learning pathways</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Overview Section */}
      <Card>
        <CardHeader>
          <CardTitle>Academic Plans Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Select a category above to manage different types of academic plans.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}