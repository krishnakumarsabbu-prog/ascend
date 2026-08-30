import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import { api } from '../lib/api'
import { Badge, Button, Card, Skeleton } from '../components/ui'
import { LayoutDashboard, Cpu, GitBranch, ShieldCheck, Sparkles } from 'lucide-react'
import { AIExecutiveIntelligence } from '../components/ai/AIExecutiveIntelligence'

export function TechHeadPortal() {
  const [params, setParams] = useSearchParams()
  const view = params.get('view') || 'readiness'
  const setView = (next: string) => setParams(next === 'readiness' ? {} : { view: next })

  const heatmapQuery = useQuery({
    queryKey: ['techhead-readiness'],
    queryFn: api.techHeadReadiness,
  })

  const rows = heatmapQuery.data || [
    { id: 'th-ananya', associate: 'Ananya Rao', track: 'GDA Cohort 2025 · Target: Payments Engineering', d2_level: 'L300', d2_status: 'green' as const, d3_level: 'L100', d3_status: 'red' as const },
    { id: 'th-rohan', associate: 'Rohan Mehta', track: 'GDA Cohort 2025 · Target: Core Banking Platform Engineering', d2_level: 'L100', d2_status: 'red' as const, d3_level: 'L100', d3_status: 'red' as const },
    { id: 'th-fatima', associate: 'Fatima Sheikh', track: 'GDA Cohort 2025 · Target: AI / Bedrock Enablement', d2_level: 'L0', d2_status: 'red' as const, d3_level: 'L0', d3_status: 'red' as const },
    { id: 'th-karthik', associate: 'Karthik Iyer', track: 'GDA Cohort 2025 · Target: Cloud & Site Reliability Engineering', d2_level: 'L400', d2_status: 'green' as const, d3_level: 'L400', d3_status: 'green' as const },
  ]

  const tabs = [
    { id: 'readiness', label: 'Cloud & Platform Readiness', icon: LayoutDashboard },
    { id: 'ai-intel', label: 'AI Technology Intel', icon: Sparkles },
    { id: 'stack', label: 'Stack Coverage', icon: Cpu },
    { id: 'pipeline', label: 'ASM Pipeline', icon: GitBranch },
    { id: 'signoff', label: 'Commissioning Sign-off', icon: ShieldCheck },
  ]

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">TECHNOLOGY HEAD</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 md:text-3xl">
          {view === 'readiness' && 'Cloud & Platform Readiness Heatmap'}
          {view === 'ai-intel' && 'AI Technology Capability Intelligence'}
          {view === 'stack' && 'Enterprise Stack Matrix'}
          {view === 'pipeline' && 'ASM Pipeline Health'}
          {view === 'signoff' && 'Commissioning Sign-off'}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {view === 'readiness' && "D2 (Cloud & Distributed Systems) and D3 (Vendor & Platform Stack) levels across all associates — the Technology Head's cross-cutting view."}
          {view === 'ai-intel' && 'AI-synthesized technology capability insights, cohort bottleneck forecasts, and skill readiness metrics.'}
          {view === 'stack' && 'Technology platform skills verification and enterprise runtime competence.'}
          {view === 'pipeline' && 'Real-time delivery progress of production-grade milestones across engineering teams.'}
          {view === 'signoff' && 'Final technology gate authorization before autonomous production deployment.'}
        </p>
      </div>

      <div className="flex flex-wrap gap-1 border-b border-slate-200 pb-px">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setView(tab.id)}
            className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-bold transition-all ${
              view === tab.id
                ? 'border-[#007df0] text-[#007df0]'
                : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-800'
            }`}
          >
            <tab.icon size={14} className={view === tab.id ? 'text-[#007df0]' : 'text-slate-400'} />
            {tab.label}
          </button>
        ))}
      </div>

      {view === 'readiness' && (
        <Card className="overflow-hidden border border-slate-200/90 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50/80 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">
                <tr>
                  <th className="px-6 py-4">ASSOCIATE</th>
                  <th className="px-6 py-4">TRACK</th>
                  <th className="px-6 py-4 text-center">D2 CLOUD & DISTRIBUTED SYSTEMS</th>
                  <th className="px-6 py-4 text-center">D3 VENDOR & PLATFORM STACK</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {heatmapQuery.isLoading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <tr key={i}>
                      <td className="px-6 py-4"><Skeleton className="h-4 w-28" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-4 w-48" /></td>
                      <td className="px-6 py-4 text-center"><Skeleton className="mx-auto h-6 w-14" /></td>
                      <td className="px-6 py-4 text-center"><Skeleton className="mx-auto h-6 w-14" /></td>
                    </tr>
                  ))
                ) : (
                  rows.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-900">{row.associate}</td>
                      <td className="px-6 py-4 text-slate-600">{row.track}</td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-block min-w-[54px] rounded px-2.5 py-1 text-xs font-bold ${
                            row.d2_status === 'green'
                              ? 'bg-emerald-100/80 text-emerald-800 border border-emerald-300/60'
                              : 'bg-rose-100/80 text-rose-800 border border-rose-300/60'
                          }`}
                        >
                          {row.d2_level}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-block min-w-[54px] rounded px-2.5 py-1 text-xs font-bold ${
                            row.d3_status === 'green'
                              ? 'bg-emerald-100/80 text-emerald-800 border border-emerald-300/60'
                              : 'bg-rose-100/80 text-rose-800 border border-rose-300/60'
                          }`}
                        >
                          {row.d3_level}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* View: AI Technology Intelligence */}
      {view === 'ai-intel' && (
        <AIExecutiveIntelligence role="TECHNOLOGY_HEAD" />
      )}

      {view === 'stack' && (
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { stack: 'Java 21 & Spring Boot 3', tier: 'L300 Core Standard', associates: 4, health: 'Verified' },
            { stack: 'AWS & Kubernetes Platform', tier: 'L300 Cloud Baseline', associates: 3, health: 'Verified' },
            { stack: 'Distributed Transactions & Kafka', tier: 'L400 Advanced', associates: 2, health: 'On Track' },
            { stack: 'Spring AI & Enterprise RAG', tier: 'L300 Emerging', associates: 2, health: 'In Progress' },
            { stack: 'Chaos Mesh & Resilience', tier: 'L400 Advanced', associates: 2, health: 'Active' },
            { stack: 'Postgres & Query Optimization', tier: 'L300 Core', associates: 4, health: 'Verified' },
          ].map((item) => (
            <Card key={item.stack} className="p-5">
              <div className="flex items-start justify-between">
                <h3 className="text-sm font-bold text-slate-900">{item.stack}</h3>
                <Badge className="bg-blue-50 text-blue-700">{item.health}</Badge>
              </div>
              <p className="mt-2 text-xs font-semibold text-slate-500">{item.tier}</p>
              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-600">
                <span>Active Associates</span>
                <span className="font-bold text-slate-900">{item.associates}</span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {view === 'pipeline' && (
        <Card className="p-6">
          <h3 className="text-sm font-bold text-slate-900 mb-4">Milestone Progression Across Engineering Pods</h3>
          <div className="space-y-4">
            {[
              { team: 'Payments Engineering', lead: 'Priya Nair', active: 'ASM-104 Defense (Ananya Rao)', progress: 75 },
              { team: 'Core Banking Platform', lead: 'Vikram Desai', active: 'ASM-102 Database Duel (Rohan Mehta)', progress: 50 },
              { team: 'Cloud & Site Reliability', lead: 'Karthik Iyer', active: 'ASM-202 Chaos Simulation (Karthik Iyer)', progress: 90 },
              { team: 'AI / Bedrock Enablement', lead: 'Priya Nair', active: 'Month 4 Gate 1 Fork (Fatima Sheikh)', progress: 40 },
            ].map((pod) => (
              <div key={pod.team} className="rounded-lg border border-slate-200 p-4">
                <div className="flex justify-between text-xs mb-2">
                  <div>
                    <span className="font-bold text-slate-900">{pod.team}</span>
                    <span className="ml-2 text-slate-400">· {pod.lead}</span>
                  </div>
                  <span className="font-bold text-blue-600">{pod.progress}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: `${pod.progress}%` }} />
                </div>
                <p className="mt-2 text-[11px] text-slate-500">Current Milestone: <strong className="text-slate-700">{pod.active}</strong></p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {view === 'signoff' && (
        <Card className="p-6">
          <h3 className="text-sm font-bold text-slate-900 mb-2">Commissioning Sign-off Queue</h3>
          <p className="text-xs text-slate-500 mb-6">Final executive technology sign-off before associate transitions to standalone engineering accountability.</p>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50/50 p-4">
              <div>
                <p className="text-xs font-bold text-slate-900">Karthik Iyer — Cloud & Site Reliability Engineering</p>
                <p className="text-[11px] text-slate-500">Cleared all 7 ASM Milestones · D2 L400 · D3 L400</p>
              </div>
              <Badge className="bg-emerald-100 text-emerald-800 border border-emerald-300">Commission Signed Off</Badge>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4">
              <div>
                <p className="text-xs font-bold text-slate-900">Ananya Rao — Payments Engineering</p>
                <p className="text-[11px] text-slate-500">Target Month 24 · D2 L300 · D3 L100 · Scheduled for Capstone</p>
              </div>
              <Button variant="outline" className="text-xs">Review Readiness Dossier</Button>
            </div>
          </div>
        </Card>
      )}

      <div className="pt-6 text-[11px] text-slate-400 space-y-1">
        <p><strong>Program Deployment.</strong> Targeted for launch with the incoming global technology campus intake.</p>
        <p>Contact: Engineering Excellence Committee · technology.accelerator@wellsfargo.com</p>
        <p>ASCEND Mockup UI — data illustrative, sourced from the Graduate Developer Accelerator executive board proposal and the Advanced Systems Engineering / Agentic AI course outlines. Wire to LMS / Prometric / HRIS for production use.</p>
      </div>
    </div>
  )
}
