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
