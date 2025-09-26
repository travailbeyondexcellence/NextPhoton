"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet } from "lucide-react"

export default function FeesManagementPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Wallet className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Fees Management</h1>
          <p className="text-muted-foreground">Manage student fees and payment records</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Collected</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">₹0</p>
            <p className="text-sm text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">₹0</p>
            <p className="text-sm text-muted-foreground">Outstanding fees</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Overdue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">0</p>
            <p className="text-sm text-muted-foreground">Students with dues</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Paid Students</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">0</p>
            <p className="text-sm text-muted-foreground">Fully paid</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Fees Management System</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Fee collection and tracking functionality will be implemented here.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}