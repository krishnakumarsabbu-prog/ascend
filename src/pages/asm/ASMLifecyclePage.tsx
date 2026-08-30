import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  GitBranch,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ExternalLink,
  ShieldCheck,
  FileText,
  Activity,
  Cpu,
  Layers,
  Sparkles,
  Users,
  Award,
  Send,
  Check,
  Zap,
} from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../lib/api'
import type { ASMProjectLifecycle, ASMPanelMember, ASMRubricScore } from '../../types'
import { Card } from '../../components/ui'

interface ASMLifecyclePageProps {
  associateId?: string
}

export function ASMLifecyclePage({ associateId = 'as-ananya' }: ASMLifecyclePageProps) {
  const queryClient = useQueryClient()
  const [selectedProjectId, setSelectedProjectId] = useState<string>('asm-proj-101')
  const [showScoreModal, setShowScoreModal] = useState(false)
  const [examinerName, setExaminerName] = useState('Priya Nair (Lead Architect)')
  const [examinerRole, setExaminerRole] = useState('LEAD_ARCHITECT')
  const [deliberationNotes, setDeliberationNotes] = useState('Outstanding architectural depth.')
  const [rubricScores, setRubricScores] = useState<Record<string, number>>({
    ARCHITECTURE_DESIGN: 4.8,
    CODE_QUALITY_TESTING: 4.7,
    PRODUCTION_OBSERVABILITY: 4.6,
    DEFENSE_PRESENTATION: 4.9,
    BUSINESS_IMPACT: 4.8,
  })

  // Fetch ASM Projects
  const projectsQuery = useQuery({
    queryKey: ['asmProjects', associateId],
    queryFn: () => api.asmProjects({ associate_id: associateId }),
  })

  const projects = projectsQuery.data || []
  const currentProject = projects.find((p) => p.id === selectedProjectId) || projects[0]

  // Submit Panel Score Mutation
  const scoreMutation = useMutation({
    mutationFn: (member: ASMPanelMember) =>
      api.submitAsmPanelScore(selectedProjectId, member),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['asmProjects'] })
      setShowScoreModal(false)
    },
  })

  const stages = [
    { key: 'SCOPING', label: '1. Scoping' },
    { key: 'RFC_REVIEW', label: '2. RFC Review' },
    { key: 'IMPLEMENTATION', label: '3. Implementation' },
    { key: 'AUTOMATED_VERIFICATION', label: '4. Verification' },
    { key: 'PEER_REVIEW', label: '5. Peer Review' },
    { key: 'BOARD_DEFENSE', label: '6. Board Defense' },
    { key: 'PRODUCTION_GATE', label: '7. Production Gate' },
    { key: 'ARCHIVED', label: '8. Complete' },
  ]

  const getStageIndex = (stage: string) => {
    return stages.findIndex((s) => s.key === stage)
  }

  const handleScoreSubmit = () => {
    const formattedScores: ASMRubricScore[] = [
      { criterion: 'ARCHITECTURE_DESIGN', criterion_label: 'Architecture & Design', weight: 0.25, score: rubricScores.ARCHITECTURE_DESIGN },
      { criterion: 'CODE_QUALITY_TESTING', criterion_label: 'Code Quality & Testing', weight: 0.25, score: rubricScores.CODE_QUALITY_TESTING },
      { criterion: 'PRODUCTION_OBSERVABILITY', criterion_label: 'Production Readiness & SRE', weight: 0.20, score: rubricScores.PRODUCTION_OBSERVABILITY },
      { criterion: 'DEFENSE_PRESENTATION', criterion_label: 'Defense Presentation', weight: 0.15, score: rubricScores.DEFENSE_PRESENTATION },
      { criterion: 'BUSINESS_IMPACT', criterion_label: 'Business Impact', weight: 0.15, score: rubricScores.BUSINESS_IMPACT },
    ]

    scoreMutation.mutate({
      examiner_id: `u-${Date.now()}`,
      examiner_name: examinerName,
      examiner_role: examinerRole,
      rubric_scores: formattedScores,
      overall_score: 4.8,
      recommendation: 'APPROVED',
      deliberation_notes: deliberationNotes,
    })
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 text-xs font-bold rounded-md bg-sky-50 text-sky-700 border border-sky-200 uppercase tracking-wider flex items-center gap-1.5">
              <GitBranch className="w-3.5 h-3.5 text-[#007df0]" /> ASM Milestone Journey
            </span>
            <span className="text-xs text-slate-300">•</span>
            <span className="text-xs text-slate-400">8-Stage Lifecycle &amp; Artifact Defense</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Advanced Systems Milestone (ASM) Lifecycle
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track multi-stage artifact submissions, Chaos Mesh experiments, P99 load profiles, and multi-examiner Architect Board defenses.
          </p>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowScoreModal(true)}
            className="px-4 py-2.5 rounded-xl bg-[#007df0] hover:bg-[#0069cc] text-white font-bold text-xs transition shadow-xs flex items-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Score Board Defense</span>
          </button>
        </div>
      </div>

      {currentProject && (
        <div className="space-y-6">
          {/* 8-Stage Milestone Progress Ribbon */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#007df0]">
                  {currentProject.project_code} • {currentProject.pathway}
                </span>
                <h2 className="text-base font-bold text-slate-900 mt-0.5">{currentProject.project_title}</h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 text-xs font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Composite Score: {currentProject.composite_score} / 5.0
                </span>
              </div>
            </div>

            {/* Stepper Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 pt-2">
              {stages.map((stg, idx) => {
                const currentIdx = getStageIndex(currentProject.current_stage)
                const isPassed = idx < currentIdx
                const isCurrent = idx === currentIdx

                return (
                  <div
                    key={stg.key}
                    className={`p-3 rounded-xl border text-center transition-all flex flex-col justify-between h-20 ${
                      isCurrent
                        ? 'bg-sky-50 border-[#007df0] text-[#007df0] shadow-xs font-bold'
                        : isPassed
                        ? 'bg-emerald-50/60 border-emerald-200 text-emerald-800'
                        : 'bg-slate-50 border-slate-200 text-slate-400'
                    }`}
                  >
                    <div className="text-[10px] font-bold uppercase truncate">{stg.label}</div>
                    <div className="flex items-center justify-center">
                      {isPassed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : isCurrent ? (
                        <Sparkles className="w-4 h-4 text-[#007df0] animate-spin" />
                      ) : (
                        <Clock className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>

          {/* Project Artifacts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Technical Evidence & Artifact Submissions */}
            <div className="lg:col-span-2 space-y-6">
              {/* Telemetry Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Card className="p-4">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">P99 Latency (Load Stress)</div>
                  <div className="text-2xl font-black text-slate-900 mt-1">{currentProject.artifacts.benchmark_p99_latency_ms} ms</div>
                  <div className="text-[10.5px] text-emerald-600 font-bold mt-0.5">SLA Target &lt; 15.0 ms</div>
                </Card>

                <Card className="p-4">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Throughput Benchmark</div>
                  <div className="text-2xl font-black text-slate-900 mt-1">{currentProject.artifacts.benchmark_throughput_tps} TPS</div>
                  <div className="text-[10.5px] text-[#007df0] font-bold mt-0.5">Zero deadlocks recorded</div>
                </Card>

                <Card className="p-4">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">SonarQube / Security Scan</div>
                  <div className="text-2xl font-black text-emerald-600 mt-1">PASSED (0 Vulns)</div>
                  <div className="text-[10.5px] text-slate-500 mt-0.5">Static analysis verified</div>
                </Card>
              </div>

              {/* Artifact Submissions List */}
              <Card className="p-6 space-y-4">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Submitted Verification Artifacts
                </h3>

                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-[#007df0]" />
                        <span className="text-xs font-bold text-slate-900">Architecture RFC Document</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Formal design specification for concurrent idempotency key deduplication and distributed saga orchestration.
                      </p>
                    </div>
                    <a
                      href={currentProject.artifacts.rfc_doc_url}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-[#007df0] hover:bg-slate-50 flex items-center gap-1 shrink-0 shadow-2xs"
                    >
                      <span>View RFC</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <GitBranch className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs font-bold text-slate-900">Pull Request (Merged to Staging)</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Production repository pull request with 94% mutation test coverage and clean CI pipeline runs.
                      </p>
                    </div>
                    <a
                      href={currentProject.artifacts.pr_url}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-emerald-700 hover:bg-slate-50 flex items-center gap-1 shrink-0 shadow-2xs"
                    >
                      <span>PR #14</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-600" />
                      <span className="text-xs font-bold text-slate-900">Chaos Mesh Resilience Report</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{currentProject.artifacts.chaos_experiment_summary}</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Right Col: Multi-Examiner Board Defense Panel */}
            <div className="space-y-5">
              <Card className="p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#007df0]" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                      Examiner Defense Panel ({currentProject.panel_examiners.length})
                    </h3>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Unanimous Pass
                  </span>
                </div>

                <div className="space-y-3">
                  {currentProject.panel_examiners.map((examiner) => (
                    <div key={examiner.examiner_id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs font-bold text-slate-900">{examiner.examiner_name}</div>
                          <div className="text-[10px] text-slate-500 font-semibold">{examiner.examiner_role.replace('_', ' ')}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-black text-slate-900">{examiner.overall_score} / 5.0</div>
                          <span className="px-1.5 py-0.2 text-[9px] font-bold rounded bg-emerald-100 text-emerald-800">
                            {examiner.recommendation}
                          </span>
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-600 italic border-t border-slate-200 pt-2 leading-relaxed">
                        "{examiner.deliberation_notes}"
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* Score Modal */}
      <AnimatePresence>
        {showScoreModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg p-6 rounded-2xl bg-white border border-slate-200 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900">Architect Board Rubric Scoring</h3>
                <button onClick={() => setShowScoreModal(false)} className="text-slate-400 hover:text-slate-600">
                  ✕
                </button>
              </div>

              {/* Rubric sliders */}
              <div className="space-y-3 text-xs">
                {[
                  { key: 'ARCHITECTURE_DESIGN', label: 'Architecture & System Design (25%)' },
                  { key: 'CODE_QUALITY_TESTING', label: 'Code Quality & Mutation Testing (25%)' },
                  { key: 'PRODUCTION_OBSERVABILITY', label: 'Production Readiness & Observability (20%)' },
                  { key: 'DEFENSE_PRESENTATION', label: 'Board Defense Presentation (15%)' },
                  { key: 'BUSINESS_IMPACT', label: 'Enterprise Business Impact (15%)' },
                ].map((item) => (
                  <div key={item.key} className="space-y-1">
                    <div className="flex justify-between font-semibold">
                      <span className="text-slate-700">{item.label}</span>
                      <span className="font-mono font-bold text-[#007df0]">{rubricScores[item.key]} / 5.0</span>
                    </div>
                    <input
                      type="range"
                      min="1.0"
                      max="5.0"
                      step="0.1"
                      value={rubricScores[item.key]}
                      onChange={(e) =>
                        setRubricScores({ ...rubricScores, [item.key]: parseFloat(e.target.value) })
                      }
                      className="w-full accent-[#007df0]"
                    />
                  </div>
                ))}

                <div className="pt-2">
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Deliberation Notes</label>
                  <textarea
                    rows={2}
                    value={deliberationNotes}
                    onChange={(e) => setDeliberationNotes(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-200 outline-none focus:border-[#007df0]"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  onClick={() => setShowScoreModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleScoreSubmit}
                  disabled={scoreMutation.isPending}
                  className="px-5 py-2 rounded-xl bg-[#007df0] hover:bg-[#0069cc] text-white font-bold text-xs transition shadow-xs"
                >
                  {scoreMutation.isPending ? 'Submitting...' : 'Sign & Ratify Defense'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
