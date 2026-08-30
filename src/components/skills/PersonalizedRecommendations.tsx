import { motion } from 'framer-motion'
import { Sparkles, ArrowRight, BookOpen, Code2, Network, Clock, CheckCircle2, ChevronRight, Target } from 'lucide-react'
import type { PersonalizedLearningItem } from '../../types'
import { Link } from 'react-router-dom'
import { Card } from '../ui'

interface PersonalizedRecommendationsProps {
  items: PersonalizedLearningItem[]
  onSelectAction?: (item: PersonalizedLearningItem) => void
}

export function PersonalizedRecommendations({ items }: PersonalizedRecommendationsProps) {
  const getActionIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'challenge':
        return <Code2 className="w-4 h-4 text-emerald-600" />
      case 'course':
        return <BookOpen className="w-4 h-4 text-blue-600" />
      case 'architecture practice':
        return <Network className="w-4 h-4 text-cyan-600" />
      default:
        return <Target className="w-4 h-4 text-purple-600" />
    }
  }

  const getActionLink = (item: PersonalizedLearningItem) => {
    if (item.action_url) return item.action_url
    if (item.action_type.toLowerCase() === 'challenge') return '/challenges'
    if (item.action_type.toLowerCase() === 'architecture practice') return '/architect-board'
    return '/curriculum'
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                Personalized Learning Engine
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-sky-50 text-sky-700 border border-sky-200 uppercase">
                  AI Next Best Action
                </span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Dynamically synthesized next actions to optimize your pathway commissioning readiness.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Recommendations Feed */}
      <div className="space-y-3">
        {items.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card className="p-4 hover:border-sky-300 hover:shadow-md transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                {/* Left Details */}
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-sky-50 text-[#007df0] font-black text-xs shrink-0 border border-sky-200">
                    #{item.rank}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1">
                        {getActionIcon(item.action_type)}
                        {item.action_type}
                      </span>
                      <span className="text-[10.5px] font-bold text-[#007df0]">{item.category}</span>
                      <span className="text-[10px] text-slate-300">•</span>
                      <span className="text-[10.5px] font-medium text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" /> ~{item.estimated_hours} hrs
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#007df0] transition">
                      {item.title}
                    </h3>

                    {/* Explicit Reason */}
                    <div className="mt-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed">
                      <span className="font-bold text-amber-700">Reason: </span>
                      {item.reason}
                    </div>
                  </div>
                </div>

                {/* Right CTA */}
                <div className="self-end sm:self-center shrink-0">
                  <Link
                    to={getActionLink(item)}
                    className="px-4 py-2 text-xs font-bold rounded-lg bg-[#007df0] hover:bg-[#0069cc] text-white transition shadow-xs flex items-center gap-1.5"
                  >
                    <span>Start Action</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
