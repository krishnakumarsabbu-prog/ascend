import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  ExternalLink,
  Check,
  Filter,
  MessageSquare,
  Settings,
  Mail,
  Zap,
  X,
} from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../lib/api'
import type { NotificationItem } from '../../types'

export function NotificationCenter() {
  const queryClient = useQueryClient()
  const [isOpen, setIsOpen] = useState(false)
  const [filterTab, setFilterTab] = useState<'ALL' | 'UNREAD' | 'WARNING'>('ALL')
  const [showChannelsModal, setShowChannelsModal] = useState(false)

  // Fetch notifications
  const notifsQuery = useQuery({
    queryKey: ['notifications'],
    queryFn: () => api.notifications(),
  })

  const notifications = notifsQuery.data || []
  const unreadCount = notifications.filter((n) => !n.is_read).length

  // Mark single as read mutation
  const markReadMutation = useMutation({
    mutationFn: (id: string) => api.markNotificationRead(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  })

  // Mark all as read mutation
  const markAllReadMutation = useMutation({
    mutationFn: () => api.markAllNotificationsRead(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  })

  const filteredNotifs = notifications.filter((n) => {
    if (filterTab === 'UNREAD') return !n.is_read
    if (filterTab === 'WARNING') return n.urgency === 'WARNING' || n.urgency === 'CRITICAL'
    return true
  })

  const getChannelBadge = (channel: string) => {
    switch (channel.toUpperCase()) {
      case 'TEAMS':
        return <span className="px-1.5 py-0.2 text-[9px] font-bold rounded bg-indigo-500/20 text-indigo-300">Teams</span>
      case 'SLACK':
        return <span className="px-1.5 py-0.2 text-[9px] font-bold rounded bg-emerald-500/20 text-emerald-300">Slack</span>
      case 'EMAIL':
        return <span className="px-1.5 py-0.2 text-[9px] font-bold rounded bg-amber-500/20 text-amber-300">Email</span>
      default:
        return <span className="px-1.5 py-0.2 text-[9px] font-bold rounded bg-blue-500/20 text-blue-300">In-App</span>
    }
  }

  return (
    <div className="relative">
      {/* Bell Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition"
        title="Enterprise Notification Center"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 px-1.5 py-0.2 text-[9px] font-black rounded-full bg-rose-500 text-white animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Flyout Notification Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-3 w-96 sm:w-[440px] z-50 rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[580px]"
            >
              {/* Header */}
              <div className="p-4 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/60">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-indigo-400" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    Notification Center
                  </h3>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.2 text-[9px] font-black rounded bg-rose-500/20 text-rose-300">
                      {unreadCount} new
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={() => markAllReadMutation.mutate()}
                      className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 transition"
                    >
                      Mark all read
                    </button>
                  )}
                  <button
                    onClick={() => setShowChannelsModal(true)}
                    className="p-1 rounded text-slate-400 hover:text-white"
                    title="Channel preferences"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-2 px-4 py-2 border-b border-slate-800/60 bg-slate-950 text-xs">
                <button
                  onClick={() => setFilterTab('ALL')}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                    filterTab === 'ALL' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  All ({notifications.length})
                </button>
                <button
                  onClick={() => setFilterTab('UNREAD')}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                    filterTab === 'UNREAD' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Unread ({unreadCount})
                </button>
                <button
                  onClick={() => setFilterTab('WARNING')}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                    filterTab === 'WARNING' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  SLA / Alerts
                </button>
              </div>

              {/* Notification List */}
              <div className="divide-y divide-slate-900 overflow-y-auto flex-1 p-2 space-y-1">
                {filteredNotifs.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-500">
                    No notifications in this view.
                  </div>
                ) : (
                  filteredNotifs.map((n) => (
                    <div
                      key={n.id}
                      className={`p-3 rounded-xl transition flex items-start justify-between gap-3 ${
                        n.is_read ? 'bg-slate-950/40 opacity-75' : 'bg-slate-900/80 border border-slate-800/80'
                      }`}
                    >
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          {getChannelBadge(n.channel)}
                          <span
                            className={`px-1.5 py-0.2 text-[9px] font-black rounded ${
                              n.urgency === 'CRITICAL'
                                ? 'bg-rose-500/20 text-rose-300'
                                : n.urgency === 'WARNING'
                                ? 'bg-amber-500/20 text-amber-300'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {n.urgency}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">{n.created_at}</span>
                        </div>

                        <h4 className="text-xs font-bold text-white leading-snug">{n.title}</h4>
                        <p className="text-[11px] text-slate-300 leading-relaxed">{n.message}</p>

                        {n.action_url && (
                          <a
                            href={n.action_url}
                            onClick={() => setIsOpen(false)}
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-400 hover:text-indigo-300 pt-1"
                          >
                            <span>Open workflow</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>

                      {!n.is_read && (
                        <button
                          onClick={() => markReadMutation.mutate(n.id)}
                          className="p-1 rounded-lg text-slate-400 hover:text-emerald-400 transition shrink-0"
                          title="Mark as read"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="p-3 border-t border-slate-800/80 text-center bg-slate-950">
                <span className="text-[10px] text-slate-500">
                  ASCEND Enterprise Multi-Channel Dispatch Active (Teams, Slack, Email)
                </span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Channel Preferences Modal (Requirement 15) */}
      <AnimatePresence>
        {showChannelsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4 text-indigo-400" />
                  <h3 className="text-sm font-bold text-white">Notification Channels &amp; Webhooks</h3>
                </div>
                <button onClick={() => setShowChannelsModal(false)} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-slate-400">
                Configure delivery endpoints for automated SLA escalations, competency gap alerts, and approval requests.
              </p>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">Microsoft Teams Webhook</div>
                      <div className="text-[10px] text-slate-500">#ascend-approvals-feed</div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-500/20 text-emerald-300">
                    Connected
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">Slack Workspace Alert</div>
                      <div className="text-[10px] text-slate-500">#gda-engineering-leads</div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-500/20 text-emerald-300">
                    Connected
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">Email Digest Schedule</div>
                      <div className="text-[10px] text-slate-500">Real-time for Critical, Daily 09:00 for Digest</div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-500/20 text-emerald-300">
                    Active
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setShowChannelsModal(false)}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition"
                >
                  Save Notification Routing
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
