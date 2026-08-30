import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  FileCheck2,
  ExternalLink,
  GitPullRequest,
  CheckCircle2,
  AlertCircle,
  Award,
  Terminal,
  Brain,
  MessageSquare,
  ShieldCheck,
  Calendar,
  Layers,
  Sparkles,
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { api } from '../../lib/api'
import type { AssociateSkill, SkillEvidenceDetail } from '../../types'
import { Card, ProgressBar } from '../ui'

interface SkillEvidenceDrawerProps {
  associateId?: string
  skillId: string | null
  onClose: () => void
}

export function SkillEvidenceDrawer({
  associateId = 'as-ananya',
  skillId,
  onClose,
}: SkillEvidenceDrawerProps) {
  const query = useQuery({
    queryKey: ['skillEvidence', associateId, skillId],
    queryFn: () => (skillId ? api.skillEvidence(associateId, skillId) : null),
    enabled: !!skillId,
  })

  const skill = query.data

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'Assessment':
        return <Brain className="w-4 h-4 text-amber-500" />
      case 'Coding':
      case 'PR':
        return <GitPullRequest className="w-4 h-4 text-emerald-500" />
      case 'Project':
        return <Terminal className="w-4 h-4 text-[#007df0]" />
      case 'Mentor':
        return <MessageSquare className="w-4 h-4 text-purple-500" />
      case 'Architecture':
        return <ShieldCheck className="w-4 h-4 text-cyan-500" />
      default:
        return <FileCheck2 className="w-4 h-4 text-slate-400" />
    }
  }

  return (
    <AnimatePresence>
      {skillId && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50 transition-opacity"
          />

          {/* Slide-over panel */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10 z-50">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-screen max-w-xl bg-white border-l border-slate-200 text-slate-900 shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/80">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-sky-100 text-sky-800 uppercase">
                      {skill?.category}
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-500">Evaluated: {skill?.last_evaluated}</span>
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 tracking-tight">{skill?.name}</h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Current Mastery:{' '}
                    <strong className="text-slate-800 font-bold">{skill?.current_level}</strong> ({skill?.current_score}%) — Target: {skill?.target_level}
                  </p>
                </div>

                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {query.isLoading ? (
                <div className="p-12 text-center text-slate-400 text-xs">
                  <div className="w-6 h-6 border-2 border-[#007df0] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  Loading cryptographic evidence breakdown...
                </div>
              ) : skill ? (
                /* Body (Scrollable) */
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {/* Evidence Triangulation Breakdown */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Triangulated Evidence Weightage
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Assessments</span>
                        <span className="text-lg font-black text-amber-600">{skill.evidence_breakdown?.assessment ?? 0}%</span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Live Coding</span>
                        <span className="text-lg font-black text-emerald-600">{skill.evidence_breakdown?.coding ?? 0}%</span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">ASM Projects</span>
                        <span className="text-lg font-black text-blue-600">{skill.evidence_breakdown?.project ?? 0}%</span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Mentor Review</span>
                        <span className="text-lg font-black text-purple-600">{skill.evidence_breakdown?.mentor ?? 0}%</span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Arch Defense</span>
                        <span className="text-lg font-black text-cyan-600">{skill.evidence_breakdown?.architecture ?? 0}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Verified Evidence Artifacts List */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Verified Artifacts &amp; Submissions ({skill.evidence_items?.length || 0})
                      </h3>
                      <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> All Digitally Verified
                      </span>
                    </div>

                    <div className="space-y-3">
                      {skill.evidence_items?.map((item: SkillEvidenceDetail) => (
                        <div
                          key={item.id}
                          className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-sky-300 transition space-y-2.5"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-start gap-2.5">
                              <div className="p-2 rounded-lg bg-white border border-slate-200 shrink-0 mt-0.5">
                                {getSourceIcon(item.source)}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-bold text-slate-900">{item.title}</span>
                                  <span className="px-1.5 py-0.2 text-[9px] font-bold uppercase rounded bg-slate-200 text-slate-700">
                                    {item.source}
                                  </span>
                                </div>
                                <p className="text-xs text-slate-500 mt-0.5">{item.details}</p>
                              </div>
                            </div>

                            <div className="text-right shrink-0">
                              <div className="text-sm font-black text-emerald-600">{item.score}%</div>
                              <div className="text-[10px] text-slate-400">{item.date}</div>
                            </div>
                          </div>

                          {item.url && (
                            <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-xs">
                              <span className="text-[11px] font-mono text-slate-400 truncate max-w-[320px]">
                                Hash: {item.url}
                              </span>
                              <span className="text-[#007df0] font-bold flex items-center gap-1 hover:underline cursor-pointer">
                                <span>Proof Log</span>
                                <ExternalLink className="w-3 h-3" />
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  )
}
