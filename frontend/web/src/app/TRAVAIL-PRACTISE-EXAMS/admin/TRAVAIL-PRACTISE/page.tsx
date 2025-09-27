"use client"

export default function TravailPractisePage() {
  return (
    <div className="min-h-full p-6 space-y-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-4">
          <span className="text-4xl">✏️</span>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Practice Assignments</h1>
            <p className="text-muted-foreground">Manage and monitor practice exercises</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/15 transition-all">
          <h3 className="text-lg font-semibold text-foreground mb-2">Active Practices</h3>
          <p className="text-2xl font-bold text-foreground">0</p>
          <p className="text-sm text-muted-foreground">Currently assigned</p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/15 transition-all">
          <h3 className="text-lg font-semibold text-foreground mb-2">Completed</h3>
          <p className="text-2xl font-bold text-foreground">0</p>
          <p className="text-sm text-muted-foreground">This week</p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/15 transition-all">
          <h3 className="text-lg font-semibold text-foreground mb-2">Average Score</h3>
          <p className="text-2xl font-bold text-foreground">0%</p>
          <p className="text-sm text-muted-foreground">Overall performance</p>
        </div>
      </div>

      {/* Management Section */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
        <h2 className="text-xl font-semibold text-foreground mb-4">Practice Management</h2>
        <p className="text-muted-foreground">
          This will integrate with travail.photonecademy.com for practice assignment management.
        </p>
      </div>
    </div>
  )
}