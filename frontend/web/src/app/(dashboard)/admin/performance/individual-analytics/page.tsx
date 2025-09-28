"use client"

import { useState, useMemo } from "react"
import { User, TrendingUp, BookOpen, Calendar, Target, AlertCircle, Award, ChevronLeft, ChevronRight, Filter, Search } from "lucide-react"
import { studentPerformances } from "@/app/(features)/Performance/comprehensivePerformanceData"

export default function IndividualStudentAnalyticsPage() {
  const [selectedStudentId, setSelectedStudentId] = useState(studentPerformances[0]?.studentId || "")
  const [selectedTimeframe, setSelectedTimeframe] = useState("semester")
  const [selectedSubject, setSelectedSubject] = useState("all")

  const selectedStudent = useMemo(() => {
    return studentPerformances.find(s => s.studentId === selectedStudentId)
  }, [selectedStudentId])

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

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'Improving':
        return <TrendingUp className="h-4 w-4 text-green-400" />
      case 'Declining':
        return <TrendingUp className="h-4 w-4 text-red-400 rotate-180" />
      default:
        return <span className="h-4 w-4 text-yellow-400">→</span>
    }
  }

  if (!selectedStudent) {
    return <div>No student data available</div>
  }

  return (
    <div className="min-h-full">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-4">
          <User className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Individual Student Analytics</h1>
            <p className="text-muted-foreground">Detailed performance analysis for individual students</p>
          </div>
        </div>
      </div>

      {/* Student Selection */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 mb-8">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <label className="text-sm text-muted-foreground">Select Student:</label>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="px-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:border-primary text-foreground"
            >
              {studentPerformances.map(student => (
                <option key={student.studentId} value={student.studentId}>
                  {student.studentName} - {student.overallGrade} ({student.overallPercentage}%)
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

      {/* Student Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <span className="text-muted-foreground">Overall Grade</span>
            <Award className="h-5 w-5 text-primary" />
          </div>
          <div className={`text-2xl font-bold ${getGradeColor(selectedStudent.overallGrade)}`}>
            {selectedStudent.overallGrade}
          </div>
          <div className="text-xs text-muted-foreground mt-2">{selectedStudent.overallPercentage}% overall</div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <span className="text-muted-foreground">Class Rank</span>
            <Target className="h-5 w-5 text-secondary" />
          </div>
          <div className="text-2xl font-bold">#{selectedStudent.rank}</div>
          <div className="text-xs text-muted-foreground mt-2">of {selectedStudent.totalStudents} students</div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <span className="text-muted-foreground">Attendance</span>
            <Calendar className="h-5 w-5 text-accent" />
          </div>
          <div className={`text-2xl font-bold ${
            selectedStudent.attendanceRate >= 90 ? 'text-green-400' :
            selectedStudent.attendanceRate >= 80 ? 'text-yellow-400' : 'text-red-400'
          }`}>
            {selectedStudent.attendanceRate}%
          </div>
          <div className="text-xs text-muted-foreground mt-2">This semester</div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <span className="text-muted-foreground">Monthly Progress</span>
            <TrendingUp className="h-5 w-5 text-green-400" />
          </div>
          <div className={`text-2xl font-bold ${
            selectedStudent.monthlyProgress > 0 ? 'text-green-400' :
            selectedStudent.monthlyProgress < 0 ? 'text-red-400' : 'text-yellow-400'
          }`}>
            {selectedStudent.monthlyProgress > 0 ? '+' : ''}{selectedStudent.monthlyProgress}%
          </div>
          <div className="text-xs text-muted-foreground mt-2">{selectedStudent.improvementTrend}</div>
        </div>
      </div>

      {/* Subject Performance Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Subject Performance Cards */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <h3 className="text-lg font-semibold mb-4">Subject Performance</h3>
          <div className="space-y-4">
            {selectedStudent.subjectPerformances.map((subject, idx) => (
              <div key={idx} className="bg-black/20 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <span className="font-medium">{subject.subject}</span>
                    <span className={`font-bold ${getGradeColor(subject.currentGrade)}`}>
                      {subject.currentGrade}
                    </span>
                  </div>
                  {getTrendIcon(subject.trend)}
                </div>

                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Performance</span>
                    <span className="font-medium">{subject.percentage}%</span>
                  </div>
                  <div className="w-full bg-black/30 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all"
                      style={{ width: `${subject.percentage}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-muted-foreground">Tests: </span>
                    <span>{subject.totalTests}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Average: </span>
                    <span>{subject.averageScore}%</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Highest: </span>
                    <span className="text-green-400">{subject.highestScore}%</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Lowest: </span>
                    <span className="text-red-400">{subject.lowestScore}%</span>
                  </div>
                </div>

                {/* Strong and Weak Areas */}
                <div className="mt-3">
                  <div className="mb-2">
                    <span className="text-xs text-green-400">Strong Areas: </span>
                    <span className="text-xs">{subject.strongAreas.join(", ")}</span>
                  </div>
                  <div>
                    <span className="text-xs text-red-400">Weak Areas: </span>
                    <span className="text-xs">{subject.weakAreas.join(", ")}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Test Scores */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <h3 className="text-lg font-semibold mb-4">Recent Test Performance</h3>
          <div className="space-y-4">
            {selectedStudent.subjectPerformances.flatMap(subject =>
              subject.recentScores.map((test, idx) => (
                <div key={`${subject.subject}-${idx}`} className="bg-black/20 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-sm">{test.testName}</h4>
                      <p className="text-xs text-muted-foreground">{subject.subject}</p>
                    </div>
                    <div className="text-right">
                      <div className={`font-bold ${getGradeColor(test.grade)}`}>
                        {test.score}/{test.maxScore}
                      </div>
                      <div className="text-xs text-muted-foreground">{test.percentage}% ({test.grade})</div>
                    </div>
                  </div>

                  <div className="mb-2">
                    <div className="w-full bg-black/30 rounded-full h-1.5">
                      <div
                        className="bg-gradient-to-r from-primary to-secondary h-1.5 rounded-full"
                        style={{ width: `${test.percentage}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">
                      {new Date(test.date).toLocaleDateString()}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      test.difficulty === 'Easy' ? 'bg-green-500/20 text-green-300' :
                      test.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-300' :
                      'bg-red-500/20 text-red-300'
                    }`}>
                      {test.difficulty}
                    </span>
                  </div>

                  <div className="mt-2">
                    <span className="text-xs text-muted-foreground">Topics: </span>
                    <span className="text-xs">{test.topics.join(", ")}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Performance Insights */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
        <h3 className="text-lg font-semibold mb-4">Performance Insights & Recommendations</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Strengths */}
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
            <h4 className="font-medium text-green-400 mb-3 flex items-center gap-2">
              <Award className="h-4 w-4" />
              Strengths
            </h4>
            <ul className="space-y-2">
              {selectedStudent.subjectPerformances.flatMap(s => s.strongAreas).slice(0, 4).map((strength, idx) => (
                <li key={idx} className="text-sm flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  {strength}
                </li>
              ))}
            </ul>
          </div>

          {/* Areas for Improvement */}
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
            <h4 className="font-medium text-red-400 mb-3 flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Areas for Improvement
            </h4>
            <ul className="space-y-2">
              {selectedStudent.subjectPerformances.flatMap(s => s.weakAreas).slice(0, 4).map((weakness, idx) => (
                <li key={idx} className="text-sm flex items-center gap-2">
                  <span className="text-red-400">!</span>
                  {weakness}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="mt-6 flex flex-wrap gap-4">
          {selectedStudent.isTopPerformer && (
            <div className="flex items-center gap-2 px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-sm">
              <Award className="h-4 w-4" />
              Top Performer
            </div>
          )}
          {selectedStudent.needsSupport && (
            <div className="flex items-center gap-2 px-3 py-1 bg-red-500/20 text-red-300 rounded-full text-sm">
              <AlertCircle className="h-4 w-4" />
              Needs Support
            </div>
          )}
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
            selectedStudent.improvementTrend === 'Improving' ? 'bg-green-500/20 text-green-300' :
            selectedStudent.improvementTrend === 'Declining' ? 'bg-red-500/20 text-red-300' :
            'bg-yellow-500/20 text-yellow-300'
          }`}>
            {getTrendIcon(selectedStudent.improvementTrend)}
            {selectedStudent.improvementTrend} Trend
          </div>
        </div>
      </div>
    </div>
  )
}