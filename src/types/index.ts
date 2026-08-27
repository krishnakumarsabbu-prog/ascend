export type RoleId = 'EARLY_TALENT' | 'MENTOR_COACH' | 'ENGINEERING_EXCELLENCE_COMMITTEE' | 'SENIOR_LEADER_SPONSOR' | 'TECHNOLOGY_HEAD'
export type Standing = 'ON_TRACK' | 'FAST_TRACK' | 'AT_RISK' | 'BLOCKED'
export type MilestoneStatus = 'COMPLETED' | 'CURRENT' | 'UPCOMING' | 'AT_RISK' | 'BLOCKED'
export type AssessmentStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED'

export interface Role { id: RoleId; name: string; description: string; scope: string }
export interface User { id: string; name: string; email: string; role: RoleId; title: string; team?: string; avatar_initials: string }
export interface Associate { id: string; user_id: string; name: string; email: string; title: string; team_id: string; team_name: string; cohort: string; standing: Standing; pathway_code: string; current_month: number; start_date: string; mentor_id?: string; mentor_name?: string; sponsor_id?: string; sponsor_name?: string }
export interface AssociatePathway { pathway_id: string; code: string; name: string; status: string; progress: number; started_at: string; target_completion: string }
export interface AssociateAssessment { id: string; associate_id: string; assessment_id: string; assessment_title: string; status: AssessmentStatus; score?: number; attempted_at?: string; completed_at?: string }
export interface AssociateASMMilestone { id: string; associate_id: string; milestone_id: string; code: string; title: string; phase: string; status: MilestoneStatus; target_week: number; credits: number; fork?: string; environment?: string; started_at?: string; completed_at?: string }
export interface CreditEntry { id: string; associate_id: string; source: string; description: string; amount: number; balance_after: number; awarded_at: string }
export interface Course { id: string; code: string; title: string; track: string; level: string; duration_weeks: number; description: string; credits: number }
export interface ASMMilestone { id: string; code: string; title: string; phase: string; description: string; target_week: number; credits: number; status: MilestoneStatus; fork?: string; environment?: string }
export interface ProgressSegment { label: string; value: number; target: number; status: string }
export interface NextAction { id: string; title: string; detail: string; due: string; priority: string; kind: string }
export interface MonthProgress { month: number; label: string; status: MilestoneStatus; milestone?: string; credits: number }
export interface DashboardData { associate: Associate; current_month: number; pathway: AssociatePathway; overall_progress: number; assessment_progress: number; asm_progress: number; credits_earned: number; credits_target: number; next_milestone?: AssociateASMMilestone; readiness: number; standing: Standing; progress_segments: ProgressSegment[]; next_actions: NextAction[]; month_progress: MonthProgress[]; recent_credits: CreditEntry[]; assessments: AssociateAssessment[] }

// Phase 2 — Curriculum + Assessment Platform
export type Tier = 'Basic' | 'Novice' | 'Apprentice' | 'Expert' | 'Master'

export interface CurriculumCourse { id: string; code: string; name: string; domain: string; difficulty: string; progress: number; assessment: string; credits: number; status: string }
export interface QuestionOption { id: string; text: string }
export interface Question { id: string; course_id: string; tier: Tier; question: string; options: QuestionOption[]; correct_answer: string; explanation: string; domain: string }
export interface AttemptQuestion { id: string; tier: Tier; question: string; options: QuestionOption[]; domain: string }
export interface AttemptSummary { id: string; course_id: string; course_code: string; course_name: string; associate_id: string; status: string; started_at: string; time_limit_minutes: number; total_questions: number; answered: number; marked_for_review: number; current_index: number; answers: Record<string, string>; marked: string[] }
export interface DomainScore { domain: string; total: number; correct: number; incorrect: number; skipped: number; percentage: number }
export interface TierPerformance { tier: string; total: number; correct: number; incorrect: number; skipped: number; percentage: number }
export interface PerformanceInsight { strongest_area: string; improvement_area: string; recommended_next_action: string }
export interface AttemptResult { attempt_id: string; course_id: string; course_code: string; course_name: string; associate_id: string; status: string; score: number; correct: number; incorrect: number; skipped: number; total_questions: number; passing_score: number; passed: boolean; gate_status: string; domain_scores: DomainScore[]; tier_performance: TierPerformance[]; insights: PerformanceInsight; completed_at: string }

// Phase 3 — Pathway Selection & Recommendation Engine
export type PathwayCode = 'DE' | 'SE' | 'CSE' | 'IE'
export type AlignmentState = 'ALIGNED' | 'PARTIALLY_ALIGNED' | 'DIVERGENT' | 'PENDING'
export type CommitteeStatus = 'CONFIRMED' | 'OVERRIDE' | 'REQUEST_REVIEW'

