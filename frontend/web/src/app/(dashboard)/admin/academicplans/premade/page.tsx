"use client"

import { useState, useMemo } from "react"
import { BookOpen, Clock, Users, Tag, Search, Filter, Plus, Edit, Copy, Trash2, Eye } from "lucide-react"
import { premadePlans } from "@/app/(features)/AcademicPlans/academicPlansDummyData"

export default function PremadePlansPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [subjectFilter, setSubjectFilter] = useState("all")
  const [difficultyFilter, setDifficultyFilter] = useState("all")
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

  // Get unique subjects and calculate stats
  const { subjects, stats } = useMemo(() => {
    const uniqueSubjects = [...new Set(premadePlans.map(p => p.subject))].sort()
    const totalPlans = premadePlans.length
    const totalUsage = premadePlans.reduce((sum, p) => sum + p.usageCount, 0)
    const publicPlans = premadePlans.filter(p => p.isPublic).length

    return {
      subjects: uniqueSubjects,
      stats: { totalPlans, totalUsage, publicPlans }
    }
  }, [])

  // Filter plans
  const filteredPlans = useMemo(() => {
    return premadePlans.filter(plan => {
      const matchesSearch =
        plan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesSubject = subjectFilter === "all" || plan.subject === subjectFilter
      const matchesDifficulty = difficultyFilter === "all" || plan.difficulty === difficultyFilter

      return matchesSearch && matchesSubject && matchesDifficulty
    })
  }, [searchTerm, subjectFilter, difficultyFilter])

  const getDifficultyBadge = (difficulty: string) => {
    const colors = {
      Beginner: "bg-green-500/20 text-green-300 border-green-500/50",
      Intermediate: "bg-yellow-500/20 text-yellow-300 border-yellow-500/50",
      Advanced: "bg-red-500/20 text-red-300 border-red-500/50"
    }

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${colors[difficulty as keyof typeof colors]}`}>
        {difficulty}
      </span>
    )
  }

  return (
    <div className="min-h-full">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-2">
          <BookOpen className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Premade Academic Plans</h1>
            <p className="text-muted-foreground">Browse and manage template academic plans</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <span className="text-muted-foreground">Total Plans</span>
            <BookOpen className="h-5 w-5 text-primary" />
          </div>
          <div className="text-2xl font-bold">{stats.totalPlans}</div>
          <div className="text-xs text-muted-foreground mt-2">Available templates</div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <span className="text-muted-foreground">Total Usage</span>
            <Users className="h-5 w-5 text-secondary" />
          </div>
          <div className="text-2xl font-bold">{stats.totalUsage}</div>
          <div className="text-xs text-muted-foreground mt-2">Times used by learners</div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <span className="text-muted-foreground">Public Plans</span>
            <Eye className="h-5 w-5 text-accent" />
          </div>
          <div className="text-2xl font-bold">{stats.publicPlans}</div>
          <div className="text-xs text-muted-foreground mt-2">Shared with community</div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search plans by title, description, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:border-primary text-foreground placeholder-muted-foreground"
              />
            </div>
          </div>

          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="px-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:border-primary text-foreground"
          >
            <option value="all">All Subjects</option>
            {subjects.map(subject => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>

          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="px-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:border-primary text-foreground"
          >
            <option value="all">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>

          <button className="px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg transition-colors flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create New Plan
          </button>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredPlans.length === 0 ? (
          <div className="col-span-2 bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20 text-center text-muted-foreground">
            No plans found matching your criteria
          </div>
        ) : (
          filteredPlans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white/10 backdrop-blur-sm rounded-lg border ${
                selectedPlan === plan.id ? 'border-primary' : 'border-white/20'
              } hover:bg-white/15 transition-all cursor-pointer`}
              onClick={() => setSelectedPlan(plan.id === selectedPlan ? null : plan.id)}
            >
              <div className="p-6">
                {/* Plan Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-2">{plan.title}</h3>
                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                  </div>
                  {getDifficultyBadge(plan.difficulty)}
                </div>

                {/* Plan Metadata */}
                <div className="flex flex-wrap gap-4 mb-4 text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <BookOpen className="h-4 w-4" />
                    <span>{plan.subject}</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{plan.duration}</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <span>⏱️</span>
                    <span>{plan.estimatedHours}h</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{plan.usageCount} uses</span>
                  </div>
                </div>

                {/* Grade Level */}
                <div className="mb-4">
                  <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-md text-sm">
                    {plan.gradeLevel}
                  </span>
                </div>

                {/* Topics */}
                <div className="mb-4">
                  <div className="text-xs text-muted-foreground mb-2">Topics Covered:</div>
                  <div className="flex flex-wrap gap-2">
                    {plan.topics.slice(0, 3).map((topic, idx) => (
                      <span key={idx} className="px-2 py-1 bg-white/10 text-xs rounded-md">
                        {topic}
                      </span>
                    ))}
                    {plan.topics.length > 3 && (
                      <span className="px-2 py-1 text-xs text-muted-foreground">
                        +{plan.topics.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                {selectedPlan === plan.id && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    {/* Objectives */}
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold mb-2">Learning Objectives:</h4>
                      <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                        {plan.objectives.map((obj, idx) => (
                          <li key={idx}>{obj}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Resources */}
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold mb-2">Resources:</h4>
                      <div className="flex flex-wrap gap-2">
                        {plan.resources.map((resource, idx) => (
                          <span key={idx} className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-md">
                            📚 {resource}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {plan.tags.map((tag, idx) => (
                          <span key={idx} className="flex items-center gap-1 px-2 py-1 bg-white/5 text-xs rounded-md">
                            <Tag className="h-3 w-3" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 mt-4">
                      <button className="flex-1 px-3 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg transition-colors flex items-center justify-center gap-2 text-sm">
                        <Eye className="h-4 w-4" />
                        Preview
                      </button>
                      <button className="flex-1 px-3 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm">
                        <Copy className="h-4 w-4" />
                        Duplicate
                      </button>
                      <button className="flex-1 px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm">
                        <Edit className="h-4 w-4" />
                        Edit
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}