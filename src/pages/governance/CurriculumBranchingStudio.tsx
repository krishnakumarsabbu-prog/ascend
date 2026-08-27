import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  GitBranch,
  GitMerge,
  BookOpen,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  Layers,
  FileCode,
  Tag,
  Users,
} from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../lib/api'
import type { CurriculumVersion, CurriculumBranchRequest } from '../../types'

export function CurriculumBranchingStudio() {
  const queryClient = useQueryClient()
  const [selectedVersionId, setSelectedVersionId] = useState<string>('cver-101')
  const [showNewBranchModal, setShowNewBranchModal] = useState(false)
  const [newBranchName, setNewBranchName] = useState('')
  const [branchSummary, setBranchSummary] = useState('')

  // Fetch Curriculum Versions
  const versionsQuery = useQuery({
    queryKey: ['curriculumVersions'],
    queryFn: () => api.curriculumVersions(),
  })

  const versions = versionsQuery.data || []
  const selectedVersion = versions.find((v) => v.id === selectedVersionId) || versions[0]

  // Create Branch Mutation
  const branchMutation = useMutation({
    mutationFn: (req: CurriculumBranchRequest) => api.createCurriculumBranch(req),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['curriculumVersions'] })
      setShowNewBranchModal(false)
      setNewBranchName('')
      setBranchSummary('')
    },
  })

  const handleCreateBranch = () => {
    if (!selectedVersion || !newBranchName) return
    branchMutation.mutate({
      course_id: selectedVersion.course_id,
      base_version: selectedVersion.version,
      new_branch_name: newBranchName,
      changelog_summary: branchSummary || 'Experimental curriculum branch update.',
      author: 'Priya Nair (Curriculum Lead)',
    })
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 text-xs font-black rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-wider flex items-center gap-1.5">
              <GitBranch className="w-3.5 h-3.5" /> Curriculum Governance
            </span>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs text-slate-400">Requirement 30 (Versioning &amp; Branching)</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Curriculum Version Control &amp; Branching
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage SemVer release tags, experimental curriculum branches, side-by-side module diffs, and cohort assignments.
          </p>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowNewBranchModal(true)}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition flex items-center gap-2 shadow-lg shadow-indigo-600/30"
          >
            <Plus className="w-4 h-4" />
            <span>Create Curriculum Branch</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Branch List + Right Diff Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Branch List */}
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xl space-y-3">
            <span className="text-xs font-bold text-slate-900 uppercase">
              Curriculum Branches ({versions.length})
            </span>

            <div className="space-y-2">
              {versions.map((ver) => (
                <div
                  key={ver.id}
                  onClick={() => setSelectedVersionId(ver.id)}
                  className={`p-4 rounded-xl border transition cursor-pointer ${
                    selectedVersion?.id === ver.id
                      ? 'bg-indigo-50 border-indigo-400 shadow-sm'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono font-bold text-indigo-700">{ver.version}</span>
                    <span
                      className={`px-2 py-0.2 text-[9px] font-bold rounded ${
                        ver.status === 'ACTIVE'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {ver.status}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900">{ver.branch_name}</h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">{ver.changelog_summary}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 2 Cols: Version Details & Diff Inspector (Requirement 30) */}
        <div className="lg:col-span-2 space-y-5">
          {selectedVersion && (
            <div className="space-y-5">
              {/* Header Card */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-indigo-700">
                      <span>{selectedVersion.course_code}</span>
                      <span>•</span>
                      <span>Branch: {selectedVersion.branch_name}</span>
                    </div>
                    <h2 className="text-lg font-bold text-slate-900 mt-1">{selectedVersion.course_title}</h2>
                  </div>

                  <span className="px-3 py-1 text-xs font-black rounded-full bg-indigo-50 text-indigo-800 border border-indigo-200">
                    Tag: {selectedVersion.version}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{selectedVersion.changelog_summary}</p>

                {/* Assigned Cohorts */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <span className="text-[11px] font-bold uppercase text-slate-400">Assigned Cohorts:</span>
                  <div className="flex flex-wrap gap-2">
                    {selectedVersion.assigned_cohorts.map((coh, idx) => (
                      <span key={idx} className="px-2.5 py-1 text-xs rounded-lg bg-slate-100 text-slate-700 font-semibold flex items-center gap-1">
                        <Users className="w-3 h-3 text-indigo-500" />
                        <span>{coh}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Diff Inspector Strip */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-white shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                      Learning Objectives &amp; Module Deltas (Diff)
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400">
                    {selectedVersion.modules_count} Total Modules
                  </span>
                </div>

                <div className="space-y-2">
                  {selectedVersion.learning_objectives_diff.map((diff, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{diff}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* New Branch Modal */}
      <AnimatePresence>
        {showNewBranchModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg p-6 rounded-2xl bg-white border border-slate-200 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900">Create Experimental Curriculum Branch</h3>
                <button onClick={() => setShowNewBranchModal(false)} className="text-slate-400 hover:text-slate-600">
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Branch Name:</label>
                  <input
                    type="text"
                    placeholder="e.g. v3.1-feature-langgraph-orchestration"
                    value={newBranchName}
                    onChange={(e) => setNewBranchName(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-300 outline-none focus:border-indigo-500 font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Changelog Summary:</label>
                  <textarea
                    rows={3}
                    placeholder="Describe experimental modules added or modified..."
                    value={branchSummary}
                    onChange={(e) => setBranchSummary(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-300 outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  onClick={() => setShowNewBranchModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateBranch}
                  disabled={branchMutation.isPending || !newBranchName}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs transition"
                >
                  {branchMutation.isPending ? 'Branching...' : 'Create Branch'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
