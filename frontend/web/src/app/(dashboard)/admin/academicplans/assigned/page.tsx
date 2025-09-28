"use client"

import { useState, useMemo } from "react"
import { BookOpen, Clock, Users, AlertCircle, CheckCircle, XCircle, Search, Filter, User, TrendingUp } from "lucide-react"
import { assignedPlans } from "@/app/(features)/AcademicPlans/academicPlansDummyData"

export default function AssignedPlansPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")

  // Calculate stats
  const stats = useMemo(() => {
    const total = assignedPlans.length
    const inProgress = assignedPlans.filter(p => p.status === "In Progress").length
    const completed = assignedPlans.filter(p => p.status === "Completed").length
    const overdue = assignedPlans.filter(p => p.status === "Overdue").length
    const notStarted = assignedPlans.filter(p => p.status === "Not Started").length
    const avgProgress = Math.round(
      assignedPlans.reduce((sum, p) => sum + p.progress, 0) / assignedPlans.length
    )

    return { total, inProgress, completed, overdue, notStarted, avgProgress }
  }, [])

  // Get unique educators
  const educators = useMemo(() => {
    const uniqueEducators = [...new Set(assignedPlans.map(p => p.educatorName))]
    return uniqueEducators.sort()
  }, [])

  // Filter plans
  const filteredPlans = useMemo(() => {
    return assignedPlans.filter(plan => {
      const matchesSearch =
        plan.planTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.learnerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.educatorName.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === "all" || plan.status === statusFilter
      const matchesPriority = priorityFilter === "all" || plan.priority === priorityFilter

      return matchesSearch && matchesStatus && matchesPriority
    })
  }, [searchTerm, statusFilter, priorityFilter])

  // Sort by priority and due date
  const sortedPlans = useMemo(() => {
    const priorityOrder = { High: 0, Medium: 1, Low: 2 }
    const statusOrder = { Overdue: 0, "In Progress": 1, "Not Started": 2, Completed: 3 }

    return [...filteredPlans].sort((a, b) => {
      // First sort by status (overdue first)
      if (a.status !== b.status) {
        return statusOrder[a.status as keyof typeof statusOrder] - statusOrder[b.status as keyof typeof statusOrder]
      }
      // Then by priority
      return priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder]
    })
  }, [filteredPlans])

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      "In Progress": { color: "bg-blue-500/20 text-blue-300 border-blue-500/50", icon: <Clock className="h-3 w-3" /> },
      "Completed": { color: "bg-green-500/20 text-green-300 border-green-500/50", icon: <CheckCircle className="h-3 w-3" /> },
      "Not Started": { color: "bg-gray-500/20 text-gray-400 border-gray-500/50", icon: <AlertCircle className="h-3 w-3" /> },
      "Overdue": { color: "bg-red-500/20 text-red-300 border-red-500/50", icon: <XCircle className="h-3 w-3" /> }
    }

    const config = statusConfig[status as keyof typeof statusConfig]
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${config.color}`}>
        {config.icon}
        {status}
      </span>
    )
  }

  const getPriorityBadge = (priority: string) => {
    const colors = {
      High: "bg-red-500/20 text-red-300",
      Medium: "bg-yellow-500/20 text-yellow-300",
      Low: "bg-green-500/20 text-green-300"
    }

    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${colors[priority as keyof typeof colors]}`}>
        {priority}
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
    if (diffDays > 0 && diffDays <= 7) return `In ${diffDays} days`
    if (diffDays < 0 && diffDays >= -7) return `${Math.abs(diffDays)} days ago`

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <div className="min-h-full">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-4">
          <BookOpen className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Assigned Academic Plans</h1>
            <p className="text-muted-foreground">Track and manage student plan assignments</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
          <div className="text-2xl font-bold">{stats.total}</div>
          <div className="text-xs text-muted-foreground">Total Assigned</div>
        </div>
        <div className="bg-blue-500/10 backdrop-blur-sm rounded-lg p-4 border border-blue-500/30">
          <div className="text-2xl font-bold text-blue-300">{stats.inProgress}</div>
          <div className="text-xs text-blue-200">In Progress</div>
        </div>
        <div className="bg-green-500/10 backdrop-blur-sm rounded-lg p-4 border border-green-500/30">
          <div className="text-2xl font-bold text-green-300">{stats.completed}</div>
          <div className="text-xs text-green-200">Completed</div>
        </div>
        <div className="bg-red-500/10 backdrop-blur-sm rounded-lg p-4 border border-red-500/30">
          <div className="text-2xl font-bold text-red-300">{stats.overdue}</div>
          <div className="text-xs text-red-200">Overdue</div>
        </div>
        <div className="bg-gray-500/10 backdrop-blur-sm rounded-lg p-4 border border-gray-500/30">
          <div className="text-2xl font-bold text-gray-300">{stats.notStarted}</div>
          <div className="text-xs text-gray-200">Not Started</div>
        </div>
        <div className="bg-purple-500/10 backdrop-blur-sm rounded-lg p-4 border border-purple-500/30">
          <div className="text-2xl font-bold text-purple-300">{stats.avgProgress}%</div>
          <div className="text-xs text-purple-200">Avg Progress</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:border-primary text-foreground"
          >
            <option value="all">All Status</option>
            <option value="In Progress">In Progress</option>
            <option value="Not Started">Not Started</option>
            <option value="Completed">Completed</option>
            <option value="Overdue">Overdue</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:border-primary text-foreground"
          >
            <option value="all">All Priorities</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>
        </div>
      </div>

      {/* Assignments List */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-semibold">Active Assignments ({sortedPlans.length})</h2>
        </div>

        <div className="divide-y divide-white/10">
          {sortedPlans.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No assignments found matching your criteria
            </div>
          ) : (
            sortedPlans.map((assignment) => (
              <div key={assignment.id} className="p-6 hover:bg-white/5 transition-colors">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  {/* Assignment Info */}
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{assignment.planTitle}</h3>
                          {getStatusBadge(assignment.status)}
                          {getPriorityBadge(assignment.priority)}
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            <span className="text-blue-300">{assignment.learnerName}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>Educator: {assignment.educatorName}</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm mb-3">
                          <div>
                            <span className="text-muted-foreground">Assigned: </span>
                            <span>{formatDate(assignment.assignedDate)}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Due: </span>
                            <span className={assignment.status === "Overdue" ? "text-red-400 font-semibold" : ""}>
                              {formatDate(assignment.dueDate)}
                            </span>
                          </div>
                          {assignment.lastAccessedAt && (
                            <div>
                              <span className="text-muted-foreground">Last Accessed: </span>
                              <span>{formatDate(assignment.lastAccessedAt)}</span>
                            </div>
                          )}
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-muted-foreground">
                              Progress: {assignment.completedTopics.length} of {assignment.totalTopics} topics
                            </span>
                            <span className="text-sm font-semibold">{assignment.progress}%</span>
                          </div>
                          <div className="w-full bg-black/30 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all"
                              style={{ width: `${assignment.progress}%` }}
                            />
                          </div>
                        </div>

                        {/* Notes */}
                        {assignment.notes && (
                          <div className="text-sm text-muted-foreground italic bg-white/5 rounded p-2">
                            Note: {assignment.notes}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg transition-colors">
                      View Details
                    </button>
                    <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                      Message Learner
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}