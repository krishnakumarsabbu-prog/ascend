import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ShieldCheck,
  AlertTriangle,
  Clock,
  CheckCircle2,
  XCircle,
  RotateCcw,
  TrendingUp,
  User,
  History,
  Send,
  Sparkles,
  ChevronRight,
  Filter,
  FileText,
} from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../lib/api'
import type { WorkflowInstance, WorkflowTransitionRequest } from '../../types'
import { Card } from '../ui'

interface ApprovalsCenterProps {
  currentRole?: string
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

  // Queries
  const instancesQuery = useQuery({
    queryKey: ['workflowInstances', currentRole],
    queryFn: () => api.workflowInstances({ role: currentRole }),
  })

  const slaMetricsQuery = useQuery({
    queryKey: ['workflowSlaMetrics'],
    queryFn: () => api.slaDashboard(),
  })

  const instances = instancesQuery.data || []
  const slaMetrics = slaMetricsQuery.data

  // Transition Mutation
  const transitionMutation = useMutation({
    mutationFn: (payload: WorkflowTransitionRequest) => api.transitionWorkflow(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflowInstances'] })
      queryClient.invalidateQueries({ queryKey: ['workflowSlaMetrics'] })
      setDecisionAction(null)
      setReasonInput('')
      setCommentsInput('')
      setSelectedInstance(null)
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
      reason: reasonInput || `Transitioned by ${currentUserName} via Approvals Center`,
      comments: commentsInput,
    })
  }

  const getSlaBadge = (status: string) => {
    switch (status) {
      case 'WITHIN_SLA':
        return (
          <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
            <Clock className="w-3 h-3" /> Within SLA
          </span>
        )
      case 'WARNING':
        return (
          <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> Near SLA
          </span>
        )
      case 'BREACHED':
        return (
          <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
            <XCircle className="w-3 h-3" /> Breached &amp; Escalated
          </span>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* SLA Metric Overview Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Active Requests</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{slaMetrics?.total_active ?? instances.length}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Across all enterprise pipelines</div>
        </Card>

        <Card className="p-4">
          <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Within Target SLA</div>
          <div className="text-2xl font-black text-emerald-700 mt-1">{slaMetrics?.within_sla ?? 2}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Avg cycle time: 28.4h</div>
        </Card>

        <Card className="p-4">
          <div className="text-[10px] font-bold uppercase tracking-wider text-amber-600">Approaching SLA Warning</div>
          <div className="text-2xl font-black text-amber-700 mt-1">{slaMetrics?.warning_count ?? 1}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">&lt; 12h threshold remaining</div>
        </Card>

        <Card className="p-4">
          <div className="text-[10px] font-bold uppercase tracking-wider text-rose-600">Auto-Escalated</div>
          <div className="text-2xl font-black text-rose-700 mt-1">{slaMetrics?.breached_count ?? 0}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Escalated to Executive Heads</div>
        </Card>
      </div>

      {/* Main Approvals Table and Details */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left 2 Cols: Active Request Queue */}
        <div className="xl:col-span-2 space-y-4">
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#007df0]">
                  ENTERPRISE APPROVAL ENGINE
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">Active Approval Queue</h3>
              </div>
              <span className="text-xs text-slate-500">{instances.length} items requiring attention</span>
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
                      ? 'bg-sky-50/70 border-[#007df0] shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{inst.associate_name}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-[11px] text-[#007df0] font-bold">{inst.workflow_name}</span>
                    </div>
                    <p className="text-xs text-slate-600">
                      Current Stage: <span className="text-slate-900 font-bold">{inst.current_step_name}</span> (Role: {inst.current_assignee_role})
                    </p>
                    <div className="text-[10.5px] text-slate-400 font-mono">
                      Due: {inst.due_date} ({inst.sla_hours}h SLA)
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {getSlaBadge(inst.sla_status)}
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-slate-100 text-slate-700 border border-slate-200">
                      {inst.status}
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              ))}