export interface PathwayInfo { id: string; code: string; name: string; description: string; focus: string; duration_months: number; total_credits: number }
export interface SkillContribution { skill: string; domain: string; percentage: number; weight: number; contribution: number }
export interface PathwayScore { pathway_code: string; pathway_name: string; score: number; normalized_score: number; confidence: number; rank: number; contributing_skills: SkillContribution[] }
export interface AssessmentPerformance { assessment_id: string; assessment_title: string; status: string; score?: number; domain: string }
export interface MentorReview { associate_id: string; mentor_id: string; mentor_name: string; recommended_pathway: string; confidence: number; strengths: string; concerns: string; comments: string; submitted_at: string }
export interface Reconciliation { system_recommendation: string; mentor_recommendation: string | null; alignment: AlignmentState; reason: string }
export interface PathwayRecommendation {
  associate_id: string
  associate_name: string
  assessment_performance: AssessmentPerformance[]
  ranked_pathways: PathwayScore[]
  system_recommendation: PathwayScore
  weights: { domain_weights: Record<string, Record<string, number>>; domain_scale: Record<string, number> }
  generated_at: string
  mentor_review: MentorReview | null
  reconciliation: Reconciliation
}
export interface PathwayHistoryEntry { id: string; associate_id: string; system_recommendation: string; mentor_recommendation: string | null; committee_decision: string; reason: string; timestamp: string; status: CommitteeStatus }

// Phase 4 — ASM Milestone Journey + Commissioning Path
export type ASMMilestoneStatus = 'COMPLETED' | 'CURRENT' | 'UPCOMING' | 'AT_RISK' | 'BLOCKED' | 'WAIVED'
export type ASMReviewDecision = 'APPROVED' | 'REQUEST_CHANGES' | 'REJECTED'
export interface ASMSkillMaturity { skill: string; domain: string; maturity: number }
export interface ASMEvidence { id: string; milestone_id: string; associate_id: string; description: string; artifact_url: string; submitted_at: string }
export interface ASMReview { id: string; milestone_id: string; associate_id: string; mentor_id: string; mentor_name: string; decision: ASMReviewDecision; comments: string; reviewed_at: string }
export interface ASMDetail { id: string; code: string; title: string; phase: string; month: number; credits: number; status: ASMMilestoneStatus; objective: string; skills_evaluated: string[]; prerequisites: string[]; expected_outcome: string; assessment_criteria: string[]; mentor: string; skill_maturity: ASMSkillMaturity[]; evidence: ASMEvidence[]; review: ASMReview | null; fork?: string; environment?: string; started_at?: string; completed_at?: string }
export interface AssociateASMDetail { associate_id: string; associate_name: string; milestones: ASMDetail[]; credits_earned: number; credits_target: number; current_month: number; overall_progress: number }
export interface CommissioningStep { id: string; label: string; kind: string; status: string; month?: number; milestone_code?: string; credits?: number }
export interface CommissioningPath { associate_id: string; associate_name: string; steps: CommissioningStep[]; commission_ready: boolean; readiness: number; completed_steps: number; total_steps: number }

export type MentorRisk = 'ON_TRACK' | 'AT_RISK' | 'NEEDS_ATTENTION'
export interface MentorMentee { id: string; name: string; title: string; email: string; pathway: string; pathway_name: string; current_month: number; readiness: number; assessment_score: number; asm_progress: number; pending_requests: number; risk: MentorRisk }
export interface DevelopmentGoal { id: string; associate_id: string; goal: string; description: string; priority: string; target_month: number; status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'AT_RISK'; updated_at: string }
export interface MenteeProfile { profile: Associate; progress: { overall: number; assessment: number; asm: number }; assessment: AssociateAssessment[]; pathway: AssociatePathway | null; asm: ASMDetail[]; credits: CreditEntry[]; development_plan: DevelopmentGoal[]; mentor_notes: { id: string; author: string; text: string; created_at: string }[] }
export interface Waiver { id: string; associate_id: string; associate: string; current_milestone: string; eligible_course: string; system_recommendation: string; reason: string; mentor_recommendation: 'RECOMMEND' | 'DO_NOT_RECOMMEND' | null; status: 'PENDING_REVIEW' | 'MENTOR_RECOMMENDED' | 'MENTOR_DECLINED'; history: { label: string; detail: string; date: string }[] }

export type GovernanceStatus = 'LIVE' | 'DRAFT' | 'DEACTIVATED' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'MORE_INFO'
export type DifficultyClass = 'Too Easy' | 'Balanced' | 'Too Difficult'
export interface GovernanceOverview { total_associates: number; assessment_progress: number; pathway_distribution: { label: string; value: number; color: string }[]; asm_completion: number; at_risk: number; pending_waivers: number; commission_ready: number; audit_events: { title: string; detail: string; time: string; tone: string }[] }
export interface QuestionBankRow { id: string; course: string; tier: Tier; question_count: number; coverage: number; pass_rate: number; last_rotation: string; live_sample_status: GovernanceStatus; status: GovernanceStatus }
export interface ASMLibraryRow { id: string; code: string; milestone: string; month: number; wf_course: string; rubric_focus: string; credits: number; status: GovernanceStatus }
export interface GovernanceWaiver { id: string; associate: string; course: string; milestone: string; mentor_recommendation: string; system_reason: string; status: GovernanceStatus; history: { label: string; detail: string; date: string }[] }
export interface DifficultyRow { id: string; course: string; tier: Tier; average_score: number; pass_rate: number; difficulty: DifficultyClass; calibration: number }
export interface LedgerAuditRow { id: string; associate: string; date: string; domain: string; instrument: string; level: string; credits: number; source: string; status: GovernanceStatus }

