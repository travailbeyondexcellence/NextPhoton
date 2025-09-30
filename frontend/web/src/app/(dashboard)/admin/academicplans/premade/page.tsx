"use client"

import { useState, useMemo } from "react"
import { BookOpen, Clock, Users, Tag, Search, Filter, Plus, Edit, Copy, Trash2, Eye, X } from "lucide-react"
import { premadePlans as initialPremadePlans, type PremadePlan } from "@/app/(features)/AcademicPlans/academicPlansDummyData"

export default function PremadePlansPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [subjectFilter, setSubjectFilter] = useState("all")
  const [difficultyFilter, setDifficultyFilter] = useState("all")
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [plans, setPlans] = useState<PremadePlan[]>(initialPremadePlans)

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subject: "",
    gradeLevel: "",
    difficulty: "" as "Beginner" | "Intermediate" | "Advanced" | "",
    duration: "",
    estimatedHours: "",
    objectives: "",
    topics: "",
    resources: "",
    tags: "",
    isPublic: true
  })

  // Get unique subjects and calculate stats
  const { subjects, stats } = useMemo(() => {
    const uniqueSubjects = [...new Set(plans.map(p => p.subject))].sort()
    const totalPlans = plans.length
    const totalUsage = plans.reduce((sum, p) => sum + p.usageCount, 0)
    const publicPlans = plans.filter(p => p.isPublic).length

    return {
      subjects: uniqueSubjects,
      stats: { totalPlans, totalUsage, publicPlans }
    }
  }, [plans])

  // Filter plans
  const filteredPlans = useMemo(() => {
    return plans.filter(plan => {
      const matchesSearch =
        plan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesSubject = subjectFilter === "all" || plan.subject === subjectFilter
      const matchesDifficulty = difficultyFilter === "all" || plan.difficulty === difficultyFilter

      return matchesSearch && matchesSubject && matchesDifficulty
    })
  }, [plans, searchTerm, subjectFilter, difficultyFilter])

  // Handle form submission
  const handleCreatePlan = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('=== FORM SUBMITTED ===')
    console.log('Form data:', formData)
    alert('Creating plan...')

    // Generate new plan ID
    const newId = `pp${String(plans.length + 1).padStart(3, '0')}`
    console.log('Generated ID:', newId)

    // Parse comma/newline-separated fields
    const objectivesArray = formData.objectives.split('\n').filter(obj => obj.trim())
    const topicsArray = formData.topics.split(',').map(t => t.trim()).filter(Boolean)
    const resourcesArray = formData.resources ? formData.resources.split(',').map(r => r.trim()).filter(Boolean) : []
    const tagsArray = formData.tags ? formData.tags.split(',').map(t => t.trim().toLowerCase()).filter(Boolean) : []

    // Create new plan object
    const newPlan: PremadePlan = {
      id: newId,
      title: formData.title,
      description: formData.description,
      subject: formData.subject,
      gradeLevel: formData.gradeLevel,
      duration: formData.duration,
      objectives: objectivesArray,
      topics: topicsArray,
      resources: resourcesArray,
      assessmentCriteria: [], // Can be added later via edit
      createdBy: "admin", // TODO: Replace with actual user ID
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      difficulty: formData.difficulty as "Beginner" | "Intermediate" | "Advanced",
      estimatedHours: parseInt(formData.estimatedHours),
      tags: tagsArray,
      isPublic: formData.isPublic,
      usageCount: 0
    }

    // Add to plans list
    console.log('Adding new plan:', newPlan)
    setPlans(prevPlans => {
      const updatedPlans = [newPlan, ...prevPlans]
      console.log('Plans updated! New count:', updatedPlans.length)
      return updatedPlans
    })

    // Reset form and close dialog
    console.log('Resetting form and closing dialog')
    setFormData({
      title: "",
      description: "",
      subject: "",
      gradeLevel: "",
      difficulty: "",
      duration: "",
      estimatedHours: "",
      objectives: "",
      topics: "",
      resources: "",
      tags: "",
      isPublic: true
    })
    setIsCreateDialogOpen(false)

    // Show success message (optional)
    console.log('Plan created successfully:', newPlan)
  }

  const getDifficultyBadge = (difficulty: string) => {
    const colors = {
      Beginner: "bg-green-500/20 text-green-300 border-green-500/50",
      Intermediate: "bg-yellow-500/20 text-yellow-300 border-yellow-500/50",
      Advanced: "bg-red-500/20 text-red-300 border-red-500/50"
    }

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${colors[difficulty as keyof typeof colors]}`}>
        {difficulty}
      </span>
    )
  }

  return (
    <div className="min-h-full">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-2">
          <BookOpen className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Premade Academic Plans</h1>
            <p className="text-muted-foreground">Browse and manage template academic plans</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <span className="text-muted-foreground">Total Plans</span>
            <BookOpen className="h-5 w-5 text-primary" />
          </div>
          <div className="text-2xl font-bold">{stats.totalPlans}</div>
          <div className="text-xs text-muted-foreground mt-2">Available templates</div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <span className="text-muted-foreground">Total Usage</span>
            <Users className="h-5 w-5 text-secondary" />
          </div>
          <div className="text-2xl font-bold">{stats.totalUsage}</div>
          <div className="text-xs text-muted-foreground mt-2">Times used by learners</div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <span className="text-muted-foreground">Public Plans</span>
            <Eye className="h-5 w-5 text-accent" />
          </div>
          <div className="text-2xl font-bold">{stats.publicPlans}</div>
          <div className="text-xs text-muted-foreground mt-2">Shared with community</div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search plans by title, description, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:border-primary text-foreground placeholder-muted-foreground"
              />
            </div>
          </div>

          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="px-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:border-primary text-foreground"
          >
            <option value="all">All Subjects</option>
            {subjects.map(subject => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>

          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="px-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:border-primary text-foreground"
          >
            <option value="all">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>

          <button
            onClick={() => setIsCreateDialogOpen(true)}
            className="px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg transition-colors flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Create New Plan
          </button>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredPlans.length === 0 ? (
          <div className="col-span-2 bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20 text-center text-muted-foreground">
            No plans found matching your criteria
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
                {/* Plan Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-2">{plan.title}</h3>
                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                  </div>
                  {getDifficultyBadge(plan.difficulty)}
                </div>

                {/* Plan Metadata */}
                <div className="flex flex-wrap gap-4 mb-4 text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <BookOpen className="h-4 w-4" />
                    <span>{plan.subject}</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{plan.duration}</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <span>⏱️</span>
                    <span>{plan.estimatedHours}h</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{plan.usageCount} uses</span>
                  </div>
                </div>

                {/* Grade Level */}
                <div className="mb-4">
                  <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-md text-sm">
                    {plan.gradeLevel}
                  </span>
                </div>

                {/* Topics */}
                <div className="mb-4">
                  <div className="text-xs text-muted-foreground mb-2">Topics Covered:</div>
                  <div className="flex flex-wrap gap-2">
                    {plan.topics.slice(0, 3).map((topic, idx) => (
                      <span key={idx} className="px-2 py-1 bg-white/10 text-xs rounded-md">
                        {topic}
                      </span>
                    ))}
                    {plan.topics.length > 3 && (
                      <span className="px-2 py-1 text-xs text-muted-foreground">
                        +{plan.topics.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                {selectedPlan === plan.id && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    {/* Objectives */}
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold mb-2">Learning Objectives:</h4>
                      <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                        {plan.objectives.map((obj, idx) => (
                          <li key={idx}>{obj}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Resources */}
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold mb-2">Resources:</h4>
                      <div className="flex flex-wrap gap-2">
                        {plan.resources.map((resource, idx) => (
                          <span key={idx} className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-md">
                            📚 {resource}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {plan.tags.map((tag, idx) => (
                          <span key={idx} className="flex items-center gap-1 px-2 py-1 bg-white/5 text-xs rounded-md">
                            <Tag className="h-3 w-3" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 mt-4">
                      <button className="flex-1 px-3 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg transition-colors flex items-center justify-center gap-2 text-sm">
                        <Eye className="h-4 w-4" />
                        Preview
                      </button>
                      <button className="flex-1 px-3 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm">
                        <Copy className="h-4 w-4" />
                        Duplicate
                      </button>
                      <button className="flex-1 px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm">
                        <Edit className="h-4 w-4" />
                        Edit
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create New Plan Dialog */}
      {isCreateDialogOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#f5e6d3] border border-[#d4c5b0] rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Dialog Header */}
            <div className="sticky top-0 bg-[#f5e6d3] border-b border-[#d4c5b0] p-6 flex items-center justify-between z-10">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Create New Academic Plan</h2>
                <p className="text-sm text-muted-foreground mt-1">Design a new premade academic plan template</p>
              </div>
              <button
                onClick={() => setIsCreateDialogOpen(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Dialog Content */}
            <div className="overflow-y-auto flex-1">
              <form
                onSubmit={handleCreatePlan}
                className="p-6 space-y-6"
              >
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
                    placeholder="e.g., Introduction to Calculus"
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
                    placeholder="Brief description of the academic plan..."
                    className="w-full px-4 py-2 bg-white/50 border border-[#d4c5b0] rounded-lg focus:outline-none focus:border-[#a89885] text-gray-800 placeholder-gray-500 resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Subject *</label>
                    <select
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      className="w-full px-4 py-2 bg-white/50 border border-[#d4c5b0] rounded-lg focus:outline-none focus:border-[#a89885] text-gray-800"
                    >
                      <option value="">Select subject</option>
                      {subjects.map(subject => (
                        <option key={subject} value={subject}>{subject}</option>
                      ))}
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Grade Level *</label>
                    <select
                      required
                      value={formData.gradeLevel}
                      onChange={(e) => setFormData({...formData, gradeLevel: e.target.value})}
                      className="w-full px-4 py-2 bg-white/50 border border-[#d4c5b0] rounded-lg focus:outline-none focus:border-[#a89885] text-gray-800"
                    >
                      <option value="">Select grade level</option>
                      <option value="Grade 6">Grade 6</option>
                      <option value="Grade 7">Grade 7</option>
                      <option value="Grade 8">Grade 8</option>
                      <option value="Grade 9">Grade 9</option>
                      <option value="Grade 10">Grade 10</option>
                      <option value="Grade 11">Grade 11</option>
                      <option value="Grade 12">Grade 12</option>
                      <option value="College/University">College/University</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Difficulty *</label>
                    <select
                      required
                      value={formData.difficulty}
                      onChange={(e) => setFormData({...formData, difficulty: e.target.value as any})}
                      className="w-full px-4 py-2 bg-white/50 border border-[#d4c5b0] rounded-lg focus:outline-none focus:border-[#a89885] text-gray-800"
                    >
                      <option value="">Select</option>
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Duration *</label>
                    <input
                      type="text"
                      required
                      value={formData.duration}
                      onChange={(e) => setFormData({...formData, duration: e.target.value})}
                      placeholder="e.g., 6 weeks"
                      className="w-full px-4 py-2 bg-white/50 border border-[#d4c5b0] rounded-lg focus:outline-none focus:border-[#a89885] text-gray-800 placeholder-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Est. Hours *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.estimatedHours}
                      onChange={(e) => setFormData({...formData, estimatedHours: e.target.value})}
                      placeholder="36"
                      className="w-full px-4 py-2 bg-white/50 border border-[#d4c5b0] rounded-lg focus:outline-none focus:border-[#a89885] text-gray-800 placeholder-gray-500"
                    />
                  </div>
                </div>
              </div>

              {/* Learning Objectives */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Learning Objectives</h3>
                <div>
                  <label className="block text-sm font-medium mb-2">Objectives (one per line) *</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.objectives}
                    onChange={(e) => setFormData({...formData, objectives: e.target.value})}
                    placeholder="Enter learning objectives, one per line..."
                    className="w-full px-4 py-2 bg-white/50 border border-[#d4c5b0] rounded-lg focus:outline-none focus:border-[#a89885] text-gray-800 placeholder-gray-500 resize-none"
                  />
                </div>
              </div>

              {/* Topics Covered */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Topics Covered</h3>
                <div>
                  <label className="block text-sm font-medium mb-2">Topics (comma-separated) *</label>
                  <input
                    type="text"
                    required
                    value={formData.topics}
                    onChange={(e) => setFormData({...formData, topics: e.target.value})}
                    placeholder="e.g., Variables, Equations, Linear Functions, Graphing"
                    className="w-full px-4 py-2 bg-white/50 border border-[#d4c5b0] rounded-lg focus:outline-none focus:border-[#a89885] text-gray-800 placeholder-gray-500"
                  />
                </div>
              </div>

              {/* Resources */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Resources</h3>
                <div>
                  <label className="block text-sm font-medium mb-2">Resources (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.resources}
                    onChange={(e) => setFormData({...formData, resources: e.target.value})}
                    placeholder="e.g., Textbook, Online Videos, Practice Worksheets"
                    className="w-full px-4 py-2 bg-white/50 border border-[#d4c5b0] rounded-lg focus:outline-none focus:border-[#a89885] text-gray-800 placeholder-gray-500"
                  />
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Tags & Visibility</h3>
                <div>
                  <label className="block text-sm font-medium mb-2">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({...formData, tags: e.target.value})}
                    placeholder="e.g., STEM, Problem-Solving, Critical Thinking"
                    className="w-full px-4 py-2 bg-white/50 border border-[#d4c5b0] rounded-lg focus:outline-none focus:border-[#a89885] text-gray-800 placeholder-gray-500"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isPublic"
                    checked={formData.isPublic}
                    onChange={(e) => setFormData({...formData, isPublic: e.target.checked})}
                    className="w-4 h-4 rounded border-white/10 bg-black/20 text-primary focus:ring-primary"
                  />
                  <label htmlFor="isPublic" className="text-sm">
                    Make this plan public (visible to all educators)
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-[#d4c5b0]">
                <button
                  type="button"
                  onClick={() => setIsCreateDialogOpen(false)}
                  className="flex-1 px-4 py-3 bg-[#d4c5b0] hover:bg-[#c4b5a0] text-gray-800 rounded-lg transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-[#8b7355] hover:bg-[#7b6345] text-white rounded-lg transition-colors font-medium"
                >
                  Create Plan
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