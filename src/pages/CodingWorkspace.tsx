import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Code2,
  Play,
  CheckCircle2,
  AlertCircle,
  Clock,
  Award,
  ChevronLeft,
  RefreshCw,
  Terminal,
  Layers,
  Sparkles,
  Zap,
  Check,
  X,
  FileCode,
  Sliders,
  Send,
} from 'lucide-react'
import { api } from '../lib/api'
import { useAuth } from '../context/AuthContext'
import type { CodingChallenge, CodeExecutionResponse, CodeSubmissionResponse } from '../types'
import { Button, Card, Badge, Skeleton } from '../components/ui'

export function CodingWorkspace() {
  const { challengeId = 'cc-101' } = useParams()
  const navigate = useNavigate()
  const { user, activeAssociateId } = useAuth()
  const queryClient = useQueryClient()

  const challengeQuery = useQuery({
    queryKey: ['coding-challenge', challengeId],
    queryFn: () => api.codingChallenge(challengeId),
  })

  const [language, setLanguage] = useState<'java' | 'python' | 'typescript' | 'sql'>('java')
  const [code, setCode] = useState<string>('')
  const [activeTab, setActiveTab] = useState<'problem' | 'submissions' | 'editorial'>('problem')
  const [activeTestCaseIdx, setActiveTestCaseIdx] = useState(0)
  const [customInput, setCustomInput] = useState('')
  const [useCustomInput, setUseCustomInput] = useState(false)
  const [timeLeft, setTimeLeft] = useState(45 * 60)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')

  const challenge = challengeQuery.data

  // Sync starter code when challenge or language changes
  useEffect(() => {
    if (challenge && challenge.starter_code) {
      setCode(challenge.starter_code[language] || challenge.starter_code.java || '')
    }
  }, [challenge, language])

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const runMutation = useMutation({
    mutationFn: () =>
      api.runCode({
        challenge_id: challengeId,
        language,
        code,
        custom_input: useCustomInput ? customInput : undefined,
      }),
  })

  const submitMutation = useMutation({
    mutationFn: () =>
      api.submitCode({
        associate_id: activeAssociateId || 'as-ananya',
        challenge_id: challengeId,
        language,
        code,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credit-ledger'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      const target = e.target as HTMLTextAreaElement
      const start = target.selectionStart
      const end = target.selectionEnd
      const newCode = code.substring(0, start) + '    ' + code.substring(end)
      setCode(newCode)
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 4
      }, 0)
    }
  }

  if (challengeQuery.isLoading || !challenge) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-12 w-1/3" />
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-[600px]" />
          <Skeleton className="h-[600px]" />
        </div>
      </div>
    )
  }

  const execResult = runMutation.data
  const submitResult = submitMutation.data

  return (
    <div className="space-y-4">
      {/* Top IDE Header Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-xl bg-slate-900 px-5 py-3 text-white border border-slate-800 shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-sm sm:text-base text-white">{challenge.title}</h1>
              <Badge
                className={
                  challenge.difficulty === 'HARD'
                    ? 'bg-red-500/20 text-red-300 border-red-500/30'
                    : challenge.difficulty === 'MEDIUM'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                }
              >
                {challenge.difficulty}
              </Badge>
            </div>
            <p className="text-[11px] text-slate-400">
              Domain: <strong className="text-slate-300">{challenge.domain}</strong> · Max Score: <strong>{challenge.points} pts</strong> · Reward: <strong className="text-emerald-400">+{challenge.credits_reward} Credits</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 rounded-lg bg-slate-800/80 px-3 py-1.5 font-mono text-xs font-bold text-amber-400 border border-slate-700">
            <Clock size={14} />
            <span>{formatTime(timeLeft)}</span>
          </div>

          <Button
            onClick={() => runMutation.mutate()}
            disabled={runMutation.isPending || submitMutation.isPending}
            variant="outline"
            className="text-xs font-bold border-slate-700 text-slate-200 bg-slate-800 hover:bg-slate-700 flex items-center gap-1.5"
          >
            <Play size={13} className="text-blue-400 fill-blue-400" />
            {runMutation.isPending ? 'Running...' : 'Run Code'}
          </Button>

          <Button
            onClick={() => submitMutation.mutate()}
            disabled={submitMutation.isPending || runMutation.isPending}
            className="text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 shadow-lg shadow-emerald-600/30"
          >
            <Send size={13} />
            {submitMutation.isPending ? 'Submitting...' : 'Submit'}
          </Button>
        </div>
      </div>

      {/* Split-Screen IDE Workspace */}
      <div className="grid gap-4 lg:grid-cols-12 min-h-[720px]">
        {/* Left Column: Problem Statement & Specs (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          {/* Sub-tabs */}
          <div className="flex items-center border-b border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-600 gap-4">
            <button
              onClick={() => setActiveTab('problem')}
              className={`flex items-center gap-1.5 py-1 transition-colors ${
                activeTab === 'problem' ? 'border-b-2 border-blue-600 text-blue-700 font-bold' : 'hover:text-slate-900'
              }`}
            >
              <FileCode size={14} /> Problem Description
            </button>
            <button
              onClick={() => setActiveTab('submissions')}
              className={`flex items-center gap-1.5 py-1 transition-colors ${
                activeTab === 'submissions' ? 'border-b-2 border-blue-600 text-blue-700 font-bold' : 'hover:text-slate-900'
              }`}
            >
              <Award size={14} /> Submissions
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6 text-xs leading-relaxed text-slate-700">
            {activeTab === 'problem' && (
              <>
                <div>
                  <h2 className="text-sm font-bold text-slate-950 mb-2">Problem Overview</h2>
                  <div className="whitespace-pre-line text-slate-700 leading-relaxed font-sans">
                    {challenge.description}
                  </div>
                </div>

                <div className="space-y-3 rounded-lg border border-slate-100 bg-slate-50/80 p-3.5">
                  <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Input Format</h3>
                  <code className="block rounded bg-slate-900 p-2.5 font-mono text-[11px] text-emerald-400">
                    {challenge.input_format}
                  </code>

                  <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider pt-2">Output Format</h3>
                  <code className="block rounded bg-slate-900 p-2.5 font-mono text-[11px] text-blue-400">
                    {challenge.output_format}
                  </code>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2">Constraints</h3>
                  <ul className="list-disc space-y-1 pl-5 text-slate-600 font-mono text-[11px]">
                    {challenge.constraints.map((c: string, i: number) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>

                {/* Sample Test Cases */}
                <div>
                  <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3">Sample Test Cases</h3>
                  <div className="space-y-4">
                    {challenge.test_cases
                      .filter((tc: any) => !tc.is_hidden)
                      .map((tc: any, idx: number) => (
                        <div key={tc.id} className="rounded-lg border border-slate-200 bg-white p-3 space-y-2">
                          <span className="font-bold text-[11px] text-blue-700 uppercase">Sample {idx + 1}</span>
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Input:</span>
                            <pre className="mt-0.5 rounded bg-slate-900 p-2 font-mono text-[11px] text-slate-200 overflow-x-auto">
                              {tc.input_data}
                            </pre>
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Expected Output:</span>
                            <pre className="mt-0.5 rounded bg-slate-900 p-2 font-mono text-[11px] text-emerald-400 overflow-x-auto">
                              {tc.expected_output}
                            </pre>
                          </div>
                          {tc.explanation && (
                            <p className="text-[11px] text-slate-500 italic mt-1">
                              <strong>Explanation:</strong> {tc.explanation}
                            </p>
                          )}
                        </div>
                      ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-2">
                  {challenge.tags.map((tag: string) => (
                    <span key={tag} className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                      #{tag}
                    </span>
                  ))}
                </div>

              </>
            )}

            {activeTab === 'submissions' && (
              <div className="space-y-4">
                <h3 className="font-bold text-slate-900 text-sm">Submission History</h3>
                {submitResult ? (
                  <div className="rounded-lg border border-emerald-200 bg-emerald-50/50 p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-900 text-xs">Latest Submission</span>
                      <Badge className="bg-emerald-100 text-emerald-800">{submitResult.status}</Badge>
                    </div>
                    <p className="text-xs text-emerald-800">
                      Score: <strong>{submitResult.score} / {challenge.points}</strong> · Credits Awarded: <strong>+{submitResult.credits_awarded}</strong>
                    </p>
                    <p className="text-[11px] text-slate-500 font-mono">
                      Runtime: {submitResult.execution_time_ms}ms · Memory: {submitResult.memory_used_mb}MB
                    </p>
                    <p className="text-xs text-slate-600 mt-2 bg-white p-2.5 rounded border border-emerald-100">
                      {submitResult.feedback}
                    </p>
                  </div>
                ) : (
                  <p className="text-slate-400 italic">No submissions for this challenge yet. Click "Submit" when ready.</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Code Editor & Test Case Runner Console (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* Code Editor Container */}
          <div className="flex-1 flex flex-col rounded-xl border border-slate-800 bg-[#0d1626] text-slate-100 shadow-xl overflow-hidden min-h-[420px]">
            {/* Editor Toolbar */}
            <div className="flex items-center justify-between border-b border-slate-800 bg-[#09101d] px-4 py-2 text-xs">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">LANGUAGE</span>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as any)}
                  className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1 font-mono text-xs font-semibold text-blue-300 outline-none focus:border-blue-500"
                >
                  <option value="java">Java 21 (LTS)</option>
                  <option value="python">Python 3.12</option>
                  <option value="typescript">TypeScript 5.7</option>
                  <option value="sql">PostgreSQL 16</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (challenge.starter_code) {
                      setCode(challenge.starter_code[language] || '')
                    }
                  }}
                  className="flex items-center gap-1 text-[11px] font-medium text-slate-400 hover:text-white transition-colors"
                >
                  <RefreshCw size={12} /> Reset Boilerplate
                </button>
              </div>
            </div>

            {/* In-Browser Code Area with Line Numbers */}
            <div className="flex-1 flex relative font-mono text-xs overflow-hidden">
              {/* Line Numbers column */}
              <div className="w-12 select-none border-r border-slate-800/80 bg-[#070d18] py-4 text-right pr-3 text-slate-600 font-mono text-xs leading-6">
                {code.split('\n').map((_, i) => (
                  <div key={i}>{i + 1}</div>
                ))}
              </div>

              {/* Editable Codearea */}
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onKeyDown={handleKeyDown}
                spellCheck={false}
                className="flex-1 resize-none bg-transparent p-4 font-mono text-xs leading-6 text-slate-100 outline-none focus:ring-0 placeholder-slate-600 selection:bg-blue-600/40"
                placeholder="// Write your solution here..."
              />
            </div>
          </div>

          {/* Test Case & Execution Results Console */}
          <div className="rounded-xl border border-slate-800 bg-[#09101d] text-slate-200 shadow-xl overflow-hidden p-4 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Terminal size={16} className="text-blue-400" />
                <span className="font-bold text-xs uppercase tracking-wider text-slate-300">Test Cases &amp; Output</span>
              </div>

              {execResult && (
                <div className="flex items-center gap-3 text-xs">
                  <Badge
                    className={
                      execResult.overall_status === 'ACCEPTED'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-red-500/20 text-red-300 border-red-500/40'
                    }
                  >
                    {execResult.overall_status} ({execResult.passed_test_cases}/{execResult.total_test_cases} Passed)
                  </Badge>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {execResult.execution_time_ms}ms · {execResult.memory_used_mb}MB
                  </span>
                </div>
              )}
            </div>

            {/* Test Case Selector Tabs */}
            <div className="flex flex-wrap gap-2">
              {challenge.test_cases
                .filter((tc: any) => !tc.is_hidden)
                .map((tc: any, idx: number) => {
                  const tcResult = execResult?.results.find((r: any) => r.test_case_id === tc.id)
                  return (
                    <button
                      key={tc.id}
                      onClick={() => setActiveTestCaseIdx(idx)}
                      className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-mono text-xs font-bold transition-colors ${
                        activeTestCaseIdx === idx
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      Case {idx + 1}
                      {tcResult && (
                        tcResult.status === 'PASSED' ? (
                          <Check size={12} className="text-emerald-400" />
                        ) : (
                          <X size={12} className="text-red-400" />
                        )
                      )}
                    </button>
                  )
                })}
            </div>


            {/* Active Test Case Detail / Execution Diff */}
            {challenge.test_cases[activeTestCaseIdx] && (
              <div className="grid gap-3 sm:grid-cols-2 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Input:</span>
                  <pre className="mt-1 rounded-lg bg-slate-950 p-2.5 font-mono text-[11px] text-slate-200 border border-slate-800 overflow-x-auto">
                    {challenge.test_cases[activeTestCaseIdx].input_data}
                  </pre>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Expected Output:</span>
                  <pre className="mt-1 rounded-lg bg-slate-950 p-2.5 font-mono text-[11px] text-emerald-400 border border-slate-800 overflow-x-auto">
                    {challenge.test_cases[activeTestCaseIdx].expected_output}
                  </pre>
                </div>

                {execResult?.results[activeTestCaseIdx] && (
                  <div className="sm:col-span-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Actual Output:</span>
                    <pre
                      className={`mt-1 rounded-lg p-2.5 font-mono text-[11px] border overflow-x-auto ${
                        execResult.results[activeTestCaseIdx].status === 'PASSED'
                          ? 'bg-slate-950 text-emerald-300 border-emerald-900/40'
                          : 'bg-red-950/40 text-red-300 border-red-800/40'
                      }`}
                    >
                      {execResult.results[activeTestCaseIdx].actual_output}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
