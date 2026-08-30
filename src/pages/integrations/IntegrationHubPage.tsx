import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Layers,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Building,
  GraduationCap,
  Sparkles,
  Zap,
  Cpu,
  Radio,
  FileCode,
  Check,
} from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../lib/api'
import type { LMSConnector, HRISConnector, XAPIStatement } from '../../types'

export function IntegrationHubPage() {
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState<'LMS' | 'HRIS' | 'XAPI_TESTER'>('LMS')
  const [xapiActor, setXapiActor] = useState('ananya.rao@enterprise.com')
  const [xapiVerb, setXapiVerb] = useState('completed')
  const [xapiActivity, setXapiActivity] = useState('Coursera: Kafka Concurrency Masterclass')
  const [xapiResult, setXapiResult] = useState<any>(null)

  // Fetch LMS and HRIS connectors
  const lmsQuery = useQuery({
    queryKey: ['lmsConnectors'],
    queryFn: () => api.lmsConnectors(),
  })

  const hrisQuery = useQuery({
    queryKey: ['hrisConnectors'],
    queryFn: () => api.hrisConnectors(),
  })

  // Sync LMS Mutation
  const syncMutation = useMutation({
    mutationFn: (id: string) => api.triggerLmsSync(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lmsConnectors'] })
    },
  })

  // Ingest xAPI Mutation
  const xapiMutation = useMutation({
    mutationFn: (stmt: XAPIStatement) => api.ingestXapi(stmt),
    onSuccess: (res) => {
      setXapiResult(res)
    },
  })

  const handleTestXapi = () => {
    xapiMutation.mutate({
      actor_email: xapiActor,
      verb: xapiVerb,
      activity_id: 'act-cser-kafka-201',
      activity_name: xapiActivity,
      score_scaled: 0.96,
      mapped_skill_id: 'sk-kafka-partitioning',
    })
  }

  const lmsList = lmsQuery.data || []
  const hrisList = hrisQuery.data || []

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 text-xs font-black rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" /> Integration Hub
            </span>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs text-slate-400">Requirements 31 &amp; 32 (LMS &amp; HRIS Connectors)</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Enterprise Integrations &amp; Connectors
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage live bi-directional sync with Coursera, Pluralsight, Tin Can xAPI LRS, Workday HCM, and Greenhouse ATS.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-bold">
        {[
          { key: 'LMS', label: '1. External LMS / LXP & xAPI (Req 31)', icon: GraduationCap },
          { key: 'HRIS', label: '2. HRIS & ATS Workforce Pipelines (Req 32)', icon: Building },
          { key: 'XAPI_TESTER', label: '3. Tin Can (xAPI) Stream Ingest Tester', icon: Radio },
        ].map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.key
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 py-2 rounded-xl flex items-center gap-2 transition shrink-0 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* TAB 1: LMS CONNECTORS */}
      {activeTab === 'LMS' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {lmsList.map((c) => (
              <div key={c.id} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 text-[9px] font-black rounded bg-indigo-50 text-indigo-700 uppercase">
                      {c.provider}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900">{c.name}</h3>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-100 text-emerald-800 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    {c.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Health Score</div>
                    <div className="text-base font-black text-emerald-600">{c.health_score}%</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Records Synced</div>
                    <div className="text-base font-black text-indigo-700">{c.total_records_synced}</div>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 font-mono space-y-1 pt-1 border-t border-slate-100">
                  <div>Frequency: <strong>{c.sync_frequency}</strong></div>
                  <div>Last Synced: <strong>{c.last_synced_at}</strong></div>
                  <div className="truncate text-slate-400">{c.credentials_masked}</div>
                </div>

                <button
                  onClick={() => syncMutation.mutate(c.id)}
                  disabled={syncMutation.isPending}
                  className="w-full py-2.5 rounded-xl bg-[#007df0] hover:bg-[#0069cc] text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-xs"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${syncMutation.isPending ? 'animate-spin' : ''}`} />
                  <span>{syncMutation.isPending ? 'Triggering Sync...' : 'Trigger Sync Now'}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: HRIS CONNECTORS */}
      {activeTab === 'HRIS' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {hrisList.map((h) => (
              <div key={h.id} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 text-[9px] font-black rounded bg-purple-50 text-purple-700 uppercase">
                      {h.provider}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900">{h.name}</h3>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-100 text-emerald-800">
                    {h.status}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Active In-Flight Pipeline</div>
                    <div className="text-xl font-black text-indigo-700">{h.active_pipeline_count} Candidates</div>
                  </div>
                  <div className="text-right font-mono text-[10px] text-slate-500">
                    <div>Direction: {h.sync_direction}</div>
                    <div>Last: {h.last_synced_at}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: XAPI STATEMENT TESTER */}
      {activeTab === 'XAPI_TESTER' && (
        <div className="max-w-2xl space-y-4">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xl space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Simulate External xAPI Statement Ingestion
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Actor Email:</label>
                <input
                  type="text"
                  value={xapiActor}
                  onChange={(e) => setXapiActor(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-mono text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Verb:</label>
                <select
                  value={xapiVerb}
                  onChange={(e) => setXapiVerb(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-mono text-xs"
                >
                  <option value="completed">completed</option>
                  <option value="mastered">mastered</option>
                  <option value="scored">scored</option>
                  <option value="passed">passed</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Activity Name:</label>
                <input
                  type="text"
                  value={xapiActivity}
                  onChange={(e) => setXapiActivity(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold"
                />
              </div>

              <button
                onClick={handleTestXapi}
                disabled={xapiMutation.isPending}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition shadow-md flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4" />
                <span>{xapiMutation.isPending ? 'Ingesting Statement...' : 'Ingest xAPI Statement'}</span>
              </button>

              {xapiResult && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> {xapiResult.message}
                  </div>
                  <div className="text-[10px] font-mono text-emerald-700">
                    Ledger Entry: {xapiResult.evidence_ledger_entry_id} • Skill: {xapiResult.mapped_skill_id}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
