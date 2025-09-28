"use client"

import { useState, useMemo } from "react"
import { Users, TrendingUp, BookOpen, Award, AlertTriangle, Calendar, Target, Filter, Search, ChevronDown, ChevronUp } from "lucide-react"
import { classPerformanceMetrics, studentPerformances } from "@/app/(features)/Performance/comprehensivePerformanceData"

export default function ClassPerformancePage() {
  const [selectedClassId, setSelectedClassId] = useState(classPerformanceMetrics[0]?.classId || "")
  const [selectedTimeframe, setSelectedTimeframe] = useState("semester")
  const [showStudentList, setShowStudentList] = useState(false)

  const selectedClass = useMemo(() => {
    return classPerformanceMetrics.find(c => c.classId === selectedClassId)
  }, [selectedClassId])

  // Get students for selected class (simulate class enrollment)
  const classStudents = useMemo(() => {
    if (!selectedClass) return []
    return studentPerformances.filter(student =>
      student.subjectPerformances.some(subject => subject.subject === selectedClass.subject)
    ).slice(0, selectedClass.totalStudents)
  }, [selectedClass])

  const getPerformanceColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-400'
    if (percentage >= 80) return 'text-blue-400'
    if (percentage >= 70) return 'text-yellow-400'
    if (percentage >= 60) return 'text-orange-400'
    return 'text-red-400'
  }

  const getGradeDistributionPercentage = (count: number, total: number) => {
    return Math.round((count / total) * 100)
  }

  if (!selectedClass) {
    return <div>No class data available</div>
  }

  return (
    <div className="min-h-full">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-4">
          <Users className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Class-wise Performance</h1>
            <p className="text-muted-foreground">Analyze performance metrics for individual classes</p>
          </div>
        </div>
      </div>

      {/* Class Selection */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 mb-8">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <label className="text-sm text-muted-foreground">Select Class:</label>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="px-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:border-primary text-foreground"
            >
              {classPerformanceMetrics.map(cls => (
                <option key={cls.classId} value={cls.classId}>
                  {cls.className} - {cls.educatorName} ({cls.totalStudents} students)
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
        </div>
      </div>

      {/* Class Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <span className="text-muted-foreground">Class Average</span>
            <Target className="h-5 w-5 text-primary" />
          </div>
          <div className={`text-2xl font-bold ${getPerformanceColor(selectedClass.averagePerformance)}`}>
            {selectedClass.averagePerformance}%
          </div>
          <div className="text-xs text-muted-foreground mt-2">{selectedClass.subject}</div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <span className="text-muted-foreground">Top Performers</span>
            <Award className="h-5 w-5 text-yellow-400" />
          </div>
          <div className="text-2xl font-bold text-green-400">{selectedClass.topPerformers}</div>
          <div className="text-xs text-muted-foreground mt-2">Above 90% performance</div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <span className="text-muted-foreground">Need Support</span>
            <AlertTriangle className="h-5 w-5 text-red-400" />
          </div>
          <div className="text-2xl font-bold text-red-400">{selectedClass.needSupport}</div>
          <div className="text-xs text-muted-foreground mt-2">Require intervention</div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <span className="text-muted-foreground">Attendance Rate</span>
            <Calendar className="h-5 w-5 text-blue-400" />
          </div>
          <div className={`text-2xl font-bold ${getPerformanceColor(selectedClass.attendanceRate)}`}>
            {selectedClass.attendanceRate}%
          </div>
          <div className="text-xs text-muted-foreground mt-2">Class attendance</div>
        </div>
      </div>

      {/* Class Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Grade Distribution */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <h3 className="text-lg font-semibold mb-4">Grade Distribution</h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">A Grade (90%+)</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-black/30 rounded-full h-3">
                  <div
                    className="bg-green-400 h-3 rounded-full"
                    style={{ width: `${getGradeDistributionPercentage(selectedClass.performanceDistribution.aGrade, selectedClass.totalStudents)}%` }}
                  />
                </div>
                <span className="text-sm font-medium w-12">{selectedClass.performanceDistribution.aGrade} ({getGradeDistributionPercentage(selectedClass.performanceDistribution.aGrade, selectedClass.totalStudents)}%)</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">B Grade (80-89%)</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-black/30 rounded-full h-3">
                  <div
                    className="bg-blue-400 h-3 rounded-full"
                    style={{ width: `${getGradeDistributionPercentage(selectedClass.performanceDistribution.bGrade, selectedClass.totalStudents)}%` }}
                  />
                </div>
                <span className="text-sm font-medium w-12">{selectedClass.performanceDistribution.bGrade} ({getGradeDistributionPercentage(selectedClass.performanceDistribution.bGrade, selectedClass.totalStudents)}%)</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">C Grade (70-79%)</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-black/30 rounded-full h-3">
                  <div
                    className="bg-yellow-400 h-3 rounded-full"
                    style={{ width: `${getGradeDistributionPercentage(selectedClass.performanceDistribution.cGrade, selectedClass.totalStudents)}%` }}
                  />
                </div>
                <span className="text-sm font-medium w-12">{selectedClass.performanceDistribution.cGrade} ({getGradeDistributionPercentage(selectedClass.performanceDistribution.cGrade, selectedClass.totalStudents)}%)</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">D Grade (60-69%)</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-black/30 rounded-full h-3">
                  <div
                    className="bg-orange-400 h-3 rounded-full"
                    style={{ width: `${getGradeDistributionPercentage(selectedClass.performanceDistribution.dGrade, selectedClass.totalStudents)}%` }}
                  />
                </div>
                <span className="text-sm font-medium w-12">{selectedClass.performanceDistribution.dGrade} ({getGradeDistributionPercentage(selectedClass.performanceDistribution.dGrade, selectedClass.totalStudents)}%)</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">F Grade (&lt;60%)</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-black/30 rounded-full h-3">
                  <div
                    className="bg-red-400 h-3 rounded-full"
                    style={{ width: `${getGradeDistributionPercentage(selectedClass.performanceDistribution.fGrade, selectedClass.totalStudents)}%` }}
                  />
                </div>
                <span className="text-sm font-medium w-12">{selectedClass.performanceDistribution.fGrade} ({getGradeDistributionPercentage(selectedClass.performanceDistribution.fGrade, selectedClass.totalStudents)}%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Assessments */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <h3 className="text-lg font-semibold mb-4">Recent Assessments</h3>

          <div className="space-y-4">
            {selectedClass.recentAssessments.map((assessment, idx) => (
              <div key={idx} className="bg-black/20 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{assessment.testName}</h4>
                  <span className="text-xs text-muted-foreground">
                    {new Date(assessment.date).toLocaleDateString()}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Average Score: </span>
                    <span className={`font-medium ${getPerformanceColor(assessment.averageScore)}`}>
                      {assessment.averageScore}%
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Max Score: </span>
                    <span className="font-medium">{assessment.maxScore}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Participation: </span>
                    <span className="font-medium">{assessment.participation}/{selectedClass.totalStudents}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Rate: </span>
                    <span className={`font-medium ${getPerformanceColor((assessment.participation/selectedClass.totalStudents)*100)}`}>
                      {Math.round((assessment.participation/selectedClass.totalStudents)*100)}%
                    </span>
                  </div>
                </div>

                <div className="mt-2">
                  <div className="w-full bg-black/30 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full"
                      style={{ width: `${assessment.averageScore}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Class Information */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 mb-8">
        <h3 className="text-lg font-semibold mb-4">Class Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <span className="text-sm text-muted-foreground">Class Name</span>
            <div className="font-medium">{selectedClass.className}</div>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Educator</span>
            <div className="font-medium">{selectedClass.educatorName}</div>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Subject</span>
            <div className="font-medium">{selectedClass.subject}</div>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Total Students</span>
            <div className="font-medium">{selectedClass.totalStudents}</div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-center">
            <div className="text-lg font-bold text-green-400">{selectedClass.improvementRate}%</div>
            <div className="text-sm text-muted-foreground">Improvement Rate</div>
          </div>
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-center">
            <div className="text-lg font-bold text-blue-400">{selectedClass.averagePerformance}%</div>
            <div className="text-sm text-muted-foreground">Class Average</div>
          </div>
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 text-center">
            <div className="text-lg font-bold text-purple-400">{selectedClass.attendanceRate}%</div>
            <div className="text-sm text-muted-foreground">Attendance Rate</div>
          </div>
        </div>
      </div>

      {/* Student List (Expandable) */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Class Students ({classStudents.length})</h3>
          <button
            onClick={() => setShowStudentList(!showStudentList)}
            className="flex items-center gap-2 px-3 py-2 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-colors"
          >
            {showStudentList ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            {showStudentList ? 'Hide' : 'Show'} Students
          </button>
        </div>

        {showStudentList && (
          <div className="space-y-3">
            {classStudents.map((student) => {
              const subjectPerformance = student.subjectPerformances.find(s => s.subject === selectedClass.subject)
              return (
                <div key={student.studentId} className="bg-black/20 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium">{student.studentName.charAt(0)}</span>
                      </div>
                      <div>
                        <h4 className="font-medium">{student.studentName}</h4>
                        <p className="text-xs text-muted-foreground">Rank #{student.rank}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">Overall</div>
                        <div className={`font-bold ${getPerformanceColor(student.overallPercentage)}`}>
                          {student.overallGrade} ({student.overallPercentage}%)
                        </div>
                      </div>

                      {subjectPerformance && (
                        <div className="text-right">
                          <div className="text-sm text-muted-foreground">{selectedClass.subject}</div>
                          <div className={`font-bold ${getPerformanceColor(subjectPerformance.percentage)}`}>
                            {subjectPerformance.currentGrade} ({subjectPerformance.percentage}%)
                          </div>
                        </div>
                      )}

                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">Attendance</div>
                        <div className={`font-bold ${getPerformanceColor(student.attendanceRate)}`}>
                          {student.attendanceRate}%
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        {student.isTopPerformer && <Award className="h-4 w-4 text-yellow-400" />}
                        {student.needsSupport && <AlertTriangle className="h-4 w-4 text-red-400" />}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}