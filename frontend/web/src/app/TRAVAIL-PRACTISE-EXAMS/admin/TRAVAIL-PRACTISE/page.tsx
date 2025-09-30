"use client"

import { useState, useMemo } from "react"
import { Edit3, Clock, TrendingUp, CheckCircle, XCircle, AlertTriangle, BookOpen, Filter, Plus, Search } from "lucide-react"
import { practiceAssignments } from "@/app/(features)/LearningActivities/learningActivitiesDummyData"

export default function TravailPractisePage() {
  const [statusFilter, setStatusFilter] = useState("all")
  const [difficultyFilter, setDifficultyFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedAssignment, setSelectedAssignment] = useState<string | null>(null)

  // Calculate stats
  const stats = useMemo(() => {
    const active = practiceAssignments.filter(p => p.status === "Assigned" || p.status === "In Progress").length
    const thisWeekCompleted = practiceAssignments.filter(p => {
      if (p.status !== "Graded" && p.status !== "Submitted") return false
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return new Date(p.submittedAt || p.gradedAt || "") >= weekAgo
    }).length

    const completedWithScores = practiceAssignments.filter(p => p.obtainedMarks !== undefined)
    const averageScore = completedWithScores.length > 0
      ? Math.round(completedWithScores.reduce((sum, p) => sum + ((p.obtainedMarks! / p.totalMarks) * 100), 0) / completedWithScores.length)
      : 0

    const overdue = practiceAssignments.filter(p => p.status === "Overdue").length

    return { active, thisWeekCompleted, averageScore, overdue }
  }, [])

  // Get unique subjects and difficulties
  const { subjects, difficulties } = useMemo(() => {
    const uniqueSubjects = [...new Set(practiceAssignments.map(p => p.subject))].sort()
    const uniqueDifficulties = [...new Set(practiceAssignments.map(p => p.difficulty))].sort()
    return { subjects: uniqueSubjects, difficulties: uniqueDifficulties }
  }, [])

  // Filter assignments
  const filteredAssignments = useMemo(() => {
    return practiceAssignments.filter(assignment => {
      const matchesSearch =
        assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignment.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignment.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignment.educatorName.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === "all" || assignment.status === statusFilter
      const matchesDifficulty = difficultyFilter === "all" || assignment.difficulty === difficultyFilter

      return matchesSearch && matchesStatus && matchesDifficulty
    })
  }, [searchTerm, statusFilter, difficultyFilter])

  // Sort by status priority and due date
  const sortedAssignments = useMemo(() => {
    const statusOrder = { "Overdue": 0, "In Progress": 1, "Assigned": 2, "Submitted": 3, "Graded": 4 }
    return [...filteredAssignments].sort((a, b) => {
      const statusDiff = statusOrder[a.status as keyof typeof statusOrder] - statusOrder[b.status as keyof typeof statusOrder]
      if (statusDiff !== 0) return statusDiff
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    })
  }, [filteredAssignments])

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      "Assigned": { color: "bg-blue-500/20 text-blue-300 border-blue-500/50", icon: <BookOpen className="h-3 w-3" /> },
      "In Progress": { color: "bg-yellow-500/20 text-yellow-300 border-yellow-500/50", icon: <Clock className="h-3 w-3" /> },
      "Submitted": { color: "bg-green-500/20 text-green-300 border-green-500/50", icon: <CheckCircle className="h-3 w-3" /> },
      "Graded": { color: "bg-purple-500/20 text-purple-300 border-purple-500/50", icon: <TrendingUp className="h-3 w-3" /> },
      "Overdue": { color: "bg-red-500/20 text-red-300 border-red-500/50", icon: <AlertTriangle className="h-3 w-3" /> }
    }

    const config = statusConfig[status as keyof typeof statusConfig]
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${config.color}`}>
        {config.icon}
        {status}
      </span>
    )
  }

  const getDifficultyBadge = (difficulty: string) => {
    const colors = {
      Easy: "bg-green-500/20 text-green-300",
      Medium: "bg-yellow-500/20 text-yellow-300",
      Hard: "bg-red-500/20 text-red-300"
    }
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${colors[difficulty as keyof typeof colors]}`}>
        {difficulty}
      </span>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const diffTime = date.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return "Today"
    if (diffDays === 1) return "Tomorrow"
    if (diffDays === -1) return "Yesterday"
    if (diffDays > 0) return `In ${diffDays} days`
    if (diffDays < 0) return `${Math.abs(diffDays)} days ago`

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <div className="min-h-full space-y-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-4">
          <Edit3 className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Practice Assignments</h1>
            <p className="text-muted-foreground">Manage and monitor practice exercises</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/15 transition-all">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-muted-foreground">Active Practices</h3>
            <Clock className="h-5 w-5 text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.active}</p>
          <p className="text-xs text-muted-foreground mt-2">Currently assigned</p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/15 transition-all">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-muted-foreground">Completed</h3>
            <CheckCircle className="h-5 w-5 text-green-400" />
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.thisWeekCompleted}</p>
          <p className="text-xs text-muted-foreground mt-2">This week</p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/15 transition-all">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-muted-foreground">Average Score</h3>
            <TrendingUp className="h-5 w-5 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.averageScore}%</p>
          <p className="text-xs text-muted-foreground mt-2">Overall performance</p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/15 transition-all">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-muted-foreground">Overdue</h3>
            <AlertTriangle className="h-5 w-5 text-red-400" />
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.overdue}</p>
          <p className="text-xs text-muted-foreground mt-2">Need attention</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search assignments by title, subject, topic..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:border-primary text-foreground placeholder-muted-foreground"
              />
            </div>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:border-primary text-foreground"
          >
            <option value="all">All Status</option>
            <option value="Assigned">Assigned</option>
            <option value="In Progress">In Progress</option>
            <option value="Submitted">Submitted</option>
            <option value="Graded">Graded</option>
            <option value="Overdue">Overdue</option>
          </select>

          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="px-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:border-primary text-foreground"
          >
            <option value="all">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>

          <button className="px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg transition-colors flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Assignment
          </button>
        </div>
      </div>

      {/* Assignments List */}
      <div className="space-y-4">
        {sortedAssignments.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20 text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No practice assignments found</h3>
            <p className="text-muted-foreground">No assignments match your current filters.</p>
          </div>
        ) : (
          sortedAssignments.map((assignment) => (
            <div
              key={assignment.id}
              className={`bg-white/10 backdrop-blur-sm rounded-lg border ${
                selectedAssignment === assignment.id ? 'border-primary' : 'border-white/20'
              } hover:bg-white/15 transition-all cursor-pointer`}
              onClick={() => setSelectedAssignment(assignment.id === selectedAssignment ? null : assignment.id)}
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-foreground">{assignment.title}</h3>
                      {getStatusBadge(assignment.status)}
                      {getDifficultyBadge(assignment.difficulty)}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{assignment.description}</p>

                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        <span className="text-primary">{assignment.subject}</span>
                        <span className="text-muted-foreground">- {assignment.topic}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>👨‍🏫</span>
                        <span className="text-muted-foreground">{assignment.educatorName}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span className="text-muted-foreground">{assignment.estimatedTime} min</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dates and Progress */}
                <div className="flex flex-wrap gap-4 text-sm mb-4">
                  <div>
                    <span className="text-muted-foreground">Due: </span>
                    <span className={assignment.status === "Overdue" ? "text-red-400 font-semibold" : "text-foreground"}>
                      {formatDate(assignment.dueDate)}
                    </span>
                  </div>
                  {assignment.submittedAt && (
                    <div>
                      <span className="text-muted-foreground">Submitted: </span>
                      <span className="text-green-400">{formatDate(assignment.submittedAt)}</span>
                    </div>
                  )}
                  {assignment.gradedAt && (
                    <div>
                      <span className="text-muted-foreground">Graded: </span>
                      <span className="text-purple-400">{formatDate(assignment.gradedAt)}</span>
                    </div>
                  )}
                </div>

                {/* Score and Attempts */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Questions: </span>
                      <span className="font-medium text-foreground">{assignment.questions.length}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Total Marks: </span>
                      <span className="font-medium text-foreground">{assignment.totalMarks}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Attempts: </span>
                      <span className="font-medium text-foreground">{assignment.attempts}/{assignment.maxAttempts}</span>
                    </div>
                  </div>
                  {assignment.obtainedMarks !== undefined && (
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary">
                        {assignment.obtainedMarks}/{assignment.totalMarks}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {Math.round((assignment.obtainedMarks / assignment.totalMarks) * 100)}%
                      </div>
                    </div>
                  )}
                </div>

                {/* Progress Bar for Graded Assignments */}
                {assignment.obtainedMarks !== undefined && (
                  <div className="mb-4">
                    <div className="w-full bg-black/30 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all"
                        style={{ width: `${(assignment.obtainedMarks / assignment.totalMarks) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Feedback */}
                {assignment.feedback && (
                  <div className="bg-black/20 rounded p-3 mb-4">
                    <div className="text-sm text-muted-foreground mb-1">Feedback:</div>
                    <div className="text-sm text-foreground">{assignment.feedback}</div>
                  </div>
                )}

                {/* Expanded Details */}
                {selectedAssignment === assignment.id && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    {/* Questions Preview */}
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold mb-3">Questions ({assignment.questions.length})</h4>
                      <div className="space-y-3">
                        {assignment.questions.slice(0, 3).map((question, idx) => (
                          <div key={question.id} className="bg-black/20 rounded p-3">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <div className="text-sm font-medium text-foreground mb-1">Q{idx + 1}. {question.question}</div>
                                <div className="text-xs text-muted-foreground">
                                  Type: {question.type} | Marks: {question.marks}
                                </div>
                              </div>
                              {question.obtainedMarks !== undefined && (
                                <div className="text-xs font-semibold text-foreground">
                                  {question.obtainedMarks}/{question.marks}
                                </div>
                              )}
                            </div>
                            {question.studentAnswer && (
                              <div className="text-xs">
                                <span className="text-muted-foreground">Answer: </span>
                                <span className={question.studentAnswer === question.correctAnswer ? "text-green-400" : "text-red-400"}>
                                  {question.studentAnswer}
                                </span>
                              </div>
                            )}
                          </div>
                        ))}
                        {assignment.questions.length > 3 && (
                          <div className="text-xs text-muted-foreground text-center">
                            +{assignment.questions.length - 3} more questions
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      {assignment.status === "Assigned" || assignment.status === "In Progress" ? (
                        <button className="flex-1 px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg transition-colors">
                          Start Practice
                        </button>
                      ) : (
                        <button className="flex-1 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg transition-colors">
                          View Submission
                        </button>
                      )}
                      <button className="flex-1 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded-lg transition-colors">
                        View Details
                      </button>
                      <button className="flex-1 px-4 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 rounded-lg transition-colors">
                        Edit Assignment
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