"use client"

import { useState, useMemo } from "react"
import { Calendar, Clock, BookOpen, CheckCircle, AlertCircle, Users, Filter, Plus, X } from "lucide-react"
import { dailyStudyPlans as initialDailyStudyPlans, type DailyStudyPlan } from "@/app/(features)/LearningActivities/learningActivitiesDummyData"

export default function DailyStudyPlanPage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [plans, setPlans] = useState<DailyStudyPlan[]>(initialDailyStudyPlans)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: new Date().toISOString().split('T')[0],
    subjects: "",
    priority: "" as "High" | "Medium" | "Low" | "",
    educatorName: "",
  })

  // Calculate stats for today
  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0]
    const todayPlans = plans.filter(plan => plan.date === today)
    const completed = plans.filter(plan => plan.status === "Completed").length
    const pending = plans.filter(plan => plan.status === "Pending").length
    const active = plans.filter(plan => plan.status === "Active").length

    return {
      todayPlans: todayPlans.length,
      completed,
      pending,
      active
    }
  }, [plans])

  // Filter plans based on selected date and status
  const filteredPlans = useMemo(() => {
    return plans.filter(plan => {
      const matchesDate = plan.date === selectedDate
      const matchesStatus = statusFilter === "all" || plan.status === statusFilter
      return matchesDate && matchesStatus
    })
  }, [plans, selectedDate, statusFilter])

  // Reset form
  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      date: new Date().toISOString().split('T')[0],
      subjects: "",
      priority: "",
      educatorName: "",
    })
    setIsEditMode(false)
    setEditingPlanId(null)
  }

  // Handle edit plan click
  const handleEditPlanClick = (plan: DailyStudyPlan) => {
    // Populate form with existing plan data
    setFormData({
      title: plan.title,
      description: plan.description,
      date: plan.date,
      subjects: plan.subjects.join(', '),
      priority: plan.priority,
      educatorName: plan.educatorName,
    })

    setIsEditMode(true)
    setEditingPlanId(plan.id)
    setIsCreateDialogOpen(true)
  }

  // Handle form submission (Create or Update)
  const handleCreatePlan = (e: React.FormEvent) => {
    e.preventDefault()

    const subjectsArray = formData.subjects.split(',').map(s => s.trim()).filter(Boolean)

    if (isEditMode && editingPlanId) {
      // UPDATE existing plan
      console.log('=== UPDATING DAILY STUDY PLAN ===')
      console.log('Plan ID:', editingPlanId)
      console.log('Form data:', formData)

      const existingPlan = plans.find(p => p.id === editingPlanId)
      if (!existingPlan) {
        alert('Plan not found!')
        return
      }

      const updatedPlan: DailyStudyPlan = {
        ...existingPlan,
        title: formData.title,
        description: formData.description,
        date: formData.date,
        subjects: subjectsArray,
        priority: formData.priority as "High" | "Medium" | "Low",
        educatorName: formData.educatorName || "Admin",
        updatedAt: new Date().toISOString(),
      }

      console.log('Updated plan:', updatedPlan)
      setPlans(prevPlans => prevPlans.map(p => p.id === editingPlanId ? updatedPlan : p))

      setIsCreateDialogOpen(false)
      resetForm()
      alert('Study plan updated successfully!')
    } else {
      // CREATE new plan
      console.log('=== CREATING DAILY STUDY PLAN ===')
      console.log('Form data:', formData)

      // Generate new plan ID
      const newId = `dsp${String(plans.length + 1).padStart(3, '0')}`

      // Create new plan object
      const newPlan: DailyStudyPlan = {
        id: newId,
        title: formData.title,
        description: formData.description,
        date: formData.date,
        timeSlots: [], // Empty initially, can be added later
        learnerIds: [],
        educatorId: "admin",
        educatorName: formData.educatorName || "Admin",
        status: "Pending",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        totalStudyTime: 0,
        completedTime: 0,
        subjects: subjectsArray,
        priority: formData.priority as "High" | "Medium" | "Low",
      }

      console.log('Adding new plan:', newPlan)
      setPlans(prevPlans => [newPlan, ...prevPlans])

      setIsCreateDialogOpen(false)
      resetForm()
      alert('Study plan created successfully!')
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      Active: { color: "bg-green-500/20 text-green-300 border-green-500/50", icon: <Clock className="h-3 w-3" /> },
      Completed: { color: "bg-blue-500/20 text-blue-300 border-blue-500/50", icon: <CheckCircle className="h-3 w-3" /> },
      Pending: { color: "bg-yellow-500/20 text-yellow-300 border-yellow-500/50", icon: <AlertCircle className="h-3 w-3" /> },
      Cancelled: { color: "bg-red-500/20 text-red-300 border-red-500/50", icon: <AlertCircle className="h-3 w-3" /> }
    }

    const config = statusConfig[status as keyof typeof statusConfig]
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${config.color}`}>
        {config.icon}
        {status}
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

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-full p-6 space-y-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-4">
          <BookOpen className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Daily Study Plan</h1>
            <p className="text-muted-foreground">Manage daily study schedules and activities</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/15 transition-all">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Today's Plans</h3>
            <Calendar className="h-5 w-5 text-primary" />
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.todayPlans}</p>
          <p className="text-sm text-muted-foreground">Active study plans</p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/15 transition-all">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Completed</h3>
            <CheckCircle className="h-5 w-5 text-green-400" />
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.completed}</p>
          <p className="text-sm text-muted-foreground">Plans completed</p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/15 transition-all">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Pending</h3>
            <AlertCircle className="h-5 w-5 text-yellow-400" />
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.pending}</p>
          <p className="text-sm text-muted-foreground">Plans pending review</p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/15 transition-all">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Active</h3>
            <Clock className="h-5 w-5 text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.active}</p>
          <p className="text-sm text-muted-foreground">Currently active</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <label className="text-sm text-muted-foreground">Date:</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-1 bg-black/20 border border-white/10 rounded text-foreground text-sm"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1 bg-black/20 border border-white/10 rounded text-foreground text-sm"
            >
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <button
            onClick={() => setIsCreateDialogOpen(true)}
            className="ml-auto px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg btn-primary-action transition-colors flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Create Plan
          </button>
        </div>
      </div>

      {/* Study Plans List */}
      <div className="space-y-4">
        {filteredPlans.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20 text-center">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No study plans found</h3>
            <p className="text-muted-foreground">
              {selectedDate === new Date().toISOString().split('T')[0]
                ? "No study plans scheduled for today."
                : `No study plans found for ${formatDate(selectedDate)}.`}
            </p>
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
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-foreground">{plan.title}</h3>
                      {getStatusBadge(plan.status)}
                      <span className={`text-sm font-medium ${getPriorityColor(plan.priority)}`}>
                        {plan.priority} Priority
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{plan.description}</p>

                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(plan.date)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>Educator: {plan.educatorName}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{plan.totalStudyTime} min total</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="text-foreground font-medium">
                      {plan.completedTime}/{plan.totalStudyTime} min ({Math.round((plan.completedTime / plan.totalStudyTime) * 100)}%)
                    </span>
                  </div>
                  <div className="w-full bg-black/30 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all"
                      style={{ width: `${(plan.completedTime / plan.totalStudyTime) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Subjects */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {plan.subjects.map((subject, idx) => (
                    <span key={idx} className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs">
                      {subject}
                    </span>
                  ))}
                </div>

                {/* Time Slots Preview */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold mb-2">Time Slots ({plan.timeSlots.length})</h4>
                  <div className="space-y-2">
                    {plan.timeSlots.slice(0, 2).map((slot) => (
                      <div key={slot.id} className="flex items-center justify-between bg-black/20 rounded p-2">
                        <div className="flex items-center gap-2">
                          <span className={`h-2 w-2 rounded-full ${
                            slot.isCompleted ? 'bg-green-400' : 'bg-gray-400'
                          }`} />
                          <span className="text-sm font-medium">{formatTime(slot.startTime)} - {formatTime(slot.endTime)}</span>
                          <span className="text-sm text-muted-foreground">{slot.subject}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">{slot.topic}</span>
                      </div>
                    ))}
                    {plan.timeSlots.length > 2 && (
                      <span className="text-xs text-muted-foreground">+{plan.timeSlots.length - 2} more time slots</span>
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                {selectedPlan === plan.id && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    {/* All Time Slots */}
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold mb-3">All Time Slots</h4>
                      <div className="space-y-3">
                        {plan.timeSlots.map((slot) => (
                          <div key={slot.id} className="bg-black/20 rounded p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-3">
                                <span className={`h-3 w-3 rounded-full ${
                                  slot.isCompleted ? 'bg-green-400' : 'bg-gray-400'
                                }`} />
                                <span className="font-medium">{formatTime(slot.startTime)} - {formatTime(slot.endTime)}</span>
                                <span className="text-primary">{slot.subject}</span>
                              </div>
                              {slot.isCompleted && (
                                <CheckCircle className="h-4 w-4 text-green-400" />
                              )}
                            </div>
                            <div className="ml-6">
                              <h5 className="text-sm font-medium mb-1">{slot.topic}</h5>
                              <div className="text-xs text-muted-foreground mb-2">
                                <strong>Activities:</strong> {slot.activities.join(", ")}
                              </div>
                              <div className="text-xs text-muted-foreground mb-2">
                                <strong>Resources:</strong> {slot.resources.join(", ")}
                              </div>
                              {slot.notes && (
                                <div className="text-xs text-muted-foreground italic">
                                  <strong>Notes:</strong> {slot.notes}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleEditPlanClick(plan)
                        }}
                        className="flex-1 px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg btn-primary-action transition-colors"
                      >
                        Edit Plan
                      </button>
                      <button className="flex-1 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded-lg transition-colors">
                        Mark Complete
                      </button>
                      <button className="flex-1 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg transition-colors">
                        View Details
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Plan Dialog */}
      {isCreateDialogOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#f5e6d3] border border-[#d4c5b0] rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Dialog Header */}
            <div className="sticky top-0 bg-[#f5e6d3] border-b border-[#d4c5b0] p-6 flex items-center justify-between z-10">
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  {isEditMode ? 'Edit Daily Study Plan' : 'Create Daily Study Plan'}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {isEditMode ? 'Update the study plan details' : 'Create a new study plan for learners'}
                </p>
              </div>
              <button
                onClick={() => {
                  setIsCreateDialogOpen(false)
                  resetForm()
                }}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Dialog Content */}
            <div className="overflow-y-auto flex-1">
              <form onSubmit={handleCreatePlan} className="p-6 space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Basic Information</h3>

                  <div>
                    <label className="block text-sm font-medium mb-2">Plan Title *</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      placeholder="e.g., Mathematics Focus Week"
                      className="w-full px-4 py-2 bg-white/50 border border-[#d4c5b0] rounded-lg focus:outline-none focus:border-[#a89885] text-gray-800 placeholder-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Description *</label>
                    <textarea
                      required
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="Brief description of the study plan..."
                      className="w-full px-4 py-2 bg-white/50 border border-[#d4c5b0] rounded-lg focus:outline-none focus:border-[#a89885] text-gray-800 placeholder-gray-500 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Date *</label>
                      <input
                        type="date"
                        required
                        value={formData.date}
                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                        className="w-full px-4 py-2 bg-white/50 border border-[#d4c5b0] rounded-lg focus:outline-none focus:border-[#a89885] text-gray-800"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Priority *</label>
                      <select
                        required
                        value={formData.priority}
                        onChange={(e) => setFormData({...formData, priority: e.target.value as any})}
                        className="w-full px-4 py-2 bg-white/50 border border-[#d4c5b0] rounded-lg focus:outline-none focus:border-[#a89885] text-gray-800"
                      >
                        <option value="">Select priority</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Subjects (comma-separated) *</label>
                    <input
                      type="text"
                      required
                      value={formData.subjects}
                      onChange={(e) => setFormData({...formData, subjects: e.target.value})}
                      placeholder="e.g., Mathematics, Physics, Chemistry"
                      className="w-full px-4 py-2 bg-white/50 border border-[#d4c5b0] rounded-lg focus:outline-none focus:border-[#a89885] text-gray-800 placeholder-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Educator Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.educatorName}
                      onChange={(e) => setFormData({...formData, educatorName: e.target.value})}
                      placeholder="e.g., Dr. Sarah Smith"
                      className="w-full px-4 py-2 bg-white/50 border border-[#d4c5b0] rounded-lg focus:outline-none focus:border-[#a89885] text-gray-800 placeholder-gray-500"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-[#d4c5b0]">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreateDialogOpen(false)
                      resetForm()
                    }}
                    className="flex-1 px-4 py-3 bg-[#d4c5b0] hover:bg-[#c4b5a0] text-gray-800 rounded-lg transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-[#8b7355] hover:bg-[#7b6345] text-white rounded-lg transition-colors font-medium"
                  >
                    {isEditMode ? 'Update Plan' : 'Create Plan'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}