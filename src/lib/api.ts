import type {
  ASMDetail,
  ASMMilestone,
  Associate,
  AssociateASMDetail,
  AttemptResult,
  AttemptSummary,
  CommissioningPath,
  Course,
  CreditEntry,
  CurriculumCourse,
  DashboardData,
  DevelopmentGoal,
  DemandOverview,
  DemandTeamSummary,
  MenteeProfile,
  MentorMentee,
  MentorReview,
  PathwayHistoryEntry,
  PathwayInfo,
  PathwayRecommendation,
  PipelineOverview,
  Question,
  Recommendation,
  Role,
  SponsoredASM,
  TeamPipeline,
  User,
  Waiver,
  GovernanceOverview,
  QuestionBankRow,
  ASMLibraryRow,
  GovernanceWaiver,
  DifficultyRow,
  LedgerAuditRow,
  BankCoverageRow,
  AdminQuestionRow,
  TechHeadReadinessRow,
  SponsorApproval,
  ArchitectDefense,
  AlreadyForkedCandidate,
  CodingChallenge,
  CodeExecutionResponse,
  CodeSubmissionResponse,
  SkillTaxonomyCategory,
  AssociateSkillProfile,
  SkillGap,
  PersonalizedLearningItem,
  AssociateSkill,
  AIReadinessBreakdown,
  AIReadinessPrediction,
  AICoachChatMessage,
  AIMentorBrief,
  AIExecutiveQueryResult,
  WorkflowDefinition,
  WorkflowInstance,
  WorkflowTransitionRequest,
  SLADashboardMetrics,
  NotificationItem,
  NotificationTemplate,
  AdaptiveTestSession,
  AdaptiveAnswerSubmit,
  AdaptiveAnswerResult,
  GovernanceQuestion,
  ProctoringTelemetry,
  ASMProjectLifecycle,
  ASMPanelMember,
  DigitalCredential,
  IssueCredentialRequest,
  MarketplaceProject,
  MarketplaceApplication,
  MarketplaceApplyRequest,
  WorkforceScenarioRequest,
  WorkforceScenarioResult,
  ExecutiveAnalyticsData,
  CustomDashboardLayout,
  ScheduledReport,
  GenerateReportRequest,
  MetricLineageNode,
  AuditLogEvent,
  AuditChainVerificationResult,
  CurriculumVersion,
  CurriculumBranchRequest,
  LMSConnector,
  HRISConnector,
  XAPIStatement,
  ActivityStreamEvent,
  PresenceSession,
  GlobalSearchResult,
  ScoringRuleConfig,
  SystemHealthStatus,
  FeatureFlagUpdate,
} from '../types'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api'

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, options)
  if (!response.ok) throw new Error(`ASCEND service returned ${response.status}`)
  return response.json() as Promise<T>
}

