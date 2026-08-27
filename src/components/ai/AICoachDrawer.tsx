import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles,
  Send,
  X,
  Bot,
  User,
  ExternalLink,
  ChevronRight,
  Lightbulb,
  CheckCircle2,
  Brain,
  Code2,
  Network,
  RotateCcw,
} from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../lib/api'
import type { AICoachChatMessage } from '../../types'
import { Link } from 'react-router-dom'

interface AICoachDrawerProps {
  associateId?: string
  isOpen: boolean
  onClose: () => void
}

export function AICoachDrawer({ associateId = 'as-ananya', isOpen, onClose }: AICoachDrawerProps) {
  const [inputText, setInputText] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const queryClient = useQueryClient()

  // Fetch chat history
  const historyQuery = useQuery({
    queryKey: ['aiCoachHistory', associateId],
    queryFn: () => api.aiCoachHistory(associateId),
    enabled: isOpen,
  })

  // Send message mutation
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

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, chatMutation.isPending])

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputText
    if (!text.trim() || chatMutation.isPending) return

    // Optimistically append user message
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
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 transition-opacity"
          />

          {/* Slide-over panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="fixed inset-y-0 right-0 w-full max-w-2xl bg-slate-900 border-l border-slate-800 shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-5 border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-white tracking-tight">ASCEND AI Associate Coach</h2>
                    <span className="px-2 py-0.5 text-[10px] font-black rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      TELEMETRY ACTIVE
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Real-time guidance synthesized from your assessments, challenges, and PRs.
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Messages Feed */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'assistant' && (
                    <div className="w-7 h-7 rounded-lg bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shrink-0 mt-1">
                      <Sparkles className="w-4 h-4" />
                    </div>
                  )}

                  <div className={`max-w-[88%] space-y-3 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                    {/* Message Bubble */}
                    <div
                      className={`p-4 rounded-2xl text-xs leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-indigo-600 text-white rounded-br-none shadow-md shadow-indigo-600/20 font-medium'
                          : 'bg-slate-950/80 text-slate-200 border border-slate-800/90 rounded-bl-none shadow-lg whitespace-pre-wrap'
                      }`}
                    >
                      {msg.text}
                    </div>

                    {/* Assistant Key Takeaways */}
                    {msg.key_takeaways && msg.key_takeaways.length > 0 && (
                      <div className="p-3 rounded-xl bg-slate-950/40 border border-indigo-500/20 space-y-1.5">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1">
                          <Lightbulb className="w-3.5 h-3.5" /> Key Takeaways
                        </div>
                        {msg.key_takeaways.map((t, idx) => (
                          <div key={idx} className="text-[11px] text-slate-300 flex items-start gap-1.5">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{t}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Action Links */}
                    {msg.action_links && msg.action_links.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {msg.action_links.map((action, idx) => (
                          <Link
                            key={idx}
                            to={action.url}
                            onClick={onClose}
                            className="px-3 py-1.5 text-[11px] font-bold rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 transition flex items-center gap-1"
                          >
                            <span>{action.label}</span>
                            <ChevronRight className="w-3 h-3" />
                          </Link>
                        ))}
                      </div>
                    )}

                    {/* Context Suggested Prompts */}
                    {msg.suggested_prompts && msg.suggested_prompts.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {msg.suggested_prompts.map((p, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSend(p)}
                            className="px-2.5 py-1 text-[10px] font-semibold rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition hover:border-slate-600"
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {msg.sender === 'user' && (
                    <div className="w-7 h-7 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center shrink-0 mt-1">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}

              {chatMutation.isPending && (
                <div className="flex gap-3 justify-start">
                  <div className="w-7 h-7 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4 animate-spin" />
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                    Synthesizing ASCEND telemetry and rubric models...
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompt Chips */}
            <div className="p-3 border-t border-slate-800/80 bg-slate-950/40">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                <span className="text-[10px] uppercase font-bold text-slate-500 shrink-0 mr-1">
                  Prompts:
                </span>
                {defaultPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleSend(prompt)}
                    disabled={chatMutation.isPending}
                    className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 shrink-0 transition"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Box */}
            <div className="p-4 border-t border-slate-800 bg-slate-900 flex items-center gap-2">
              <input
                type="text"
                placeholder="Ask about readiness, skill gaps, defense prep, or coding..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSend()
                  }
                }}
                disabled={chatMutation.isPending}
                className="flex-1 px-4 py-2.5 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
              />
              <button
                onClick={() => handleSend()}
                disabled={!inputText.trim() || chatMutation.isPending}
                className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white transition shadow-lg shadow-indigo-600/30"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
