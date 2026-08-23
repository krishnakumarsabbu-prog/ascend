export type RoleId = 'EARLY_TALENT' | 'MENTOR_COACH' | 'ENGINEERING_EXCELLENCE_COMMITTEE' | 'SENIOR_LEADER_SPONSOR'
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