function postJson<T>(path: string, body: unknown): Promise<T> {
  return request<T>(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

function putJson<T>(path: string, body: unknown): Promise<T> {
  return request<T>(path, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

function deleteJson<T>(path: string): Promise<T> {
  return request<T>(path, {
    method: 'DELETE',
  })
}

export const api = {
  // Authentication & Users
  roles: () => request<Role[]>('/roles'),
  users: () => request<User[]>('/users'),
  associates: () => request<Associate[]>('/associates'),
  dashboard: (id: string) => request<DashboardData>(`/dashboard/${id}`),

  // Courses & Curriculum
  courses: () => request<Course[]>('/courses'),
  curriculumCourses: () => request<CurriculumCourse[]>('/curriculum/courses'),
  curriculumCourse: (id: string) => request<CurriculumCourse>(`/curriculum/courses/${id}`),
  courseQuestions: (id: string) => request<Question[]>(`/curriculum/courses/${id}/questions`),

  // Associate Progress & Milestones
  milestones: () => request<ASMMilestone[]>('/asm-milestones'),
  associateAssessments: (id: string) => request<any[]>(`/associates/${id}/assessments`),
  associateAsm: (id: string) => request<AssociateASMDetail>(`/associates/${id}/asm`),
  startAsm: (milestoneId: string, associateId: string) => postJson<ASMDetail>(`/asm/${milestoneId}/start`, { associate_id: associateId }),
  submitAsm: (milestoneId: string, payload: { associate_id: string; evidence_description: string; artifact_url: string }) => postJson<ASMDetail>(`/asm/${milestoneId}/submit`, payload),
  reviewAsm: (milestoneId: string, payload: { associate_id: string; mentor_id: string; mentor_name: string; decision: 'APPROVED' | 'REQUEST_CHANGES' | 'REJECTED'; comments: string }) => postJson<ASMDetail>(`/asm/${milestoneId}/review`, payload),
  commissioning: (id: string) => request<CommissioningPath>(`/associates/${id}/commissioning`),
  commissioningPath: (id: string) => request<CommissioningPath>(`/associates/${id}/commissioning-path`),
  credits: (id: string) => request<CreditEntry[]>(`/associates/${id}/credits`),
  associateCredits: (id: string) => request<CreditEntry[]>(`/associates/${id}/credits`),
  developmentGoals: (id: string) => request<DevelopmentGoal[]>(`/associates/${id}/goals`),
  developmentPlan: (id: string) => request<DevelopmentGoal[]>(`/mentees/${id}/development-plan`),
  createDevelopmentPlan: (payload: Omit<DevelopmentGoal, 'id' | 'updated_at'>) => postJson<DevelopmentGoal>('/development-plan', payload),

  // Mentor Portal
  mentorMentees: (mentorId: string) => request<MentorMentee[]>(`/mentors/${mentorId}/mentees`),
  menteeProfile: (id: string) => request<MenteeProfile>(`/mentees/${id}/profile`),
  startMilestone: (milestoneId: string, associateId: string) => postJson<ASMDetail>(`/asm/milestones/${milestoneId}/start`, { associate_id: associateId }),
  submitEvidence: (milestoneId: string, payload: { associate_id: string; pr_url: string; artifact_name?: string; notes?: string }) => postJson<ASMDetail>(`/asm/milestones/${milestoneId}/evidence`, payload),
  reviewMilestone: (milestoneId: string, payload: { reviewer_id: string; decision: 'APPROVED' | 'REJECTED'; rubric_scores: Record<string, number>; notes?: string }) => postJson<ASMDetail>(`/asm/milestones/${milestoneId}/review`, payload),
  waivers: () => request<Waiver[]>('/waivers'),
  reviewWaiver: (id: string, mentorId: string, recommendation: 'RECOMMEND' | 'DO_NOT_RECOMMEND') => postJson<Waiver>(`/waivers/${id}/mentor-review`, { mentor_id: mentorId, recommendation }),

  // Governance & Excellence Committee
  governanceOverview: () => request<GovernanceOverview>('/governance/overview'),
  committeeOverview: () => request<any>('/committee/overview'),
  questionBank: () => request<QuestionBankRow[]>('/governance/question-bank'),
  bankCoverage: () => request<BankCoverageRow[]>('/committee/bank-coverage'),
  committeeBankCoverage: () => request<BankCoverageRow[]>('/committee/bank-coverage'),
  adminQuestions: (courseId?: string) => request<AdminQuestionRow[]>(`/committee/admin-questions${courseId ? `?course_id=${courseId}` : ''}`),
  committeeAdminQuestions: () => request<AdminQuestionRow[]>('/committee/admin-questions'),
  alreadyForked: () => request<AlreadyForkedCandidate[]>('/pathways/already-forked'),
  alreadyForkedCandidates: () => request<AlreadyForkedCandidate[]>('/pathways/already-forked'),
  asmLibrary: () => request<ASMLibraryRow[]>('/committee/asm-library'),
  committeeAsmLibrary: () => request<ASMLibraryRow[]>('/committee/asm-library'),
  governanceWaivers: () => request<GovernanceWaiver[]>('/committee/waivers'),
  difficultyEngine: () => request<DifficultyRow[]>('/committee/difficulty'),
  committeeDifficulty: () => request<DifficultyRow[]>('/committee/difficulty'),
  ledgerAudit: () => request<LedgerAuditRow[]>('/committee/ledger'),
  committeeLedger: () => request<LedgerAuditRow[]>('/committee/ledger'),
  updateGovernance: (area: string, id: string, action: string) => postJson<{ status: string; id: string }>(`/committee/${area}/${id}/${action}`, {}),

  // Assessments Test Engine
  startAssessment: (courseId: string, associateId: string) => postJson<AttemptSummary>(`/assessments/${courseId}/start`, { associate_id: associateId }),
  getAssessmentAttempt: (attemptId: string) => request<AttemptSummary>(`/assessments/${attemptId}`),
  getAssessment: (attemptId: string) => request<AttemptSummary>(`/assessments/${attemptId}`),
  saveAnswer: (attemptId: string, questionId: string, selectedOption: string) => postJson<AttemptSummary>(`/assessments/${attemptId}/answer`, { question_id: questionId, selected_option: selectedOption }),
  submitAnswer: (attemptId: string, questionId: string, selectedOption: string) => postJson<{ status: string }>(`/assessments/${attemptId}/answer`, { question_id: questionId, selected_option: selectedOption }),
  toggleMark: (attemptId: string, questionId: string) => postJson<AttemptSummary>(`/assessments/${attemptId}/mark`, { question_id: questionId }),
  toggleMarkForReview: (attemptId: string, questionId: string) => postJson<{ status: string; is_marked: boolean }>(`/assessments/${attemptId}/mark`, { question_id: questionId }),
  setCurrentIndex: (attemptId: string, index: number) => postJson<{ status: string }>(`/assessments/${attemptId}/current`, { index }),
  submitAssessment: (attemptId: string) => postJson<AttemptResult>(`/assessments/${attemptId}/submit`, {}),
  getAssessmentResult: (attemptId: string) => request<AttemptResult>(`/assessments/${attemptId}/result`),

  // Pathways & Architect Defense
  pathways: () => request<PathwayInfo[]>('/pathways'),
  pathwayRecommendation: (associateId: string) => request<PathwayRecommendation>(`/pathways/recommendation/${associateId}`),
  submitMentorReview: (review: { associate_id: string; mentor_id: string; mentor_name: string; recommended_pathway: string; confidence: number; strengths: string; concerns: string; comments: string }) => postJson<MentorReview>('/pathways/mentor-review', review),
  submitCommitteeDecision: (decision: { associate_id: string; system_recommendation: string; mentor_recommendation: string; committee_decision: string; reason: string; status: string }) => postJson<{ id: string }>('/pathways/committee-decision', decision),
  pathwayHistory: (associateId: string) => request<PathwayHistoryEntry[]>(`/pathways/history/${associateId}`),

  // Sponsor Portal
  demand: () => request<DemandOverview>('/demand'),
  demandTeams: () => request<DemandTeamSummary[]>('/demand/teams'),
  demandTeam: (teamId: string) => request<TeamPipeline>(`/demand/${teamId}`),
  pipeline: () => request<PipelineOverview>('/pipeline'),
  pipelineTeam: (teamId: string) => request<TeamPipeline>(`/pipeline/${teamId}`),
  workforceRecommendations: () => request<Recommendation[]>('/workforce/recommendations'),
  sponsoredAsm: () => request<SponsoredASM[]>('/sponsored-asm'),
  sponsorApprovals: () => request<SponsorApproval[]>('/sponsor/approvals'),
  decideSponsorApproval: (id: string, action: 'approve' | 'reject') => postJson<SponsorApproval>(`/sponsor/approvals/${id}/${action}`, {}),

  // Architect Board
  architectDefenses: (associateId?: string) => request<ArchitectDefense[]>(`/architect-board/defenses${associateId ? `/${associateId}` : ''}`),
  scoreArchitectDefense: (associateId: string, score: number, milestoneId?: string) => postJson<ArchitectDefense>('/architect-board/score', { associate_id: associateId, score, milestone_id: milestoneId || 'asm-104' }),

  // Technology Head
  techHeadReadiness: () => request<TechHeadReadinessRow[]>('/techhead/readiness-heatmap'),

  // HackerRank Coding Challenges
  codingChallenges: () => request<CodingChallenge[]>('/coding/challenges'),
  codingChallenge: (id: string) => request<CodingChallenge>(`/coding/challenges/${id}`),
  runCode: (req: { challenge_id: string; language: string; code: string; custom_input?: string }) => postJson<CodeExecutionResponse>('/code/run', req),
  submitCode: (req: { associate_id: string; challenge_id: string; language: string; code: string }) => postJson<CodeSubmissionResponse>('/code/submit', req),

  // Product Administration & Authoring CRUD
  createUser: (payload: any) => postJson<{ user: User; associate?: Associate }>('/users', payload),
  updateUser: (userId: string, payload: any) => putJson<User>(`/users/${userId}`, payload),
  deleteUser: (userId: string) => deleteJson<{ status: string; user_id: string }>(`/users/${userId}`),

  createCourse: (payload: any) => postJson<{ course: Course; curriculum_course: CurriculumCourse }>('/courses', payload),
  updateCourse: (courseId: string, payload: any) => putJson<Course>(`/courses/${courseId}`, payload),
  deleteCourse: (courseId: string) => deleteJson<{ status: string; course_id: string }>(`/courses/${courseId}`),

  createQuestion: (payload: any) => postJson<Question>('/questions', payload),
  deleteQuestion: (questionId: string) => deleteJson<{ status: string; question_id: string }>(`/questions/${questionId}`),

  createCodingChallenge: (payload: any) => postJson<CodingChallenge>('/coding/challenges', payload),
  deleteCodingChallenge: (challengeId: string) => deleteJson<{ status: string; challenge_id: string }>(`/coding/challenges/${challengeId}`),

  // Skills Intelligence Platform (Phase 1)
  skillsTaxonomy: () => request<SkillTaxonomyCategory[]>('/skills/taxonomy'),
  skillProfile: (associateId: string) => request<AssociateSkillProfile>(`/skills/associate/${associateId}/profile`),
  skillGaps: (associateId: string) => request<SkillGap[]>(`/skills/associate/${associateId}/gaps`),
  personalizedRecommendations: (associateId: string) => request<PersonalizedLearningItem[]>(`/skills/associate/${associateId}/recommendations`),
  skillEvidence: (associateId: string, skillId: string) => request<AssociateSkill>(`/skills/associate/${associateId}/evidence/${skillId}`),

  // AI Talent Intelligence (Phase 2)
  aiReadiness: (associateId: string) => request<AIReadinessBreakdown>(`/ai/readiness/${associateId}`),
  aiPredictions: (associateId: string) => request<AIReadinessPrediction>(`/ai/predictions/${associateId}`),
  aiCoachHistory: (associateId: string) => request<AICoachChatMessage[]>(`/ai/coach/history/${associateId}`),
  aiCoachChat: (req: { associate_id: string; message: string; context_topic?: string }) => postJson<AICoachChatMessage>('/ai/coach/chat', req),
  aiMentorBrief: (associateId: string) => request<AIMentorBrief>(`/ai/mentor/brief/${associateId}`),
  aiMentorBriefs: () => request<AIMentorBrief[]>('/ai/mentor/briefs'),
  aiExecutiveQuery: (query: string, role = 'SENIOR_LEADER_SPONSOR') => postJson<AIExecutiveQueryResult>('/ai/executive/query', { query, role }),

  // Workflow Engine & SLA Escalation (Phase 3)
  workflowDefinitions: () => request<WorkflowDefinition[]>('/workflows/definitions'),
  workflowDefinition: (code: string) => request<WorkflowDefinition>(`/workflows/definitions/${code}`),
  saveWorkflowDefinition: (def: WorkflowDefinition) => postJson<WorkflowDefinition>('/workflows/definitions', def),
  workflowInstances: (params?: { role?: string; associate_id?: string; status?: string }) => {
    const query = new URLSearchParams(params as any).toString()
    return request<WorkflowInstance[]>(`/workflows/instances${query ? `?${query}` : ''}`)
  },
  workflowInstance: (id: string) => request<WorkflowInstance>(`/workflows/instances/${id}`),
  transitionWorkflow: (req: WorkflowTransitionRequest) => postJson<WorkflowInstance>('/workflows/instances/transition', req),
  slaDashboard: () => request<SLADashboardMetrics>('/workflows/sla/dashboard'),

  // Enterprise Notification Center (Phase 3)
  notifications: (userId?: string, unreadOnly = false) => {
    const query = new URLSearchParams({ ...(userId ? { user_id: userId } : {}), ...(unreadOnly ? { unread_only: 'true' } : {}) }).toString()
    return request<NotificationItem[]>(`/notifications${query ? `?${query}` : ''}`)
  },
  markNotificationRead: (id: string) => request<{ status: string }>(`/notifications/${id}/read`, { method: 'PATCH' }),
  markAllNotificationsRead: (userId?: string) => postJson<{ status: string; count: number }>('/notifications/read-all', { user_id: userId }),
  notificationTemplates: () => request<NotificationTemplate[]>('/notifications/templates'),

  // Adaptive Testing & Question Governance (Phase 4)
  startAdaptiveAssessment: (req: { associate_id: string; course_id: string; target_domain?: string }) =>
    postJson<AdaptiveTestSession>('/assessments/adaptive/start', req),
  submitAdaptiveAnswer: (req: AdaptiveAnswerSubmit) =>
    postJson<AdaptiveAnswerResult>('/assessments/adaptive/submit', req),
  governanceQuestions: (params?: { domain?: string; status?: string }) => {
    const query = new URLSearchParams(params as any).toString()
    return request<GovernanceQuestion[]>(`/assessments/governance/questions${query ? `?${query}` : ''}`)
  },
  saveGovernanceQuestion: (question: GovernanceQuestion) =>
    postJson<GovernanceQuestion>('/assessments/governance/questions', question),
  updateQuestionStatus: (id: string, status: string) =>
    request<GovernanceQuestion>(`/assessments/governance/questions/${id}/status?status=${status}`, { method: 'PATCH' }),
  proctoringTelemetry: (sessionId: string) =>
    request<ProctoringTelemetry>(`/assessments/proctoring/${sessionId}`),

  // Advanced ASM Project Lifecycle & Digital Credentials (Phase 5)
  asmProjects: (params?: { associate_id?: string; stage?: string }) => {
    const query = new URLSearchParams(params as any).toString()
    return request<ASMProjectLifecycle[]>(`/asm/lifecycle/projects${query ? `?${query}` : ''}`)
  },
  asmProject: (id: string) => request<ASMProjectLifecycle>(`/asm/lifecycle/projects/${id}`),
  submitAsmPanelScore: (id: string, member: ASMPanelMember) =>
    postJson<ASMProjectLifecycle>(`/asm/lifecycle/projects/${id}/panel-score`, member),
  associateCredentials: (associateId: string) =>
    request<DigitalCredential[]>(`/credentials/associate/${associateId}`),
  verifyCredential: (credentialId: string) =>
    request<DigitalCredential>(`/credentials/verify/${credentialId}`),
  issueCredential: (req: IssueCredentialRequest) =>
    postJson<DigitalCredential>('/credentials/issue', req),

  // Internal Talent Marketplace & Strategic Workforce Planning (Phase 6)
  marketplaceProjects: () => request<MarketplaceProject[]>('/marketplace/projects'),
  marketplaceProject: (id: string) => request<MarketplaceProject>(`/marketplace/projects/${id}`),
  marketplaceProjectMatch: (id: string, associateId: string) =>
    request<{ match_score: number; match_breakdown: Record<string, number> }>(`/marketplace/projects/${id}/matches/${associateId}`),
  marketplaceApplications: (params?: { associate_id?: string; project_id?: string }) => {
    const query = new URLSearchParams(params as any).toString()
    return request<MarketplaceApplication[]>(`/marketplace/applications${query ? `?${query}` : ''}`)
  },
  applyMarketplaceProject: (req: MarketplaceApplyRequest) =>
    postJson<MarketplaceApplication>('/marketplace/apply', req),
  updateMarketplaceAppStatus: (appId: string, status: string) =>
    request<MarketplaceApplication>(`/marketplace/applications/${appId}/status?status=${status}`, { method: 'PATCH' }),
  simulateWorkforceScenario: (req: WorkforceScenarioRequest) =>
    postJson<WorkforceScenarioResult>('/workforce/simulate-scenario', req),
  workforceForecast: () => request<WorkforceScenarioResult>('/workforce/forecast'),

  // Executive Analytics, Dashboard Builder & Reporting (Phase 7)
  executiveAnalytics: () => request<ExecutiveAnalyticsData>('/analytics/executive'),
  cohortAnalytics: () => request<any[]>('/analytics/cohorts'),
  skillsMatrixAnalytics: () => request<any[]>('/analytics/skills-matrix'),
  customDashboards: (role?: string) => {
    const query = role ? `?role=${role}` : ''
    return request<CustomDashboardLayout[]>(`/analytics/dashboards${query}`)
  },
  customDashboard: (id: string) => request<CustomDashboardLayout>(`/analytics/dashboards/${id}`),
  saveCustomDashboard: (dashboard: CustomDashboardLayout) =>
    postJson<CustomDashboardLayout>('/analytics/dashboards', dashboard),
  scheduledReports: () => request<ScheduledReport[]>('/reports/scheduled'),
  saveScheduledReport: (report: ScheduledReport) =>
    postJson<ScheduledReport>('/reports/scheduled', report),
  generateReport: (req: GenerateReportRequest) =>
    postJson<any>('/reports/generate', req),

  // Data Governance, Metric Lineage & Audit Center (Phase 8)
  metricLineageNodes: () => request<MetricLineageNode[]>('/governance/metrics/lineage'),
  debugMetric: (metricKey: string) => request<any>(`/governance/metrics/${metricKey}/debug`),
  auditLogs: (params?: { severity?: string; action?: string; actor_id?: string }) => {
    const query = new URLSearchParams(params as any).toString()
    return request<AuditLogEvent[]>(`/governance/audit/logs${query ? `?${query}` : ''}`)
  },
  verifyAuditChain: () => postJson<AuditChainVerificationResult>('/governance/audit/verify-chain', {}),
  curriculumVersions: (courseId?: string) => {
    const query = courseId ? `?course_id=${courseId}` : ''
    return request<CurriculumVersion[]>(`/governance/curriculum/versions${query}`)
  },
  createCurriculumBranch: (req: CurriculumBranchRequest) =>
    postJson<CurriculumVersion>('/governance/curriculum/branch', req),

  // Enterprise Integration Hub, Global Command Palette & Activity Stream (Phase 9)
  lmsConnectors: () => request<LMSConnector[]>('/integrations/lms'),
  triggerLmsSync: (id: string) => postJson<LMSConnector>(`/integrations/lms/${id}/sync`, {}),
  hrisConnectors: () => request<HRISConnector[]>('/integrations/hris'),
  ingestXapi: (stmt: XAPIStatement) => postJson<any>('/integrations/xapi/ingest', stmt),
  activityStream: (limit?: number) => {
    const query = limit ? `?limit=${limit}` : ''
    return request<ActivityStreamEvent[]>(`/activity/stream${query}`)
  },
  activityPresence: () => request<PresenceSession[]>('/activity/presence'),
  searchGlobal: (q: string) => request<GlobalSearchResult[]>(`/search/global?q=${encodeURIComponent(q)}`),

  // Dynamic Scoring Rules & Control Center (Phase 10)
  systemHealth: () => request<SystemHealthStatus>('/control-center/health'),
  scoringRules: () => request<ScoringRuleConfig[]>('/control-center/scoring-rules'),
  updateScoringRule: (rule: ScoringRuleConfig) =>
    postJson<ScoringRuleConfig>('/control-center/scoring-rules', rule),
  featureFlags: () => request<Record<string, boolean>>('/control-center/feature-flags'),
  updateFeatureFlags: (flags: Record<string, boolean>) =>
    postJson<Record<string, boolean>>('/control-center/feature-flags', { flags }),
}