// Phase 7 — Senior Leader Sponsor: Demand & Pipeline Intelligence
export type WorkforceRisk = 'Healthy' | 'Watch' | 'High Demand' | 'Critical Shortfall'

export interface OpenRole { title: string; pathway: string; skill_level: string; priority: string; target_month: number }
export interface ReadyAssociate { id: string; name: string; pathway: string; readiness: number; current_month: number; standing: string }
export interface TeamPipeline {
  id: string
  name: string
  lead: string
  focus: string
  demand: number
  ready: number
  shortfall: number
  readiness: number
  risk: WorkforceRisk
  pathway_demand: Record<string, number>
  open_roles: OpenRole[]
  ready_associates: ReadyAssociate[]
}
export interface DemandOverview {
  total_demand: number
  total_ready: number
  total_shortfall: number
  readiness: number
  team_count: number
  risk_distribution: Record<WorkforceRisk, number>
  teams: TeamPipeline[]
}
export interface DemandTeamSummary { id: string; name: string; lead: string; focus: string; open_role_count: number }
export interface PipelineOverview { total_demand: number; total_ready: number; total_shortfall: number; teams: TeamPipeline[] }
export interface Recommendation {
  id: string
  team: string
  priority: 'P0' | 'P1' | 'P2' | 'P3'
  action: string
  detail: string
  impact: 'High' | 'Medium' | 'Low'
}
export interface SponsoredASM {
  id: string
  associate_id: string
  associate_name: string
  business_team: string
  asm_code: string
  asm_title: string
  skills: string[]
  pipeline: string
  demand_impact: number
  target_month: number
  priority: string
}

export interface BankCoverageRow {
  id: string
  course: string
  basic: number
  novice: number
  apprentice: number
  expert: number
  master: number
  total: number
  live_sample_status: string
}

export interface AdminQuestionRow {
  id: string
  number: number
  question: string
  correct_answer: string
}

export interface TechHeadReadinessRow {
  id: string
  associate: string
  track: string
  d2_level: string
  d2_status: 'green' | 'red'
  d3_level: string
  d3_status: 'green' | 'red'
}

export interface SponsorApproval {
  id: string
  associate_id: string
  associate_name: string
  type: string
  requested_date: string
  cohort: string
  target_team: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
}

export interface ArchitectDefense {
  id: string
  associate_id: string
  associate_name: string
  milestone: string
  topic: string
  panel: string
  date: string
  status: string
  stream: string
  score?: number | null
}

export interface AlreadyForkedCandidate {
  id: string
  name: string
  detail: string
  initials: string
}

export interface TestCase {
  id: string
  input_data: string
  expected_output: string
  is_hidden: boolean
  explanation?: string
}

export interface TestCaseResult {
  test_case_id: string
  status: 'PASSED' | 'FAILED' | 'RUNTIME_ERROR' | 'TIMEOUT'
  input_data: string
  expected_output: string
  actual_output: string
  is_hidden: boolean
  stdout?: string
  stderr?: string
  execution_time_ms: number
  memory_used_mb: number
}

export interface CodingChallenge {
  id: string
  title: string
  slug: string
  difficulty: 'EASY' | 'MEDIUM' | 'HARD'
  domain: string
  points: number
  credits_reward: number
  time_limit_minutes: number
  pass_percentage: number
  description: string
  input_format: string
  output_format: string
  constraints: string[]
  starter_code: Record<string, string>
  test_cases: TestCase[]
  tags: string[]
}

export interface CodeExecutionResponse {
  challenge_id: string
  language: string
  overall_status: 'ACCEPTED' | 'WRONG_ANSWER' | 'RUNTIME_ERROR' | 'COMPILATION_ERROR'
  total_test_cases: number
  passed_test_cases: number
  execution_time_ms: number
  memory_used_mb: number
  results: TestCaseResult[]
  stdout_summary: string
}

export interface CodeSubmissionResponse {
  submission_id: string
  associate_id: string
  challenge_id: string
  status: 'ACCEPTED' | 'REJECTED'
  score: number
  credits_awarded: number
  total_test_cases: number
  passed_test_cases: number
  execution_time_ms: number
  memory_used_mb: number
  submitted_at: string
  feedback: string
}

