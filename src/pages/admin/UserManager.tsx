import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Shield,
  Trash2,
  Edit,
  CheckCircle2,
  AlertTriangle,
  X,
  Mail,
  Briefcase,
  GitBranch,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react'
import { api } from '../../lib/api'
import type { User, Associate, RoleId, CreateUserPayload } from '../../types'
import { Button, Card, Badge, Skeleton } from '../../components/ui'

const ROLE_LABELS: Record<RoleId, { label: string; badge: string }> = {
  EARLY_TALENT: { label: 'Early Talent (GDA)', badge: 'bg-blue-50 text-blue-700 border-blue-200' },
  MENTOR_COACH: { label: 'Mentor / Coach', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  ENGINEERING_EXCELLENCE_COMMITTEE: { label: 'Excellence Committee', badge: 'bg-purple-50 text-purple-700 border-purple-200' },
  SENIOR_LEADER_SPONSOR: { label: 'Senior Leader Sponsor', badge: 'bg-amber-50 text-amber-700 border-amber-200' },
  TECHNOLOGY_HEAD: { label: 'Technology Head', badge: 'bg-rose-50 text-rose-700 border-rose-200' },
}

export function UserManager() {
  const queryClient = useQueryClient()
  const usersQuery = useQuery({ queryKey: ['users'], queryFn: api.users })
  const associatesQuery = useQuery({ queryKey: ['associates'], queryFn: api.associates })

  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('ALL')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedUserForEdit, setSelectedUserForEdit] = useState<User | null>(null)

  // Form State for Create User
  const [formData, setFormData] = useState<CreateUserPayload>({
    name: '',
    email: '',
    role: 'EARLY_TALENT',
    title: 'Associate Software Engineer',
    cohort: 'Cohort 2025',
    team_name: 'Payments Engineering',
    pathway_code: 'SE',
    mentor_id: 'u-priya',
    sponsor_id: 'u-sponsor',
    current_month: 1,
    standing: 'ON_TRACK',
  })

  const createUserMutation = useMutation({
    mutationFn: (payload: CreateUserPayload) => api.createUser(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['associates'] })
      setIsCreateModalOpen(false)
      setFormData({
        name: '',
        email: '',
        role: 'EARLY_TALENT',
        title: 'Associate Software Engineer',
        cohort: 'Cohort 2025',
        team_name: 'Payments Engineering',
        pathway_code: 'SE',
        mentor_id: 'u-priya',
        sponsor_id: 'u-sponsor',
        current_month: 1,
        standing: 'ON_TRACK',
      })
    },
  })

  const deleteUserMutation = useMutation({
    mutationFn: (userId: string) => api.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['associates'] })
    },
  })

  const users = usersQuery.data || []
  const associates = associatesQuery.data || []

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter
    return matchesSearch && matchesRole
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-blue-700">
            <span className="h-2 w-2 rounded-full bg-blue-600" />
            ENTERPRISE DIRECTORY &amp; ACCESS MANAGEMENT
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">
            User &amp; Associate Management
          </h1>
          <p className="mt-1 max-w-2xl text-xs text-slate-500">
            Provision new user accounts, assign enterprise roles, map mentors and sponsors, and manage GDA cohort pathway assignments.
          </p>
        </div>

        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-blue-600/20 shrink-0"
        >
          <UserPlus size={15} />
          Create New User
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4 border-slate-200">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users by name, email, or title..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-4 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Role:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 outline-none focus:border-blue-500"
            >
              <option value="ALL">All Roles ({users.length})</option>
              <option value="EARLY_TALENT">Early Talent ({users.filter((u) => u.role === 'EARLY_TALENT').length})</option>
              <option value="MENTOR_COACH">Mentor / Coach ({users.filter((u) => u.role === 'MENTOR_COACH').length})</option>
              <option value="ENGINEERING_EXCELLENCE_COMMITTEE">Excellence Committee</option>
              <option value="SENIOR_LEADER_SPONSOR">Senior Leader Sponsor</option>
              <option value="TECHNOLOGY_HEAD">Technology Head</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Users & Associates Directory Table */}
      <Card className="overflow-hidden border border-slate-200 shadow-sm">
        <div className="border-b border-slate-200 bg-slate-50/80 px-6 py-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">ACTIVE DIRECTORY</span>
            <h2 className="text-sm font-bold text-slate-900 mt-0.5">Enterprise User Accounts ({filteredUsers.length})</h2>
          </div>
        </div>

        {usersQuery.isLoading ? (
          <div className="p-6 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-6 py-3.5">USER / ASSOCIATE</th>
                  <th className="px-6 py-3.5">ROLE</th>
                  <th className="px-6 py-3.5">COHORT / TEAM</th>
                  <th className="px-6 py-3.5">MENTOR / SPONSOR</th>
                  <th className="px-6 py-3.5 text-center">STANDING</th>
                  <th className="px-6 py-3.5 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((user) => {
                  const assoc = associates.find((a) => a.user_id === user.id)
                  const roleConfig = ROLE_LABELS[user.role] || { label: user.role, badge: 'bg-slate-100 text-slate-700' }
                  return (
                    <tr key={user.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0c1b33] text-xs font-bold text-white shadow-sm">
                            {user.avatar_initials || user.name.split(' ').map((n) => n[0]).join('')}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{user.name}</p>
                            <p className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                              <Mail size={11} /> {user.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <Badge className={roleConfig.badge}>{roleConfig.label}</Badge>
                        <p className="text-[10px] text-slate-400 mt-1">{user.title}</p>
                      </td>

                      <td className="px-6 py-4">
                        {assoc ? (
                          <div>
                            <p className="font-semibold text-slate-800">{assoc.team_name}</p>
                            <p className="text-[10px] text-slate-400 font-mono">{assoc.cohort} · Pathway: <strong>{assoc.pathway_code}</strong></p>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Enterprise Admin</span>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        {assoc ? (
                          <div className="space-y-0.5">
                            <p className="text-slate-700 font-medium">Mentor: <strong>{assoc.mentor_name || 'Priya Nair'}</strong></p>
                            <p className="text-[10px] text-slate-400">Sponsor: {assoc.sponsor_name || 'Leadership Sponsor'}</p>
                          </div>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-center">
                        {assoc ? (
                          <Badge
                            className={
                              assoc.standing === 'FAST_TRACK'
                                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                : 'bg-blue-50 text-blue-800 border-blue-200'
                            }
                          >
                            {assoc.standing === 'FAST_TRACK' ? 'Fast-Track' : 'On Track'}
                          </Badge>
                        ) : (
                          <Badge className="bg-slate-100 text-slate-700">Governance</Badge>
                        )}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete user ${user.name}?`)) {
                              deleteUserMutation.mutate(user.id)
                            }
                          }}
                          className="rounded p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                          title="Delete User"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Modal: Create New User & Associate */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                    <UserPlus size={16} />
                  </div>
                  <h2 className="text-base font-bold text-slate-900">Create New User / Associate</h2>
                </div>
                <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                  <X size={18} />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  if (!formData.name || !formData.email) {
                    alert('Please provide a valid name and email.')
                    return
                  }
                  createUserMutation.mutate(formData)
                }}
                className="space-y-4 text-xs"
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Vikram Sharma"
                      className="w-full rounded-lg border border-slate-300 p-2.5 outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="vikram.sharma@wellsfargo.com"
                      className="w-full rounded-lg border border-slate-300 p-2.5 outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Enterprise Role *</label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value as RoleId })}
                      className="w-full rounded-lg border border-slate-300 p-2.5 outline-none focus:border-blue-500 font-semibold text-slate-800"
                    >
                      <option value="EARLY_TALENT">Early Talent (GDA Associate)</option>
                      <option value="MENTOR_COACH">Mentor / Coach</option>
                      <option value="ENGINEERING_EXCELLENCE_COMMITTEE">Engineering Excellence Committee</option>
                      <option value="SENIOR_LEADER_SPONSOR">Senior Leader Sponsor</option>
                      <option value="TECHNOLOGY_HEAD">Technology Head</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Job Title *</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g. Associate Software Engineer"
                      className="w-full rounded-lg border border-slate-300 p-2.5 outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Associate Specific Fields */}
                {formData.role === 'EARLY_TALENT' && (
                  <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4 space-y-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700">GDA ASSOCIATE SETTINGS</span>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Assigned Business Team</label>
                        <input
                          type="text"
                          value={formData.team_name}
                          onChange={(e) => setFormData({ ...formData, team_name: e.target.value })}
                          className="w-full rounded-lg border border-slate-300 bg-white p-2 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Starting Pathway Code</label>
                        <select
                          value={formData.pathway_code}
                          onChange={(e) => setFormData({ ...formData, pathway_code: e.target.value })}
                          className="w-full rounded-lg border border-slate-300 bg-white p-2 outline-none font-mono font-bold text-blue-700"
                        >
                          <option value="SE">SE (Software Engineering)</option>
                          <option value="DE">DE (Data &amp; Analytics)</option>
                          <option value="CSE">CSE (Cloud &amp; SRE)</option>
                          <option value="IE">IE (Integration &amp; Platform)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={createUserMutation.isPending}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
                  >
                    {createUserMutation.isPending ? 'Provisioning...' : 'Provision Account'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
