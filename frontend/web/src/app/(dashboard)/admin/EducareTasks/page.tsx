"use client"

import { useState, useMemo } from "react"
import { PackageCheck, Clock, CheckCircle, AlertCircle, User, Calendar, TrendingUp, Filter, Search, ChevronDown, ChevronUp, Tag, MessageSquare, Paperclip, Target, Users, BookOpen, Heart, Briefcase, Star, Activity } from "lucide-react"
import { eduCareTasks, getTaskStatistics, type EduCareTask } from "@/app/(features)/EduCareTasks/educareTasksDummyData"

export default function EduCareTasksPage() {
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [selectedPriority, setSelectedPriority] = useState<string>("all")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedTask, setExpandedTask] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  const statistics = getTaskStatistics()

  // Filter tasks based on selections
  const filteredTasks = useMemo(() => {
    return eduCareTasks.filter(task => {
      const statusMatch = selectedStatus === "all" || task.status === selectedStatus
      const priorityMatch = selectedPriority === "all" || task.priority === selectedPriority
      const categoryMatch = selectedCategory === "all" || task.category === selectedCategory
      const searchMatch = searchTerm === "" ||
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase())

      return statusMatch && priorityMatch && categoryMatch && searchMatch
    })
  }, [selectedStatus, selectedPriority, selectedCategory, searchTerm])

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
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
            + New Task
          </button>
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
          Showing {filteredTasks.length} of {eduCareTasks.length} tasks
        </div>
      </div>

      {/* Tasks List */}
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
                  <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm">
                    Update Progress
                  </button>
                  <button className="px-4 py-2 bg-secondary/20 text-secondary rounded-lg hover:bg-secondary/30 transition-colors text-sm">
                    Add Comment
                  </button>
                  <button className="px-4 py-2 bg-accent/20 text-accent rounded-lg hover:bg-accent/30 transition-colors text-sm">
                    Edit Task
                  </button>
                  {task.status !== 'Completed' && (
                    <button className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors text-sm">
                      Mark Complete
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredTasks.length === 0 && (
        <div className="text-center py-12">
          <PackageCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No tasks found</h3>
          <p className="text-muted-foreground">Try adjusting your filters or search criteria</p>
        </div>
      )}
    </div>
  )
}