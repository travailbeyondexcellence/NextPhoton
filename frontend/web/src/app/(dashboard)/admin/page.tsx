
"use client"

import { useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const AdminPage = () => {
  const router = useRouter()

  // Handler for Create Course button - navigates to academic plans premade section
  const handleCreateCourse = () => {
    router.push("/admin/academicplans/premade")
  }

  // Handler for View Reports button - navigates to performance page
  const handleViewReports = () => {
    router.push("/admin/performance")
  }

  // Handler for System Settings button - navigates to settings page
  const handleSystemSettings = () => {
    router.push("/settings")
  }

  return (
    <div className="min-h-full">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground">
          Manage your educational platform and monitor system performance
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Users Card */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/15 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="text-muted-foreground">Total Users</div>
            <div className="text-primary">📊</div>
          </div>
          <div className="text-2xl font-bold">1,284</div>
          <div className="text-xs text-muted-foreground mt-2">+12% from last month</div>
        </div>

        {/* Active Sessions Card */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/15 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="text-muted-foreground">Active Sessions</div>
            <div className="text-success">🟢</div>
          </div>
          <div className="text-2xl font-bold">423</div>
          <div className="text-xs text-muted-foreground mt-2">Currently online</div>
        </div>

        {/* Total Courses Card */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/15 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="text-muted-foreground">Total Courses</div>
            <div className="text-secondary">📚</div>
          </div>
          <div className="text-2xl font-bold">86</div>
          <div className="text-xs text-muted-foreground mt-2">5 new this week</div>
        </div>

        {/* Revenue Card */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/15 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="text-muted-foreground">Monthly Revenue</div>
            <div className="text-accent">💰</div>
          </div>
          <div className="text-2xl font-bold">$24,780</div>
          <div className="text-xs text-muted-foreground mt-2">+8% from last month</div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <div className="lg:col-span-2">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <h2 className="text-xl font-semibold mb-4">Recent Activities</h2>
            <div className="space-y-3">
              {[
                { user: "John Educator", action: "Created new course", time: "2 minutes ago", icon: "📝" },
                { user: "Mike Learner", action: "Completed assignment", time: "15 minutes ago", icon: "✅" },
                { user: "Sarah ECM", action: "Updated schedule", time: "1 hour ago", icon: "📅" },
                { user: "Admin", action: "System backup completed", time: "2 hours ago", icon: "💾" },
                { user: "Robert Guardian", action: "Viewed progress report", time: "3 hours ago", icon: "📊" },
              ].map((activity, index) => (
                <div key={index} className="flex items-center gap-4 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all">
                  <div className="text-2xl">{activity.icon}</div>
                  <div className="flex-1">
                    <div className="font-medium">{activity.user}</div>
                    <div className="text-sm text-muted-foreground">{activity.action}</div>
                  </div>
                  <div className="text-xs text-muted-foreground">{activity.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-2">
              {/* Add New User - Dropdown menu with user type options */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="w-full p-3 bg-white/5 text-foreground rounded-lg border border-white/10 hover:bg-white/10 transition-all text-left cursor-pointer">
                    <div className="font-medium">Add New User</div>
                    <div className="text-xs text-muted-foreground">Create educator or learner account</div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Select User Type</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push("/admin/educators/createNewEducator")}>
                    <span className="mr-2">👨‍🏫</span>
                    Create Educator
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/admin/learners/createNewLearner")}>
                    <span className="mr-2">👨‍🎓</span>
                    Create Learner
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/admin/guardians/createNewGuardian")}>
                    <span className="mr-2">👨‍👩‍👧</span>
                    Create Guardian
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Create Course - Direct navigation to academic plans */}
              <button
                onClick={handleCreateCourse}
                className="w-full p-3 bg-white/5 text-foreground rounded-lg border border-white/10 hover:bg-white/10 transition-all text-left cursor-pointer"
              >
                <div className="font-medium">Create Course</div>
                <div className="text-xs text-muted-foreground">Set up new educational content</div>
              </button>

              {/* View Reports - Direct navigation to performance page */}
              <button
                onClick={handleViewReports}
                className="w-full p-3 bg-white/5 text-foreground rounded-lg border border-white/10 hover:bg-white/10 transition-all text-left cursor-pointer"
              >
                <div className="font-medium">View Reports</div>
                <div className="text-xs text-muted-foreground">Analytics and performance metrics</div>
              </button>

              {/* System Settings - Direct navigation to settings page */}
              <button
                onClick={handleSystemSettings}
                className="w-full p-3 bg-white/5 text-foreground rounded-lg border border-white/10 hover:bg-white/10 transition-all text-left cursor-pointer"
              >
                <div className="font-medium">System Settings</div>
                <div className="text-xs text-muted-foreground">Configure platform preferences</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
