import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bell,
  Check,
  ExternalLink,
  MessageSquare,
  Mail,
  Zap,
  Sliders,
  X,
  AlertTriangle,
  Award,
  BookOpen,
  Settings,
} from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../lib/api'
import type { NotificationItem } from '../../types'
import { Card } from '../ui'

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false)
  const [showChannelsModal, setShowChannelsModal] = useState(false)
  const [filterTab, setFilterTab] = useState<'ALL' | 'UNREAD' | 'WARNING'>('ALL')
  const queryClient = useQueryClient()

  // Fetch Notifications
  const notifsQuery = useQuery({
    queryKey: ['enterpriseNotifications'],
    queryFn: () => api.notifications(),
  })

  // Mark Read Mutation
  const markReadMutation = useMutation({
    mutationFn: (id: string) => api.markNotificationRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enterpriseNotifications'] })
    },
  })

  const markAllReadMutation = useMutation({
    mutationFn: () => api.markAllNotificationsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enterpriseNotifications'] })
    },
  })

  const notifications: NotificationItem[] = notifsQuery.data || []
  const unreadCount = notifications.filter((n: NotificationItem) => !n.is_read).length

  const filteredNotifs = notifications.filter((n: NotificationItem) => {
    if (filterTab === 'UNREAD') return !n.is_read
    if (filterTab === 'WARNING') return n.urgency === 'WARNING' || n.urgency === 'CRITICAL'
    return true
  })

  const getChannelBadge = (channel: string) => {
    switch (channel) {
      case 'SLACK':
        return (
          <span className="px-1.5 py-0.2 text-[9px] font-bold rounded bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
            <Zap className="w-2.5 h-2.5 text-emerald-600" /> Slack
          </span>
        )
      case 'TEAMS':
        return (
          <span className="px-1.5 py-0.2 text-[9px] font-bold rounded bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1">
            <MessageSquare className="w-2.5 h-2.5 text-indigo-600" /> Teams
          </span>
        )
      default:
        return (
          <span className="px-1.5 py-0.2 text-[9px] font-bold rounded bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1">
            <Mail className="w-2.5 h-2.5 text-slate-500" /> In-App
          </span>
        )
    }
  }

  return (
    <div className="relative">
      {/* Bell Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition"
        title="Enterprise Notification Center"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute 1 top-1.5 right-1.5 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
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
              className="absolute right-0 mt-3 w-96 sm:w-[440px] z-50 rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[580px]"
            >
              {/* Header */}
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-[#007df0]" />
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Notification Center
                  </h3>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.2 text-[9px] font-bold rounded bg-rose-50 text-rose-700 border border-rose-200">
                      {unreadCount} new
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={() => markAllReadMutation.mutate()}
                      className="text-[11px] font-semibold text-[#007df0] hover:underline transition"
                    >
                      Mark all read
                    </button>
                  )}
                  <button
                    onClick={() => setShowChannelsModal(true)}
                    className="p-1 rounded text-slate-400 hover:text-slate-700"
                    title="Channel preferences"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-2 px-4 py-2 border-b border-slate-100 bg-white text-xs">
                <button
                  onClick={() => setFilterTab('ALL')}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                    filterTab === 'ALL' ? 'bg-[#007df0] text-white' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  All ({notifications.length})
                </button>
                <button
                  onClick={() => setFilterTab('UNREAD')}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                    filterTab === 'UNREAD' ? 'bg-[#007df0] text-white' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Unread ({unreadCount})
                </button>
                <button
                  onClick={() => setFilterTab('WARNING')}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                    filterTab === 'WARNING' ? 'bg-[#007df0] text-white' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  SLA / Alerts
                </button>
              </div>

              {/* Notification List */}
              <div className="divide-y divide-slate-100 overflow-y-auto flex-1 p-2 space-y-1 bg-slate-50/50">
                {filteredNotifs.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-400">
                    No notifications in this view.
                  </div>
                ) : (
                  filteredNotifs.map((n: NotificationItem) => (
                    <div
                      key={n.id}
                      className={`p-3 rounded-xl transition flex items-start justify-between gap-3 ${
                        n.is_read ? 'bg-white/60 opacity-80 border border-transparent' : 'bg-white border border-slate-200 shadow-2xs'
                      }`}
                    >
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          {getChannelBadge(n.channel)}
                          <span
                            className={`px-1.5 py-0.2 text-[9px] font-bold rounded ${
                              n.urgency === 'CRITICAL'
                                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                : n.urgency === 'WARNING'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {n.urgency}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">{n.created_at}</span>
                        </div>

                        <h4 className="text-xs font-bold text-slate-900 leading-snug">{n.title}</h4>
                        <p className="text-[11px] text-slate-600 leading-relaxed">{n.message}</p>

                        {n.action_url && (
                          <a
                            href={n.action_url}
                            onClick={() => setIsOpen(false)}
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-[#007df0] hover:underline pt-1"
                          >
                            <span>Open workflow</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>

                      {!n.is_read && (
                        <button
                          onClick={() => markReadMutation.mutate(n.id)}
                          className="p-1 rounded-lg text-slate-400 hover:text-emerald-600 transition shrink-0"
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
              <div className="p-3 border-t border-slate-100 text-center bg-slate-50">
                <span className="text-[10px] text-slate-400 font-medium">
                  ASCEND Enterprise Multi-Channel Dispatch Active (Teams, Slack, Email)
                </span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Channel Preferences Modal */}
      <AnimatePresence>
        {showChannelsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md p-6 rounded-2xl bg-white border border-slate-200 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4 text-[#007df0]" />
                  <h3 className="text-sm font-bold text-slate-900">Notification Channels &amp; Webhooks</h3>
                </div>
                <button onClick={() => setShowChannelsModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-slate-500">
                Configure delivery endpoints for automated SLA escalations, competency gap alerts, and approval requests.
              </p>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-indigo-50 text-indigo-700">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">Microsoft Teams Webhook</div>
                      <div className="text-[10px] text-slate-500">#ascend-approvals-feed</div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Connected
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">Slack Workspace Alert</div>
                      <div className="text-[10px] text-slate-500">#gda-engineering-leads</div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Connected
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-amber-50 text-amber-700">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">Email Digest Schedule</div>
                      <div className="text-[10px] text-slate-500">Real-time for Critical, Daily 09:00 for Digest</div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Active
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setShowChannelsModal(false)}
                  className="w-full py-2.5 rounded-xl bg-[#007df0] hover:bg-[#0069cc] text-white font-bold text-xs transition shadow-xs"
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