export interface CreateUserPayload {
  name: string
  email: string
  role: RoleId
  title: string
  avatar_initials?: string
  cohort?: string
  team_name?: string
  pathway_code?: string
  mentor_id?: string
  sponsor_id?: string
  current_month?: number
  standing?: Standing
}

export interface UpdateUserPayload {
  name?: string
  email?: string
  role?: RoleId
  title?: string
  avatar_initials?: string
  team_name?: string
  pathway_code?: string
  mentor_id?: string
  sponsor_id?: string
  standing?: Standing
}


export interface CreateCoursePayload {
  code: string
  title: string
  description: string
  focus: string
  domain?: string
  tier?: string
  duration_weeks?: number
  target_week?: number
  credits?: number
  prerequisites?: string[]
  modules?: string[]
}

export interface UpdateCoursePayload {
  title?: string
  description?: string
  focus?: string
  domain?: string
  tier?: string
  duration_weeks?: number
  target_week?: number
  credits?: number
  prerequisites?: string[]
  modules?: string[]
}

export interface CreateQuestionPayload {
  course_id: string
  tier: string
  question_text: string
  options: string[]
  correct_option_index: number
  explanation?: string
  competency?: string
  domain?: string
}

export interface CreateCodingChallengePayload {
  title: string
  slug: string
  difficulty: 'EASY' | 'MEDIUM' | 'HARD'
  domain: string
  points?: number
  credits_reward?: number
  time_limit_minutes?: number
  description: string
  input_format: string
  output_format: string
  constraints: string[]
  starter_code: Record<string, string>
  test_cases: TestCase[]
  tags?: string[]
}

// ---------------------------------------------------------------------------
// Skills Intelligence Platform Types (Phase 1)
// ---------------------------------------------------------------------------

export type CompetencyLevel = 'L0 — Awareness' | 'L1 — Beginner' | 'L2 — Practitioner' | 'L3 — Advanced' | 'L4 — Expert'
export type SkillPriority = 'Critical' | 'High' | 'Medium' | 'Low'
export type SkillConfidence = 'HIGH' | 'MEDIUM' | 'LOW'
export type SkillEvidenceSource = 'Assessment' | 'Coding' | 'Project' | 'Mentor' | 'Architecture' | 'PR' | 'Certification'

export interface SkillItem {
  id: string
  code: string
  name: string
  category: string
  description: string
  target_score: number
  target_level: string
  business_importance: string
  icon?: string
}

export interface SkillTaxonomyCategory {
  category: string
  description: string
  skills: SkillItem[]
}

export interface SkillEvidenceDetail {
  id: string
  source: SkillEvidenceSource | string
  title: string
  score: number
  weight: number
  confidence: SkillConfidence | string
  date: string
  url?: string
  details?: string
}

export interface EvidenceBreakdown {
  assessment: number
  coding: number
  project: number
  mentor: number
  architecture: number
}

export interface AssociateSkill {
  skill_id: string
  name: string
  category: string
  current_score: number
  current_level: string
  target_score: number
  target_level: string
  gap: number
  confidence: SkillConfidence | string
  evidence_count: number
  last_evaluated: string
  evidence_breakdown: EvidenceBreakdown
  evidence_items: SkillEvidenceDetail[]
  recommended_learning: string
}

export interface AssociateSkillProfile {
  associate_id: string
  associate_name: string
  overall_competency: number
  total_skills: number
  strong_skills_count: number
  gaps_count: number
  category_scores: Record<string, number>
  skills: AssociateSkill[]
}

export interface SkillGap {
  skill_id: string
  skill_name: string
  category: string
  current_level: string
  required_level: string
  current_score: number
  required_score: number
  gap: number
  business_importance: string
  priority: SkillPriority | string
  recommended_course: string
  recommended_challenge: string
  recommended_project: string
  expected_completion_time: string
}

export interface PersonalizedLearningItem {
  id: string
  rank: number
  title: string
  category: string
  reason: string
  skill_name: string
  gap_points: number
  action_type: 'Course' | 'Challenge' | 'Architecture Practice' | 'Mentor Checkin' | string
  action_url: string
  difficulty: string
  estimated_hours: number
}

// ---------------------------------------------------------------------------
// AI Talent Intelligence Platform Types (Phase 2)
// ---------------------------------------------------------------------------

export interface AIReadinessBreakdown {
  associate_id: string
  associate_name: string
  overall: number
  technical: number
  architecture: number
  cloud: number
  production: number
  leadership: number
  commissioning_ready: boolean
  readiness_tier: string
  trajectory: string
  last_updated: string
}

export interface RiskIndicator {
  id: string
  label: string
  probability: number
  level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | string
  explanation: string
  primary_factor: string
  action_suggestion: string
}

export interface AIReadinessPrediction {
  associate_id: string
  associate_name: string
  readiness_breakdown: AIReadinessBreakdown
  predicted_commission_date: string
  graduation_readiness_probability: number
  at_risk_probability: number
  risk_indicators: RiskIndicator[]
  score_change_explanation: string
  historical_trajectory: Record<string, number>[]
}

