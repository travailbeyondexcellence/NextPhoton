"use client"

export default function PremadePlansPage() {
  return (
    <div className="min-h-full container mx-auto p-6">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          📚 Premade Academic Plans
        </h1>
        <p className="text-muted-foreground">
          Browse and manage template academic plans
        </p>
      </div>

      {/* Content Grid */}
      <div className="grid gap-6">
        {/* Available Templates Section */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/15 transition-all">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Available Templates
          </h2>
          <p className="text-muted-foreground">
            Premade academic plan templates will be displayed here.
          </p>
        </div>
      </div>
    </div>
  )
}