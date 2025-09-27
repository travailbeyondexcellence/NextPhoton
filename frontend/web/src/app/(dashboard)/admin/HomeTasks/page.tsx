"use client"

export default function HomeTasksPage() {
  return (
    <div className="min-h-full p-6 space-y-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-4">
          <span className="text-4xl">📋</span>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Home Tasks</h1>
            <p className="text-muted-foreground">Manage homework and home assignments</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/15 transition-all">
          <h3 className="text-lg font-semibold text-foreground mb-2">Assigned Today</h3>
          <p className="text-2xl font-bold text-foreground">0</p>
          <p className="text-sm text-muted-foreground">New assignments</p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/15 transition-all">
          <h3 className="text-lg font-semibold text-foreground mb-2">Pending</h3>
          <p className="text-2xl font-bold text-foreground">0</p>
          <p className="text-sm text-muted-foreground">Awaiting submission</p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/15 transition-all">
          <h3 className="text-lg font-semibold text-foreground mb-2">Submitted</h3>
          <p className="text-2xl font-bold text-foreground">0</p>
          <p className="text-sm text-muted-foreground">Ready for review</p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/15 transition-all">
          <h3 className="text-lg font-semibold text-foreground mb-2">Graded</h3>
          <p className="text-2xl font-bold text-foreground">0</p>
          <p className="text-sm text-muted-foreground">Completed this week</p>
        </div>
      </div>

      {/* Management Section */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
        <h2 className="text-xl font-semibold text-foreground mb-4">Home Tasks Management</h2>
        <p className="text-muted-foreground">
          Homework assignment and tracking functionality will be implemented here.
        </p>
      </div>
    </div>
  )
}