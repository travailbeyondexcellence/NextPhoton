"use client"

import { useState, useMemo, useEffect } from "react"
import { Home, Clock, CheckCircle, AlertTriangle, Award, FileText, Calendar, Users, Plus, Search, Filter, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

// Define HomeTask interface
interface HomeTask {
  id: string
  title: string
  description: string
  subject: string
  type: "Homework" | "Assignment" | "Project" | "Reading" | "Research"
  assignedTo: string[]
  assignedBy: string
  educatorName: string
  assignedDate: string
  dueDate: string
  submittedAt?: string
  gradedAt?: string
  status: "Assigned Today" | "Pending" | "Submitted" | "Graded" | "Overdue"
  priority: "High" | "Medium" | "Low"
  estimatedHours: number
  actualHours?: number
  resources: string[]
  instructions: string[]
  submissions?: Array<{
    studentId: string
    studentName: string
    submittedAt: string
    files: string[]
    notes?: string
    lateSubmission: boolean
    grade?: string
    marks?: number
    feedback?: string
  }>
  totalMarks: number
  obtainedMarks?: number
  grade?: string
  feedback?: string
}

export default function HomeTasksPage() {
  const [tasks, setTasks] = useState<HomeTask[]>([])
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTask, setSelectedTask] = useState<string | null>(null)
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null)
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    subject: "",
    type: "Homework" as HomeTask["type"],
    priority: "Medium" as HomeTask["priority"],
    estimatedHours: "",
    totalMarks: "",
    dueDate: "",
    instructions: "",
    resources: ""
  })

  // Load tasks from JSON on mount
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const response = await fetch('/api/home-tasks')
        const result = await response.json()
        if (result.success) {
          setTasks(result.data)
        } else {
          throw new Error(result.message)
        }
      } catch (err) {
        console.error('Error loading tasks:', err)
        toast.error('Failed to load tasks')
      }
    }
    loadTasks()
  }, [])

  // CRUD Handlers
  const handleOpenCreate = () => {
    setIsEditMode(false)
    setEditingTaskId(null)
    setTaskForm({
      title: "",
      description: "",
      subject: "",
      type: "Homework",
      priority: "Medium",
      estimatedHours: "",
      totalMarks: "",
      dueDate: "",
      instructions: "",
      resources: ""
    })
    setIsCreateTaskOpen(true)
  }

  const handleOpenEdit = (task: HomeTask) => {
    setIsEditMode(true)
    setEditingTaskId(task.id)
    setTaskForm({
      title: task.title,
      description: task.description,
      subject: task.subject,
      type: task.type,
      priority: task.priority,
      estimatedHours: task.estimatedHours.toString(),
      totalMarks: task.totalMarks.toString(),
      dueDate: task.dueDate.split('T')[0],
      instructions: task.instructions.join('\n'),
      resources: task.resources.join(', ')
    })
    setIsCreateTaskOpen(true)
  }

  const handleSubmit = async () => {
    // Validate required fields
    if (!taskForm.title || !taskForm.subject || !taskForm.dueDate) {
      toast.error('Please fill in all required fields')
      return
    }

    const newTask: HomeTask = {
      id: isEditMode ? editingTaskId! : `ht${String(tasks.length + 1).padStart(3, '0')}`,
      title: taskForm.title,
      description: taskForm.description,
      subject: taskForm.subject,
      type: taskForm.type,
      priority: taskForm.priority,
      estimatedHours: parseInt(taskForm.estimatedHours) || 0,
      totalMarks: parseInt(taskForm.totalMarks) || 0,
      dueDate: new Date(taskForm.dueDate).toISOString(),
      assignedDate: new Date().toISOString(),
      assignedTo: [],
      assignedBy: "current_user",
      educatorName: "Current Educator",
      status: "Assigned Today",
      instructions: taskForm.instructions.split('\n').filter(i => i.trim()),
      resources: taskForm.resources.split(',').map(r => r.trim()).filter(r => r)
    }

    try {
      let updatedTasks: HomeTask[]
      if (isEditMode) {
        updatedTasks = tasks.map(t => t.id === editingTaskId ? { ...t, ...newTask } : t)
      } else {
        updatedTasks = [...tasks, newTask]
      }

      // Call API to update JSON file
      const response = await fetch('/api/home-tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: updatedTasks })
      })

      if (!response.ok) throw new Error('Failed to save task')

      setTasks(updatedTasks)
      setIsCreateTaskOpen(false)
      toast.success(isEditMode ? 'Task updated successfully' : 'Task created successfully')
    } catch (error) {
      console.error('Error saving task:', error)
      toast.error('Failed to save task')
    }
  }

  const handleDeleteTask = async (taskId: string, taskTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${taskTitle}"?`)) return

    try {
      const updatedTasks = tasks.filter(t => t.id !== taskId)

      const response = await fetch('/api/home-tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: updatedTasks })
      })

      if (!response.ok) throw new Error('Failed to delete task')

      setTasks(updatedTasks)
      toast.success('Task deleted successfully')
    } catch (error) {
      console.error('Error deleting task:', error)
      toast.error('Failed to delete task')
    }
  }

  // Calculate stats
  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0]
    const assignedToday = tasks.filter(task => task.assignedDate.split('T')[0] === today).length
    const pending = tasks.filter(task => task.status === "Pending").length
    const submitted = tasks.filter(task => task.status === "Submitted").length

    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    const gradedThisWeek = tasks.filter(task => {
      if (task.status !== "Graded") return false
      return new Date(task.gradedAt || "") >= weekAgo
    }).length

    return { assignedToday, pending, submitted, gradedThisWeek }
  }, [tasks])

  // Get unique types and priorities
  const { types, priorities } = useMemo(() => {
    const uniqueTypes = [...new Set(tasks.map(t => t.type))].sort()
    const uniquePriorities = [...new Set(tasks.map(t => t.priority))].sort()
    return { types: uniqueTypes, priorities: uniquePriorities }
  }, [tasks])

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.educatorName.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === "all" || task.status === statusFilter
      const matchesType = typeFilter === "all" || task.type === typeFilter
      const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter

      return matchesSearch && matchesStatus && matchesType && matchesPriority
    })
  }, [tasks, searchTerm, statusFilter, typeFilter, priorityFilter])

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

          <button
            onClick={handleOpenCreate}
            className="px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg btn-primary-action flex items-center gap-2 cursor-pointer"
          >
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
                        <button className="flex-1 px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg btn-primary-action">
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
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleOpenEdit(task)
                        }}
                        className="flex-1 px-4 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Pencil className="h-4 w-4" />
                        Edit
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteTask(task.id, task.title)
                        }}
                        className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create/Edit Task Sheet */}
      <Sheet open={isCreateTaskOpen} onOpenChange={setIsCreateTaskOpen}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl border-white/10">
          <SheetHeader>
            <SheetTitle className="text-2xl font-bold text-foreground">
              {isEditMode ? "Edit Home Task" : "Create New Home Task"}
            </SheetTitle>
            <SheetDescription className="text-muted-foreground">
              {isEditMode ? "Update the task details below" : "Fill in the details to create a new homework assignment"}
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-foreground font-medium">
                Title <span className="text-red-400">*</span>
              </Label>
              <Input
                id="title"
                placeholder="e.g., History Timeline Project"
                value={taskForm.title}
                onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                className="bg-black/30 border-white/20 text-foreground"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-foreground font-medium">Description</Label>
              <Textarea
                id="description"
                placeholder="Brief description..."
                value={taskForm.description}
                onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                className="bg-black/30 border-white/20 text-foreground min-h-[100px]"
              />
            </div>

            {/* Subject and Type */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="subject" className="text-foreground font-medium">
                  Subject <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="subject"
                  placeholder="e.g., History"
                  value={taskForm.subject}
                  onChange={(e) => setTaskForm({ ...taskForm, subject: e.target.value })}
                  className="bg-black/30 border-white/20 text-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type" className="text-foreground font-medium">Type</Label>
                <select
                  id="type"
                  value={taskForm.type}
                  onChange={(e) => setTaskForm({ ...taskForm, type: e.target.value as HomeTask["type"] })}
                  className="w-full px-3 py-2 bg-black/30 border border-white/20 rounded-md text-foreground"
                >
                  <option value="Homework">Homework</option>
                  <option value="Assignment">Assignment</option>
                  <option value="Project">Project</option>
                  <option value="Reading">Reading</option>
                  <option value="Research">Research</option>
                </select>
              </div>
            </div>

            {/* Priority and Estimated Hours */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priority" className="text-foreground font-medium">Priority</Label>
                <select
                  id="priority"
                  value={taskForm.priority}
                  onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value as HomeTask["priority"] })}
                  className="w-full px-3 py-2 bg-black/30 border border-white/20 rounded-md text-foreground"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="estimatedHours" className="text-foreground font-medium">Estimated Hours</Label>
                <Input
                  id="estimatedHours"
                  type="number"
                  placeholder="e.g., 8"
                  value={taskForm.estimatedHours}
                  onChange={(e) => setTaskForm({ ...taskForm, estimatedHours: e.target.value })}
                  className="bg-black/30 border-white/20 text-foreground"
                />
              </div>
            </div>

            {/* Total Marks and Due Date */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="totalMarks" className="text-foreground font-medium">Total Marks</Label>
                <Input
                  id="totalMarks"
                  type="number"
                  placeholder="e.g., 40"
                  value={taskForm.totalMarks}
                  onChange={(e) => setTaskForm({ ...taskForm, totalMarks: e.target.value })}
                  className="bg-black/30 border-white/20 text-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dueDate" className="text-foreground font-medium">
                  Due Date <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={taskForm.dueDate}
                  onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                  className="bg-black/30 border-white/20 text-foreground"
                />
              </div>
            </div>

            {/* Instructions */}
            <div className="space-y-2">
              <Label htmlFor="instructions" className="text-foreground font-medium">Instructions</Label>
              <Textarea
                id="instructions"
                placeholder="Enter instructions (one per line)..."
                value={taskForm.instructions}
                onChange={(e) => setTaskForm({ ...taskForm, instructions: e.target.value })}
                className="bg-black/30 border-white/20 text-foreground min-h-[100px]"
              />
            </div>

            {/* Resources */}
            <div className="space-y-2">
              <Label htmlFor="resources" className="text-foreground font-medium">Resources</Label>
              <Input
                id="resources"
                placeholder="Enter resources (comma-separated)..."
                value={taskForm.resources}
                onChange={(e) => setTaskForm({ ...taskForm, resources: e.target.value })}
                className="bg-black/30 border-white/20 text-foreground"
              />
            </div>
          </div>

          <SheetFooter className="mt-8 gap-2">
            <Button
              variant="outline"
              onClick={() => setIsCreateTaskOpen(false)}
              className="bg-black/30 border-white/20 text-foreground hover:bg-black/40"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              {isEditMode ? "Update Task" : "Create Task"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}