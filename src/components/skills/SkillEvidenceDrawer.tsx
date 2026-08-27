import { motion, AnimatePresence } from 'framer-motion'
import { X, Award, CheckCircle2, AlertTriangle, ExternalLink, BookOpen, Code2, GitPullRequest, Network, UserCheck, ShieldCheck, ChevronRight, Sparkles } from 'lucide-react'
import type { AssociateSkill, SkillEvidenceDetail } from '../../types'
import { Link } from 'react-router-dom'

interface SkillEvidenceDrawerProps {
  skill: AssociateSkill | null
  isOpen: boolean
  onClose: () => void
}

export function SkillEvidenceDrawer({ skill, isOpen, onClose }: SkillEvidenceDrawerProps) {
  if (!skill) return null

  const getSourceIcon = (source: string) => {
    switch (source.toLowerCase()) {
      case 'assessment': return <Award className="w-4 h-4 text-amber-400" />
      case 'coding': return <Code2 className="w-4 h-4 text-emerald-400" />
      case 'project': return <GitPullRequest className="w-4 h-4 text-blue-400" />
      case 'mentor': return <UserCheck className="w-4 h-4 text-purple-400" />
      case 'architecture': return <Network className="w-4 h-4 text-cyan-400" />
      default: return <ShieldCheck className="w-4 h-4 text-slate-400" />
    }
  }

  const getConfidenceBadge = (confidence: string) => {
    switch (confidence.toUpperCase()) {
      case 'HIGH':
        return <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">HIGH CONFIDENCE</span>
      case 'MEDIUM':
        return <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">MEDIUM CONFIDENCE</span>
      default:
        return <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">LOW CONFIDENCE</span>
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 transition-opacity"
          />

          {/* Slide-over panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="fixed inset-y-0 right-0 w-full max-w-2xl bg-slate-900 border-l border-slate-800 shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-10">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="px-2.5 py-0.5 text-xs font-semibold rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      {skill.category}
                    </span>
                    {getConfidenceBadge(skill.confidence)}
                  </div>
                  <h2 className="text-xl font-bold text-white tracking-tight">{skill.name}</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Last evaluated: <span className="text-slate-300 font-medium">{skill.last_evaluated}</span> • Evaluated across <span className="text-indigo-400 font-semibold">{skill.evidence_count} evidence sources</span>
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Top Score Summary Banner */}
              <div className="mt-5 grid grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-slate-400">Current Score</span>
                  <div className="flex items-baseline gap-1.5 mt-0.5">
                    <span className="text-2xl font-black text-white">{skill.current_score}%</span>
                    <span className="text-xs font-semibold text-indigo-400">{skill.current_level}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[11px] uppercase tracking-wider text-slate-400">Target Benchmark</span>
                  <div className="flex items-baseline gap-1.5 mt-0.5">
                    <span className="text-2xl font-black text-slate-300">{skill.target_score}%</span>
                    <span className="text-xs text-slate-400">{skill.target_level}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[11px] uppercase tracking-wider text-slate-400">Competency Gap</span>
                  <div className="flex items-baseline gap-1.5 mt-0.5">
                    <span className={`text-2xl font-black ${skill.gap === 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {skill.gap === 0 ? '0' : `-${skill.gap}`}
                    </span>
                    <span className="text-xs text-slate-400">{skill.gap === 0 ? 'Target Met' : 'Points Behind'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Evidence Aggregation Model (Requirement 4) */}
              <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-indigo-400" />
                      Multi-Source Evidence Aggregation
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Competency is triangulated across automated assessments, live coding, repositories, and architect defenses.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {/* Assessment */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300 font-medium flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-amber-400" /> MCQ Assessments (Weight: 25%)
                      </span>
                      <span className="font-bold text-white">{skill.evidence_breakdown.assessment}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: `${skill.evidence_breakdown.assessment}%` }} />
                    </div>
                  </div>

                  {/* Coding */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300 font-medium flex items-center gap-1.5">
                        <Code2 className="w-3.5 h-3.5 text-emerald-400" /> Coding Submissions (Weight: 25%)
                      </span>
                      <span className="font-bold text-white">{skill.evidence_breakdown.coding}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${skill.evidence_breakdown.coding}%` }} />
                    </div>
                  </div>

                  {/* Project */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300 font-medium flex items-center gap-1.5">
                        <GitPullRequest className="w-3.5 h-3.5 text-blue-400" /> Project & ASM Repositories (Weight: 20%)
                      </span>
                      <span className="font-bold text-white">{skill.evidence_breakdown.project}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${skill.evidence_breakdown.project}%` }} />
                    </div>
                  </div>

                  {/* Mentor */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300 font-medium flex items-center gap-1.5">
                        <UserCheck className="w-3.5 h-3.5 text-purple-400" /> Mentor Assessment (Weight: 15%)
                      </span>
                      <span className="font-bold text-white">{skill.evidence_breakdown.mentor}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500 rounded-full" style={{ width: `${skill.evidence_breakdown.mentor}%` }} />
                    </div>
                  </div>

                  {/* Architecture */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300 font-medium flex items-center gap-1.5">
                        <Network className="w-3.5 h-3.5 text-cyan-400" /> Architect Board Review (Weight: 15%)
                      </span>
                      <span className="font-bold text-white">{skill.evidence_breakdown.architecture}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${skill.evidence_breakdown.architecture}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Granular Evidence Items Feed */}
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
                  Verified Evidence Records ({skill.evidence_items.length})
                </h3>
                <div className="space-y-3">
                  {skill.evidence_items.map((ev) => (
                    <div
                      key={ev.id}
                      className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition space-y-2"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-lg bg-slate-800 border border-slate-700">
                            {getSourceIcon(ev.source)}
                          </div>
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                              {ev.source} • Verified {ev.date}
                            </span>
                            <h4 className="text-sm font-semibold text-white">{ev.title}</h4>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`text-base font-bold ${ev.score >= 80 ? 'text-emerald-400' : ev.score >= 60 ? 'text-amber-400' : 'text-rose-400'}`}>
                            {ev.score}%
                          </span>
                          <div className="text-[10px] text-slate-400">Weight {Math.round(ev.weight * 100)}%</div>
                        </div>
                      </div>

                      {ev.details && (
                        <p className="text-xs text-slate-300 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/60 leading-relaxed">
                          {ev.details}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Action */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-slate-900 border border-indigo-500/30">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400 shrink-0">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300">Target Skill Action</span>
                    <h4 className="text-sm font-bold text-white mt-0.5">{skill.recommended_learning}</h4>
                    <p className="text-xs text-slate-300 mt-1">
                      Targeting this module will close {skill.gap} competency points and advance you toward {skill.target_level}.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between">
              <Link
                to="/challenges"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white transition flex items-center gap-1.5"
              >
                <Code2 className="w-3.5 h-3.5" />
                Practice Challenges
              </Link>
              <Link
                to="/curriculum"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition shadow-lg shadow-indigo-600/30 flex items-center gap-1.5"
              >
                <span>Open Learning Track</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