export interface AICoachChatMessage {
  id: string
  sender: 'user' | 'assistant'
  text: string
  timestamp: string
  suggested_prompts?: string[]
  action_links?: { label: string; url: string }[]
  key_takeaways?: string[]
}

export interface AIMentorBrief {
  associate_id: string
  associate_name: string
  cohort: string
  pathway: string
  status: 'NEEDS_ATTENTION' | 'ON_TRACK' | 'FAST_TRACK' | string
  overall_readiness: number
  primary_concern: string
  evidence_summary: Record<string, string>
  recommended_actions: string[]
  talking_points: string[]
  generated_at: string
}

export interface AIExecutiveQueryResult {
  query: string
  answer_markdown: string
  key_metrics: { label: string; value: string }[]
  recommended_decisions: string[]
  affected_cohorts: string[]
  generated_at: string
}

// ---------------------------------------------------------------------------
// Configurable Workflow Engine & SLA Escalation Types (Phase 3)
// ---------------------------------------------------------------------------

export type WorkflowNodeType =
  | 'START'
  | 'APPROVAL'
  | 'REVIEW'
  | 'DECISION'
  | 'CONDITION'
  | 'NOTIFICATION'
  | 'ASSIGNMENT'
  | 'ESCALATION'
  | 'END'

export interface WorkflowNode {
  id: string
  label: string
  type: WorkflowNodeType | string
  role: RoleId | string
  sla_hours: number
  warning_hours: number
  escalation_role?: RoleId | string
  config?: Record<string, string>
  position_x: number
  position_y: number
}

export interface WorkflowEdge {
  id: string
  source: string
  target: string
  label?: string
  condition?: string
}

export interface WorkflowDefinition {
  id: string
  code: string
  name: string
  description: string
  category: 'WAIVER' | 'PATHWAY' | 'FAST_TRACK' | 'PROMOTION' | 'COMMISSIONING' | 'ARCHITECT_BOARD' | string
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
  is_active: boolean
  version: number
  updated_at: string
}

export interface WorkflowHistoryEntry {
  id: string
  step_id: string
  step_name: string
  actor_id: string
  actor_name: string
  actor_role: string
  action: 'SUBMIT' | 'APPROVE' | 'REJECT' | 'REQUEST_REWORK' | 'ESCALATE' | 'DELEGATE' | string
  decision_reason: string
  comments: string
  timestamp: string
  sla_met: boolean
}

export interface WorkflowInstance {
  id: string
  workflow_id: string
  workflow_code: string
  workflow_name: string
  associate_id: string
  associate_name: string
  current_step_id: string
  current_step_name: string
  current_assignee_role: string
  status: 'PENDING' | 'IN_REVIEW' | 'APPROVED' | 'REJECTED' | 'REWORK' | 'ESCALATED' | string
  created_at: string
  due_date: string
  sla_hours: number
  sla_status: 'HEALTHY' | 'WARNING' | 'BREACHED_ESCALATED' | string
  history: WorkflowHistoryEntry[]
  payload: Record<string, string>
}

export interface WorkflowTransitionRequest {
  instance_id: string
  action: 'APPROVE' | 'REJECT' | 'REQUEST_REWORK' | 'ESCALATE' | 'DELEGATE'
  actor_id?: string
  actor_name?: string
  actor_role?: string
  comments?: string
  reason?: string
  delegate_to?: string
}

export interface SLADashboardMetrics {
  total_active: number
  within_sla: number
  warning_count: number
  breached_count: number
  average_cycle_time_hours: number
  recent_escalations: WorkflowInstance[]
}

export interface NotificationItem {
  id: string
  user_id: string
  title: string
  message: string
  channel: 'IN_APP' | 'EMAIL' | 'TEAMS' | 'SLACK' | string
  event_type: string
  is_read: boolean
  urgency: 'NORMAL' | 'WARNING' | 'CRITICAL' | string
  created_at: string
  action_url?: string
  metadata?: Record<string, string>
}

export interface NotificationTemplate {
  id: string
  event_type: string
  name: string
  subject_template: string
  body_template: string
  default_channels: string[]
}

// ---------------------------------------------------------------------------
// Adaptive Testing & Assessment Integrity Engine Types (Phase 4)
// ---------------------------------------------------------------------------

export interface Choice {
  id: string
  text: string
}

export interface AdaptiveQuestion {
  id: string
  course_id: string
  title: string
  prompt: string
  choices: Choice[]
  correct_choice_id: string
  explanation: string
  domain?: string
  difficulty?: string
}

export interface AdaptiveTestSession {
  session_id: string
  associate_id: string
  course_id: string
  course_title: string
  current_theta: number
  current_sem: number
  questions_answered: number
  max_questions: number
  target_sem_stop: number
  is_completed: boolean
  ability_history: number[]
  current_question?: AdaptiveQuestion | null
  domain_breakdown: Record<string, number>
}

