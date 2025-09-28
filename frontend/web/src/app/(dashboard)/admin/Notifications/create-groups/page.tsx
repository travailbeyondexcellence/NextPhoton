"use client"

import React, { useState } from 'react'
import { Users, Plus, Edit2, Trash2, Save, Search, UserPlus } from 'lucide-react'
import { recipientGroups } from '@/app/(features)/Notifications/notificationsDummyData'
import { learners } from '@/app/(dashboard)/admin/learners/learnersDummyData'
import { educators } from '@/app/(dashboard)/roleMenus/educatorsData'
import { guardians } from '@/app/(dashboard)/admin/guardians/guardiansDummyData'

export default function CreateGroupsPage() {
  const [isCreatingGroup, setIsCreatingGroup] = useState(false)
  const [groupName, setGroupName] = useState('')
  const [groupDescription, setGroupDescription] = useState('')
  const [selectedMembers, setSelectedMembers] = useState<string[]>([])
  const [memberType, setMemberType] = useState<'learners' | 'educators' | 'guardians'>('learners')
  const [searchQuery, setSearchQuery] = useState('')

  const allMembers = {
    learners: learners.map(l => ({ id: l.id, name: l.name, email: l.email, type: 'learner' })),
    educators: educators.map(e => ({ id: e.id.toString(), name: e.name, email: e.email, type: 'educator' })),
    guardians: guardians.map(g => ({ id: g.id, name: g.name, email: g.email, type: 'guardian' }))
  }

  const currentMembers = allMembers[memberType]

  const filteredMembers = currentMembers.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const toggleMemberSelection = (memberId: string) => {
    setSelectedMembers(prev =>
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    )
  }

  const handleCreateGroup = () => {
    // Handle group creation logic here
    console.log('Creating group:', {
      name: groupName,
      description: groupDescription,
      members: selectedMembers
    })

    // Reset form
    setIsCreatingGroup(false)
    setGroupName('')
    setGroupDescription('')
    setSelectedMembers([])
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'academic': 'text-blue-500 bg-blue-500/10',
      'grade-specific': 'text-purple-500 bg-purple-500/10',
      'performance': 'text-orange-500 bg-orange-500/10',
      'administrative': 'text-green-500 bg-green-500/10',
      'custom': 'text-pink-500 bg-pink-500/10'
    }
    return colors[category] || 'text-gray-500 bg-gray-500/10'
  }

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <UserPlus className="text-primary" size={28} />
            <h1 className="text-3xl font-bold">Manage Groups</h1>
          </div>
          {!isCreatingGroup && (
            <button
              onClick={() => setIsCreatingGroup(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-all"
            >
              <Plus size={18} />
              Create New Group
            </button>
          )}
        </div>
        <p className="text-muted-foreground">Create and manage recipient groups for targeted messaging</p>
      </div>

      {isCreatingGroup ? (
        /* Create Group Form */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Group Details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 rounded-xl border border-white/10 backdrop-blur-sm bg-white/5">
              <h3 className="font-semibold mb-4">Group Details</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Group Name</label>
                  <input
                    type="text"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    placeholder="Enter group name..."
                    className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:border-primary/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={groupDescription}
                    onChange={(e) => setGroupDescription(e.target.value)}
                    placeholder="Describe the purpose of this group..."
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:border-primary/50 resize-none"
                  />
                </div>

                {/* Member Type Selector */}
                <div>
                  <label className="block text-sm font-medium mb-2">Member Type</label>
                  <div className="flex gap-2">
                    {(['learners', 'educators', 'guardians'] as const).map(type => (
                      <button
                        key={type}
                        onClick={() => {
                          setMemberType(type)
                          setSelectedMembers([])
                        }}
                        className={`flex-1 px-4 py-2 rounded-lg capitalize transition-all ${
                          memberType === type
                            ? 'bg-primary/20 text-primary border border-primary/50'
                            : 'bg-white/10 hover:bg-white/20'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Member Selection */}
            <div className="p-6 rounded-xl border border-white/10 backdrop-blur-sm bg-white/5">
              <h3 className="font-semibold mb-4">Select Members</h3>

              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search ${memberType}...`}
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:border-primary/50"
                />
              </div>

              {/* Members Grid */}
              <div className="grid grid-cols-2 gap-2 max-h-96 overflow-y-auto">
                {filteredMembers.map(member => (
                  <label
                    key={member.id}
                    className={`flex items-center p-2 rounded-lg cursor-pointer transition-all text-sm ${
                      selectedMembers.includes(member.id)
                        ? 'bg-primary/20 border border-primary/50'
                        : 'bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedMembers.includes(member.id)}
                      onChange={() => toggleMemberSelection(member.id)}
                      className="mr-2"
                    />
                    <div className="flex-1 overflow-hidden">
                      <div className="font-medium truncate">{member.name}</div>
                      <div className="text-xs text-muted-foreground truncate">{member.email}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Actions Sidebar */}
          <div className="space-y-6">
            <div className="p-6 rounded-xl border border-white/10 backdrop-blur-sm bg-white/5">
              <h3 className="font-semibold mb-4">Group Summary</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Group Name:</span>
                  <div className="font-medium mt-1">{groupName || 'Not set'}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Member Type:</span>
                  <div className="font-medium mt-1 capitalize">{memberType}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Selected Members:</span>
                  <div className="font-medium mt-1">{selectedMembers.length}</div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleCreateGroup}
                disabled={!groupName || selectedMembers.length === 0}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save size={18} />
                Create Group
              </button>
              <button
                onClick={() => {
                  setIsCreatingGroup(false)
                  setGroupName('')
                  setGroupDescription('')
                  setSelectedMembers([])
                }}
                className="w-full px-4 py-3 rounded-lg bg-white/10 hover:bg-white/20 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Groups List */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recipientGroups.map(group => (
            <div
              key={group.id}
              className="p-5 rounded-xl border border-white/10 backdrop-blur-sm bg-white/5 hover:bg-white/10 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <Users size={20} className="text-primary" />
                <span className={`text-xs px-2 py-1 rounded ${getCategoryColor(group.category)}`}>
                  {group.category}
                </span>
              </div>

              <h3 className="font-semibold mb-2">{group.name}</h3>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {group.description}
              </p>

              <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                <span>{group.memberCount} members</span>
                <span>Created {new Date(group.createdAt).toLocaleDateString()}</span>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all text-sm">
                  <Edit2 size={14} />
                  Edit
                </button>
                <button className="p-2 rounded-lg bg-white/10 hover:bg-red-500/20 hover:text-red-500 transition-all">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Statistics */}
      {!isCreatingGroup && (
        <div className="mt-8 p-6 rounded-xl border border-white/10 backdrop-blur-sm bg-white/5">
          <h3 className="font-semibold mb-4">Group Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-2xl font-bold">{recipientGroups.length}</div>
              <div className="text-sm text-muted-foreground">Total Groups</div>
            </div>
            <div>
              <div className="text-2xl font-bold">
                {recipientGroups.reduce((sum, g) => sum + g.memberCount, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Total Members</div>
            </div>
            <div>
              <div className="text-2xl font-bold">
                {recipientGroups.filter(g => g.category === 'academic').length}
              </div>
              <div className="text-sm text-muted-foreground">Academic Groups</div>
            </div>
            <div>
              <div className="text-2xl font-bold">
                {recipientGroups.filter(g => g.category === 'custom').length}
              </div>
              <div className="text-sm text-muted-foreground">Custom Groups</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}