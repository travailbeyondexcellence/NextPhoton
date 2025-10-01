"use client"

import { useState, useMemo, useEffect } from "react"
import { PackageCheck, Clock, CheckCircle, AlertCircle, User, Calendar, TrendingUp, Filter, Search, ChevronDown, ChevronUp, Tag, MessageSquare, Paperclip, Target, Users, BookOpen, Heart, Briefcase, Star, Activity, X } from "lucide-react"
import { type EduCareTask } from "@/app/(features)/EduCareTasks/educareTasksDummyData"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export default function EduCareTasksPage() {
  // State for tasks loaded from API
  const [tasks, setTasks] = useState<EduCareTask[]>([])
  const [statistics, setStatistics] = useState({
    active: 0,
    pending: 0,
    completed: 0,
    overdue: 0,
    averageProgress: 0,
    total: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [selectedPriority, setSelectedPriority] = useState<string>("all")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedTask, setExpandedTask] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null)

  // Form state for new task creation
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    category: "Academic Support" as EduCareTask['category'],
    priority: "Medium" as EduCareTask['priority'],
    status: "Active" as EduCareTask['status'],
    studentName: "",
    className: "",
    assignedToName: "",
    assignedToRole: "",
    dueDate: "",
    impact: "Medium" as EduCareTask['impact'],
    tags: "",
    followUpRequired: false,
    parentNotificationSent: false,
  })

  // Fetch tasks from API on component mount
  useEffect(() => {
    fetchTasks()
    fetchStatistics()
  }, [])

  // Function to fetch all tasks from API
  const fetchTasks = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/educare-tasks')
      const result = await response.json()

      if (result.success) {
        setTasks(result.data)
      } else {
        console.error('Failed to fetch tasks:', result.error)
      }
    } catch (error) {
      console.error('Error fetching tasks:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Function to fetch statistics from API
  const fetchStatistics = async () => {
    try {
      const response = await fetch('/api/educare-tasks?stats=true')
      const result = await response.json()

      if (result.success) {
        setStatistics(result.data)
      }
    } catch (error) {
      console.error('Error fetching statistics:', error)
    }
  }

  // Handle form input changes
  const handleInputChange = (field: string, value: any) => {
    setNewTask(prev => ({ ...prev, [field]: value }))
  }

  // Handle Edit button click - Populate form with task data
  const handleEditTask = (task: EduCareTask) => {
    setNewTask({
      title: task.title,
      description: task.description,
      category: task.category,
      priority: task.priority,
      status: task.status,
      studentName: task.studentName,
      className: task.className,
      assignedToName: task.assignedTo.name,
      assignedToRole: task.assignedTo.role,
      dueDate: task.dueDate,
      impact: task.impact,
      tags: task.tags.join(', '),
      followUpRequired: task.followUpRequired || false,
      parentNotificationSent: task.parentNotificationSent || false,
    })
    setIsEditMode(true)
    setEditingTaskId(task.taskId)
    setIsNewTaskOpen(true)
  }

  // Handle Delete button click
  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) {
      return
    }

    try {
      const response = await fetch(`/api/educare-tasks?taskId=${taskId}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (result.success) {
        // Success - refresh tasks and statistics
        await fetchTasks()
        await fetchStatistics()
        alert('Task deleted successfully!')
      } else {
        alert(`Failed to delete task: ${result.message}`)
      }
    } catch (error) {
      console.error('Error deleting task:', error)
      alert('An error occurred while deleting the task')
    }
  }

  // Handle form submission - Create or Update task via API
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // Convert tags string to array
      const tagsArray = newTask.tags
        ? newTask.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
        : []

      // Prepare task data for API
      const taskData = {
        title: newTask.title,
        description: newTask.description,
        category: newTask.category,
        priority: newTask.priority,
        status: newTask.status,
        studentName: newTask.studentName,
        className: newTask.className,
        assignedToName: newTask.assignedToName,
        assignedToRole: newTask.assignedToRole,
        dueDate: newTask.dueDate,
        impact: newTask.impact,
        tags: tagsArray,
        followUpRequired: newTask.followUpRequired,
        parentNotificationSent: newTask.parentNotificationSent,
      }

      // Call API to create or update task
      const response = await fetch('/api/educare-tasks', {
        method: isEditMode ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(isEditMode ? { ...taskData, taskId: editingTaskId } : taskData),
      })

      const result = await response.json()

      if (result.success) {
        // Success - refresh tasks and statistics
        await fetchTasks()
        await fetchStatistics()

        // Reset form and close sheet
        setNewTask({
          title: "",
          description: "",
          category: "Academic Support",
          priority: "Medium",
          status: "Active",
          studentName: "",
          className: "",
          assignedToName: "",
          assignedToRole: "",
          dueDate: "",
          impact: "Medium",
          tags: "",
          followUpRequired: false,
          parentNotificationSent: false,
        })
        setIsNewTaskOpen(false)
        setIsEditMode(false)
        setEditingTaskId(null)

        alert(isEditMode ? "Task updated successfully!" : "Task created successfully!")
      } else {
        alert(`Failed to ${isEditMode ? 'update' : 'create'} task: ${result.message}`)
      }
    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} task:`, error)
      alert(`An error occurred while ${isEditMode ? 'updating' : 'creating'} the task`)
    }
  }

  // Filter tasks based on selections
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const statusMatch = selectedStatus === "all" || task.status === selectedStatus
      const priorityMatch = selectedPriority === "all" || task.priority === selectedPriority
      const categoryMatch = selectedCategory === "all" || task.category === selectedCategory
      const searchMatch = searchTerm === "" ||
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase())

      return statusMatch && priorityMatch && categoryMatch && searchMatch
    })
  }, [tasks, selectedStatus, selectedPriority, selectedCategory, searchTerm])

  const getStatusColor = (status: EduCareTask['status']) => {
    switch (status) {
      case 'Active': return 'text-blue-400 bg-blue-500/20'
      case 'In Progress': return 'text-yellow-400 bg-yellow-500/20'
      case 'Pending Review': return 'text-orange-400 bg-orange-500/20'
      case 'Completed': return 'text-green-400 bg-green-500/20'
      case 'Overdue': return 'text-red-400 bg-red-500/20'
      default: return 'text-gray-400 bg-gray-500/20'
    }
  }

  const getPriorityColor = (priority: EduCareTask['priority']) => {
    switch (priority) {
      case 'High': return 'text-red-400'
      case 'Medium': return 'text-yellow-400'
      case 'Low': return 'text-green-400'
      default: return 'text-gray-400'
    }
  }

  const getCategoryIcon = (category: EduCareTask['category']) => {
    switch (category) {
      case 'Academic Support': return <BookOpen className="h-4 w-4" />
      case 'Behavioral Guidance': return <Users className="h-4 w-4" />
      case 'Parent Communication': return <MessageSquare className="h-4 w-4" />
      case 'Student Wellness': return <Heart className="h-4 w-4" />
      case 'Career Counseling': return <Briefcase className="h-4 w-4" />
      case 'Special Needs': return <Star className="h-4 w-4" />
      case 'Extracurricular': return <Activity className="h-4 w-4" />
      default: return <PackageCheck className="h-4 w-4" />
    }
  }

  const getImpactColor = (impact: EduCareTask['impact']) => {
    switch (impact) {
      case 'Critical': return 'text-red-500'
      case 'High': return 'text-orange-500'
      case 'Medium': return 'text-yellow-500'
      case 'Low': return 'text-green-500'
      default: return 'text-gray-500'
    }
  }

  return (
    <div className="min-h-full">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <PackageCheck className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">EduCare Tasks</h1>
              <p className="text-muted-foreground">Manage educational care and support tasks</p>
            </div>
          </div>

          {/* New Task Sheet Trigger */}
          <Sheet open={isNewTaskOpen} onOpenChange={setIsNewTaskOpen}>
            <SheetTrigger asChild>
              <button
                onClick={() => {
                  setIsEditMode(false)
                  setEditingTaskId(null)
                }}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 btn-primary-action"
              >
                + New Task
              </button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-2xl overflow-y-auto bg-gradient-to-br from-emerald-950/95 to-emerald-900/95 backdrop-blur-xl border-emerald-500/20">
              <SheetHeader>
                <SheetTitle className="text-foreground">
                  {isEditMode ? 'Edit EduCare Task' : 'Create New EduCare Task'}
                </SheetTitle>
                <SheetDescription className="text-muted-foreground">
                  {isEditMode
                    ? 'Update the details below to modify this educational care task'
                    : 'Fill in the details below to create a new educational care task'}
                </SheetDescription>
              </SheetHeader>

              {/* New Task Form */}
              <form onSubmit={handleCreateTask} className="space-y-6 mt-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium mb-2">Task Title *</label>
                  <input
                    type="text"
                    required
                    value={newTask.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="e.g., Math Tutoring Session - Algebra Basics"
                    className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium mb-2">Description *</label>
                  <textarea
                    required
                    value={newTask.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Provide detailed description of the task..."
                    rows={4}
                    className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary resize-none"
                  />
                </div>

                {/* Row 1: Category, Priority, Status */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Category *</label>
                    <select
                      required
                      value={newTask.category}
                      onChange={(e) => handleInputChange("category", e.target.value as EduCareTask['category'])}
                      className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-lg text-foreground focus:outline-none focus:border-primary"
                    >
                      <option value="Academic Support">Academic Support</option>
                      <option value="Behavioral Guidance">Behavioral Guidance</option>
                      <option value="Parent Communication">Parent Communication</option>
                      <option value="Student Wellness">Student Wellness</option>
                      <option value="Career Counseling">Career Counseling</option>
                      <option value="Special Needs">Special Needs</option>
                      <option value="Extracurricular">Extracurricular</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Priority *</label>
                    <select
                      required
                      value={newTask.priority}
                      onChange={(e) => handleInputChange("priority", e.target.value as EduCareTask['priority'])}
                      className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-lg text-foreground focus:outline-none focus:border-primary"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Status *</label>
                    <select
                      required
                      value={newTask.status}
                      onChange={(e) => handleInputChange("status", e.target.value as EduCareTask['status'])}
                      className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-lg text-foreground focus:outline-none focus:border-primary"
                    >
                      <option value="Active">Active</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Pending Review">Pending Review</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                </div>

                {/* Row 2: Student Name, Class Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Student Name *</label>
                    <input
                      type="text"
                      required
                      value={newTask.studentName}
                      onChange={(e) => handleInputChange("studentName", e.target.value)}
                      placeholder="e.g., Sarah Johnson"
                      className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Class Name *</label>
                    <input
                      type="text"
                      required
                      value={newTask.className}
                      onChange={(e) => handleInputChange("className", e.target.value)}
                      placeholder="e.g., 10-A Mathematics"
                      className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                {/* Row 3: Assigned To Name, Role */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Assigned To (Name) *</label>
                    <input
                      type="text"
                      required
                      value={newTask.assignedToName}
                      onChange={(e) => handleInputChange("assignedToName", e.target.value)}
                      placeholder="e.g., Dr. Emily Roberts"
                      className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Assigned To (Role) *</label>
                    <input
                      type="text"
                      required
                      value={newTask.assignedToRole}
                      onChange={(e) => handleInputChange("assignedToRole", e.target.value)}
                      placeholder="e.g., Math Educator"
                      className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                {/* Row 4: Due Date, Impact */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Due Date *</label>
                    <input
                      type="date"
                      required
                      value={newTask.dueDate}
                      onChange={(e) => handleInputChange("dueDate", e.target.value)}
                      className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-lg text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Impact Level *</label>
                    <select
                      required
                      value={newTask.impact}
                      onChange={(e) => handleInputChange("impact", e.target.value as EduCareTask['impact'])}
                      className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-lg text-foreground focus:outline-none focus:border-primary"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Critical">Critical</option>
                    </select>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium mb-2">Tags</label>
                  <input
                    type="text"
                    value={newTask.tags}
                    onChange={(e) => handleInputChange("tags", e.target.value)}
                    placeholder="Separate tags with commas (e.g., Mathematics, Algebra, One-on-One)"
                    className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Separate multiple tags with commas</p>
                </div>

                {/* Checkboxes */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="followUpRequired"
                      checked={newTask.followUpRequired}
                      onChange={(e) => handleInputChange("followUpRequired", e.target.checked)}
                      className="w-4 h-4 rounded border-white/20"
                    />
                    <label htmlFor="followUpRequired" className="text-sm font-medium">
                      Follow-up Required
                    </label>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="parentNotificationSent"
                      checked={newTask.parentNotificationSent}
                      onChange={(e) => handleInputChange("parentNotificationSent", e.target.checked)}
                      className="w-4 h-4 rounded border-white/20"
                    />
                    <label htmlFor="parentNotificationSent" className="text-sm font-medium">
                      Send Parent Notification
                    </label>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex gap-3 pt-4 border-t border-white/10">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 btn-primary-action font-medium"
                  >
                    {isEditMode ? 'Update Task' : 'Create Task'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsNewTaskOpen(false)
                      setIsEditMode(false)
                      setEditingTaskId(null)
                    }}
                    className="px-4 py-2 bg-white/10 text-foreground rounded-lg hover:bg-white/20 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {/* Active Tasks Card */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/15 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="text-muted-foreground">Active Tasks</div>
            <div className="text-blue-400">📋</div>
          </div>
          <div className="text-2xl font-bold">{statistics.active}</div>
          <div className="text-xs text-muted-foreground mt-2">Currently active</div>
        </div>

        {/* Pending Review Card */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/15 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="text-muted-foreground">Pending Review</div>
            <div className="text-orange-400">⏳</div>
          </div>
          <div className="text-2xl font-bold">{statistics.pending}</div>
          <div className="text-xs text-muted-foreground mt-2">Awaiting approval</div>
        </div>

        {/* Completed Card */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/15 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="text-muted-foreground">Completed</div>
            <div className="text-green-400">✅</div>
          </div>
          <div className="text-2xl font-bold">{statistics.completed}</div>
          <div className="text-xs text-muted-foreground mt-2">This month</div>
        </div>

        {/* Overdue Card */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/15 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="text-muted-foreground">Overdue</div>
            <div className="text-red-400">⚠️</div>
          </div>
          <div className="text-2xl font-bold text-red-400">{statistics.overdue}</div>
          <div className="text-xs text-muted-foreground mt-2">Need attention</div>
        </div>

        {/* Average Progress Card */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/15 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="text-muted-foreground">Avg Progress</div>
            <TrendingUp className="h-5 w-5 text-primary" />
          </div>
          <div className="text-2xl font-bold">{statistics.averageProgress}%</div>
          <div className="text-xs text-muted-foreground mt-2">Overall progress</div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Task Management</h2>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-3 py-2 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-colors"
          >
            <Filter className="h-4 w-4" />
            Filters
            {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search tasks by title, student, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-black/20 border border-white/10 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
          />
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-lg text-foreground focus:outline-none focus:border-primary"
              >
                <option value="all">All Status</option>
                <option value="Active">Active</option>
                <option value="In Progress">In Progress</option>
                <option value="Pending Review">Pending Review</option>
                <option value="Completed">Completed</option>
                <option value="Overdue">Overdue</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Priority</label>
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-lg text-foreground focus:outline-none focus:border-primary"
              >
                <option value="all">All Priorities</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-lg text-foreground focus:outline-none focus:border-primary"
              >
                <option value="all">All Categories</option>
                <option value="Academic Support">Academic Support</option>
                <option value="Behavioral Guidance">Behavioral Guidance</option>
                <option value="Parent Communication">Parent Communication</option>
                <option value="Student Wellness">Student Wellness</option>
                <option value="Career Counseling">Career Counseling</option>
                <option value="Special Needs">Special Needs</option>
                <option value="Extracurricular">Extracurricular</option>
              </select>
            </div>
          </div>
        )}

        <div className="text-sm text-muted-foreground mt-4">
          Showing {filteredTasks.length} of {tasks.length} tasks
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-muted-foreground">Loading tasks...</p>
        </div>
      )}

      {/* Tasks List */}
      {!isLoading && (
        <div className="space-y-4">
          {filteredTasks.map((task) => (
          <div key={task.taskId} className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 overflow-hidden">
            {/* Task Header */}
            <div
              className="p-6 cursor-pointer hover:bg-white/5 transition-colors"
              onClick={() => setExpandedTask(expandedTask === task.taskId ? null : task.taskId)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg">{task.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                    <span className={`text-xs font-medium ${getPriorityColor(task.priority)}`}>
                      {task.priority} Priority
                    </span>
                    {task.followUpRequired && (
                      <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs">
                        Follow-up Required
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground mb-3">{task.description}</p>

                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(task.category)}
                      <span className="text-muted-foreground">{task.category}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Student: {task.studentName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Assigned to: {task.assignedTo.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-muted-foreground" />
                      <span className={`font-medium ${getImpactColor(task.impact)}`}>
                        {task.impact} Impact
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{task.progress}%</span>
                    </div>
                    <div className="w-full bg-black/30 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          task.progress === 100 ? 'bg-green-400' :
                          task.progress >= 75 ? 'bg-blue-400' :
                          task.progress >= 50 ? 'bg-yellow-400' :
                          task.progress >= 25 ? 'bg-orange-400' : 'bg-red-400'
                        }`}
                        style={{ width: `${task.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Tags */}
                  {task.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {task.tags.map((tag, idx) => (
                        <span key={idx} className="flex items-center gap-1 px-2 py-1 bg-primary/20 text-primary rounded-full text-xs">
                          <Tag className="h-3 w-3" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="ml-4">
                  {expandedTask === task.taskId ? (
                    <ChevronUp className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
              </div>
            </div>

            {/* Expanded Task Details */}
            {expandedTask === task.taskId && (
              <div className="px-6 pb-6 border-t border-white/10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
                  {/* Subtasks */}
                  {task.subtasks && task.subtasks.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        Subtasks ({task.subtasks.filter(st => st.completed).length}/{task.subtasks.length})
                      </h4>
                      <div className="space-y-2">
                        {task.subtasks.map((subtask) => (
                          <div key={subtask.id} className="flex items-start gap-2">
                            <input
                              type="checkbox"
                              checked={subtask.completed}
                              readOnly
                              className="mt-1 rounded border-white/20"
                            />
                            <div className="flex-1">
                              <span className={`text-sm ${subtask.completed ? 'line-through text-muted-foreground' : ''}`}>
                                {subtask.title}
                              </span>
                              {subtask.completedBy && (
                                <p className="text-xs text-muted-foreground">
                                  Completed by {subtask.completedBy} on {new Date(subtask.completedAt!).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Comments */}
                  {task.comments.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        Comments ({task.comments.length})
                      </h4>
                      <div className="space-y-3">
                        {task.comments.map((comment) => (
                          <div key={comment.id} className="bg-black/20 rounded-lg p-3">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium text-sm">{comment.author}</span>
                              <span className="text-xs text-muted-foreground">
                                {new Date(comment.timestamp).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">{comment.text}</p>
                            <span className="text-xs text-primary">{comment.role}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Task Metadata */}
                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Created:</span>
                      <p className="font-medium">{new Date(task.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Updated:</span>
                      <p className="font-medium">{new Date(task.updatedAt).toLocaleDateString()}</p>
                    </div>
                    {task.completedAt && (
                      <div>
                        <span className="text-muted-foreground">Completed:</span>
                        <p className="font-medium">{new Date(task.completedAt).toLocaleDateString()}</p>
                      </div>
                    )}
                    <div>
                      <span className="text-muted-foreground">Class:</span>
                      <p className="font-medium">{task.className}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mt-4">
                    {task.parentNotificationSent && (
                      <span className="flex items-center gap-1 text-xs text-green-400">
                        <CheckCircle className="h-3 w-3" />
                        Parent Notified
                      </span>
                    )}
                    {task.attachments && task.attachments.length > 0 && (
                      <span className="flex items-center gap-1 text-xs text-blue-400">
                        <Paperclip className="h-3 w-3" />
                        {task.attachments.length} Attachments
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-4">
                  <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 btn-primary-action text-sm">
                    Update Progress
                  </button>
                  <button className="px-4 py-2 bg-secondary/20 text-secondary rounded-lg hover:bg-secondary/30 transition-colors text-sm">
                    Add Comment
                  </button>
                  <button
                    onClick={() => handleEditTask(task)}
                    className="px-4 py-2 bg-accent/20 text-accent rounded-lg hover:bg-accent/30 btn-primary-action text-sm"
                  >
                    Edit Task
                  </button>
                  <button
                    onClick={() => handleDeleteTask(task.taskId)}
                    className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 btn-primary-action text-sm"
                  >
                    Delete
                  </button>
                  {task.status !== 'Completed' && (
                    <button className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 btn-primary-action text-sm">
                      Mark Complete
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Empty State */}
        {filteredTasks.length === 0 && (
          <div className="text-center py-12">
            <PackageCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No tasks found</h3>
            <p className="text-muted-foreground">Try adjusting your filters or search criteria</p>
          </div>
        )}
      </div>
      )}
    </div>
  )
}