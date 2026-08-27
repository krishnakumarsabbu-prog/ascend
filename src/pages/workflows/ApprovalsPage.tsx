import { ApprovalsCenter } from '../../components/workflows/ApprovalsCenter'
import type { RoleId } from '../../types'

interface ApprovalsPageProps {
  currentRole?: RoleId | string
  currentUserId?: string
  currentUserName?: string
}

export function ApprovalsPage({
  currentRole = 'SENIOR_LEADER_SPONSOR',
  currentUserId = 'u-sponsor',
  currentUserName = 'Sponsor Executive',
}: ApprovalsPageProps) {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 text-xs font-black rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-wider">
            Governance &amp; SLA Management
          </span>
          <span className="text-xs text-slate-500">•</span>
          <span className="text-xs text-slate-400">Requirements 12 &amp; 14</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Enterprise Approvals &amp; SLA Command Center
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Review, transition, rework, and track SLA escalations across Fast-Track Waivers, Pathway Forks, and Commissioning Sign-offs.
        </p>
      </div>

      <ApprovalsCenter
        currentRole={currentRole}
        currentUserId={currentUserId}
        currentUserName={currentUserName}
      />
    </div>
  )
}
