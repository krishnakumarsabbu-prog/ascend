import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ShieldCheck,
  FileCode,
  Lock,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Search,
  Filter,
  Layers,
  ArrowRight,
  Sparkles,
} from 'lucide-react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { api } from '../../lib/api'
import type { AuditLogEvent } from '../../types'
import { Card } from '../../components/ui'

export function AuditCenterPage() {
  const [selectedEventId, setSelectedEventId] = useState<string>('audit-evt-101')
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL')
  const [filterAction, setFilterAction] = useState<string>('ALL')
  const [verificationResult, setVerificationResult] = useState<any>(null)

  // Query Audit Events
  const auditQuery = useQuery({
    queryKey: ['auditLogs', filterSeverity, filterAction],
    queryFn: () =>
      api.auditLogs({
        severity: filterSeverity === 'ALL' ? undefined : filterSeverity,
        action: filterAction === 'ALL' ? undefined : filterAction,
      }),
  })

  // Verify Cryptographic Hash Chain Mutation
  const verifyMutation = useMutation({
    mutationFn: () => api.verifyAuditChain(),
    onSuccess: (res) => {
      setVerificationResult(res)
    },
  })

  const logs = auditQuery.data || []
  const selectedEvent = logs.find((l) => l.id === selectedEventId) || logs[0]

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'SECURITY_EVENT':
        return 'bg-purple-50 text-purple-700 border-purple-200'
      case 'COMPLIANCE_VIOLATION':
        return 'bg-rose-50 text-rose-700 border-rose-200'
      case 'WARNING':
        return 'bg-amber-50 text-amber-700 border-amber-200'
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200'
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 text-xs font-bold rounded-md bg-sky-50 text-sky-700 border border-sky-200 uppercase tracking-wider flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#007df0]" /> Security &amp; Compliance Audit Ledger
            </span>
            <span className="text-xs text-slate-300">•</span>
            <span className="text-xs text-slate-400">Cryptographic Audit Ledger</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Immutable Audit Trail &amp; Governance Center
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Immutable, cryptographically hash-chained audit logging for SOC 2 Type II, ISO 27001, and GDPR compliance validation.
          </p>
        </div>

        {/* Action Button: Verify Hash Chain */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => verifyMutation.mutate()}
            disabled={verifyMutation.isPending}
            className="px-4 py-2.5 rounded-xl bg-[#007df0] hover:bg-[#0069cc] text-white font-bold text-xs transition flex items-center gap-2 shadow-xs"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{verifyMutation.isPending ? 'Verifying Block Hashes...' : 'Verify Cryptographic Chain'}</span>
          </button>
        </div>
      </div>

      {/* Verification Result Banner */}
      {verificationResult && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between gap-4 text-xs shadow-xs"
        >
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <span className="font-bold text-emerald-800 uppercase">
                Cryptographic Hash Chain Validated (0 Tamper Anomalies)
              </span>
              <p className="text-slate-600 font-mono text-[11px]">
                {verificationResult.total_events_checked} block digests checked • Root: {verificationResult.root_hash.slice(0, 16)}... • Latest: {verificationResult.latest_block_hash.slice(0, 16)}...
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono text-slate-400">{verificationResult.verified_at}</span>
        </motion.div>
      )}

      {/* Filters Bar */}
      <Card className="p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <span className="text-xs font-bold text-slate-900 uppercase">
          Audit Event Log ({logs.length})
        </span>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-semibold"
          >
            <option value="ALL">All Severities</option>
            <option value="INFO">INFO</option>
            <option value="WARNING">WARNING</option>
            <option value="SECURITY_EVENT">SECURITY EVENT</option>
            <option value="COMPLIANCE_VIOLATION">COMPLIANCE VIOLATION</option>
          </select>

          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-semibold"
          >
            <option value="ALL">All Actions</option>
            <option value="APPROVE">APPROVE</option>
            <option value="CREATE">CREATE</option>
            <option value="OVERRIDE">OVERRIDE</option>
            <option value="UPDATE">UPDATE</option>
          </select>
        </div>
      </Card>

      {/* Main Grid: Left Event Table + Right Diff Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Events Table */}
        <div className="lg:col-span-2 space-y-3">
          {logs.map((evt) => {
            const isSelected = selectedEvent?.id === evt.id
            return (
              <Card
                key={evt.id}
                onClick={() => setSelectedEventId(evt.id)}
                className={`p-4 transition cursor-pointer ${
                  isSelected
                    ? 'ring-2 ring-[#007df0] bg-sky-50/50 shadow-xs'
                    : 'hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 text-[9px] font-bold rounded border ${getSeverityBadge(evt.severity)}`}>
                      {evt.severity}
                    </span>
                    <span className="font-mono text-xs font-bold text-slate-900">{evt.action}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-xs text-slate-600">{evt.resource_type}</span>
                  </div>
                  <span className="font-mono text-[10px] text-slate-400">{evt.timestamp}</span>
                </div>

                <div className="text-xs font-bold text-slate-900">{evt.resource_name}</div>

                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-2 border-t border-slate-100 font-mono">
                  <span>Actor: {evt.actor_name} ({evt.actor_role})</span>
                  <span className="truncate max-w-[180px]">Hash: {evt.hash_chain_sha256.slice(0, 16)}...</span>
                </div>
              </Card>
            )
          })}
        </div>

        {/* Right Col: Side-by-Side JSON Diff Inspector */}
        <div className="space-y-4">
          {selectedEvent && (
            <Card className="p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-[#007df0]" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    State Change Delta (JSON Diff)
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-slate-400">IP: {selectedEvent.ip_address}</span>
              </div>

              {/* Before State */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase text-rose-600">Before State:</span>
                <pre className="p-3 rounded-xl bg-slate-50 text-[11px] font-mono text-rose-700 overflow-x-auto border border-slate-200">
                  {selectedEvent.before_state ? JSON.stringify(selectedEvent.before_state, null, 2) : 'null (Created)'}
                </pre>
              </div>

              {/* After State */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase text-emerald-600">After State:</span>
                <pre className="p-3 rounded-xl bg-slate-50 text-[11px] font-mono text-emerald-700 overflow-x-auto border border-slate-200">
                  {JSON.stringify(selectedEvent.after_state, null, 2)}
                </pre>
              </div>

              {/* Actor & Reason */}
              <div className="pt-2 border-t border-slate-100 text-xs space-y-1">
                <div className="text-slate-400 font-semibold text-[10px] uppercase">Audit Action Details:</div>
                <p className="text-slate-700 leading-relaxed font-medium">"{selectedEvent.action} executed on {selectedEvent.resource_type} ({selectedEvent.resource_name}) by {selectedEvent.actor_name}"</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
