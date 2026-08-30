import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Sparkles,
  Send,
  Bot,
  User,
  ExternalLink,
  ChevronRight,
  Lightbulb,
  CheckCircle2,
  Brain,
  Code2,
  Network,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
} from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../lib/api'
import { AIReadinessGauge } from '../../components/ai/AIReadinessGauge'
import type { AICoachChatMessage } from '../../types'
import { Link } from 'react-router-dom'
import { Card } from '../../components/ui'

interface AICoachPageProps {
  associateId?: string
}

export function AICoachPage({ associateId = 'as-ananya' }: AICoachPageProps) {
  const [inputText, setInputText] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const queryClient = useQueryClient()

  // Queries
  const historyQuery = useQuery({
    queryKey: ['aiCoachHistory', associateId],
    queryFn: () => api.aiCoachHistory(associateId),
  })

  const predictionQuery = useQuery({
    queryKey: ['aiPredictions', associateId],
    queryFn: () => api.aiPredictions(associateId),
  })

  const chatMutation = useMutation({
    mutationFn: (msg: string) => api.aiCoachChat({ associate_id: associateId, message: msg }),
    onSuccess: (newAssistantMsg) => {
      queryClient.setQueryData<AICoachChatMessage[]>(['aiCoachHistory', associateId], (old = []) => [
        ...old,
        newAssistantMsg,
      ])
    },
  })

  const messages = historyQuery.data || []
  const prediction = predictionQuery.data

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, chatMutation.isPending])

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputText
    if (!text.trim() || chatMutation.isPending) return

    const tempUserMsg: AICoachChatMessage = {
      id: `temp-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: 'Just now',
    }
    queryClient.setQueryData<AICoachChatMessage[]>(['aiCoachHistory', associateId], (old = []) => [
      ...old,
      tempUserMsg,
    ])

    setInputText('')
    chatMutation.mutate(text.trim())
  }

  const defaultPrompts = [
    'Why is my readiness score 82%?',
    'What should I learn this week?',
    'Explain my biggest skill gap',
    'Prepare me for my architecture defense',
    'Give me 5 practice problems for my weak areas',
    'How can I improve my Java concurrency score?',
  ]

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 text-xs font-bold rounded-md bg-sky-50 text-sky-700 border border-sky-200 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> ASCEND AI Intelligence
            </span>
            <span className="text-xs text-slate-300">•</span>
            <span className="text-xs text-slate-400">Context-Aware Associate Engineering Coach</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            AI Talent &amp; Architecture Coach
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Your personalized engineering assistant analyzing real-time rubric telemetry, code execution runs, and milestone velocity.
          </p>
        </div>
      </div>

      {/* Embedded Readiness Scorecard */}
      <AIReadinessGauge associateId={associateId} />

      {/* Main Conversational Coach Workspace */}
      <Card className="overflow-hidden flex flex-col h-[640px]">
        {/* Workspace Top Bar */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-[#00ADEF] via-[#0084FF] to-[#6366f1] text-white shadow-sm">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Live Coaching Session</h3>
              <p className="text-[11px] text-slate-500">Active model: ASCEND Deterministic Talent Evaluator v2.4</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-emerald-700">Telemetry Connected</span>
          </div>
        </div>

        {/* Message Feed */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'assistant' && (
                <div className="w-8 h-8 rounded-xl bg-sky-50 border border-sky-200 text-[#007df0] flex items-center justify-center shrink-0 mt-1 shadow-2xs">
                  <Sparkles className="w-4 h-4" />
                </div>
              )}

              <div className={`max-w-[85%] space-y-3 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                <div
                  className={`p-4 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#007df0] text-white rounded-br-none shadow-xs font-medium'
                      : 'bg-slate-50 text-slate-800 border border-slate-200 rounded-bl-none shadow-2xs whitespace-pre-wrap'
                  }`}
                >
                  {msg.text}
                </div>

                {msg.key_takeaways && msg.key_takeaways.length > 0 && (
                  <div className="p-3.5 rounded-xl bg-sky-50/60 border border-sky-200 space-y-1.5">
                    <div className="text-[10.5px] font-bold uppercase tracking-wider text-sky-800 flex items-center gap-1">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-500" /> Key Takeaways
                    </div>
                    {msg.key_takeaways.map((t, idx) => (
                      <div key={idx} className="text-xs text-slate-700 flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{t}</span>
                      </div>
                    ))}
                  </div>
                )}

                {msg.action_links && msg.action_links.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {msg.action_links.map((action, idx) => (
                      <Link
                        key={idx}
                        to={action.url}
                        className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-sky-50 hover:bg-sky-100 text-[#007df0] border border-sky-200 transition flex items-center gap-1.5"
                      >
                        <span>{action.label}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    ))}
                  </div>
                )}

                {msg.suggested_prompts && msg.suggested_prompts.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {msg.suggested_prompts.map((p, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(p)}
                        className="px-3 py-1 text-[11px] font-semibold rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition"
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 mt-1 font-bold text-xs">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {chatMutation.isPending && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-xl bg-sky-50 text-[#007df0] flex items-center justify-center shrink-0 border border-sky-200">
                <Sparkles className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-500 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#007df0] animate-pulse" />
                Synthesizing ASCEND telemetry and rubric models...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts Bar */}
        <div className="p-3 border-t border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 shrink-0">
              Suggested:
            </span>
            {defaultPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleSend(prompt)}
                disabled={chatMutation.isPending}
                className="px-3 py-1 text-xs font-semibold rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shrink-0 transition shadow-2xs"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Message Input Form */}
        <div className="p-4 border-t border-slate-200 bg-white flex items-center gap-3">
          <input
            type="text"
            placeholder="Ask anything (e.g. 'Why is my readiness score 82%?', 'Prepare me for defense')..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
            disabled={chatMutation.isPending}
            className="flex-1 px-4 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#007df0] focus:bg-white"
          />
          <button
            onClick={() => handleSend()}
            disabled={!inputText.trim() || chatMutation.isPending}
            className="px-5 py-2.5 rounded-xl bg-[#007df0] hover:bg-[#0069cc] disabled:opacity-50 text-white font-bold text-xs transition shadow-xs flex items-center gap-2"
          >
            <span>Send</span>
            <Send className="w-4 h-4" />
          </button>
        </div>
      </Card>
    </div>
  )
}
