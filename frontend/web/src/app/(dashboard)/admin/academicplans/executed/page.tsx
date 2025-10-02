"use client"

import { useState, useMemo } from "react"
import { CheckCircle, Clock, TrendingUp, Award, User, Calendar, BarChart } from "lucide-react"
import { executedPlans } from "@/app/(features)/AcademicPlans/academicPlansDummyData"

export default function ExecutedPlansPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [completionFilter, setCompletionFilter] = useState("all")
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

  // Calculate statistics
  const stats = useMemo(() => {
    const totalExecuted = executedPlans.length
    const completed = executedPlans.filter(p => p.completedAt).length
    const inProgress = executedPlans.filter(p => !p.completedAt).length
    const avgCompletion = Math.round(
      executedPlans.reduce((sum, p) => sum + p.completionRate, 0) / executedPlans.length
    )
    const totalHours = executedPlans.reduce((sum, p) => sum + p.actualHours, 0)
    const avgScore = executedPlans
      .filter(p => p.topicsCompleted.some(t => t.score !== undefined))
      .reduce((acc, p) => {
        const scores = p.topicsCompleted.filter(t => t.score).map(t => t.score!)
        const avg = scores.reduce((sum, s) => sum + s, 0) / scores.length
        return acc + avg
      }, 0) / executedPlans.filter(p => p.topicsCompleted.some(t => t.score !== undefined)).length

    return {
      totalExecuted,
      completed,
      inProgress,
      avgCompletion,
      totalHours,
      avgScore: Math.round(avgScore)
    }
  }, [])

  // Filter executed plans
  const filteredPlans = useMemo(() => {
    return executedPlans.filter(plan => {
      const matchesSearch =
        plan.planTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.learnerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.educatorName.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesCompletion =
        completionFilter === "all" ||
        (completionFilter === "completed" && plan.completedAt) ||
        (completionFilter === "in-progress" && !plan.completedAt)

      return matchesSearch && matchesCompletion
    })
  }, [searchTerm, completionFilter])

  // Sort by completion rate and date
  const sortedPlans = useMemo(() => {
    return [...filteredPlans].sort((a, b) => {
      // Completed plans first
      if (a.completedAt && !b.completedAt) return -1
      if (!a.completedAt && b.completedAt) return 1
      // Then by completion rate
      return b.completionRate - a.completionRate
    })
  }, [filteredPlans])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getGradeBadge = (grade: string | undefined) => {
    if (!grade) return null
    const gradeColors = {
      'A': 'bg-green-500/20 text-green-300 border-green-500/50',
      'B': 'bg-blue-500/20 text-blue-300 border-blue-500/50',
      'C': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50',
      'D': 'bg-orange-500/20 text-orange-300 border-orange-500/50',
      'F': 'bg-red-500/20 text-red-300 border-red-500/50'
    }

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-bold border ${gradeColors[grade as keyof typeof gradeColors] || gradeColors['C']}`}>
        Grade: {grade}
      </span>
    )
  }

  const getCompletionColor = (rate: number) => {
    if (rate === 100) return 'from-green-500 to-green-400'
    if (rate >= 80) return 'from-blue-500 to-blue-400'
    if (rate >= 60) return 'from-yellow-500 to-yellow-400'
    if (rate >= 40) return 'from-orange-500 to-orange-400'
    return 'from-red-500 to-red-400'
  }

  return (
    <div className="min-h-full">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-4">
          <CheckCircle className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Executed Academic Plans</h1>
            <p className="text-muted-foreground">Review completed and in-progress plan executions</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
          <div className="text-2xl font-bold">{stats.totalExecuted}</div>
          <div className="text-xs text-muted-foreground">Total Executed</div>
        </div>
        <div className="bg-green-500/10 backdrop-blur-sm rounded-lg p-4 border border-green-500/30">
          <div className="text-2xl font-bold text-green-300">{stats.completed}</div>
          <div className="text-xs text-green-200">Completed</div>
        </div>
        <div className="bg-blue-500/10 backdrop-blur-sm rounded-lg p-4 border border-blue-500/30">
          <div className="text-2xl font-bold text-blue-300">{stats.inProgress}</div>
          <div className="text-xs text-blue-200">In Progress</div>
        </div>
        <div className="bg-purple-500/10 backdrop-blur-sm rounded-lg p-4 border border-purple-500/30">
          <div className="text-2xl font-bold text-purple-300">{stats.avgCompletion}%</div>
          <div className="text-xs text-purple-200">Avg Completion</div>
        </div>
        <div className="bg-yellow-500/10 backdrop-blur-sm rounded-lg p-4 border border-yellow-500/30">
          <div className="text-2xl font-bold text-yellow-300">{stats.totalHours}h</div>
          <div className="text-xs text-yellow-200">Total Hours</div>
        </div>
        <div className="bg-cyan-500/10 backdrop-blur-sm rounded-lg p-4 border border-cyan-500/30">
          <div className="text-2xl font-bold text-cyan-300">{stats.avgScore}%</div>
          <div className="text-xs text-cyan-200">Avg Score</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <BarChart className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by plan, learner, or educator..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:border-primary text-foreground placeholder-muted-foreground"
              />
            </div>
          </div>

          <select
            value={completionFilter}
            onChange={(e) => setCompletionFilter(e.target.value)}
            className="px-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:border-primary text-foreground"
          >
            <option value="all">All Executions</option>
            <option value="completed">Completed</option>
            <option value="in-progress">In Progress</option>
          </select>
        </div>
      </div>

      {/* Executed Plans List */}
      <div className="space-y-6">
        {sortedPlans.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20 text-center text-muted-foreground">
            No executed plans found matching your criteria
          </div>
        ) : (
          sortedPlans.map((execution) => (
            <div
              key={execution.id}
              className={`bg-white/10 backdrop-blur-sm rounded-lg border ${
                selectedPlan === execution.id ? 'border-primary' : 'border-white/20'
              } hover:bg-white/15 transition-all cursor-pointer`}
              onClick={() => setSelectedPlan(execution.id === selectedPlan ? null : execution.id)}
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{execution.planTitle}</h3>
                    <div className="flex flex-wrap gap-3 text-sm">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-blue-300">{execution.learnerName}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>Educator: {execution.educatorName}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{execution.actualHours} hours</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getGradeBadge(execution.overallGrade)}
                    {execution.completedAt ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-500/20 text-green-300 border border-green-500/50 rounded-full text-sm">
                        <CheckCircle className="h-4 w-4" />
                        Completed
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-500/20 text-blue-300 border border-blue-500/50 rounded-full text-sm">
                        <Clock className="h-4 w-4" />
                        In Progress
                      </span>
                    )}
                  </div>
                </div>

                {/* Dates */}
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                  <div>
                    <span>Started: </span>
                    <span className="text-foreground">{formatDate(execution.startedAt)}</span>
                  </div>
                  {execution.completedAt && (
                    <div>
                      <span>Completed: </span>
                      <span className="text-foreground">{formatDate(execution.completedAt)}</span>
                    </div>
                  )}
                </div>

                {/* Completion Progress */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Overall Completion</span>
                    <span className="text-lg font-bold">{execution.completionRate}%</span>
                  </div>
                  <div className="w-full bg-black/30 rounded-full h-3">
                    <div
                      className={`bg-gradient-to-r ${getCompletionColor(execution.completionRate)} h-3 rounded-full transition-all`}
                      style={{ width: `${execution.completionRate}%` }}
                    />
                  </div>
                </div>

                {/* Topics Progress */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold mb-2">Topics Completed ({execution.topicsCompleted.length})</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {execution.topicsCompleted.map((topic, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-white/5 rounded px-3 py-2">
                        <span className="text-sm">{topic.topic}</span>
                        {topic.score !== undefined && (
                          <span className={`text-sm font-bold ${
                            topic.score >= 90 ? 'text-green-400' :
                            topic.score >= 80 ? 'text-blue-400' :
                            topic.score >= 70 ? 'text-yellow-400' : 'text-orange-400'
                          }`}>
                            {topic.score}%
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Expanded Details */}
                {selectedPlan === execution.id && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    {/* Assessment Scores */}
                    {execution.assessmentScores && execution.assessmentScores.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold mb-2">Assessment Scores</h4>
                        <div className="space-y-2">
                          {execution.assessmentScores.map((assessment, idx) => (
                            <div key={idx} className="flex items-center justify-between bg-white/5 rounded px-3 py-2">
                              <span className="text-sm">{assessment.criteria}</span>
                              <div className="flex items-center gap-2">
                                <div className="w-32 bg-black/30 rounded-full h-2">
                                  <div
                                    className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full"
                                    style={{ width: `${(assessment.score / assessment.maxScore) * 100}%` }}
                                  />
                                </div>
                                <span className="text-sm font-semibold">
                                  {assessment.score}/{assessment.maxScore}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Feedback */}
                    {execution.feedback && (
                      <div className="bg-white/5 rounded p-4">
                        <h4 className="text-sm font-semibold mb-2">Educator Feedback</h4>
                        <p className="text-sm text-muted-foreground">{execution.feedback}</p>
                      </div>
                    )}
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