export interface AdaptiveAnswerSubmit {
  session_id: string
  question_id: string
  selected_choice_id: string
  time_spent_seconds?: number
  tab_switches_during_item?: number
  copy_paste_events?: number
}

export interface AdaptiveAnswerResult {
  is_correct: boolean
  correct_choice_id: string
  updated_theta: number
  updated_sem: number
  ability_trajectory: 'INCREASING' | 'STEADY' | 'DECREASING' | string
  is_completed: boolean
  final_grade?: string
  next_question?: AdaptiveQuestion | null
  explanation: string
  proctoring_flagged: boolean
}

export interface PsychometricStats {
  p_value: number
  discrimination_index: number
  avg_response_time_seconds: number
  exposure_count: number
  distractor_frequencies?: Record<string, number>
}

export interface QuestionVersionChangelog {
  version: number
  author: string
  change_summary: string
  timestamp: string
}

export interface GovernanceQuestion {
  id: string
  code: string
  title: string
  prompt: string
  domain: string
  difficulty: 'L100' | 'L200' | 'L300' | 'L400' | string
  status: 'DRAFT' | 'IN_REVIEW' | 'ACTIVE' | 'RETIRED' | 'ARCHIVED' | string
  version: number
  author: string
  reviewer?: string
  irt_b_difficulty: number
  irt_a_discrimination: number
  psychometrics: PsychometricStats
  changelog: QuestionVersionChangelog[]
  choices: Choice[]
  correct_choice_id: string
  explanation: string
}

export interface ProctoringViolation {
  id: string
  event_type: 'TAB_BLUR' | 'COPY_PASTE' | 'VELOCITY_ANOMALY' | 'DUAL_DISPLAY' | string
  description: string
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | string
  timestamp: string
}

export interface ProctoringTelemetry {
  session_id: string
  associate_id: string
  tab_switch_count: number
  copy_paste_count: number
  window_blur_duration_seconds: number
  keystroke_typing_wpm: number
  submission_velocity_anomaly: boolean
  integrity_score: number
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | string
  violations: ProctoringViolation[]
}

// ---------------------------------------------------------------------------
// Advanced ASM Project Lifecycle & Digital Credentials (Phase 5)
// ---------------------------------------------------------------------------

export interface ASMRubricScore {
  criterion: 'ARCHITECTURE_DESIGN' | 'CODE_QUALITY_TESTING' | 'PRODUCTION_OBSERVABILITY' | 'DEFENSE_PRESENTATION' | 'BUSINESS_IMPACT' | string
  criterion_label: string
  weight: number
  score: number
  comments?: string
}

export interface ASMPanelMember {
  examiner_id: string
  examiner_name: string
  examiner_role: 'LEAD_ARCHITECT' | 'SRE_LEAD' | 'SECURITY_CHAMPION' | 'SPONSOR' | string
  rubric_scores: ASMRubricScore[]
  overall_score: number
  recommendation: 'APPROVED' | 'APPROVED_WITH_CONDITIONS' | 'REWORK_REQUIRED' | string
  deliberation_notes: string
  signed_at?: string | null
}

export interface ASMArtifacts {
  pr_url: string
  rfc_doc_url: string
  chaos_experiment_summary: string
  benchmark_p99_latency_ms: number
  benchmark_throughput_tps: number
  security_scan_passed: boolean
  security_vulnerabilities_found: number
  deployment_manifest_url: string
}

export interface ASMProjectLifecycle {
  id: string
  project_code: string
  project_title: string
  associate_id: string
  associate_name: string
  pathway: string
  current_stage: 'SCOPING' | 'RFC_REVIEW' | 'IMPLEMENTATION' | 'AUTOMATED_VERIFICATION' | 'PEER_REVIEW' | 'BOARD_DEFENSE' | 'PRODUCTION_GATE' | 'ARCHIVED' | string
  started_at: string
  target_completion: string
  artifacts: ASMArtifacts
  panel_examiners: ASMPanelMember[]
  composite_score: number
  status: 'IN_PROGRESS' | 'DEFENDED' | 'PRODUCTION_READY' | 'REWORK' | string
}

export interface DigitalCredential {
  id: string
  credential_code: string
  title: string
  badge_tier: 'FOUNDATIONAL' | 'PRACTITIONER' | 'SPECIALIST' | 'ARCHITECT' | 'MASTER' | string
  associate_id: string
  associate_name: string
  issue_date: string
  expiry_date?: string | null
  verification_hash_sha256: string
  public_verification_url: string
  skills_verified: string[]
  evidence_summary: Record<string, string>
  issuing_authority: string
  status: 'ACTIVE' | 'REVOKED' | string
  qr_code_data: string
}

export interface IssueCredentialRequest {
  associate_id: string
  title: string
  badge_tier?: 'FOUNDATIONAL' | 'PRACTITIONER' | 'SPECIALIST' | 'ARCHITECT' | 'MASTER' | string
  skills_verified: string[]
  evidence_summary: Record<string, string>
}

