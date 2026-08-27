import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileText,
  Download,
  Calendar,
  Clock,
  Send,
  Mail,
  CheckCircle2,
  Sparkles,
  Layers,
  FileSpreadsheet,
  Presentation,
  Check,
} from 'lucide-react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { api } from '../../lib/api'
import type { ScheduledReport, GenerateReportRequest } from '../../types'

export function EnterpriseReportingPage() {
  const [selectedReportType, setSelectedReportType] = useState<string>('EXECUTIVE_BRIEF')
  const [selectedFormat, setSelectedFormat] = useState<'PDF' | 'EXCEL' | 'PPTX'>('PDF')
  const [generatedResult, setGeneratedResult] = useState<any>(null)

  // Fetch Scheduled Reports
  const reportsQuery = useQuery({
    queryKey: ['scheduledReports'],
    queryFn: () => api.scheduledReports(),
  })

  const reports = reportsQuery.data || []

  // Generate Report Mutation
  const generateMutation = useMutation({
    mutationFn: (req: GenerateReportRequest) => api.generateReport(req),
    onSuccess: (res) => {
      setGeneratedResult(res)
    },
  })

  const handleInstantGenerate = () => {
    generateMutation.mutate({
      report_type: selectedReportType,
      format: selectedFormat,
      time_range_days: 30,
    })
  }

  const getFormatIcon = (fmt: string) => {
    switch (fmt) {
      case 'EXCEL':
        return <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
      case 'PPTX':
        return <Presentation className="w-4 h-4 text-amber-600" />
      default:
        return <FileText className="w-4 h-4 text-rose-600" />
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 text-xs font-black rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" /> Enterprise Reporting
            </span>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs text-slate-400">Requirement 26 (Scheduled Reports &amp; Multi-Format Export)</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Scheduled Reports &amp; Export Center
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Generate on-demand executive briefings, cohort progress packages, and configure automated multi-channel report dispatch.
          </p>
        </div>
      </div>

      {/* Main Grid: Left Instant Generator + Right Scheduled Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: 1-Click Instant Report Generator */}
        <div className="space-y-4">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xl space-y-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Instant Report Generator
            </h3>

            {/* Report Type Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Select Report Package:</label>
              <select
                value={selectedReportType}
                onChange={(e) => setSelectedReportType(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 font-semibold text-slate-800"
              >
                <option value="EXECUTIVE_BRIEF">Executive Sponsor Brief</option>
                <option value="COHORT_PROGRESS">Cohort Progress &amp; Throughput Report</option>
                <option value="SKILL_GAP">Skill Gap &amp; Competency Matrix</option>
                <option value="INTEGRITY_SUMMARY">Assessment Integrity &amp; Proctoring Audit</option>
                <option value="COMMISSIONING_PACKAGE">Production Commissioning Readiness Package</option>
              </select>
            </div>

            {/* Export Format Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Export Format:</label>
              <div className="grid grid-cols-3 gap-2 text-xs font-bold">
                {[
                  { key: 'PDF', label: 'PDF Report' },
                  { key: 'EXCEL', label: 'Excel / CSV' },
                  { key: 'PPTX', label: 'PowerPoint' },
                ].map((fmt) => (
                  <button
                    key={fmt.key}
                    onClick={() => setSelectedFormat(fmt.key as any)}
                    className={`p-2.5 rounded-xl border transition text-center ${
                      selectedFormat === fmt.key
                        ? 'bg-indigo-50 border-indigo-400 text-indigo-700 font-black'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    {fmt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handleInstantGenerate}
                disabled={generateMutation.isPending}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>{generateMutation.isPending ? 'Generating Report...' : 'Generate & Export Package'}</span>
              </button>
            </div>

            {/* Generated Report Result Card */}
            {generatedResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs space-y-2"
              >
                <div className="font-bold flex items-center gap-1.5 text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Report Generated Ready!
                </div>
                <p className="text-[11px] text-slate-700">{generatedResult.executive_summary}</p>
                <div className="pt-1 flex items-center justify-between text-[10px] font-mono text-emerald-700">
                  <span>Format: {generatedResult.format}</span>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      alert(`Downloading ${generatedResult.report_type}.${generatedResult.format.toLowerCase()}`)
                    }}
                    className="font-bold underline text-indigo-700"
                  >
                    Download File
                  </a>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Right 2 Cols: Scheduled Reports Table (Requirement 26) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Active Automated Scheduled Reports ({reports.length})
              </h3>
            </div>

            <div className="space-y-3">
              {reports.map((rep) => (
                <div
                  key={rep.id}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {getFormatIcon(rep.format)}
                      <h4 className="text-xs font-bold text-slate-900">{rep.title}</h4>
                    </div>
                    <span className="px-2.5 py-0.5 text-[10px] font-bold rounded bg-indigo-100 text-indigo-800 uppercase">
                      {rep.frequency}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-200 gap-2">
                    <div className="flex items-center gap-3">
                      <span>Recipients: <strong className="text-slate-700">{rep.recipients.join(', ')}</strong></span>
                    </div>
                    <div className="flex items-center gap-3 font-mono text-[10px]">
                      <span>Last Sent: {rep.last_sent}</span>
                      <span>Next Run: <strong className="text-indigo-600">{rep.next_run}</strong></span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