              {instances.length === 0 && (
                <div className="p-8 text-center text-xs text-slate-400">
                  No pending approval requests assigned to your role.
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Right Col: Instance Inspector & Decision Action Panel */}
        <div className="space-y-4">
          {selectedInstance ? (
            <Card className="p-6 space-y-5">
              {/* Header */}
              <div className="border-b border-slate-100 pb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#007df0]">
                  Request Detail: #{selectedInstance.id}
                </span>
                <h3 className="text-sm font-bold text-slate-900 mt-0.5">{selectedInstance.workflow_name}</h3>
                <p className="text-xs text-slate-500">Candidate: <strong className="text-slate-900">{selectedInstance.associate_name}</strong></p>
              </div>

              {/* Payload Parameters */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Request Justification &amp; Payload
                </span>
                {Object.entries(selectedInstance.payload).map(([k, v]) => (
                  <div key={k} className="text-xs">
                    <span className="text-slate-500 capitalize">{k.replace('_', ' ')}:</span>{' '}
                    <span className="text-slate-900 font-medium">{v}</span>
                  </div>
                ))}
              </div>

              {/* Action Decision Selector */}
              {selectedInstance.status !== 'APPROVED' && selectedInstance.status !== 'REJECTED' && (
                <div className="space-y-3 pt-2">
                  <span className="text-[11px] font-bold uppercase text-slate-500 block">
                    Render Decision:
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setDecisionAction('APPROVE')}
                      className={`p-2.5 text-xs font-bold rounded-xl border transition flex items-center justify-center gap-1.5 ${
                        decisionAction === 'APPROVE'
                          ? 'bg-emerald-600 text-white border-emerald-500 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                    </button>
                    <button
                      onClick={() => setDecisionAction('REQUEST_REWORK')}
                      className={`p-2.5 text-xs font-bold rounded-xl border transition flex items-center justify-center gap-1.5 ${
                        decisionAction === 'REQUEST_REWORK'
                          ? 'bg-amber-600 text-white border-amber-500 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-amber-300 hover:bg-amber-50/40'
                      }`}
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Rework
                    </button>
                    <button
                      onClick={() => setDecisionAction('ESCALATE')}
                      className={`p-2.5 text-xs font-bold rounded-xl border transition flex items-center justify-center gap-1.5 ${
                        decisionAction === 'ESCALATE'
                          ? 'bg-purple-600 text-white border-purple-500 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-purple-300 hover:bg-purple-50/40'
                      }`}
                    >
                      <TrendingUp className="w-3.5 h-3.5" /> Escalate
                    </button>
                    <button
                      onClick={() => setDecisionAction('REJECT')}
                      className={`p-2.5 text-xs font-bold rounded-xl border transition flex items-center justify-center gap-1.5 ${
                        decisionAction === 'REJECT'
                          ? 'bg-rose-600 text-white border-rose-500 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-rose-300 hover:bg-rose-50/40'
                      }`}
                    >
                      <XCircle className="w-3.5 h-3.5" /> Reject
                    </button>
                  </div>

                  {/* Decision Form inputs */}
                  {decisionAction && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-3 pt-2">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 block mb-1">Decision Reasoning (Audited)</label>
                        <input
                          type="text"
                          placeholder="Why is this action being taken? (Required for audit)"
                          value={reasonInput}
                          onChange={(e) => setReasonInput(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-[#007df0] focus:bg-white"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 block mb-1">Internal Feedback / Comments</label>
                        <textarea
                          rows={2}
                          placeholder="Optional comments for next reviewers or candidate..."
                          value={commentsInput}
                          onChange={(e) => setCommentsInput(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-[#007df0] focus:bg-white resize-none"
                        />
                      </div>

                      <button
                        onClick={handleExecuteDecision}
                        disabled={transitionMutation.isPending}
                        className="w-full py-2.5 rounded-xl bg-[#007df0] hover:bg-[#0069cc] text-white font-bold text-xs transition shadow-xs flex items-center justify-center gap-2"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Confirm &amp; Transition Request</span>
                      </button>
                    </motion.div>
                  )}
                </div>
              )}

              {/* Audit History Timeline */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5 text-[#007df0]" /> Audit History &amp; Decision Log
                </span>

                <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                  {selectedInstance.history.map((h) => (
                    <div key={h.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{h.actor_name} ({h.actor_role})</span>
                        <span className="text-slate-400 text-[10px] font-mono">{h.timestamp}</span>
                      </div>
                      <div className="text-[#007df0] font-bold">Action: {h.action}</div>
                      <p className="text-slate-600 leading-snug">{h.decision_reason}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ) : (
            <Card className="p-12 text-center text-slate-400">
              <ShieldCheck className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p className="text-xs">Select any request on the left to review details and take action.</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
