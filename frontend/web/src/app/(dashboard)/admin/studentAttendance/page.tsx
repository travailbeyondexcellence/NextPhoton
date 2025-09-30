"use client"

import { useState, useMemo, useEffect } from "react"
import { Calendar, Users, CheckCircle, XCircle, AlertCircle, Clock, TrendingUp, TrendingDown, Search, Filter, ChevronDown } from "lucide-react"
import attendanceRecords, { getAttendanceSummary, AttendanceRecord } from "@/app/(features)/Attendance/attendanceDummyData"

export default function StudentAttendancePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [dateFilter, setDateFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [batchFilter, setBatchFilter] = useState("all")
  const [viewMode, setViewMode] = useState<"daily" | "learner" | "session">("daily")
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null)

  // Get attendance summary
  const summary = getAttendanceSummary()

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (selectedRecordId && !target.closest('.relative')) {
        setSelectedRecordId(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [selectedRecordId]);

  // Get unique values for filters
  const uniqueDates = useMemo(() => {
    const dates = [...new Set(attendanceRecords.map(r => r.sessionDate))];
    return dates.sort((a, b) => b.localeCompare(a));
  }, []);

  const uniqueBatches = useMemo(() => {
    const batches = [...new Set(attendanceRecords.map(r => r.batchName))];
    return batches.sort();
  }, []);

  const uniqueLearners = useMemo(() => {
    const learners = [...new Set(attendanceRecords.map(r => ({
      id: r.learnerId,
      name: r.learnerName
    })))];
    return learners.sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  // Filter attendance records
  const filteredRecords = useMemo(() => {
    return attendanceRecords.filter(record => {
      const matchesSearch =
        record.learnerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.sessionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.educatorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.subject?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDate = dateFilter === "all" || record.sessionDate === dateFilter;
      const matchesStatus = statusFilter === "all" || record.status === statusFilter;
      const matchesBatch = batchFilter === "all" || record.batchName === batchFilter;

      return matchesSearch && matchesDate && matchesStatus && matchesBatch;
    });
  }, [searchTerm, dateFilter, statusFilter, batchFilter]);

  // Group records based on view mode
  const groupedRecords = useMemo(() => {
    if (viewMode === "learner") {
      const grouped: { [key: string]: AttendanceRecord[] } = {};
      filteredRecords.forEach(record => {
        const key = `${record.learnerId}-${record.learnerName}`;
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(record);
      });
      return grouped;
    } else if (viewMode === "session") {
      const grouped: { [key: string]: AttendanceRecord[] } = {};
      filteredRecords.forEach(record => {
        const key = `${record.sessionId}-${record.sessionName}-${record.sessionDate}`;
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(record);
      });
      return grouped;
    } else {
      // Daily view - group by date
      const grouped: { [key: string]: AttendanceRecord[] } = {};
      filteredRecords.forEach(record => {
        if (!grouped[record.sessionDate]) grouped[record.sessionDate] = [];
        grouped[record.sessionDate].push(record);
      });
      return grouped;
    }
  }, [filteredRecords, viewMode]);

  const getStatusBadge = (status: string) => {
    const statusConfig: { [key: string]: { color: string, icon: JSX.Element, text: string } } = {
      present: { color: "bg-green-500/20 text-green-300 border-green-500/50", icon: <CheckCircle className="h-3 w-3" />, text: "Present" },
      absent: { color: "bg-red-500/20 text-red-300 border-red-500/50", icon: <XCircle className="h-3 w-3" />, text: "Absent" },
      late: { color: "bg-yellow-500/20 text-yellow-300 border-yellow-500/50", icon: <Clock className="h-3 w-3" />, text: "Late" },
      excused: { color: "bg-blue-500/20 text-blue-300 border-blue-500/50", icon: <AlertCircle className="h-3 w-3" />, text: "Excused" },
      "left-early": { color: "bg-orange-500/20 text-orange-300 border-orange-500/50", icon: <Clock className="h-3 w-3" />, text: "Left Early" }
    };

    const config = statusConfig[status] || statusConfig.absent;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${config.color}`}>
        {config.icon}
        {config.text}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const calculateLearnerStats = (records: AttendanceRecord[]) => {
    const total = records.length;
    const present = records.filter(r => r.status === "present" || r.status === "late").length;
    const rate = total > 0 ? Math.round((present / total) * 100) : 0;
    const avgParticipation = records.reduce((acc, r) => acc + (r.participationScore || 0), 0) / (total || 1);

    return { total, present, rate, avgParticipation: Math.round(avgParticipation) };
  };

  const calculateSessionStats = (records: AttendanceRecord[]) => {
    const total = records.length;
    const present = records.filter(r => r.status === "present" || r.status === "late").length;
    const rate = total > 0 ? Math.round((present / total) * 100) : 0;

    return { total, present, absent: total - present, rate };
  };

  // Handler for Mark Attendance button
  const handleMarkAttendance = () => {
    // TODO: Implement mark attendance modal/form
    console.log("Mark Attendance clicked");
    alert("Mark Attendance feature - Coming soon!\n\nThis will open a form to mark attendance for students.");
  };

  // Handler for Export Report button
  const handleExportReport = () => {
    // TODO: Implement export functionality (CSV, PDF, Excel)
    console.log("Export Report clicked");
    console.log("Filtered records:", filteredRecords);

    // Simple CSV export as placeholder
    const csvContent = "data:text/csv;charset=utf-8,"
      + "Date,Student,Session,Educator,Status,Check In,Check Out,Participation\n"
      + filteredRecords.map(r =>
          `${r.sessionDate},${r.learnerName},${r.sessionName},${r.educatorName},${r.status},${r.checkInTime || 'N/A'},${r.checkOutTime || 'N/A'},${r.participationScore || 'N/A'}%`
        ).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `attendance_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    alert("Attendance report exported successfully!");
  };

  // Handler for action menu (three dots)
  const handleActionClick = (recordId: string, action?: string) => {
    console.log("Action clicked for record:", recordId, "Action:", action);

    if (action) {
      // Close menu first
      setSelectedRecordId(null);

      // Handle specific action
      switch (action) {
        case "edit":
          // TODO: Implement edit attendance modal
          alert(`Edit attendance for record ${recordId}\n\nThis will open an edit form to modify attendance details.`);
          break;
        case "view":
          // TODO: Implement view details modal
          const record = attendanceRecords.find(r => r.id === recordId);
          if (record) {
            alert(`View Details:\n\nStudent: ${record.learnerName}\nSession: ${record.sessionName}\nDate: ${record.sessionDate}\nStatus: ${record.status}\nCheck In: ${record.checkInTime || 'N/A'}\nCheck Out: ${record.checkOutTime || 'N/A'}\nParticipation: ${record.participationScore || 'N/A'}%`);
          }
          break;
        case "delete":
          // TODO: Implement delete functionality
          if (confirm("Are you sure you want to delete this attendance record?")) {
            console.log(`Deleting record ${recordId}`);
            alert(`Record ${recordId} would be deleted.\n\nThis functionality needs to be connected to the backend.`);
          }
          break;
        default:
          break;
      }
    } else {
      // Toggle menu visibility
      setSelectedRecordId(selectedRecordId === recordId ? null : recordId);
    }
  };

  return (
    <div className="min-h-full">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-4">
          <Calendar className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Student Attendance</h1>
            <p className="text-muted-foreground">Track and manage student attendance records</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Present Today Card */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/15 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="text-muted-foreground">Present Today</div>
            <CheckCircle className="h-5 w-5 text-green-500" />
          </div>
          <div className="text-2xl font-bold text-green-400">{summary.presentToday}</div>
          <div className="text-xs text-muted-foreground mt-2">Students present</div>
        </div>

        {/* Absent Today Card */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/15 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="text-muted-foreground">Absent Today</div>
            <XCircle className="h-5 w-5 text-red-500" />
          </div>
          <div className="text-2xl font-bold text-red-400">{summary.absentToday}</div>
          <div className="text-xs text-muted-foreground mt-2">Students absent</div>
        </div>

        {/* On Leave Card */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/15 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="text-muted-foreground">Excused</div>
            <AlertCircle className="h-5 w-5 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-blue-400">{summary.excusedToday}</div>
          <div className="text-xs text-muted-foreground mt-2">Approved leaves</div>
        </div>

        {/* Attendance Rate Card */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/15 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="text-muted-foreground">Attendance Rate</div>
            <div className="text-primary">📊</div>
          </div>
          <div className="flex items-baseline gap-2">
            <div className="text-2xl font-bold">{summary.attendanceRate}%</div>
            {summary.attendanceRate >= 75 ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
          </div>
          <div className="text-xs text-muted-foreground mt-2">Overall average</div>
        </div>
      </div>

      {/* View Mode Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setViewMode("daily")}
          className={`px-4 py-2 rounded-lg transition-all ${
            viewMode === "daily"
              ? "bg-primary text-primary-foreground"
              : "bg-white/10 hover:bg-white/20 text-foreground"
          }`}
        >
          Daily View
        </button>
        <button
          onClick={() => setViewMode("learner")}
          className={`px-4 py-2 rounded-lg transition-all ${
            viewMode === "learner"
              ? "bg-primary text-primary-foreground"
              : "bg-white/10 hover:bg-white/20 text-foreground"
          }`}
        >
          By Learner
        </button>
        <button
          onClick={() => setViewMode("session")}
          className={`px-4 py-2 rounded-lg transition-all ${
            viewMode === "session"
              ? "bg-primary text-primary-foreground"
              : "bg-white/10 hover:bg-white/20 text-foreground"
          }`}
        >
          By Session
        </button>
      </div>

      {/* Filters Section */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 mb-6">
        <div className="flex flex-wrap gap-4">
          {/* Search */}
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search learner, session, educator..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:border-primary text-foreground placeholder-muted-foreground"
              />
            </div>
          </div>

          {/* Date Filter */}
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:border-primary text-foreground"
          >
            <option value="all">All Dates</option>
            {uniqueDates.map(date => (
              <option key={date} value={date}>{formatDate(date)}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:border-primary text-foreground"
          >
            <option value="all">All Status</option>
            <option value="present">Present</option>
            <option value="absent">Absent</option>
            <option value="late">Late</option>
            <option value="excused">Excused</option>
            <option value="left-early">Left Early</option>
          </select>

          {/* Batch Filter */}
          <select
            value={batchFilter}
            onChange={(e) => setBatchFilter(e.target.value)}
            className="px-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:border-primary text-foreground"
          >
            <option value="all">All Batches</option>
            {uniqueBatches.map(batch => (
              <option key={batch} value={batch}>{batch}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Attendance Management Table Section */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 mb-6">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Attendance Management</h2>
            <div className="flex gap-2">
              <button
                onClick={handleMarkAttendance}
                className="px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg transition-colors text-sm cursor-pointer"
              >
                Mark Attendance
              </button>
              <button
                onClick={handleExportReport}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-foreground rounded-lg transition-colors text-sm cursor-pointer"
              >
                Export Report
              </button>
            </div>
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-black/20 border-b border-white/10">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Date/Time
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Student
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Session
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Educator
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Check In/Out
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Participation
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredRecords.slice(0, 10).map((record) => (
                <tr key={record.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    <div>
                      <div className="font-medium">{formatDate(record.sessionDate).split(',')[0]}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(record.sessionDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-xs font-semibold">
                        {record.learnerName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-medium">{record.learnerName}</div>
                        <div className="text-xs text-muted-foreground">{record.learnerBatch}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm">
                    <div>
                      <div className="font-medium truncate max-w-[200px]">{record.sessionName}</div>
                      <div className="text-xs text-muted-foreground">{record.subject}</div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    {record.educatorName.split(' ').slice(0, 2).join(' ')}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {getStatusBadge(record.status)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    {record.checkInTime ? (
                      <div>
                        <div className="font-medium">{record.checkInTime} - {record.checkOutTime || 'Active'}</div>
                        {record.duration > 0 && (
                          <div className="text-xs text-muted-foreground">{record.duration} mins</div>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-center">
                    {record.participationScore !== undefined && record.participationScore > 0 ? (
                      <div className="flex flex-col items-center">
                        <div className={`text-sm font-medium ${
                          record.participationScore >= 80 ? 'text-green-400' :
                          record.participationScore >= 60 ? 'text-yellow-400' : 'text-red-400'
                        }`}>
                          {record.participationScore}%
                        </div>
                        <div className="flex gap-1 mt-1">
                          {record.cameraOn && <span className="text-xs">📹</span>}
                          {record.micUsed && <span className="text-xs">🎤</span>}
                        </div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-center">
                    <div className="relative">
                      <button
                        onClick={() => handleActionClick(record.id)}
                        className="text-primary hover:text-primary/80 transition-colors cursor-pointer p-1 rounded hover:bg-white/10"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </button>

                      {/* Dropdown menu */}
                      {selectedRecordId === record.id && (
                        <div className="absolute right-0 top-8 z-50 min-w-[160px] bg-background border border-white/20 rounded-lg shadow-lg overflow-hidden">
                          <button
                            onClick={() => handleActionClick(record.id, "view")}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-white/10 transition-colors"
                          >
                            View Details
                          </button>
                          <button
                            onClick={() => handleActionClick(record.id, "edit")}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-white/10 transition-colors"
                          >
                            Edit Attendance
                          </button>
                          <button
                            onClick={() => handleActionClick(record.id, "delete")}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-white/10 transition-colors text-red-400"
                          >
                            Delete Record
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="p-4 border-t border-white/10 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {Math.min(10, filteredRecords.length)} of {filteredRecords.length} records
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded text-sm transition-colors" disabled>
              Previous
            </button>
            <button className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded text-sm transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Attendance Records Cards View */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-semibold">
            {viewMode === "daily" ? "Daily Attendance Cards" : viewMode === "learner" ? "Attendance by Learner" : "Attendance by Session"}
            <span className="ml-2 text-sm text-muted-foreground">({filteredRecords.length} records)</span>
          </h2>
        </div>

        <div className="divide-y divide-white/10 max-h-[600px] overflow-y-auto">
          {Object.entries(groupedRecords).length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No attendance records found matching your criteria
            </div>
          ) : (
            Object.entries(groupedRecords).map(([key, records]) => {
              if (viewMode === "learner") {
                const [learnerId, learnerName] = key.split('-');
                const stats = calculateLearnerStats(records);
                return (
                  <div key={key} className="p-6 hover:bg-white/5 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">{learnerName}</h3>
                        <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                          <span>Total Sessions: {stats.total}</span>
                          <span className="text-green-400">Present: {stats.present}</span>
                          <span className="text-yellow-400">Attendance: {stats.rate}%</span>
                          <span className="text-blue-400">Participation: {stats.avgParticipation}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {records.map(record => (
                        <div key={record.id} className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                          <div className="flex items-center gap-3">
                            {getStatusBadge(record.status)}
                            <div>
                              <div className="font-medium">{record.sessionName}</div>
                              <div className="text-xs text-muted-foreground">
                                {formatDate(record.sessionDate)} • {record.subject} • {record.educatorName}
                              </div>
                            </div>
                          </div>
                          <div className="text-right text-sm">
                            {record.checkInTime && (
                              <div className="text-muted-foreground">
                                {record.checkInTime} - {record.checkOutTime || 'Present'}
                              </div>
                            )}
                            {record.participationScore !== undefined && (
                              <div className="text-xs text-blue-400">
                                Participation: {record.participationScore}%
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              } else if (viewMode === "session") {
                const [sessionId, sessionName, date] = key.split('-');
                const stats = calculateSessionStats(records);
                return (
                  <div key={key} className="p-6 hover:bg-white/5 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">{sessionName}</h3>
                        <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                          <span>{formatDate(date)}</span>
                          <span>Total: {stats.total}</span>
                          <span className="text-green-400">Present: {stats.present}</span>
                          <span className="text-red-400">Absent: {stats.absent}</span>
                          <span className="text-yellow-400">Rate: {stats.rate}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                      {records.map(record => (
                        <div key={record.id} className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                          <div className="flex items-center gap-3">
                            {getStatusBadge(record.status)}
                            <div>
                              <div className="font-medium">{record.learnerName}</div>
                              <div className="text-xs text-muted-foreground">
                                {record.learnerBatch} • {record.checkInTime || 'Absent'}
                              </div>
                            </div>
                          </div>
                          {record.participationScore !== undefined && record.participationScore > 0 && (
                            <div className="text-xs text-blue-400">
                              {record.participationScore}%
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              } else {
                // Daily view
                return (
                  <div key={key} className="p-6 hover:bg-white/5 transition-colors">
                    <h3 className="text-lg font-semibold text-foreground mb-4">{formatDate(key)}</h3>
                    <div className="space-y-3">
                      {records.map(record => (
                        <div key={record.id} className="flex items-center justify-between p-4 bg-black/20 rounded-lg hover:bg-black/30 transition-colors">
                          <div className="flex items-center gap-4">
                            {getStatusBadge(record.status)}
                            <div>
                              <div className="font-medium">{record.learnerName}</div>
                              <div className="text-sm text-muted-foreground">
                                {record.sessionName} • {record.subject}
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                {record.educatorName} • {record.batchName}
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            {record.checkInTime ? (
                              <div>
                                <div className="text-sm font-medium">
                                  {record.checkInTime} - {record.checkOutTime || 'Present'}
                                </div>
                                {record.duration > 0 && (
                                  <div className="text-xs text-muted-foreground">
                                    {record.duration} mins
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="text-sm text-muted-foreground">
                                {record.excuseReason || record.lateReason || 'Not marked'}
                              </div>
                            )}
                            {record.participationScore !== undefined && record.participationScore > 0 && (
                              <div className="text-xs text-blue-400 mt-1">
                                Participation: {record.participationScore}%
                              </div>
                            )}
                            {record.notes && (
                              <div className="text-xs text-muted-foreground italic mt-1 max-w-xs text-right">
                                {record.notes}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }
            })
          )}
        </div>
      </div>
    </div>
  )
}