// ---------------------------------------------------------------------------
// Internal Talent Marketplace & Strategic Workforce Planning (Phase 6)
// ---------------------------------------------------------------------------

export interface MarketplaceProject {
  id: string
  title: string
  business_unit: string
  team: string
  technical_stack: string[]
  target_competency_tier: 'L100' | 'L200' | 'L300' | 'L400' | string
  allocation_percentage: number
  duration_weeks: number
  mentorship_available: boolean
  business_impact: string
  open_seats: number
  status: 'OPEN' | 'FILLED' | 'COMPLETED' | string
  posted_by: string
  created_at: string
}

export interface MarketplaceApplication {
  id: string
  project_id: string
  project_title: string
  associate_id: string
  associate_name: string
  pathway: string
  match_score: number
  match_breakdown: Record<string, number>
  candidate_pitch: string
  status: 'APPLIED' | 'SHORTLISTED' | 'INTERVIEW_SCHEDULED' | 'OFFERED' | 'COMMISSIONED' | string
  applied_at: string
}

export interface MarketplaceApplyRequest {
  project_id: string
  associate_id: string
  candidate_pitch?: string
}

export interface WorkforceScenarioRequest {
  scenario_name: string
  cohort_intake_delta: number
  ai_shift_percentage: number
  accelerated_weeks: number
  simulated_attrition_rate: number
}

export interface WorkforceQuarterPipeline {
  quarter: string
  intake: number
  in_training: number
  production_ready: number
  demand_met_pct: number
}

export interface WorkforceScenarioResult {
  scenario_name: string
  projected_graduates: number
  projected_avg_readiness: number
  domain_surplus_deficit: Record<string, number>
  timeline_weeks: number
  quarterly_pipeline: WorkforceQuarterPipeline[]
}

// ---------------------------------------------------------------------------
// Executive Analytics, Custom Dashboard Builder & Reporting (Phase 7)
// ---------------------------------------------------------------------------

export interface AnalyticsKPI {
  metric_key: string
  label: string
  value: number
  formatted_value: string
  unit: string
  change_pct_30d: number
  trend_direction: 'UP' | 'DOWN' | 'STABLE' | string
  category: 'EXECUTIVE' | 'COHORT' | 'SKILL' | 'INTEGRITY' | string
}

export interface ExecutiveAnalyticsData {
  executive_kpis: AnalyticsKPI[]
  cohort_progress: Array<{
    cohort_name: string
    enrolled: number
    readiness_avg: number
    passed_gates: number
    at_risk: number
    commissioned_pct: number
  }>
  skill_health_matrix: Array<{
    domain: string
    health_score: number
    top_skill: string
    critical_gap: string
    l4_masters: number
  }>
  assessment_integrity_metrics: {
    overall_integrity_score: number
    total_adaptive_tests_delivered: number
    cat_stopping_accuracy_met_pct: number
    flagged_proctoring_anomalies_pct: number
    avg_response_time_seconds: number
  }
  time_series_velocity: Array<{
    day: string
    se_velocity: number
    ai_velocity: number
    avg_readiness: number
  }>
}

export interface DashboardWidgetConfig {
  id: string
  widget_type: 'KPI_CARD' | 'RADIAL_GAUGE' | 'TIME_SERIES' | 'SKILL_RADAR' | 'FUNNEL_CHART' | 'HEATMAP_MATRIX' | 'LEADERBOARD' | 'RISK_TICKER' | string
  title: string
  size: '1x1' | '2x1' | '2x2' | 'full' | string
  metric_source: string
  config?: Record<string, any>
}

export interface CustomDashboardLayout {
  id: string
  title: string
  role: string
  is_default: boolean
  widgets: DashboardWidgetConfig[]
  created_at: string
  updated_at: string
}

export interface ScheduledReport {
  id: string
  title: string
  report_type: 'COHORT_PROGRESS' | 'EXECUTIVE_BRIEF' | 'SKILL_GAP' | 'INTEGRITY_SUMMARY' | 'COMMISSIONING_PACKAGE' | string
  frequency: 'DAILY' | 'WEEKLY' | 'BI_WEEKLY' | 'MONTHLY' | 'QUARTERLY' | string
  delivery_channels: string[]
  recipients: string[]
  format: 'PDF' | 'EXCEL' | 'PPTX' | string
  next_run: string
  last_sent: string
  is_active: boolean
}

export interface GenerateReportRequest {
  report_type: string
  format?: 'PDF' | 'EXCEL' | 'PPTX' | string
  time_range_days?: number
  cohort_id?: string
}

// ---------------------------------------------------------------------------
// Data Governance, Metric Lineage & Audit Center (Phase 8)
// ---------------------------------------------------------------------------

