"use client"

import { useState, useMemo } from "react"
import { Home, Clock, CheckCircle, AlertTriangle, Award, FileText, Calendar, Users, Plus, Search, Filter } from "lucide-react"
import { homeTasks } from "@/app/(features)/LearningActivities/learningActivitiesDummyData"

export default function HomeTasksPage() {
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTask, setSelectedTask] = useState<string | null>(null)

  // Calculate stats
  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0]
    const assignedToday = homeTasks.filter(task => task.assignedDate.split('T')[0] === today).length
    const pending = homeTasks.filter(task => task.status === "Pending").length
    const submitted = homeTasks.filter(task => task.status === "Submitted").length

    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    const gradedThisWeek = homeTasks.filter(task => {
      if (task.status !== "Graded") return false
      return new Date(task.gradedAt || "") >= weekAgo
    }).length

    return { assignedToday, pending, submitted, gradedThisWeek }
  }, [])

  // Get unique types and priorities
  const { types, priorities } = useMemo(() => {
    const uniqueTypes = [...new Set(homeTasks.map(t => t.type))].sort()
    const uniquePriorities = [...new Set(homeTasks.map(t => t.priority))].sort()
    return { types: uniqueTypes, priorities: uniquePriorities }
  }, [])

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return homeTasks.filter(task => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.educatorName.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === "all" || task.status === statusFilter
      const matchesType = typeFilter === "all" || task.type === typeFilter
      const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter

      return matchesSearch && matchesStatus && matchesType && matchesPriority
    })
  }, [searchTerm, statusFilter, typeFilter, priorityFilter])

  // Sort by status priority and due date
  const sortedTasks = useMemo(() => {
    const statusOrder = { "Overdue": 0, "Assigned Today": 1, "Pending": 2, "Submitted": 3, "Graded": 4 }
    const priorityOrder = { "High": 0, "Medium": 1, "Low": 2 }

    return [...filteredTasks].sort((a, b) => {
      const statusDiff = statusOrder[a.status as keyof typeof statusOrder] - statusOrder[b.status as keyof typeof statusOrder]
      if (statusDiff !== 0) return statusDiff

      const priorityDiff = priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder]
      if (priorityDiff !== 0) return priorityDiff

      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    })
  }, [filteredTasks])

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      "Assigned Today": { color: "bg-blue-500/20 text-blue-300 border-blue-500/50", icon: <Calendar className="h-3 w-3" /> },
      "Pending": { color: "bg-yellow-500/20 text-yellow-300 border-yellow-500/50", icon: <Clock className="h-3 w-3" /> },
      "Submitted": { color: "bg-green-500/20 text-green-300 border-green-500/50", icon: <CheckCircle className="h-3 w-3" /> },
      "Graded": { color: "bg-purple-500/20 text-purple-300 border-purple-500/50", icon: <Award className="h-3 w-3" /> },
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

  const getTypeBadge = (type: string) => {
    const typeColors = {
      "Homework": "bg-blue-500/20 text-blue-300",
      "Assignment": "bg-green-500/20 text-green-300",
      "Project": "bg-purple-500/20 text-purple-300",
      "Reading": "bg-yellow-500/20 text-yellow-300",
      "Research": "bg-red-500/20 text-red-300"
    }
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${typeColors[type as keyof typeof typeColors] || typeColors["Homework"]}`}>
        {type}
      </span>
    )
  }

  const getPriorityColor = (priority: string) => {
    const colors = {
      High: "text-red-400",
      Medium: "text-yellow-400",
      Low: "text-green-400"
    }
    return colors[priority as keyof typeof colors]
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
    <div className="min-h-full p-6 space-y-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-4">
          <Home className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Home Tasks</h1>
            <p className="text-muted-foreground">Manage homework and home assignments</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/15 transition-all">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Assigned Today</h3>
            <Calendar className="h-5 w-5 text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.assignedToday}</p>
          <p className="text-sm text-muted-foreground">New assignments</p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/15 transition-all">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Pending</h3>
            <Clock className="h-5 w-5 text-yellow-400" />
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.pending}</p>
          <p className="text-sm text-muted-foreground">Awaiting submission</p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/15 transition-all">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Submitted</h3>
            <CheckCircle className="h-5 w-5 text-green-400" />
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.submitted}</p>
          <p className="text-sm text-muted-foreground">Ready for review</p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/15 transition-all">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Graded</h3>
            <Award className="h-5 w-5 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.gradedThisWeek}</p>
          <p className="text-sm text-muted-foreground">Completed this week</p>
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
                placeholder="Search tasks by title, subject, educator..."
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
            <option value="Assigned Today">Assigned Today</option>
            <option value="Pending">Pending</option>
            <option value="Submitted">Submitted</option>
            <option value="Graded">Graded</option>
            <option value="Overdue">Overdue</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:border-primary text-foreground"
          >
            <option value="all">All Types</option>
            {types.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
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

          <button className="px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg transition-colors flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Task
          </button>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {sortedTasks.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No home tasks found</h3>
            <p className="text-muted-foreground">No tasks match your current filters.</p>
          </div>
        ) : (
          sortedTasks.map((task) => (
            <div
              key={task.id}
              className={`bg-white/10 backdrop-blur-sm rounded-lg border ${
                selectedTask === task.id ? 'border-primary' : 'border-white/20'
              } hover:bg-white/15 transition-all cursor-pointer`}
              onClick={() => setSelectedTask(task.id === selectedTask ? null : task.id)}
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-foreground">{task.title}</h3>
                      {getStatusBadge(task.status)}
                      {getTypeBadge(task.type)}
                      <span className={`text-sm font-medium ${getPriorityColor(task.priority)}`}>
                        {task.priority} Priority
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{task.description}</p>

                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        <span className="text-primary">{task.subject}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>👨‍🏫</span>
                        <span>{task.educatorName}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{task.estimatedHours}h estimated</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{task.assignedTo.length} students</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dates and Progress */}
                <div className="flex flex-wrap gap-4 text-sm mb-4">
                  <div>
                    <span className="text-muted-foreground">Assigned: </span>
                    <span className="text-foreground">{formatDate(task.assignedDate)}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Due: </span>
                    <span className={task.status === "Overdue" ? "text-red-400 font-semibold" : "text-foreground"}>
                      {formatDate(task.dueDate)}
                    </span>
                  </div>
                  {task.submittedAt && (
                    <div>
                      <span className="text-muted-foreground">Submitted: </span>
                      <span className="text-green-400">{formatDate(task.submittedAt)}</span>
                    </div>
                  )}
                  {task.gradedAt && (
                    <div>
                      <span className="text-muted-foreground">Graded: </span>
                      <span className="text-purple-400">{formatDate(task.gradedAt)}</span>
                    </div>
                  )}
                </div>

                {/* Score and Time */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Total Marks: </span>
                      <span className="font-medium">{task.totalMarks}</span>
                    </div>
                    {task.actualHours && (
                      <div className="text-sm">
                        <span className="text-muted-foreground">Actual Time: </span>
                        <span className="font-medium">{task.actualHours}h</span>
                      </div>
                    )}
                  </div>
                  {task.obtainedMarks !== undefined && task.grade && (
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary">
                        {task.obtainedMarks}/{task.totalMarks}
                      </div>
                      <div className="text-sm">
                        <span className={`font-bold ${
                          task.grade.startsWith('A') ? 'text-green-400' :
                          task.grade.startsWith('B') ? 'text-blue-400' :
                          task.grade.startsWith('C') ? 'text-yellow-400' : 'text-red-400'
                        }`}>
                          Grade: {task.grade}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Progress Bar for Graded Tasks */}
                {task.obtainedMarks !== undefined && (
                  <div className="mb-4">
                    <div className="w-full bg-black/30 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all"
                        style={{ width: `${(task.obtainedMarks / task.totalMarks) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Feedback */}
                {task.feedback && (
                  <div className="bg-black/20 rounded p-3 mb-4">
                    <div className="text-sm text-muted-foreground mb-1">Feedback:</div>
                    <div className="text-sm">{task.feedback}</div>
                  </div>
                )}

                {/* Expanded Details */}
                {selectedTask === task.id && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    {/* Instructions */}
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold mb-2">Instructions</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {task.instructions.map((instruction, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            <span>{instruction}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Resources */}
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold mb-2">Resources</h4>
                      <div className="flex flex-wrap gap-2">
                        {task.resources.map((resource, idx) => (
                          <span key={idx} className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-md">
                            📚 {resource}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Submissions */}
                    {task.submissions && task.submissions.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold mb-3">Submissions ({task.submissions.length})</h4>
                        <div className="space-y-2">
                          {task.submissions.map((submission) => (
                            <div key={submission.studentId} className="bg-black/20 rounded p-3">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{submission.studentName}</span>
                                  {submission.lateSubmission && (
                                    <span className="px-2 py-1 bg-red-500/20 text-red-300 text-xs rounded">
                                      Late
                                    </span>
                                  )}
                                  {submission.grade && (
                                    <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded">
                                      {submission.grade}
                                    </span>
                                  )}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {formatDate(submission.submittedAt)}
                                </div>
                              </div>
                              {submission.notes && (
                                <div className="text-xs text-muted-foreground mb-2">
                                  <strong>Notes:</strong> {submission.notes}
                                </div>
                              )}
                              {submission.feedback && (
                                <div className="text-xs text-muted-foreground">
                                  <strong>Feedback:</strong> {submission.feedback}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2">
                      {task.status === "Pending" || task.status === "Assigned Today" ? (
                        <button className="flex-1 px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg transition-colors">
                          Submit Task
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
                        Edit Task
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