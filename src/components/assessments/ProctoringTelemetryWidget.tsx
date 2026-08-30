import { ShieldAlert, ShieldCheck, Eye, Copy, Zap, AlertTriangle } from 'lucide-react'
import type { ProctoringTelemetry } from '../../types'
import { Card } from '../ui'

interface ProctoringTelemetryWidgetProps {
  telemetry?: ProctoringTelemetry | null
  activeTabSwitches?: number
  activeCopyPastes?: number
}

export function ProctoringTelemetryWidget({
  telemetry,
  activeTabSwitches = 0,
  activeCopyPastes = 0,
}: ProctoringTelemetryWidgetProps) {
  const score = telemetry ? telemetry.integrity_score : Math.max(40, 100 - activeTabSwitches * 10 - activeCopyPastes * 15)
  const tabCount = telemetry ? telemetry.tab_switch_count : activeTabSwitches
  const copyCount = telemetry ? telemetry.copy_paste_count : activeCopyPastes
  const isHealthy = score >= 85

  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
        <div className="flex items-center gap-2">
          {isHealthy ? (
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          ) : (
            <ShieldAlert className="w-4 h-4 text-amber-600 animate-bounce" />
          )}
          <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Assessment Integrity Monitor
          </span>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-xs">
          <span className="text-slate-400">Score:</span>
          <span
            className={`font-black ${
              score >= 90 ? 'text-emerald-600' : score >= 75 ? 'text-amber-600' : 'text-rose-600'
            }`}
          >
            {score}/100
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
          <div className="text-slate-500 font-semibold flex items-center justify-center gap-1">
            <Eye className="w-3 h-3 text-[#007df0]" /> Focus Loss
          </div>
          <div className={`font-bold mt-0.5 text-xs ${tabCount > 0 ? 'text-amber-600' : 'text-slate-800'}`}>
            {tabCount} event(s)
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
          <div className="text-slate-500 font-semibold flex items-center justify-center gap-1">
            <Copy className="w-3 h-3 text-[#007df0]" /> Clipboard
          </div>
          <div className={`font-bold mt-0.5 text-xs ${copyCount > 0 ? 'text-rose-600' : 'text-slate-800'}`}>
            {copyCount} paste(s)
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
          <div className="text-slate-500 font-semibold flex items-center justify-center gap-1">
            <Zap className="w-3 h-3 text-[#007df0]" /> Keystroke
          </div>
          <div className="font-bold mt-0.5 text-xs text-slate-800">
            {telemetry?.keystroke_typing_wpm ?? 58.0} WPM
          </div>
        </div>
      </div>

      {telemetry?.violations && telemetry.violations.length > 0 && (
        <div className="space-y-1.5 pt-1">
          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
            Violation Log ({telemetry.violations.length})
          </span>
          <div className="max-h-24 overflow-y-auto space-y-1">
            {telemetry.violations.map((v) => (
              <div
                key={v.id}
                className="p-1.5 rounded bg-slate-50 border border-slate-200 text-[10px] flex items-center justify-between text-slate-700"
              >
                <span className="truncate max-w-[200px]">{v.description}</span>
                <span className="text-[9px] font-bold text-amber-600">{v.severity}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  )
}
