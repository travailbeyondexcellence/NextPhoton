"use client"

import { useState, useMemo, useEffect } from "react"
import { FileText, Calendar, Clock, TrendingUp, Users, MapPin, Monitor, CheckCircle, AlertCircle, Plus, Filter, Search, X, Save, Edit, Trash2 } from "lucide-react"
import { examinations as fallbackExaminations, type Examination } from "@/app/(features)/LearningActivities/learningActivitiesDummyData"
import { GlassModal } from "@/components/glass/GlassModal"

export default function TravailExamsPage() {
  // Local state for examinations (loaded from API)
  const [allExaminations, setAllExaminations] = useState<Examination[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const [statusFilter, setStatusFilter] = useState("all")
  const [examTypeFilter, setExamTypeFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedExam, setSelectedExam] = useState<string | null>(null)
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editingExamId, setEditingExamId] = useState<string | null>(null)

  // Fetch examinations from API on component mount
  useEffect(() => {
    fetchExaminations()
  }, [])

  const fetchExaminations = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/examinations')
      const result = await response.json()

      if (result.success) {
        setAllExaminations(result.data)
      } else {
        console.error('Failed to fetch examinations:', result.error)
        // Fallback to imported dummy data if API fails
        setAllExaminations(fallbackExaminations)
      }
    } catch (error) {
      console.error('Error fetching examinations:', error)
      // Fallback to imported dummy data if API fails
      setAllExaminations(fallbackExaminations)
    } finally {
      setIsLoading(false)
    }
  }

  // Form state for scheduling new exam
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    examType: 'Quiz' as Examination['examType'],
    scheduledDate: new Date().toISOString().slice(0, 16),
    duration: 60,
    totalMarks: 100,
    passingMarks: 40,
    isOnline: true,
    venue: '',
    instructions: '',
    syllabus: '',
  })

  // Handle form input changes
  const handleFormChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      subject: '',
      examType: 'Quiz',
      scheduledDate: new Date().toISOString().slice(0, 16),
      duration: 60,
      totalMarks: 100,
      passingMarks: 40,
      isOnline: true,
      venue: '',
      instructions: '',
      syllabus: '',
    })
    setIsEditMode(false)
    setEditingExamId(null)
  }

  // Handle form submission (Create or Update)
  const handleScheduleExam = async (e: React.FormEvent) => {
    e.preventDefault()

    // Determine status based on scheduled date
    const now = new Date()
    const scheduledDate = new Date(formData.scheduledDate)
    let status: Examination['status'] = 'Scheduled'
    if (scheduledDate < now) {
      status = 'Completed'
    }

    if (isEditMode && editingExamId) {
      // UPDATE existing examination
      const existingExam = allExaminations.find(e => e.id === editingExamId)

      const updatedExamination: Examination = {
        ...existingExam!,
        title: formData.title,
        description: formData.description,
        subject: formData.subject,
        examType: formData.examType,
        scheduledDate: new Date(formData.scheduledDate).toISOString(),
        duration: formData.duration,
        totalMarks: formData.totalMarks,
        passingMarks: formData.passingMarks,
        isOnline: formData.isOnline,
        venue: formData.isOnline ? undefined : formData.venue,
        instructions: formData.instructions ? formData.instructions.split('\n').filter(i => i.trim()) : [],
        syllabus: formData.syllabus ? formData.syllabus.split(',').map(s => s.trim()).filter(s => s) : [],
        status: status,
      }

      try {
        const response = await fetch('/api/examinations', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedExamination),
        })

        const result = await response.json()

        if (result.success) {
          // Update local state
          setAllExaminations(prev =>
            prev.map(e => e.id === editingExamId ? updatedExamination : e)
          )

          alert('Examination updated successfully!')
          setShowScheduleModal(false)
          resetForm()
        } else {
          alert(`Failed to update examination: ${result.message}`)
        }
      } catch (error) {
        console.error('Error updating examination:', error)
        alert('Failed to update examination. Please try again.')
      }
    } else {
      // CREATE new examination
      const newExamination: Examination = {
        id: `exam${Date.now()}`,
        title: formData.title,
        description: formData.description,
        subject: formData.subject,
        examType: formData.examType,
        scheduledDate: new Date(formData.scheduledDate).toISOString(),
        duration: formData.duration,
        totalMarks: formData.totalMarks,
        passingMarks: formData.passingMarks,
        educatorId: 'admin001', // TODO: Get from authenticated user
        educatorName: 'Current Admin', // TODO: Get from authenticated user
        enrolledStudents: [],
        status: status,
        instructions: formData.instructions ? formData.instructions.split('\n').filter(i => i.trim()) : [],
        syllabus: formData.syllabus ? formData.syllabus.split(',').map(s => s.trim()).filter(s => s) : [],
        createdAt: new Date().toISOString(),
        isOnline: formData.isOnline,
        venue: formData.isOnline ? undefined : formData.venue,
      }

      try {
        const response = await fetch('/api/examinations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newExamination),
        })

        const result = await response.json()

        if (result.success) {
          // Update local state
          setAllExaminations(prev => [newExamination, ...prev])

          alert('Examination scheduled successfully!')
          setShowScheduleModal(false)
          resetForm()
        } else {
          alert(`Failed to schedule examination: ${result.message}`)
        }
      } catch (error) {
        console.error('Error scheduling examination:', error)
        alert('Failed to schedule examination. Please try again.')
      }
    }
  }

  // Handle edit button click
  const handleEditExamination = (examination: Examination) => {
    // Populate form with existing examination data
    setFormData({
      title: examination.title,
      description: examination.description,
      subject: examination.subject,
      examType: examination.examType,
      scheduledDate: new Date(examination.scheduledDate).toISOString().slice(0, 16),
      duration: examination.duration,
      totalMarks: examination.totalMarks,
      passingMarks: examination.passingMarks,
      isOnline: examination.isOnline,
      venue: examination.venue || '',
      instructions: examination.instructions.join('\n'),
      syllabus: examination.syllabus.join(', '),
    })

    setIsEditMode(true)
    setEditingExamId(examination.id)
    setShowScheduleModal(true)
  }

  // Handle delete button click
  const handleDeleteExamination = async (examinationId: string) => {
    if (!confirm('Are you sure you want to delete this examination? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/examinations?id=${examinationId}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (result.success) {
        // Update local state
        setAllExaminations(prev => prev.filter(e => e.id !== examinationId))
        alert('Examination deleted successfully!')
      } else {
        alert(`Failed to delete examination: ${result.message}`)
      }
    } catch (error) {
      console.error('Error deleting examination:', error)
      alert('Failed to delete examination. Please try again.')
    }
  }

  // Calculate stats
  const stats = useMemo(() => {
    const upcoming = allExaminations.filter(exam => exam.status === "Scheduled").length
    const inProgress = allExaminations.filter(exam => exam.status === "In Progress").length

    const thisMonthCompleted = allExaminations.filter(exam => {
      if (exam.status !== "Completed") return false
      const monthAgo = new Date()
      monthAgo.setMonth(monthAgo.getMonth() - 1)
      return new Date(exam.scheduledDate) >= monthAgo
    }).length

    const completedWithResults = allExaminations.filter(exam =>
      exam.examResults && exam.examResults.length > 0
    )
    const averageScore = completedWithResults.length > 0
      ? Math.round(
          completedWithResults.reduce((sum, exam) => {
            const avgExamScore = exam.examResults!.reduce((examSum, result) => examSum + result.percentage, 0) / exam.examResults!.length
            return sum + avgExamScore
          }, 0) / completedWithResults.length
        )
      : 0

    return { upcoming, inProgress, thisMonthCompleted, averageScore }
  }, [allExaminations])

  // Get unique exam types and subjects
  const { examTypes, subjects } = useMemo(() => {
    const uniqueExamTypes = [...new Set(allExaminations.map(e => e.examType))].sort()
    const uniqueSubjects = [...new Set(allExaminations.map(e => e.subject))].sort()
    return { examTypes: uniqueExamTypes, subjects: uniqueSubjects }
  }, [allExaminations])

  // Filter examinations
  const filteredExaminations = useMemo(() => {
    return allExaminations.filter(exam => {
      const matchesSearch =
        exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exam.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exam.educatorName.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === "all" || exam.status === statusFilter
      const matchesExamType = examTypeFilter === "all" || exam.examType === examTypeFilter

      return matchesSearch && matchesStatus && matchesExamType
    })
  }, [allExaminations, searchTerm, statusFilter, examTypeFilter])

  // Sort by status priority and date
  const sortedExaminations = useMemo(() => {
    const statusOrder = { "In Progress": 0, "Scheduled": 1, "Completed": 2, "Cancelled": 3 }
    return [...filteredExaminations].sort((a, b) => {
      const statusDiff = statusOrder[a.status as keyof typeof statusOrder] - statusOrder[b.status as keyof typeof statusOrder]
      if (statusDiff !== 0) return statusDiff
      return new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime()
    })
  }, [filteredExaminations])

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      "Scheduled": { color: "bg-blue-500/20 text-blue-300 border-blue-500/50", icon: <Calendar className="h-3 w-3" /> },
      "In Progress": { color: "bg-yellow-500/20 text-yellow-300 border-yellow-500/50", icon: <Clock className="h-3 w-3" /> },
      "Completed": { color: "bg-green-500/20 text-green-300 border-green-500/50", icon: <CheckCircle className="h-3 w-3" /> },
      "Cancelled": { color: "bg-red-500/20 text-red-300 border-red-500/50", icon: <AlertCircle className="h-3 w-3" /> }
    }

    const config = statusConfig[status as keyof typeof statusConfig]
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${config.color}`}>
        {config.icon}
        {status}
      </span>
    )
  }

  const getExamTypeBadge = (examType: string) => {
    const typeColors = {
      "Quiz": "bg-green-500/20 text-green-300",
      "Unit Test": "bg-blue-500/20 text-blue-300",
      "Mid-term": "bg-yellow-500/20 text-yellow-300",
      "Final": "bg-red-500/20 text-red-300",
      "Practice Test": "bg-purple-500/20 text-purple-300"
    }
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${typeColors[examType as keyof typeof typeColors] || typeColors["Quiz"]}`}>
        {examType}
      </span>
    )
  }

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const diffTime = date.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    let dateText = ""
    if (diffDays === 0) dateText = "Today"
    else if (diffDays === 1) dateText = "Tomorrow"
    else if (diffDays === -1) dateText = "Yesterday"
    else if (diffDays > 0) dateText = `In ${diffDays} days`
    else dateText = `${Math.abs(diffDays)} days ago`

    const timeText = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })

    return `${dateText} at ${timeText}`
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
    }
    return `${mins}m`
  }

  return (
    <div className="min-h-full space-y-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-4">
          <FileText className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Examinations</h1>
            <p className="text-muted-foreground">Manage and monitor student examinations</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/15 transition-all">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-muted-foreground">Upcoming Exams</h3>
            <Calendar className="h-5 w-5 text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.upcoming}</p>
          <p className="text-xs text-muted-foreground mt-2">Scheduled</p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/15 transition-all">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-muted-foreground">In Progress</h3>
            <Clock className="h-5 w-5 text-yellow-400" />
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.inProgress}</p>
          <p className="text-xs text-muted-foreground mt-2">Currently active</p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/15 transition-all">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-muted-foreground">Completed</h3>
            <CheckCircle className="h-5 w-5 text-green-400" />
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.thisMonthCompleted}</p>
          <p className="text-xs text-muted-foreground mt-2">This month</p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/15 transition-all">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-muted-foreground">Average Score</h3>
            <TrendingUp className="h-5 w-5 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.averageScore}%</p>
          <p className="text-xs text-muted-foreground mt-2">Overall average</p>
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
                placeholder="Search examinations by title, subject, educator..."
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
            <option value="Scheduled">Scheduled</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <select
            value={examTypeFilter}
            onChange={(e) => setExamTypeFilter(e.target.value)}
            className="px-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:border-primary text-foreground"
          >
            <option value="all">All Types</option>
            {examTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>

          <button
            onClick={() => setShowScheduleModal(true)}
            className="px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg btn-primary-action flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Schedule Exam
          </button>
        </div>
      </div>

      {/* Examinations List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Loading examinations...</h3>
            <p className="text-muted-foreground">Please wait while we fetch the data</p>
          </div>
        ) : sortedExaminations.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No examinations found</h3>
            <p className="text-muted-foreground">No examinations match your current filters.</p>
          </div>
        ) : (
          sortedExaminations.map((exam) => (
            <div
              key={exam.id}
              className={`bg-white/10 backdrop-blur-sm rounded-lg border ${
                selectedExam === exam.id ? 'border-primary' : 'border-white/20'
              } hover:bg-white/15 transition-all cursor-pointer`}
              onClick={() => setSelectedExam(exam.id === selectedExam ? null : exam.id)}
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-foreground">{exam.title}</h3>
                      {getStatusBadge(exam.status)}
                      {getExamTypeBadge(exam.examType)}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{exam.description}</p>

                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        <span className="text-primary">{exam.subject}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>👨‍🏫</span>
                        <span className="text-muted-foreground">{exam.educatorName}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span className="text-muted-foreground">{formatDuration(exam.duration)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span className="text-muted-foreground">{exam.enrolledStudents.length} students</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Exam Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <span className="text-muted-foreground text-sm">Scheduled: </span>
                    <div className="font-medium text-foreground">{formatDateTime(exam.scheduledDate)}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-sm">Total Marks: </span>
                    <div className="font-medium text-foreground">{exam.totalMarks}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-sm">Passing Marks: </span>
                    <div className="font-medium text-foreground">{exam.passingMarks}</div>
                  </div>
                  <div className="flex items-center gap-1">
                    {exam.isOnline ? (
                      <><Monitor className="h-4 w-4 text-blue-400" /><span className="text-blue-400">Online</span></>
                    ) : (
                      <><MapPin className="h-4 w-4 text-orange-400" /><span className="text-orange-400">{exam.venue}</span></>
                    )}
                  </div>
                </div>

                {/* Results Summary for Completed Exams */}
                {exam.examResults && exam.examResults.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold mb-2">Results Summary</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Completed: </span>
                        <span className="font-medium text-foreground">{exam.examResults.filter(r => r.status === "Completed").length}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Average: </span>
                        <span className="font-medium text-foreground">
                          {Math.round(exam.examResults.reduce((sum, r) => sum + r.percentage, 0) / exam.examResults.length)}%
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Highest: </span>
                        <span className="font-medium text-green-400">
                          {Math.max(...exam.examResults.map(r => r.percentage))}%
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Pass Rate: </span>
                        <span className="font-medium text-foreground">
                          {Math.round((exam.examResults.filter(r => r.obtainedMarks >= exam.passingMarks).length / exam.examResults.length) * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Expanded Details */}
                {selectedExam === exam.id && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    {/* Instructions */}
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold mb-2">Instructions</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {exam.instructions.map((instruction, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            <span>{instruction}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Syllabus */}
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold mb-2">Syllabus Coverage</h4>
                      <div className="flex flex-wrap gap-2">
                        {exam.syllabus.map((topic, idx) => (
                          <span key={idx} className="px-2 py-1 bg-white/10 text-xs rounded-md">
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Individual Results for Completed Exams */}
                    {exam.examResults && exam.examResults.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold mb-3">Student Results</h4>
                        <div className="space-y-2">
                          {exam.examResults.slice(0, 5).map((result) => (
                            <div key={result.studentId} className="flex items-center justify-between bg-black/20 rounded p-3">
                              <div className="flex items-center gap-3">
                                <span className="font-medium text-foreground">{result.studentName}</span>
                                <span className={`px-2 py-1 rounded text-xs ${
                                  result.status === "Completed" ? "bg-green-500/20 text-green-300" :
                                  result.status === "In Progress" ? "bg-yellow-500/20 text-yellow-300" :
                                  "bg-gray-500/20 text-gray-400"
                                }`}>
                                  {result.status}
                                </span>
                                {result.rank && (
                                  <span className="text-xs text-muted-foreground">Rank #{result.rank}</span>
                                )}
                              </div>
                              <div className="text-right">
                                <div className="font-bold text-foreground">
                                  {result.obtainedMarks}/{exam.totalMarks}
                                </div>
                                <div className={`text-sm ${
                                  result.percentage >= (exam.passingMarks / exam.totalMarks) * 100
                                    ? "text-green-400" : "text-red-400"
                                }`}>
                                  {result.percentage}% ({result.grade})
                                </div>
                              </div>
                            </div>
                          ))}
                          {exam.examResults.length > 5 && (
                            <div className="text-xs text-muted-foreground text-center">
                              +{exam.examResults.length - 5} more students
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2">
                      {exam.status === "Scheduled" && (
                        <button className="flex-1 px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg btn-primary-action transition-colors">
                          Start Exam
                        </button>
                      )}
                      {exam.status === "Completed" && (
                        <button className="flex-1 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded-lg transition-colors">
                          View Results
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleEditExamination(exam)
                        }}
                        className="flex-1 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <Edit size={16} />
                        Edit Exam
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteExamination(exam.id)
                        }}
                        className="flex-1 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <Trash2 size={16} />
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

      {/* Schedule Exam Modal */}
      <GlassModal
        isOpen={showScheduleModal}
        onClose={() => {
          setShowScheduleModal(false)
          resetForm()
        }}
        size="xl"
        className="max-h-[90vh] overflow-y-auto"
      >
        <div className="space-y-6">
          {/* Modal Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <FileText className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">
                {isEditMode ? 'Edit Exam' : 'Schedule New Exam'}
              </h2>
            </div>
            <button
              onClick={() => {
                setShowScheduleModal(false)
                resetForm()
              }}
              className="p-2 rounded-lg hover:bg-white/10 transition-all"
            >
              <X size={20} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleScheduleExam} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Exam Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleFormChange('title', e.target.value)}
                placeholder="e.g., Physics Unit Test - Mechanics"
                required
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:border-primary/50 transition-all"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleFormChange('description', e.target.value)}
                placeholder="Enter exam description..."
                required
                rows={3}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:border-primary/50 transition-all resize-none"
              />
            </div>

            {/* Subject and Exam Type Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Subject */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Subject <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => handleFormChange('subject', e.target.value)}
                  placeholder="e.g., Physics, Mathematics"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:border-primary/50 transition-all"
                />
              </div>

              {/* Exam Type */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Exam Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.examType}
                  onChange={(e) => handleFormChange('examType', e.target.value as Examination['examType'])}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:border-primary/50 transition-all"
                >
                  <option value="Quiz">Quiz</option>
                  <option value="Unit Test">Unit Test</option>
                  <option value="Mid-term">Mid-term</option>
                  <option value="Final">Final</option>
                  <option value="Practice Test">Practice Test</option>
                </select>
              </div>
            </div>

            {/* Scheduled Date and Duration Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Scheduled Date */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Scheduled Date & Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  value={formData.scheduledDate}
                  onChange={(e) => handleFormChange('scheduledDate', e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:border-primary/50 transition-all"
                />
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Duration (minutes) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => handleFormChange('duration', parseInt(e.target.value))}
                  placeholder="60"
                  min="1"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:border-primary/50 transition-all"
                />
              </div>
            </div>

            {/* Marks Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Total Marks */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Total Marks <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.totalMarks}
                  onChange={(e) => handleFormChange('totalMarks', parseInt(e.target.value))}
                  placeholder="100"
                  min="1"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:border-primary/50 transition-all"
                />
              </div>

              {/* Passing Marks */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Passing Marks <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.passingMarks}
                  onChange={(e) => handleFormChange('passingMarks', parseInt(e.target.value))}
                  placeholder="40"
                  min="1"
                  max={formData.totalMarks}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:border-primary/50 transition-all"
                />
              </div>
            </div>

            {/* Exam Mode */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Exam Mode <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="examMode"
                    checked={formData.isOnline === true}
                    onChange={() => handleFormChange('isOnline', true)}
                    className="w-5 h-5"
                  />
                  <div className="flex items-center gap-2">
                    <Monitor size={16} className="text-blue-400" />
                    <span className="text-sm">Online</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="examMode"
                    checked={formData.isOnline === false}
                    onChange={() => handleFormChange('isOnline', false)}
                    className="w-5 h-5"
                  />
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-orange-400" />
                    <span className="text-sm">Offline</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Venue (only for offline exams) */}
            {!formData.isOnline && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  Venue <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.venue}
                  onChange={(e) => handleFormChange('venue', e.target.value)}
                  placeholder="e.g., Physics Lab, Room 101"
                  required={!formData.isOnline}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:border-primary/50 transition-all"
                />
              </div>
            )}

            {/* Instructions */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Instructions (Optional)
              </label>
              <textarea
                value={formData.instructions}
                onChange={(e) => handleFormChange('instructions', e.target.value)}
                placeholder="Enter exam instructions, one per line..."
                rows={4}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:border-primary/50 transition-all resize-none"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Enter each instruction on a new line
              </p>
            </div>

            {/* Syllabus Coverage */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Syllabus Coverage (Optional)
              </label>
              <textarea
                value={formData.syllabus}
                onChange={(e) => handleFormChange('syllabus', e.target.value)}
                placeholder="Enter topics covered, separated by commas..."
                rows={3}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:border-primary/50 transition-all resize-none"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Separate topics with commas (e.g., Newton's Laws, Forces, Motion)
              </p>
            </div>

            {/* Form Actions */}
            <div className="flex gap-3 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => {
                  setShowScheduleModal(false)
                  resetForm()
                }}
                className="flex-1 px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 transition-all font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-all font-medium flex items-center justify-center gap-2"
              >
                <Save size={18} />
                {isEditMode ? 'Update Exam' : 'Schedule Exam'}
              </button>
            </div>
          </form>
        </div>
      </GlassModal>
    </div>
  )
}