"use client"

import { useState, useMemo } from "react"
import { FileText, Calendar, Clock, TrendingUp, Users, MapPin, Monitor, CheckCircle, AlertCircle, Plus, Filter, Search } from "lucide-react"
import { examinations } from "@/app/(features)/LearningActivities/learningActivitiesDummyData"

export default function TravailExamsPage() {
  const [statusFilter, setStatusFilter] = useState("all")
  const [examTypeFilter, setExamTypeFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedExam, setSelectedExam] = useState<string | null>(null)

  // Calculate stats
  const stats = useMemo(() => {
    const upcoming = examinations.filter(exam => exam.status === "Scheduled").length
    const inProgress = examinations.filter(exam => exam.status === "In Progress").length

    const thisMonthCompleted = examinations.filter(exam => {
      if (exam.status !== "Completed") return false
      const monthAgo = new Date()
      monthAgo.setMonth(monthAgo.getMonth() - 1)
      return new Date(exam.scheduledDate) >= monthAgo
    }).length

    const completedWithResults = examinations.filter(exam =>
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
  }, [])

  // Get unique exam types and subjects
  const { examTypes, subjects } = useMemo(() => {
    const uniqueExamTypes = [...new Set(examinations.map(e => e.examType))].sort()
    const uniqueSubjects = [...new Set(examinations.map(e => e.subject))].sort()
    return { examTypes: uniqueExamTypes, subjects: uniqueSubjects }
  }, [])

  // Filter examinations
  const filteredExaminations = useMemo(() => {
    return examinations.filter(exam => {
      const matchesSearch =
        exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exam.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exam.educatorName.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === "all" || exam.status === statusFilter
      const matchesExamType = examTypeFilter === "all" || exam.examType === examTypeFilter

      return matchesSearch && matchesStatus && matchesExamType
    })
  }, [searchTerm, statusFilter, examTypeFilter])

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
    <div className="min-h-full p-6 space-y-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-4">
          <FileText className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Examinations</h1>
            <p className="opacity-70" style={{ color: 'var(--sidebar-text-color, inherit)' }}>Manage and monitor student examinations</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/15 transition-all">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Upcoming Exams</h3>
            <Calendar className="h-5 w-5 text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.upcoming}</p>
          <p className="text-sm opacity-70" style={{ color: 'var(--sidebar-text-color, inherit)' }}>Scheduled</p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/15 transition-all">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">In Progress</h3>
            <Clock className="h-5 w-5 text-yellow-400" />
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.inProgress}</p>
          <p className="text-sm opacity-70" style={{ color: 'var(--sidebar-text-color, inherit)' }}>Currently active</p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/15 transition-all">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Completed</h3>
            <CheckCircle className="h-5 w-5 text-green-400" />
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.thisMonthCompleted}</p>
          <p className="text-sm opacity-70" style={{ color: 'var(--sidebar-text-color, inherit)' }}>This month</p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/15 transition-all">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Average Score</h3>
            <TrendingUp className="h-5 w-5 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.averageScore}%</p>
          <p className="text-sm opacity-70" style={{ color: 'var(--sidebar-text-color, inherit)' }}>Overall average</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 opacity-70" style={{ color: 'var(--sidebar-text-color, inherit)' }} />
              <input
                type="text"
                placeholder="Search examinations by title, subject, educator..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:border-primary text-foreground placeholder:opacity-70"
                style={{ "--tw-placeholder-color": 'var(--sidebar-text-color, inherit)' } as React.CSSProperties}
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

          <button className="px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg transition-colors flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Schedule Exam
          </button>
        </div>
      </div>

      {/* Examinations List */}
      <div className="space-y-4">
        {sortedExaminations.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20 text-center">
            <FileText className="h-12 w-12 opacity-70 mx-auto mb-4" style={{ color: 'var(--sidebar-text-color, inherit)' }} />
            <h3 className="text-lg font-semibold text-foreground mb-2">No examinations found</h3>
            <p className="opacity-70" style={{ color: 'var(--sidebar-text-color, inherit)' }}>No examinations match your current filters.</p>
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
                    <p className="text-sm opacity-70 mb-3" style={{ color: 'var(--sidebar-text-color, inherit)' }}>{exam.description}</p>

                    <div className="flex flex-wrap gap-4 text-sm opacity-70" style={{ color: 'var(--sidebar-text-color, inherit)' }}>
                      <div className="flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        <span className="text-primary">{exam.subject}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>👨‍🏫</span>
                        <span>{exam.educatorName}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{formatDuration(exam.duration)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{exam.enrolledStudents.length} students</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Exam Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <span className="opacity-70 text-sm" style={{ color: 'var(--sidebar-text-color, inherit)' }}>Scheduled: </span>
                    <div className="font-medium">{formatDateTime(exam.scheduledDate)}</div>
                  </div>
                  <div>
                    <span className="opacity-70 text-sm" style={{ color: 'var(--sidebar-text-color, inherit)' }}>Total Marks: </span>
                    <div className="font-medium">{exam.totalMarks}</div>
                  </div>
                  <div>
                    <span className="opacity-70 text-sm" style={{ color: 'var(--sidebar-text-color, inherit)' }}>Passing Marks: </span>
                    <div className="font-medium">{exam.passingMarks}</div>
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
                        <span className="opacity-70" style={{ color: 'var(--sidebar-text-color, inherit)' }}>Completed: </span>
                        <span className="font-medium">{exam.examResults.filter(r => r.status === "Completed").length}</span>
                      </div>
                      <div>
                        <span className="opacity-70" style={{ color: 'var(--sidebar-text-color, inherit)' }}>Average: </span>
                        <span className="font-medium">
                          {Math.round(exam.examResults.reduce((sum, r) => sum + r.percentage, 0) / exam.examResults.length)}%
                        </span>
                      </div>
                      <div>
                        <span className="opacity-70" style={{ color: 'var(--sidebar-text-color, inherit)' }}>Highest: </span>
                        <span className="font-medium text-green-400">
                          {Math.max(...exam.examResults.map(r => r.percentage))}%
                        </span>
                      </div>
                      <div>
                        <span className="opacity-70" style={{ color: 'var(--sidebar-text-color, inherit)' }}>Pass Rate: </span>
                        <span className="font-medium">
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
                      <ul className="text-sm opacity-70 space-y-1" style={{ color: 'var(--sidebar-text-color, inherit)' }}>
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
                                <span className="font-medium">{result.studentName}</span>
                                <span className={`px-2 py-1 rounded text-xs ${
                                  result.status === "Completed" ? "bg-green-500/20 text-green-300" :
                                  result.status === "In Progress" ? "bg-yellow-500/20 text-yellow-300" :
                                  "bg-gray-500/20 text-gray-400"
                                }`}>
                                  {result.status}
                                </span>
                                {result.rank && (
                                  <span className="text-xs opacity-70" style={{ color: 'var(--sidebar-text-color, inherit)' }}>Rank #{result.rank}</span>
                                )}
                              </div>
                              <div className="text-right">
                                <div className="font-bold">
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
                            <div className="text-xs opacity-70 text-center" style={{ color: 'var(--sidebar-text-color, inherit)' }}>
                              +{exam.examResults.length - 5} more students
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2">
                      {exam.status === "Scheduled" && (
                        <button className="flex-1 px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg transition-colors">
                          Start Exam
                        </button>
                      )}
                      {exam.status === "Completed" && (
                        <button className="flex-1 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded-lg transition-colors">
                          View Results
                        </button>
                      )}
                      <button className="flex-1 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg transition-colors">
                        Edit Exam
                      </button>
                      <button className="flex-1 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-lg transition-colors">
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
    </div>
  )
}