export interface MetricLineageNode {
  id: string
  name: string
  category: 'RAW_EVENT' | 'INTERMEDIATE_INDICATOR' | 'PILLAR_SCORE' | 'COMPOSITE_METRIC' | string
  formula_latex: string
  input_sources: string[]
  current_value: number
  formatted_value: string
  update_frequency: string
  owner: string
  sensitivity_weight: number
  parent_node_ids: string[]
}

export interface AuditLogEvent {
  id: string
  timestamp: string
  actor_id: string
  actor_name: string
  actor_role: string
  ip_address: string
  action: 'CREATE' | 'UPDATE' | 'APPROVE' | 'REJECT' | 'OVERRIDE' | 'EXPORT' | 'SECURITY_EVENT' | string
  resource_type: string
  resource_id: string
  resource_name: string
  severity: 'INFO' | 'WARNING' | 'SECURITY_EVENT' | 'COMPLIANCE_VIOLATION' | string
  before_state?: Record<string, any> | null
  after_state?: Record<string, any> | null
  hash_chain_sha256: string
}

export interface AuditChainVerificationResult {
  total_events_checked: number
  chain_valid: boolean
  root_hash: string
  latest_block_hash: string
  tamper_detected: boolean
  verified_at: string
}

export interface CurriculumVersion {
  id: string
  course_id: string
  course_code: string
  course_title: string
  version: string
  branch_name: string
  status: 'DRAFT' | 'IN_REVIEW' | 'ACTIVE' | 'DEPRECATED' | 'ARCHIVED' | string
  author: string
  approved_by?: string | null
  changelog_summary: string
  modules_count: number
  learning_objectives_diff: string[]
  assigned_cohorts: string[]
  created_at: string
}

export interface CurriculumBranchRequest {
  course_id: string
  base_version: string
  new_branch_name: string
  changelog_summary: string
  author: string
}

// ---------------------------------------------------------------------------
// Enterprise Integration Hub, Global Command Palette & Activity Stream (Phase 9)
// ---------------------------------------------------------------------------

export interface LMSConnector {
  id: string
  provider: 'COURSERA' | 'PLURALSIGHT' | 'DEGREED' | 'UDEMY' | 'SCORM_XAPI' | string
  name: string
  status: 'CONNECTED' | 'SYNCING' | 'ERROR' | 'PAUSED' | string
  sync_frequency: string
  last_synced_at: string
  total_records_synced: number
  health_score: number
  credentials_masked: string
}

export interface HRISConnector {
  id: string
  provider: 'WORKDAY' | 'SUCCESSFACTORS' | 'GREENHOUSE' | 'LEVER' | string
  name: string
  status: 'CONNECTED' | 'IDLE' | 'SYNCING' | string
  sync_direction: 'BIDIRECTIONAL' | 'INBOUND_ATS' | 'OUTBOUND_HRIS' | string
  last_synced_at: string
  active_pipeline_count: number
}

export interface XAPIStatement {
  actor_email: string
  verb: string
  activity_id: string
  activity_name: string
  score_scaled?: number
  mapped_skill_id?: string
}

export interface ActivityStreamEvent {
  id: string
  timestamp: string
  event_type: 'ASSESSMENT_SUBMITTED' | 'CODE_EXECUTED' | 'DEFENSE_RATIFIED' | 'CREDENTIAL_ISSUED' | 'GIG_APPLIED' | 'WORKFLOW_ESCALATED' | string
  actor_id: string
  actor_name: string
  actor_avatar?: string
  description: string
  entity_type: string
  entity_id: string
  severity: 'NORMAL' | 'SUCCESS' | 'WARNING' | string
}

export interface PresenceSession {
  user_id: string
  user_name: string
  role: string
  status: 'ONLINE' | 'IN_ASSESSMENT' | 'IN_DEFENSE_PANEL' | 'IDLE' | string
  current_activity: string
  active_device: string
  last_ping: string
}

export interface GlobalSearchResult {
  id: string
  title: string
  subtitle: string
  category: 'ASSOCIATE' | 'SKILL' | 'COURSE' | 'PROJECT' | 'APPROVAL' | 'PAGE' | 'EXECUTIVE' | string
  url: string
  badge?: string
}

// ---------------------------------------------------------------------------
// Dynamic Scoring Rules & Control Center (Phase 10)
// ---------------------------------------------------------------------------

export interface ScoringRuleConfig {
  id: string
  pathway: 'SOFTWARE_ENGINEERING' | 'AI_ENGINEERING' | 'CLOUD_INFRASTRUCTURE' | 'DATA_ENGINEERING' | string
  technical_weight: number
  architecture_weight: number
  cloud_weight: number
  production_weight: number
  leadership_weight: number
  cat_sem_target: number
  minimum_passing_score: number
  updated_at: string
}

export interface SystemHealthStatus {
  database_status: string
  vector_store_status: string
  irt_engine_latency_ms: number
  lrs_stream_status: string
  uptime_pct: number
  active_feature_flags: Record<string, boolean>
}

export interface FeatureFlagUpdate {
  flags: Record<string, boolean>
}













