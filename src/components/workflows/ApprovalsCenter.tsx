import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShieldCheck,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  UserCheck,
  Send,
  FileText,
  ChevronRight,
  TrendingUp,
  History,
  MessageSquare,
  Sparkles,
  ArrowUpRight,
  Check,
} from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../lib/api'
import type { WorkflowInstance, WorkflowTransitionRequest, RoleId } from '../../types'

interface ApprovalsCenterProps {
  currentRole?: RoleId | string
  currentUserId?: string
  currentUserName?: string
}

export function ApprovalsCenter({
  currentRole = 'SENIOR_LEADER_SPONSOR',
  currentUserId = 'u-sponsor',
  currentUserName = 'Sponsor Executive',
}: ApprovalsCenterProps) {
  const queryClient = useQueryClient()
  const [selectedInstance, setSelectedInstance] = useState<WorkflowInstance | null>(null)
  const [decisionAction, setDecisionAction] = useState<'APPROVE' | 'REJECT' | 'REQUEST_REWORK' | 'ESCALATE' | 'DELEGATE' | null>(null)
  const [reasonInput, setReasonInput] = useState('')
  const [commentsInput, setCommentsInput] = useState('')
  const [delegateToInput, setDelegateToInput] = useState('ENGINEERING_EXCELLENCE_COMMITTEE')

  // Queries
  const instancesQuery = useQuery({
    queryKey: ['workflowInstances', currentRole],
    queryFn: () => api.workflowInstances(),
  })

  const slaQuery = useQuery({
    queryKey: ['slaDashboard'],
    queryFn: api.slaDashboard,
  })

  const instances = instancesQuery.data || []
  const slaMetrics = slaQuery.data

  // Transition Mutation
  const transitionMutation = useMutation({
    mutationFn: (req: WorkflowTransitionRequest) => api.transitionWorkflow(req),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['workflowInstances'] })
      queryClient.invalidateQueries({ queryKey: ['slaDashboard'] })
      setSelectedInstance(updated)
      setDecisionAction(null)
      setReasonInput('')
      setCommentsInput('')
    },
  })

  const handleExecuteDecision = () => {
    if (!selectedInstance || !decisionAction) return
    transitionMutation.mutate({
      instance_id: selectedInstance.id,
      action: decisionAction,
      actor_id: currentUserId,
      actor_name: currentUserName,
      actor_role: currentRole,
      reason: reasonInput || `Action ${decisionAction} approved by ${currentUserName}`,
      comments: commentsInput,
      delegate_to: decisionAction === 'DELEGATE' ? delegateToInput : undefined,
    })
  }

  const getSlaBadge = (status: string) => {
    switch (status) {
      case 'HEALTHY':
        return (
          <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Within SLA
          </span>
        )
      case 'WARNING':
        return (
          <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1 animate-pulse">
            <AlertTriangle className="w-3 h-3" /> SLA Warning (&lt; 6h)
          </span>
        )
      case 'BREACHED_ESCALATED':
        return (
          <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30 flex items-center gap-1">
            <XCircle className="w-3 h-3" /> Breached &amp; Escalated
          </span>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* SLA Metric Overview Strip (Requirement 14) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Active Requests</div>
          <div className="text-2xl font-black text-white mt-1">{slaMetrics?.total_active ?? instances.length}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Across all enterprise pipelines</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
          <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Within Target SLA</div>
          <div className="text-2xl font-black text-emerald-400 mt-1">{slaMetrics?.within_sla ?? 2}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Avg cycle time: 28.4h</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
          <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Approaching SLA Warning</div>
          <div className="text-2xl font-black text-amber-400 mt-1">{slaMetrics?.warning_count ?? 1}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">&lt; 12h threshold remaining</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
          <div className="text-[10px] font-bold uppercase tracking-wider text-rose-400">Auto-Escalated</div>
          <div className="text-2xl font-black text-rose-400 mt-1">{slaMetrics?.breached_count ?? 0}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Escalated to Executive Heads</div>
        </div>
      </div>

      {/* Main Approvals Table and Details */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left 2 Cols: Active Request Queue */}
        <div className="xl:col-span-2 space-y-4">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                  ENTERPRISE APPROVAL ENGINE (REQ 12)
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">Active Approval Queue</h3>
              </div>
              <span className="text-xs text-slate-400">{instances.length} items requiring attention</span>
            </div>

            {/* List of Instances */}
            <div className="space-y-3">
              {instances.map((inst) => (
                <div
                  key={inst.id}
                  onClick={() => {
                    setSelectedInstance(inst)
                    setDecisionAction(null)
                  }}
                  className={`p-4 rounded-xl border transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    selectedInstance?.id === inst.id
                      ? 'bg-slate-800/90 border-indigo-500 shadow-lg'
                      : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{inst.associate_name}</span>
                      <span className="text-slate-600">•</span>
                      <span className="text-[11px] text-indigo-400 font-semibold">{inst.workflow_name}</span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Current Stage: <span className="text-slate-200 font-bold">{inst.current_step_name}</span> (Role: {inst.current_assignee_role})
                    </p>
                    <div className="text-[10px] text-slate-500 font-mono">
                      Due: {inst.due_date} ({inst.sla_hours}h SLA)
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {getSlaBadge(inst.sla_status)}
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-slate-800 text-slate-300">
                      {inst.status}
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Instance Inspector & Decision Action Panel */}
        <div className="space-y-4">
          {selectedInstance ? (
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-5">
              {/* Header */}
              <div className="border-b border-slate-800 pb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                  Request Detail: #{selectedInstance.id}
                </span>
                <h3 className="text-sm font-bold text-white mt-0.5">{selectedInstance.workflow_name}</h3>
                <p className="text-xs text-slate-400">Candidate: <strong className="text-white">{selectedInstance.associate_name}</strong></p>
              </div>

              {/* Payload Parameters */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Request Justification &amp; Payload
                </span>
                {Object.entries(selectedInstance.payload).map(([k, v]) => (
                  <div key={k} className="text-xs">
                    <span className="text-slate-400 capitalize">{k.replace('_', ' ')}:</span>{' '}
                    <span className="text-slate-200 font-medium">{v}</span>
                  </div>
                ))}
              </div>

              {/* Action Decision Selector */}
              {selectedInstance.status !== 'APPROVED' && selectedInstance.status !== 'REJECTED' && (
                <div className="space-y-3 pt-2">
                  <span className="text-[11px] font-bold uppercase text-slate-400 block">
                    Render Decision:
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setDecisionAction('APPROVE')}
                      className={`p-2.5 text-xs font-bold rounded-xl border transition flex items-center justify-center gap-1.5 ${
                        decisionAction === 'APPROVE'
                          ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-600/30'
                          : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-emerald-500/50'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                    </button>
                    <button
                      onClick={() => setDecisionAction('REQUEST_REWORK')}
                      className={`p-2.5 text-xs font-bold rounded-xl border transition flex items-center justify-center gap-1.5 ${
                        decisionAction === 'REQUEST_REWORK'
                          ? 'bg-amber-600 text-white border-amber-500 shadow-lg shadow-amber-600/30'
                          : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-amber-500/50'
                      }`}
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Rework
                    </button>
                    <button
                      onClick={() => setDecisionAction('ESCALATE')}
                      className={`p-2.5 text-xs font-bold rounded-xl border transition flex items-center justify-center gap-1.5 ${
                        decisionAction === 'ESCALATE'
                          ? 'bg-purple-600 text-white border-purple-500 shadow-lg shadow-purple-600/30'
                          : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-purple-500/50'
                      }`}
                    >
                      <TrendingUp className="w-3.5 h-3.5" /> Escalate
                    </button>
                    <button
                      onClick={() => setDecisionAction('REJECT')}
                      className={`p-2.5 text-xs font-bold rounded-xl border transition flex items-center justify-center gap-1.5 ${
                        decisionAction === 'REJECT'
                          ? 'bg-rose-600 text-white border-rose-500 shadow-lg shadow-rose-600/30'
                          : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-rose-500/50'
                      }`}
                    >
                      <XCircle className="w-3.5 h-3.5" /> Reject
                    </button>
                  </div>

                  {/* Decision Form inputs */}
                  {decisionAction && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-3 pt-2">
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-1">Decision Reasoning (Audited)</label>
                        <input
                          type="text"
                          placeholder="Why is this action being taken? (Required for audit)"
                          value={reasonInput}
                          onChange={(e) => setReasonInput(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-1">Internal Feedback / Comments</label>
                        <textarea
                          rows={2}
                          placeholder="Optional comments for next reviewers or candidate..."
                          value={commentsInput}
                          onChange={(e) => setCommentsInput(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500 resize-none"
                        />
                      </div>

                      <button
                        onClick={handleExecuteDecision}
                        disabled={transitionMutation.isPending}
                        className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Confirm &amp; Transition Request</span>
                      </button>
                    </motion.div>
                  )}
                </div>
              )}

              {/* Audit History Timeline (Requirement 12) */}
              <div className="pt-4 border-t border-slate-800 space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5 text-indigo-400" /> Audit History &amp; Decision Log
                </span>

                <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                  {selectedInstance.history.map((h) => (
                    <div key={h.id} className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 text-[11px] space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">{h.actor_name} ({h.actor_role})</span>
                        <span className="text-slate-500 text-[10px] font-mono">{h.timestamp}</span>
                      </div>
                      <div className="text-indigo-400 font-semibold">Action: {h.action}</div>
                      <p className="text-slate-300 leading-snug">{h.decision_reason}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-400">
              <ShieldCheck className="w-8 h-8 mx-auto mb-2 text-slate-600" />
              <p className="text-xs">Select any request on the left to review details and take action.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
