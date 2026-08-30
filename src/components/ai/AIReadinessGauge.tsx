import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Brain,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight,
  ShieldAlert,
  Info,
  Code2,
  Cpu,
  Network,
  Users,
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { api } from '../../lib/api'
import type { AIReadinessPrediction, RiskIndicator } from '../../types'
import { Card, ProgressBar } from '../ui'

interface AIReadinessGaugeProps {
  associateId?: string
  onOpenCoach?: () => void
}

export function AIReadinessGauge({
  associateId = 'as-ananya',
  onOpenCoach,
}: AIReadinessGaugeProps) {
  const query = useQuery({
    queryKey: ['aiReadinessPrediction', associateId],
    queryFn: () => api.aiPredictions(associateId),
  })

  if (query.isLoading) {
    return (
      <Card className="p-8 text-center text-slate-400">
        <div className="w-8 h-8 border-2 border-[#007df0] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <p className="text-xs">Computing real-time predictive readiness models...</p>
      </Card>
    )
  }

  if (query.isError || !query.data) {
    return null
  }

  const prediction = query.data
  const { readiness_breakdown, score_change_explanation, risk_indicators = [] } = prediction
  const overallScore = readiness_breakdown?.overall ?? 82

  const getPillarIcon = (name: string) => {
    switch (name) {
      case 'Technical':
        return <Code2 className="w-4 h-4 text-[#007df0]" />
      case 'Architecture':
        return <Cpu className="w-4 h-4 text-purple-600" />
      case 'Cloud':
        return <Network className="w-4 h-4 text-sky-600" />
      case 'Production':
        return <Layers className="w-4 h-4 text-amber-600" />
      default:
        return <Users className="w-4 h-4 text-emerald-600" />
    }
  }

  const getRiskLevelBadge = (level: string) => {
    switch (level) {
      case 'CRITICAL':
      case 'HIGH':
        return <span className="px-2 py-0.5 text-[9px] font-bold rounded bg-rose-50 text-rose-700 border border-rose-200">HIGH RISK</span>
      case 'MEDIUM':
        return <span className="px-2 py-0.5 text-[9px] font-bold rounded bg-amber-50 text-amber-700 border border-amber-200">MEDIUM RISK</span>
      default:
        return <span className="px-2 py-0.5 text-[9px] font-bold rounded bg-emerald-50 text-emerald-700 border border-emerald-200">LOW RISK</span>
    }
  }

  const pillarsList = [
    { name: 'Technical Depth', score: readiness_breakdown.technical, details: 'Concurrency, Data Pipelines, REST API architecture' },
    { name: 'Architecture & Design', score: readiness_breakdown.architecture, details: 'Distributed sagas, RFC defense evaluation' },
    { name: 'Cloud & Kubernetes', score: readiness_breakdown.cloud, details: 'Terraform, Docker containerization, Helm' },
    { name: 'Production Readiness', score: readiness_breakdown.production, details: 'SonarQube clean, Mutation testing, Grafana' },
    { name: 'Leadership & Delivery', score: readiness_breakdown.leadership, details: 'PR mentorship, Sprint delivery, Cross-team collaboration' },
  ]

  return (
    <div className="space-y-6">
      {/* Top Banner Card */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          {/* Left: Score Gauge Circle */}
          <div className="flex items-center gap-5">
            <div className="relative flex items-center justify-center w-24 h-24 rounded-2xl bg-sky-50 border border-sky-200 shadow-2xs shrink-0">
              <div className="text-center">
                <span className="text-2xl font-black text-slate-900 leading-none">{overallScore}%</span>
                <span className="block text-[9.5px] uppercase font-bold text-slate-400 mt-1">Readiness</span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-sky-50 text-sky-700 border border-sky-200 uppercase">
                  AI Talent Intelligence
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {readiness_breakdown.trajectory}
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Enterprise Production Readiness</h2>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Predicted Commissioning Date: <span className="text-slate-800 font-bold">{prediction.predicted_commission_date}</span>
                <span className="text-slate-400 font-normal">(Graduation Probability: {Math.round(prediction.graduation_readiness_probability * 100)}%)</span>
              </p>
            </div>
          </div>

          {/* Right: Confidence Metric */}
          <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 self-stretch lg:self-auto justify-between lg:justify-start">
            <div>
              <div className="text-[10.5px] uppercase font-bold text-slate-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Predictive Confidence
              </div>
              <div className="text-2xl font-black text-slate-900 mt-0.5">
                {Math.round((1 - prediction.at_risk_probability) * 100)}%
              </div>
              <div className="text-[10.5px] text-slate-500">Based on 14 live telemetry signals</div>
            </div>
            {onOpenCoach && (
              <button
                onClick={onOpenCoach}
                className="px-4 py-2 text-xs font-bold rounded-lg bg-[#007df0] hover:bg-[#0069cc] text-white transition shadow-xs flex items-center gap-1.5 shrink-0"
              >
                <span>Ask AI Coach</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Explainable AI Score Change Narrative */}
        {score_change_explanation && (
          <div className="mt-5 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-[#007df0] shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <span className="font-bold text-slate-900">Explainable Model Summary: </span>
              {score_change_explanation}
            </div>
          </div>
        )}
      </Card>

      {/* 4 Pillars Breakdown & Active Risk Indicators */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: 5 Pillars */}
        <Card className="lg:col-span-2 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Readiness Breakdown across Core Pillars
            </h3>
            <span className="text-xs text-slate-400 font-medium">Weighted Rubric Score</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {pillarsList.map((pillar) => (
              <div
                key={pillar.name}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-sky-300 transition space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getPillarIcon(pillar.name)}
                    <span className="text-xs font-bold text-slate-800">{pillar.name}</span>
                  </div>
                  <span className="text-sm font-black text-slate-900">{pillar.score}%</span>
                </div>

                <ProgressBar
                  value={pillar.score / 100}
                  color={pillar.score >= 80 ? 'bg-emerald-500' : 'bg-[#007df0]'}
                />

                <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed pt-0.5">
                  {pillar.details}
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* Right 1 Col: Risk Indicators */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Active Risk Signals ({risk_indicators.length})
              </h3>
            </div>
          </div>

          <div className="space-y-3">
            {risk_indicators.map((risk: RiskIndicator, idx: number) => (
              <div
                key={risk.id || idx}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{risk.label}</span>
                  {getRiskLevelBadge(risk.level)}
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">{risk.explanation}</p>
                <div className="p-2 rounded bg-white border border-slate-200 text-[10.5px] text-slate-700">
                  <span className="font-bold text-[#007df0]">Mitigation: </span>
                  {risk.action_suggestion}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
