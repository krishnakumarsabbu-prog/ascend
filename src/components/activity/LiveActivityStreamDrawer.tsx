import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Activity,
  Users,
  Radio,
  X,
  Sparkles,
  Award,
  BriefcaseBusiness,
  Terminal,
  Brain,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { api } from '../../lib/api'
import type { ActivityStreamEvent, PresenceSession } from '../../types'

interface DrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function LiveActivityStreamDrawer({ isOpen, onClose }: DrawerProps) {
  const [activeTab, setActiveTab] = useState<'STREAM' | 'PRESENCE'>('STREAM')

  const streamQuery = useQuery({
    queryKey: ['activityStream'],
    queryFn: () => api.activityStream(30),
    refetchInterval: 15_000,
    enabled: isOpen,
  })

  const presenceQuery = useQuery({
    queryKey: ['activityPresence'],
    queryFn: () => api.activityPresence(),
    refetchInterval: 15_000,
    enabled: isOpen,
  })

  const stream = streamQuery.data || []
  const presence = presenceQuery.data || []

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'CREDENTIAL_ISSUED':
        return <Award className="w-4 h-4 text-purple-400" />
      case 'GIG_APPLIED':
        return <BriefcaseBusiness className="w-4 h-4 text-emerald-400" />
      case 'DEFENSE_RATIFIED':
        return <ShieldCheck className="w-4 h-4 text-indigo-400" />
      case 'ASSESSMENT_SUBMITTED':
        return <Brain className="w-4 h-4 text-blue-400" />
      default:
        return <Terminal className="w-4 h-4 text-amber-400" />
    }
  }

  const getPresenceBadge = (status: string) => {
    switch (status) {
      case 'IN_ASSESSMENT':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40'
      case 'IN_DEFENSE_PANEL':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40'
      default:
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
          />

          {/* Slide-over Panel */}
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-screen max-w-md bg-slate-900 border-l border-slate-800 text-white shadow-2xl flex flex-col"
            >
              {/* Drawer Header */}
              <div className="p-5 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                    <Activity className="w-4 h-4" />
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-white">Live Activity &amp; Presence</h3>
                    <p className="text-[10px] text-slate-400 font-mono">Real-time enterprise telemetry feed</p>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Tabs Switcher */}
              <div className="p-3 border-b border-slate-800 grid grid-cols-2 gap-2 text-xs font-bold">
                <button
                  onClick={() => setActiveTab('STREAM')}
                  className={`py-2 rounded-xl flex items-center justify-center gap-1.5 transition ${
                    activeTab === 'STREAM'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>Activity Stream ({stream.length})</span>
                </button>
                <button
                  onClick={() => setActiveTab('PRESENCE')}
                  className={`py-2 rounded-xl flex items-center justify-center gap-1.5 transition ${
                    activeTab === 'PRESENCE'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <Radio className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Active Now ({presence.length})</span>
                </button>
              </div>

              {/* Drawer Body Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {activeTab === 'STREAM' && (
                  <div className="space-y-3">
                    {stream.map((evt) => (
                      <div
                        key={evt.id}
                        className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-lg bg-slate-800">
                              {getEventIcon(evt.event_type)}
                            </div>
                            <span className="font-bold text-white">{evt.actor_name}</span>
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono">{evt.timestamp}</span>
                        </div>

                        <p className="text-[11px] text-slate-300 leading-relaxed">{evt.description}</p>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'PRESENCE' && (
                  <div className="space-y-3">
                    {presence.map((sess) => (
                      <div
                        key={sess.user_id}
                        className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="font-bold text-white">{sess.user_name}</span>
                          </div>
                          <span className={`px-2 py-0.5 text-[9px] font-bold rounded border ${getPresenceBadge(sess.status)}`}>
                            {sess.status.replace('_', ' ')}
                          </span>
                        </div>

                        <div className="text-[11px] text-slate-300 font-medium">{sess.current_activity}</div>
                        <div className="text-[10px] text-slate-500 font-mono flex items-center justify-between pt-1 border-t border-slate-800/60">
                          <span>{sess.active_device}</span>
                          <span>{sess.last_ping}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  )
}
