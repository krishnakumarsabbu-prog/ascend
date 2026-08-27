import { motion } from 'framer-motion'
import {
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  Sparkles,
  Calendar,
  Layers,
  Cpu,
  Network,
  Cloud,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  Info,
} from 'lucide-react'
import type { AIReadinessPrediction } from '../../types'
import { Link } from 'react-router-dom'

interface AIReadinessGaugeProps {
  prediction: AIReadinessPrediction
  onOpenCoach?: () => void
}

export function AIReadinessGauge({ prediction, onOpenCoach }: AIReadinessGaugeProps) {
  const { readiness_breakdown, risk_indicators, score_change_explanation } = prediction

  const getPillarIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'technical': return <Cpu className="w-4 h-4 text-emerald-400" />
      case 'architecture': return <Network className="w-4 h-4 text-cyan-400" />
      case 'cloud': return <Cloud className="w-4 h-4 text-sky-400" />
      case 'production': return <Layers className="w-4 h-4 text-purple-400" />
      default: return <ShieldCheck className="w-4 h-4 text-amber-400" />
    }
  }

  const getRiskLevelBadge = (level: string) => {
    switch (level.toUpperCase()) {
      case 'CRITICAL':
        return <span className="px-2 py-0.5 text-[10px] font-black rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">CRITICAL RISK</span>
      case 'HIGH':
        return <span className="px-2 py-0.5 text-[10px] font-black rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">HIGH RISK</span>
      case 'MEDIUM':
        return <span className="px-2 py-0.5 text-[10px] font-black rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">MEDIUM RISK</span>
      default:
        return <span className="px-2 py-0.5 text-[10px] font-black rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">LOW RISK</span>
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Main Score Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-950 border border-indigo-500/30 shadow-2xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          {/* Left: Overall Gauge */}
          <div className="flex items-center gap-5">
            <div className="relative flex items-center justify-center">
              <svg className="w-28 h-28 transform -rotate-90">
                <circle
                  cx="56"
                  cy="56"
                  r="46"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-slate-800"
                  fill="transparent"
                />
                <circle
                  cx="56"
                  cy="56"
                  r="46"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeDasharray={289}
                  strokeDashoffset={289 - (289 * readiness_breakdown.overall) / 100}
                  className="text-indigo-500 transition-all duration-1000 ease-out"
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-black text-white">{readiness_breakdown.overall}%</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300">Readiness</span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 text-xs font-black rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase">
                  AI Talent Intelligence
                </span>
                <span className="px-2.5 py-0.5 text-xs font-bold rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {readiness_breakdown.trajectory}
                </span>
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">Enterprise Production Readiness</h2>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Predicted Commissioning Date: <span className="text-slate-200 font-semibold">{prediction.predicted_commission_date}</span>
              </p>
            </div>
          </div>

          {/* Right: Quick Probabilities */}
          <div className="grid grid-cols-2 gap-3 w-full lg:w-auto">
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-center">
              <div className="text-[10px] uppercase font-bold text-slate-400">Graduation Probability</div>
              <div className="text-xl font-black text-emerald-400 mt-0.5">
                {prediction.graduation_readiness_probability}%
              </div>
              <div className="text-[10px] text-slate-500 font-medium">Trajectory: High Confidence</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-center">
              <div className="text-[10px] uppercase font-bold text-slate-400">At-Risk Probability</div>
              <div className="text-xl font-black text-amber-400 mt-0.5">
                {prediction.at_risk_probability}%
              </div>
              <div className="text-[10px] text-slate-500 font-medium">Controlled Risk</div>
            </div>
          </div>
        </div>

        {/* Explainable AI Score Change Banner (Requirement 8) */}
        <div className="mt-6 p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/30 flex items-start gap-3">
          <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-300 shrink-0 mt-0.5">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-indigo-300 flex items-center gap-1">
              <Info className="w-3 h-3" /> Explainable AI Metric Analysis
            </span>
            <p className="text-xs text-slate-200 mt-1 leading-relaxed">
              {score_change_explanation}
            </p>
          </div>
          {onOpenCoach && (
            <button
              onClick={onOpenCoach}
              className="px-3 py-1.5 text-xs font-bold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition shrink-0 flex items-center gap-1 self-center"
            >
              <span>Ask AI Coach</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* 5-Pillar Breakdown Bars (Requirement 7) */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center justify-between">
          <span>5-Pillar Readiness Scorecard</span>
          <span className="text-xs font-normal text-slate-400 lowercase">normalized across rubric telemetry</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            { label: 'Technical', score: readiness_breakdown.technical, icon: 'technical', color: 'bg-emerald-500' },
            { label: 'Architecture', score: readiness_breakdown.architecture, icon: 'architecture', color: 'bg-cyan-500' },
            { label: 'Cloud', score: readiness_breakdown.cloud, icon: 'cloud', color: 'bg-sky-500' },
            { label: 'Production', score: readiness_breakdown.production, icon: 'production', color: 'bg-purple-500' },
            { label: 'Leadership', score: readiness_breakdown.leadership, icon: 'leadership', color: 'bg-amber-500' },
          ].map((pillar) => (
            <div key={pillar.label} className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                  {getPillarIcon(pillar.icon)} {pillar.label}
                </span>
                <span className="font-bold text-white">{pillar.score}%</span>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className={`h-full ${pillar.color} rounded-full transition-all duration-500`} style={{ width: `${pillar.score}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Predictive Risk Indicators (Requirement 8) */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          Predictive Risk Factors & Mitigation Actions ({risk_indicators.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {risk_indicators.map((risk) => (
            <div
              key={risk.id}
              className="p-4 rounded-2xl bg-slate-900 border border-slate-800/90 shadow-lg space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <h4 className="text-xs font-bold text-white">{risk.label}</h4>
                  {getRiskLevelBadge(risk.level)}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{risk.explanation}</p>
                <div className="mt-2 text-[11px] text-slate-400 bg-slate-950/60 p-2 rounded-lg border border-slate-800/60">
                  <span className="font-bold text-slate-300">Root Factor: </span>
                  {risk.primary_factor}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 text-[11px] text-indigo-300 font-medium">
                <span className="font-bold text-indigo-400">Action: </span>
                {risk.action_suggestion}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
