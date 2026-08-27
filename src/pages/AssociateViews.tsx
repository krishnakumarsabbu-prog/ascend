import { useState } from 'react'
import { Card, Button, Badge } from '../components/ui'
import { BookOpen, GitBranch, Sparkles, Network, Coins, GraduationCap, CheckCircle2, ArrowRight, Play, ExternalLink, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'

export function WFAssessmentsPage() {
  const assessments = [
    { code: 'WF-101', name: 'Java 21 & Secure AI Prompting', tier: 'L100', questions: 5, time: '15 mins', status: 'Available', credits: 23 },
    { code: 'WF-102', name: 'Spring Boot 3 & Microservice Patterns', tier: 'L200', questions: 5, time: '20 mins', status: 'Available', credits: 20 },
    { code: 'WF-103', name: 'AWS Lambda, DynamoDB & Serverless', tier: 'L200', questions: 5, time: '20 mins', status: 'Available', credits: 20 },
    { code: 'WF-104', name: 'Distributed Systems & Kafka Eventing', tier: 'L300', questions: 5, time: '25 mins', status: 'Locked (Pre-req WF-102)', credits: 25 },
    { code: 'WF-201', name: 'Secure SDLC, Threat Modeling & OIDC', tier: 'L300', questions: 5, time: '25 mins', status: 'Locked', credits: 25 },
    { code: 'WF-202', name: 'Observability & SRE Incident Command', tier: 'L300', questions: 5, time: '25 mins', status: 'Locked', credits: 25 },
    { code: 'WF-203', name: 'Generative AI & Agentic RAG Architecture', tier: 'L400', questions: 5, time: '30 mins', status: 'Locked', credits: 30 },
  ]

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">WF CURRICULUM</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">WF Course Assessments</h1>
        <p className="mt-1 text-xs text-slate-500">Standardized automated course assessments mapped to the GDA Engineering Excellence framework.</p>
      </div>

      <div className="grid gap-4">
        {assessments.map((a) => (
          <Card key={a.code} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-blue-600">{a.code}</span>
                <Badge className="text-[10px]">{a.tier}</Badge>
                <Badge className="bg-amber-50 text-amber-800 border-amber-200">+{a.credits} Credits</Badge>
              </div>
              <h3 className="mt-1 text-sm font-bold text-slate-900">{a.name}</h3>
              <p className="text-xs text-slate-500">{a.questions} randomized multiple-choice questions · {a.time} duration</p>
            </div>
            <div>
              {a.status === 'Available' ? (
                <Link to="/take-assessment">
                  <Button className="bg-[#1e3a66] hover:bg-[#14294b] text-white text-xs font-bold gap-2">
                    <Play size={13} /> Launch Assessment
                  </Button>
                </Link>
              ) : (
                <Button disabled variant="outline" className="text-xs">
                  {a.status}
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export function ASMForkPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">ENGINEERING WORKSPACE</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">ASM Fork & Environment</h1>
        <p className="mt-1 text-xs text-slate-500">Self-contained production clone repositories, CI/CD pipelines, and cloud sandboxes for Applied Systems Milestones.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <GitBranch size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Active Repository Fork</h3>
              <p className="text-xs text-slate-500">github.enterprise.wellsfargo.com/gda-2025/payments-core-asm104</p>
            </div>
          </div>
          <p className="text-xs text-slate-600">
            Fork created from <code>payments-core:v2.4.1</code> with injected latency faults and simulated bank core microservices.
          </p>
          <div className="rounded border border-slate-200 bg-slate-50 p-3 text-[11px] font-mono text-slate-700">
            git clone git@github.enterprise.wellsfargo.com:gda-2025/payments-core-asm104.git
          </div>
          <Button variant="outline" className="text-xs gap-2">
            <ExternalLink size={13} /> Open in Cloud Codespace
          </Button>
        </Card>

        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Automated Test Harness</h3>
              <p className="text-xs text-slate-500">Chaos simulation & throughput benchmarking</p>
            </div>
          </div>
          <p className="text-xs text-slate-600">
            Your PR will run through 4 test suites: Unit Tests, Resilience Chaos, P99 Latency Verification, and Static Security Scan.
          </p>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-600">Throughput Target:</span>
              <span className="font-bold text-slate-900">5,000 TPS &lt; 15ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Chaos Invariant:</span>
              <span className="font-bold text-slate-900">Zero duplicate ledger entries</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export function AdvancedIntensivesPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">ACCELERATED LEARNING</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">Advanced Intensives</h1>
        <p className="mt-1 text-xs text-slate-500">Deep-dive technical intensives mentored by Principal Architects and Engineering Fellows.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { title: 'Spring AI & Enterprise RAG', lead: 'Dr. Alok Verma', weeks: '3 Weeks', focus: 'Vector DBs, embedding drift, token budget optimization' },
          { title: 'Distributed Consensus & Raft', lead: 'Elena Rostova', weeks: '2 Weeks', focus: 'Split-brain resolution, quorum leasing, distributed locks' },
          { title: 'Zero-Trust Mesh & eBPF', lead: 'Sarah Chen', weeks: '2 Weeks', focus: 'Kernel-level traffic inspection, mTLS wire-speed enforcement' },
        ].map((item) => (
          <Card key={item.title} className="p-5">
            <div className="flex justify-between items-start">
              <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
              <Badge className="bg-purple-50 text-purple-700">{item.weeks}</Badge>
            </div>
            <p className="mt-2 text-xs text-slate-500">Lead: <strong>{item.lead}</strong></p>
            <p className="mt-3 text-xs text-slate-600">{item.focus}</p>
            <Button variant="outline" className="mt-4 w-full text-xs">View Syllabus</Button>
          </Card>
        ))}
      </div>
    </div>
  )
}

export function ArchitectBoardPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">DEFENSE & RATIFICATION</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">Architect Board Defense</h1>
        <p className="mt-1 text-xs text-slate-500">Defend architectural RFCs and production incident runbooks in front of the Distinguished Engineering Panel.</p>
      </div>

      <Card className="p-6">
        <div className="flex flex-col md:flex-row justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">SCHEDULED DEFENSE</span>
            <h3 className="text-base font-bold text-slate-900 mt-0.5">ASM-104 RFC Board Defense</h3>
            <p className="text-xs text-slate-500 mt-1">Topic: <em>Payments Core Architecture & Idempotency RFC</em></p>
          </div>
          <div className="text-right">
            <Badge className="bg-amber-100 text-amber-800">Stream 04/05 Scheduled</Badge>
            <p className="text-xs text-slate-500 mt-1">Panel: Priya Nair, Vikram Desai, Suresh Pillai</p>
          </div>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-3 text-xs">
          <div className="rounded border border-slate-200 p-3 bg-slate-50">
            <span className="font-bold text-slate-700">1. Architectural Clarity</span>
            <p className="text-slate-500 mt-1">RFC document, sequence diagrams, failure domain isolation.</p>
          </div>
          <div className="rounded border border-slate-200 p-3 bg-slate-50">
            <span className="font-bold text-slate-700">2. Trade-Off Analysis</span>
            <p className="text-slate-500 mt-1">Justify database vs cache vs queue design decisions.</p>
          </div>
          <div className="rounded border border-slate-200 p-3 bg-slate-50">
            <span className="font-bold text-slate-700">3. Live Q&amp;A Defense</span>
            <p className="text-slate-500 mt-1">15 min presentation + 20 min panel interrogation.</p>
          </div>
        </div>
      </Card>
    </div>
  )
}

export function CreditLedgerPage() {
  const entries = [
    { date: '2026-04-12', domain: 'D1 Algorithms & Core', instrument: 'WF-101 Java 21 & Secure AI Prompting', level: 'L100', credits: 23, status: 'Audited' },
    { date: '2026-04-28', domain: 'D2 Cloud & Distributed', instrument: 'WF-102 Spring Boot Microservices', level: 'L200', credits: 20, status: 'Audited' },
    { date: '2026-05-15', domain: 'D3 Vendor & Platform', instrument: 'ASM-101 Microservice Migration', level: 'L200', credits: 25, status: 'Audited' },
    { date: '2026-06-02', domain: 'D1 Algorithms & Core', instrument: 'WF-103 AWS Lambda & Serverless', level: 'L200', credits: 20, status: 'Audited' },
  ]

  const totalCredits = entries.reduce((acc, e) => acc + e.credits, 0)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">ENTERPRISE CREDIT LEDGER</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">My Credit Ledger</h1>
          <p className="mt-1 text-xs text-slate-500">Immutable ledger of verified assessment and milestone credits toward GDA Commissioning.</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-right shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">TOTAL BALANCE</p>
          <p className="text-2xl font-black text-slate-900">{totalCredits} <span className="text-xs font-medium text-slate-500">Credits</span></p>
        </div>
      </div>

      <Card className="overflow-hidden border border-slate-200 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-6 py-3.5">DATE</th>
                <th className="px-6 py-3.5">DOMAIN</th>
                <th className="px-6 py-3.5">INSTRUMENT</th>
                <th className="px-6 py-3.5">LEVEL</th>
                <th className="px-6 py-3.5 text-right">CREDITS</th>
                <th className="px-6 py-3.5 text-center">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {entries.map((e, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50">
                  <td className="px-6 py-3.5 font-mono text-slate-500">{e.date}</td>
                  <td className="px-6 py-3.5 font-medium text-slate-800">{e.domain}</td>
                  <td className="px-6 py-3.5 font-bold text-slate-900">{e.instrument}</td>
                  <td className="px-6 py-3.5"><Badge>{e.level}</Badge></td>
                  <td className="px-6 py-3.5 text-right font-black text-blue-600">+{e.credits}</td>
                  <td className="px-6 py-3.5 text-center"><Badge className="bg-emerald-50 text-emerald-700">{e.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

export function ProgramOverviewPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">GDA BLUEPRINT</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">Program Overview</h1>
        <p className="mt-1 text-xs text-slate-500">Graduate Developer Accelerator: 24-Month Roadmap & Gate Architecture.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        {[
          { month: 'Months 1-3', gate: 'Gate 0: Foundation', desc: 'Core Java 21, Spring Boot 3, secure AI prompting baseline and live code exercises.' },
          { month: 'Month 4', gate: 'Gate 1: Specialization Fork', desc: 'Algorithmic assessment + mentor evaluation to ratify DE / SE / CSE / IE pathway.' },
          { month: 'Months 5-18', gate: 'Gate 2: Applied Milestones', desc: '7 Applied Systems Milestones with production codebases and chaos testing.' },
          { month: 'Months 19-24', gate: 'Gate 3: Commissioning', desc: 'Architect Board RFC defense, final Technology Head sign-off, autonomous delivery.' },
        ].map((g) => (
          <Card key={g.month} className="p-5">
            <Badge className="bg-blue-50 text-blue-700">{g.month}</Badge>
            <h3 className="mt-2 text-sm font-bold text-slate-900">{g.gate}</h3>
            <p className="mt-2 text-xs text-slate-600">{g.desc}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}
