import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import {
  HelpCircle,
  Code2,
  PlusCircle,
  Search,
  Filter,
  Trash2,
  Edit,
  X,
  CheckCircle2,
  Terminal,
  FileCode,
  Sparkles,
  Layers,
  Zap,
  Check,
  Award,
} from 'lucide-react'
import { api } from '../../lib/api'
import type {
  AdminQuestionRow,
  CodingChallenge,
  CreateQuestionPayload,
  CreateCodingChallengePayload,
  TestCase,
} from '../../types'
import { Button, Card, Badge, Skeleton } from '../../components/ui'

export function QuestionStudio() {
  const queryClient = useQueryClient()
  const [studioTab, setStudioTab] = useState<'mcq' | 'challenges'>('mcq')
  const [selectedCourse, setSelectedCourse] = useState('WF-101')
  const [selectedTier, setSelectedTier] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')

  // Modals State
  const [isMCQModalOpen, setIsMCQModalOpen] = useState(false)
  const [isChallengeModalOpen, setIsChallengeModalOpen] = useState(false)

  // MCQ Query & Mutations
  const mcqQuery = useQuery({
    queryKey: ['committee-admin-questions'],
    queryFn: api.committeeAdminQuestions,
  })

  const createQuestionMutation = useMutation({
    mutationFn: (payload: CreateQuestionPayload) => api.createQuestion(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['committee-admin-questions'] })
      setIsMCQModalOpen(false)
      setMcqForm({
        course_id: selectedCourse,
        tier: 'Apprentice',
        question_text: '',
        options: ['', '', '', ''],
        correct_option_index: 0,
        explanation: '',
        competency: 'Core Systems',
        domain: 'D1',
      })
    },
  })

  const deleteQuestionMutation = useMutation({
    mutationFn: (id: string) => api.deleteQuestion(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['committee-admin-questions'] }),
  })

  // Challenges Query & Mutations
  const challengesQuery = useQuery({
    queryKey: ['coding-challenges'],
    queryFn: api.codingChallenges,
  })

  const createChallengeMutation = useMutation({
    mutationFn: (payload: CreateCodingChallengePayload) => api.createCodingChallenge(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coding-challenges'] })
      setIsChallengeModalOpen(false)
      setChallengeForm({
        title: '',
        slug: '',
        difficulty: 'MEDIUM',
        domain: 'Distributed Systems',
        points: 100,
        credits_reward: 15,
        time_limit_minutes: 45,
        description: '',
        input_format: 'Standard Input',
        output_format: 'Standard Output',
        constraints: ['1 <= N <= 100,000'],
        starter_code: {
          java: 'public class Solution {\n    public static void main(String[] args) {\n        // Code here\n    }\n}',
          python: 'def solution():\n    pass\n',
          typescript: 'export function solution() {\n    // Code here\n}\n',
          sql: '-- SQL Query here\n',
        },
        test_cases: [
          { id: 'tc-1', input_data: 'input_sample_1', expected_output: 'output_sample_1', is_hidden: false },
        ],
        tags: ['Distributed Systems', 'Algorithms'],
      })
    },
  })

  const deleteChallengeMutation = useMutation({
    mutationFn: (id: string) => api.deleteCodingChallenge(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['coding-challenges'] }),
  })

  // MCQ Form State
  const [mcqForm, setMcqForm] = useState<CreateQuestionPayload>({
    course_id: 'WF-101',
    tier: 'Apprentice',
    question_text: '',
    options: ['', '', '', ''],
    correct_option_index: 0,
    explanation: '',
    competency: 'Concurrency & Locking',
    domain: 'D1',
  })

  // Challenge Form State
  const [challengeForm, setChallengeForm] = useState<CreateCodingChallengePayload>({
    title: '',
    slug: '',
    difficulty: 'MEDIUM',
    domain: 'Distributed Systems & Concurrency',
    points: 100,
    credits_reward: 15,
    time_limit_minutes: 45,
    description: '',
    input_format: 'Array of elements',
    output_format: 'Processed array',
    constraints: ['1 <= N <= 100,000', 'P99 Latency < 5ms'],
    starter_code: {
      java: 'public class Solution {\n    public static void main(String[] args) {\n        // Code here\n    }\n}',
      python: 'def solution():\n    pass\n',
      typescript: 'export function solution() {\n    // Code here\n}\n',
      sql: '-- SQL Query here\n',
    },
    test_cases: [
      { id: 'tc-1', input_data: 'sample_input', expected_output: 'sample_output', is_hidden: false, explanation: 'Basic test case' },
    ],
    tags: ['Distributed Systems', 'Java 21'],
  })

  const [testCaseInput, setTestCaseInput] = useState<{ input: string; output: string; hidden: boolean; explanation: string }>({
    input: '',
    output: '',
    hidden: false,
    explanation: '',
  })

  const handleAddTestCase = () => {
    if (testCaseInput.input && testCaseInput.output) {
      const newTC: TestCase = {
        id: `tc-${(challengeForm.test_cases?.length || 0) + 1}`,
        input_data: testCaseInput.input,
        expected_output: testCaseInput.output,
        is_hidden: testCaseInput.hidden,
        explanation: testCaseInput.explanation,
      }
      setChallengeForm({
        ...challengeForm,
        test_cases: [...challengeForm.test_cases, newTC],
      })
      setTestCaseInput({ input: '', output: '', hidden: false, explanation: '' })
    }
  }

  const handleRemoveTestCase = (idx: number) => {
    const updated = [...challengeForm.test_cases]
    updated.splice(idx, 1)
    setChallengeForm({ ...challengeForm, test_cases: updated })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-blue-700">
            <span className="h-2 w-2 rounded-full bg-blue-600" />
            ASSESSMENT &amp; CODING PROBLEM STUDIO
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">
            Question &amp; Challenge Studio
          </h1>
          <p className="mt-1 max-w-2xl text-xs text-slate-500">
            Author multiple-choice question banks and split-pane HackerRank coding problems with automated test case validation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {studioTab === 'mcq' ? (
            <Button
              onClick={() => setIsMCQModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-600/20"
            >
              <PlusCircle size={15} />
              Add MCQ Question
            </Button>
          ) : (
            <Button
              onClick={() => setIsChallengeModalOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
            >
              <Code2 size={15} />
              Create Coding Challenge
            </Button>
          )}
        </div>
      </div>

      {/* Studio Nav Tabs */}
      <div className="flex border-b border-slate-200 gap-4 text-xs font-bold">
        <button
          onClick={() => setStudioTab('mcq')}
          className={`flex items-center gap-2 pb-3 border-b-2 transition-colors ${
            studioTab === 'mcq' ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <HelpCircle size={15} />
          MCQ Question Bank Studio
        </button>

        <button
          onClick={() => setStudioTab('challenges')}
          className={`flex items-center gap-2 pb-3 border-b-2 transition-colors ${
            studioTab === 'challenges' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Terminal size={15} />
          HackerRank Challenge Studio ({challengesQuery.data?.length || 0})
        </button>
      </div>

      {/* Tab 1: MCQ Question Bank Studio */}
      {studioTab === 'mcq' && (
        <div className="space-y-4">
          <Card className="p-4 border-slate-200">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <label className="text-xs font-bold text-slate-700">Course:</label>
                <select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-blue-700 outline-none"
                >
                  <option value="WF-101">WF-101 Java 21 &amp; Secure AI Prompting</option>
                  <option value="WF-102">WF-102 Spring Boot &amp; Data Integrity</option>
                  <option value="WF-103">WF-103 Spring Security &amp; Cloud Foundations</option>
                  <option value="WF-104">WF-104 Event Integration &amp; Observability</option>
                  <option value="WF-201">WF-201 Microservices at Cloud Scale</option>
                  <option value="WF-203">WF-203 Spring AI &amp; Enterprise RAG</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Tier:</span>
                <div className="flex rounded-lg border border-slate-200 p-0.5 bg-slate-50 text-[10px] font-bold">
                  {['ALL', 'Basic', 'Novice', 'Apprentice', 'Expert', 'Master'].map((tier) => (
                    <button
                      key={tier}
                      onClick={() => setSelectedTier(tier)}
                      className={`rounded px-2.5 py-1 transition-colors ${
                        selectedTier === tier ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {tier}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <Card className="overflow-hidden border border-slate-200 shadow-sm">
            <div className="border-b border-slate-200 bg-slate-50/80 px-6 py-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {selectedCourse} QUESTION BANK
              </span>
              <h2 className="text-sm font-bold text-slate-900 mt-0.5">Authoring &amp; Answer Key Maintenance</h2>
            </div>

            <div className="divide-y divide-slate-100">
              {(mcqQuery.data || []).map((q: AdminQuestionRow, idx: number) => (
                <div key={q.id} className="p-5 hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-blue-100 px-2 py-0.5 font-mono text-[10px] font-bold text-blue-800">
                          Q{idx + 1}
                        </span>
                        <span className="text-xs font-bold text-slate-900">{q.question}</span>
                      </div>
                      <div className="rounded-md border border-emerald-200 bg-emerald-50/60 p-2.5 text-xs text-emerald-900 font-semibold flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                        <span>
                          <strong>CORRECT ANSWER (ADMIN VIEW):</strong> {q.correct_answer}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        if (window.confirm('Delete this question?')) {
                          deleteQuestionMutation.mutate(q.id)
                        }
                      }}
                      className="text-slate-400 hover:text-red-600 p-1.5 rounded"
                      title="Delete question"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Tab 2: HackerRank Coding Challenge Studio */}
      {studioTab === 'challenges' && (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {(challengesQuery.data || []).map((challenge: CodingChallenge) => (
              <Card key={challenge.id} className="p-5 border-slate-200 flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="rounded bg-emerald-50 px-2 py-0.5 font-mono text-xs font-bold text-emerald-700 border border-emerald-100">
                      {challenge.id.toUpperCase()}
                    </span>
                    <Badge
                      className={
                        challenge.difficulty === 'HARD'
                          ? 'bg-red-50 text-red-700'
                          : challenge.difficulty === 'MEDIUM'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-emerald-50 text-emerald-700'
                      }
                    >
                      {challenge.difficulty}
                    </Badge>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900">{challenge.title}</h3>
                  <p className="text-[11px] text-slate-500 font-medium">{challenge.domain}</p>

                  <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                    {challenge.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span className="font-bold text-slate-700">{challenge.test_cases?.length || 0} Test Cases</span>
                    <span className="font-bold text-emerald-700">+{challenge.credits_reward} Credits</span>
                  </div>

                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete challenge ${challenge.title}?`)) {
                          deleteChallengeMutation.mutate(challenge.id)
                        }
                      }}
                      className="rounded p-1 text-slate-400 hover:text-red-600"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Add MCQ Question */}
      <AnimatePresence>
        {isMCQModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                    <HelpCircle size={16} />
                  </div>
                  <h2 className="text-base font-bold text-slate-900">Add MCQ Assessment Question</h2>
                </div>
                <button onClick={() => setIsMCQModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                  <X size={18} />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  if (!mcqForm.question_text || mcqForm.options.some((o) => !o.trim())) {
                    alert('Please provide question prompt and all 4 choices.')
                    return
                  }
                  createQuestionMutation.mutate(mcqForm)
                }}
                className="space-y-4 text-xs"
              >
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Target Course</label>
                  <select
                    value={mcqForm.course_id}
                    onChange={(e) => setMcqForm({ ...mcqForm, course_id: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 p-2 font-bold text-blue-700 outline-none"
                  >
                    <option value="WF-101">WF-101 Java 21 &amp; Secure AI Prompting</option>
                    <option value="WF-102">WF-102 Spring Boot &amp; Data Integrity</option>
                    <option value="WF-103">WF-103 Spring Security &amp; Cloud Foundations</option>
                    <option value="WF-104">WF-104 Event Integration &amp; Observability</option>
                    <option value="WF-201">WF-201 Microservices at Cloud Scale</option>
                    <option value="WF-203">WF-203 Spring AI &amp; Enterprise RAG</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Question Prompt *</label>
                  <textarea
                    required
                    rows={3}
                    value={mcqForm.question_text}
                    onChange={(e) => setMcqForm({ ...mcqForm, question_text: e.target.value })}
                    placeholder="Enter the technical scenario or code analysis question..."
                    className="w-full rounded-lg border border-slate-300 p-2.5 outline-none focus:border-blue-500 resize-none"
                  />
                </div>

                {/* 4 Options with Radio Selector */}
                <div className="space-y-2.5">
                  <label className="block font-bold text-slate-700">Answer Choices (Select Correct Option)</label>
                  {mcqForm.options.map((opt, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="correct_answer"
                        checked={mcqForm.correct_option_index === i}
                        onChange={() => setMcqForm({ ...mcqForm, correct_option_index: i })}
                        className="accent-blue-600 h-4 w-4"
                      />
                      <input
                        type="text"
                        required
                        value={opt}
                        onChange={(e) => {
                          const updated = [...mcqForm.options]
                          updated[i] = e.target.value
                          setMcqForm({ ...mcqForm, options: updated })
                        }}
                        placeholder={`Option ${String.fromCharCode(65 + i)}`}
                        className={`flex-1 rounded-lg border p-2 text-xs outline-none ${
                          mcqForm.correct_option_index === i
                            ? 'border-emerald-500 bg-emerald-50/40 font-semibold'
                            : 'border-slate-300'
                        }`}
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Explanation / Rationale</label>
                  <input
                    type="text"
                    value={mcqForm.explanation}
                    onChange={(e) => setMcqForm({ ...mcqForm, explanation: e.target.value })}
                    placeholder="Why is this option correct according to enterprise standards?"
                    className="w-full rounded-lg border border-slate-300 p-2 outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                  <Button type="button" variant="outline" onClick={() => setIsMCQModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={createQuestionMutation.isPending}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold"
                  >
                    {createQuestionMutation.isPending ? 'Saving...' : 'Save Question'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal: Create Coding Challenge */}
      <AnimatePresence>
        {isChallengeModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                    <Terminal size={16} />
                  </div>
                  <h2 className="text-base font-bold text-slate-900">Author HackerRank Coding Challenge</h2>
                </div>
                <button onClick={() => setIsChallengeModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                  <X size={18} />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  if (!challengeForm.title || !challengeForm.description) {
                    alert('Please provide challenge title and problem description.')
                    return
                  }
                  createChallengeMutation.mutate(challengeForm)
                }}
                className="space-y-4 text-xs"
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Challenge Title *</label>
                    <input
                      type="text"
                      required
                      value={challengeForm.title}
                      onChange={(e) =>
                        setChallengeForm({
                          ...challengeForm,
                          title: e.target.value,
                          slug: e.target.value.toLowerCase().replace(/\s+/g, '-'),
                        })
                      }
                      placeholder="e.g. Distributed Consensus Lock Manager"
                      className="w-full rounded-lg border border-slate-300 p-2.5 outline-none focus:border-emerald-500 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Difficulty &amp; Points</label>
                    <div className="grid grid-cols-2 gap-2">
                      <select
                        value={challengeForm.difficulty}
                        onChange={(e) => setChallengeForm({ ...challengeForm, difficulty: e.target.value as any })}
                        className="rounded-lg border border-slate-300 p-2.5 font-bold"
                      >
                        <option value="EASY">EASY</option>
                        <option value="MEDIUM">MEDIUM</option>
                        <option value="HARD">HARD</option>
                      </select>
                      <input
                        type="number"
                        value={challengeForm.points}
                        onChange={(e) => setChallengeForm({ ...challengeForm, points: Number(e.target.value) })}
                        placeholder="Points"
                        className="rounded-lg border border-slate-300 p-2.5 font-bold"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Problem Statement &amp; Requirements *</label>
                  <textarea
                    required
                    rows={4}
                    value={challengeForm.description}
                    onChange={(e) => setChallengeForm({ ...challengeForm, description: e.target.value })}
                    placeholder="Describe the production engineering scenario, invariants, and edge conditions..."
                    className="w-full rounded-lg border border-slate-300 p-2.5 outline-none focus:border-emerald-500 resize-none font-sans"
                  />
                </div>

                {/* Test Cases Builder */}
                <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-3">
                  <span className="font-bold text-slate-900 text-xs">
                    Test Cases &amp; Benchmarks ({challengeForm.test_cases.length})
                  </span>

                  <div className="grid gap-2 sm:grid-cols-2">
                    <input
                      type="text"
                      value={testCaseInput.input}
                      onChange={(e) => setTestCaseInput({ ...testCaseInput, input: e.target.value })}
                      placeholder="Input data (e.g. [10, 20, 30])"
                      className="rounded-lg border border-slate-300 bg-white p-2 font-mono"
                    />
                    <input
                      type="text"
                      value={testCaseInput.output}
                      onChange={(e) => setTestCaseInput({ ...testCaseInput, output: e.target.value })}
                      placeholder="Expected Output (e.g. 60)"
                      className="rounded-lg border border-slate-300 bg-white p-2 font-mono"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-1.5 text-slate-700 font-semibold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={testCaseInput.hidden}
                        onChange={(e) => setTestCaseInput({ ...testCaseInput, hidden: e.target.checked })}
                        className="accent-emerald-600"
                      />
                      Is Hidden Verification Case
                    </label>

                    <Button type="button" onClick={handleAddTestCase} variant="outline" className="text-xs">
                      + Add Test Case
                    </Button>
                  </div>

                  <div className="space-y-1.5 max-h-32 overflow-y-auto">
                    {challengeForm.test_cases.map((tc, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-white px-3 py-1.5 rounded border border-slate-200 font-mono text-[11px]">
                        <span>
                          {idx + 1}. In: <code>{tc.input_data}</code> → Out: <code className="text-emerald-700">{tc.expected_output}</code>
                          {tc.is_hidden && <span className="ml-2 text-[9px] bg-slate-200 px-1.5 py-0.2 rounded font-sans">Hidden</span>}
                        </span>
                        <button type="button" onClick={() => handleRemoveTestCase(idx)} className="text-slate-400 hover:text-red-600">
                          <X size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                  <Button type="button" variant="outline" onClick={() => setIsChallengeModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={createChallengeMutation.isPending}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                  >
                    {createChallengeMutation.isPending ? 'Publishing...' : 'Publish Coding Challenge'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
