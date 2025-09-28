"use client"

import { useState, useMemo } from "react"
import { BookOpen, TrendingUp, Target, Users, Calendar, Award, AlertCircle, BarChart3, PieChart } from "lucide-react"
import { studentPerformances, classPerformanceMetrics } from "@/app/(features)/Performance/comprehensivePerformanceData"

export default function SubjectAnalyticsPage() {
  const [selectedSubject, setSelectedSubject] = useState("Mathematics")
  const [selectedTimeframe, setSelectedTimeframe] = useState("semester")
  const [selectedMetric, setSelectedMetric] = useState("performance")

  // Get all unique subjects from data
  const allSubjects = useMemo(() => {
    const subjects = new Set<string>()
    studentPerformances.forEach(student => {
      student.subjectPerformances.forEach(subject => {
        subjects.add(subject.subject)
      })
    })
    return Array.from(subjects)
  }, [])

  // Calculate subject-wise analytics
  const subjectAnalytics = useMemo(() => {
    const studentsInSubject = studentPerformances.filter(student =>
      student.subjectPerformances.some(subject => subject.subject === selectedSubject)
    )

    const subjectPerformances = studentsInSubject.map(student =>
      student.subjectPerformances.find(subject => subject.subject === selectedSubject)
    ).filter(Boolean)

    const totalStudents = studentsInSubject.length
    const averagePerformance = Math.round(
      subjectPerformances.reduce((sum, perf) => sum + (perf?.percentage || 0), 0) / totalStudents
    )

    // Grade distribution
    const gradeDistribution = {
      A: subjectPerformances.filter(p => (p?.percentage || 0) >= 90).length,
      B: subjectPerformances.filter(p => (p?.percentage || 0) >= 80 && (p?.percentage || 0) < 90).length,
      C: subjectPerformances.filter(p => (p?.percentage || 0) >= 70 && (p?.percentage || 0) < 80).length,
      D: subjectPerformances.filter(p => (p?.percentage || 0) >= 60 && (p?.percentage || 0) < 70).length,
      F: subjectPerformances.filter(p => (p?.percentage || 0) < 60).length,
    }

    // Calculate improvement trends
    const improvingStudents = subjectPerformances.filter(p => p?.trend === 'Improving').length
    const decliningStudents = subjectPerformances.filter(p => p?.trend === 'Declining').length
    const stableStudents = totalStudents - improvingStudents - decliningStudents

    // Strong and weak areas analysis
    const allStrongAreas = subjectPerformances.flatMap(p => p?.strongAreas || [])
    const allWeakAreas = subjectPerformances.flatMap(p => p?.weakAreas || [])

    const strongAreaCounts = allStrongAreas.reduce((acc, area) => {
      acc[area] = (acc[area] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const weakAreaCounts = allWeakAreas.reduce((acc, area) => {
      acc[area] = (acc[area] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const topStrongAreas = Object.entries(strongAreaCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([area, count]) => ({ area, count, percentage: Math.round((count / totalStudents) * 100) }))

    const topWeakAreas = Object.entries(weakAreaCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([area, count]) => ({ area, count, percentage: Math.round((count / totalStudents) * 100) }))

    return {
      totalStudents,
      averagePerformance,
      gradeDistribution,
      improvingStudents,
      decliningStudents,
      stableStudents,
      topStrongAreas,
      topWeakAreas,
      subjectPerformances,
      studentsInSubject
    }
  }, [selectedSubject])

  const getPerformanceColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-400'
    if (percentage >= 80) return 'text-blue-400'
    if (percentage >= 70) return 'text-yellow-400'
    if (percentage >= 60) return 'text-orange-400'
    return 'text-red-400'
  }

  const getGradeColor = (grade: string) => {
    const colors = {
      'A': 'text-green-400', 'A+': 'text-green-400', 'A-': 'text-green-400',
      'B': 'text-blue-400', 'B+': 'text-blue-400', 'B-': 'text-blue-400',
      'C': 'text-yellow-400', 'C+': 'text-yellow-400', 'C-': 'text-yellow-400',
      'D': 'text-orange-400', 'D+': 'text-orange-400', 'D-': 'text-orange-400',
      'F': 'text-red-400'
    }
    return colors[grade as keyof typeof colors] || 'text-gray-400'
  }

  return (
    <div className="min-h-full">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-4">
          <BookOpen className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Subject-wise Analytics</h1>
            <p className="text-muted-foreground">Detailed performance analysis by subject</p>
          </div>
        </div>
      </div>

      {/* Subject Selection */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 mb-8">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-muted-foreground" />
            <label className="text-sm text-muted-foreground">Select Subject:</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="px-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:border-primary text-foreground"
            >
              {allSubjects.map(subject => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="px-3 py-2 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:border-primary text-foreground"
            >
              <option value="month">This Month</option>
              <option value="semester">This Semester</option>
              <option value="year">Academic Year</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="px-3 py-2 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:border-primary text-foreground"
            >
              <option value="performance">Performance</option>
              <option value="improvement">Improvement</option>
              <option value="participation">Participation</option>
            </select>
          </div>
        </div>
      </div>

      {/* Subject Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <span className="text-muted-foreground">Subject Average</span>
            <Target className="h-5 w-5 text-primary" />
          </div>
          <div className={`text-2xl font-bold ${getPerformanceColor(subjectAnalytics.averagePerformance)}`}>
            {subjectAnalytics.averagePerformance}%
          </div>
          <div className="text-xs text-muted-foreground mt-2">{selectedSubject}</div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <span className="text-muted-foreground">Total Students</span>
            <Users className="h-5 w-5 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-blue-400">{subjectAnalytics.totalStudents}</div>
          <div className="text-xs text-muted-foreground mt-2">Enrolled in {selectedSubject}</div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <span className="text-muted-foreground">Top Performers</span>
            <Award className="h-5 w-5 text-yellow-400" />
          </div>
          <div className="text-2xl font-bold text-green-400">{subjectAnalytics.gradeDistribution.A}</div>
          <div className="text-xs text-muted-foreground mt-2">A Grade students</div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <span className="text-muted-foreground">Improving</span>
            <TrendingUp className="h-5 w-5 text-green-400" />
          </div>
          <div className="text-2xl font-bold text-green-400">{subjectAnalytics.improvingStudents}</div>
          <div className="text-xs text-muted-foreground mt-2">Students showing improvement</div>
        </div>
      </div>

      {/* Subject Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Grade Distribution */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <PieChart className="h-5 w-5" />
            Grade Distribution in {selectedSubject}
          </h3>

          <div className="space-y-4">
            {Object.entries(subjectAnalytics.gradeDistribution).map(([grade, count]) => {
              const percentage = Math.round((count / subjectAnalytics.totalStudents) * 100)
              return (
                <div key={grade} className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Grade {grade}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-black/30 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full ${
                          grade === 'A' ? 'bg-green-400' :
                          grade === 'B' ? 'bg-blue-400' :
                          grade === 'C' ? 'bg-yellow-400' :
                          grade === 'D' ? 'bg-orange-400' : 'bg-red-400'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium w-16">{count} ({percentage}%)</span>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-6 grid grid-cols-3 gap-4 text-center">
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
              <div className="text-lg font-bold text-green-400">{subjectAnalytics.improvingStudents}</div>
              <div className="text-xs text-muted-foreground">Improving</div>
            </div>
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
              <div className="text-lg font-bold text-yellow-400">{subjectAnalytics.stableStudents}</div>
              <div className="text-xs text-muted-foreground">Stable</div>
            </div>
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
              <div className="text-lg font-bold text-red-400">{subjectAnalytics.decliningStudents}</div>
              <div className="text-xs text-muted-foreground">Declining</div>
            </div>
          </div>
        </div>

        {/* Top Student Performers */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Award className="h-5 w-5" />
            Top Performers in {selectedSubject}
          </h3>

          <div className="space-y-3">
            {subjectAnalytics.studentsInSubject
              .sort((a, b) => {
                const aSubject = a.subjectPerformances.find(s => s.subject === selectedSubject)
                const bSubject = b.subjectPerformances.find(s => s.subject === selectedSubject)
                return (bSubject?.percentage || 0) - (aSubject?.percentage || 0)
              })
              .slice(0, 8)
              .map((student, idx) => {
                const subjectPerf = student.subjectPerformances.find(s => s.subject === selectedSubject)
                return (
                  <div key={student.studentId} className="bg-black/20 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold">#{idx + 1}</span>
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">{student.studentName}</h4>
                          <p className="text-xs text-muted-foreground">Overall Rank #{student.rank}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className={`font-bold ${getGradeColor(subjectPerf?.currentGrade || 'F')}`}>
                          {subjectPerf?.currentGrade} ({subjectPerf?.percentage}%)
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {subjectPerf?.trend || 'Stable'}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      </div>

      {/* Subject Strengths and Weaknesses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Strong Areas */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Award className="h-5 w-5 text-green-400" />
            Strong Areas in {selectedSubject}
          </h3>

          <div className="space-y-3">
            {subjectAnalytics.topStrongAreas.map((area, idx) => (
              <div key={idx} className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-green-400">{area.area}</h4>
                  <span className="text-sm text-green-300">{area.percentage}%</span>
                </div>
                <div className="w-full bg-black/30 rounded-full h-2">
                  <div
                    className="bg-green-400 h-2 rounded-full"
                    style={{ width: `${area.percentage}%` }}
                  />
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {area.count} out of {subjectAnalytics.totalStudents} students excel in this area
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weak Areas */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-400" />
            Areas Needing Improvement
          </h3>

          <div className="space-y-3">
            {subjectAnalytics.topWeakAreas.map((area, idx) => (
              <div key={idx} className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-red-400">{area.area}</h4>
                  <span className="text-sm text-red-300">{area.percentage}%</span>
                </div>
                <div className="w-full bg-black/30 rounded-full h-2">
                  <div
                    className="bg-red-400 h-2 rounded-full"
                    style={{ width: `${area.percentage}%` }}
                  />
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {area.count} out of {subjectAnalytics.totalStudents} students need support in this area
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Subject Insights */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          {selectedSubject} Performance Insights
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">{subjectAnalytics.averagePerformance}%</div>
            <div className="text-sm text-muted-foreground mb-2">Subject Average</div>
            <div className="text-xs text-blue-300">
              {subjectAnalytics.averagePerformance >= 80 ? 'Above target' : 'Needs improvement'}
            </div>
          </div>

          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-400">
              {Math.round((subjectAnalytics.improvingStudents / subjectAnalytics.totalStudents) * 100)}%
            </div>
            <div className="text-sm text-muted-foreground mb-2">Improvement Rate</div>
            <div className="text-xs text-green-300">Students showing progress</div>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400">
              {Math.round(((subjectAnalytics.gradeDistribution.A + subjectAnalytics.gradeDistribution.B) / subjectAnalytics.totalStudents) * 100)}%
            </div>
            <div className="text-sm text-muted-foreground mb-2">Success Rate</div>
            <div className="text-xs text-yellow-300">A & B grade students</div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-black/20 rounded-lg p-4">
            <h4 className="font-medium text-green-400 mb-2">📈 Positive Trends</h4>
            <ul className="text-sm space-y-1">
              <li>• {subjectAnalytics.improvingStudents} students showing improvement</li>
              <li>• {subjectAnalytics.gradeDistribution.A} students achieving A grades</li>
              <li>• Strong performance in {subjectAnalytics.topStrongAreas[0]?.area || 'core concepts'}</li>
            </ul>
          </div>

          <div className="bg-black/20 rounded-lg p-4">
            <h4 className="font-medium text-red-400 mb-2">⚠️ Areas of Concern</h4>
            <ul className="text-sm space-y-1">
              <li>• {subjectAnalytics.decliningStudents} students showing decline</li>
              <li>• {subjectAnalytics.gradeDistribution.F} students below passing grade</li>
              <li>• Focus needed on {subjectAnalytics.topWeakAreas[0]?.area || 'weak areas'}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}