from __future__ import annotations

from datetime import date, datetime
from enum import Enum
from typing import Dict, List, Optional, Any

from pydantic import BaseModel, Field


class Role(str, Enum):
    EARLY_TALENT = "EARLY_TALENT"
    MENTOR_COACH = "MENTOR_COACH"
    ENGINEERING_EXCELLENCE_COMMITTEE = "ENGINEERING_EXCELLENCE_COMMITTEE"
    SENIOR_LEADER_SPONSOR = "SENIOR_LEADER_SPONSOR"
    TECHNOLOGY_HEAD = "TECHNOLOGY_HEAD"


class Standing(str, Enum):
    ON_TRACK = "ON_TRACK"
    FAST_TRACK = "FAST_TRACK"
    AT_RISK = "AT_RISK"
    BLOCKED = "BLOCKED"


class MilestoneStatus(str, Enum):
    COMPLETED = "COMPLETED"
    CURRENT = "CURRENT"
    UPCOMING = "UPCOMING"
    AT_RISK = "AT_RISK"
    BLOCKED = "BLOCKED"


class AssessmentStatus(str, Enum):
    NOT_STARTED = "NOT_STARTED"
    IN_PROGRESS = "IN_PROGRESS"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"


class Course(BaseModel):
    id: str
    code: str
    title: str
    track: str
    level: str
    duration_weeks: int
    description: str
    credits: int


class Assessment(BaseModel):
    id: str
    course_id: str
    title: str
    type: str
    difficulty: str
    duration_minutes: int
    passing_score: int
    description: str


class AssociateAssessment(BaseModel):
    id: str
    associate_id: str
    assessment_id: str
    assessment_title: str
    status: AssessmentStatus
    score: Optional[int] = None
    attempted_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None


class ASMMilestone(BaseModel):
    id: str
    code: str
    title: str
    phase: str
    description: str
    target_week: int
    credits: int
    status: MilestoneStatus
    fork: Optional[str] = None
    environment: Optional[str] = None


class AssociateASMMilestone(BaseModel):
    id: str
    associate_id: str
    milestone_id: str
    code: str
    title: str
    phase: str
    status: MilestoneStatus
    target_week: int
    credits: int
    fork: Optional[str] = None
    environment: Optional[str] = None
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None


class CreditEntry(BaseModel):
    id: str
    associate_id: str
    source: str
    description: str
    amount: int
    balance_after: int
    awarded_at: datetime


class Pathway(BaseModel):
    id: str
    code: str
    name: str
    description: str
    focus: str
    duration_months: int
    total_credits: int
    milestones: List[str] = Field(default_factory=list)


class AssociatePathway(BaseModel):
    pathway_id: str
    code: str
    name: str
    status: str
    progress: float
    started_at: datetime
    target_completion: date
    total_credits: int = 120


class Team(BaseModel):
    id: str
    name: str
    lead: str
    focus: str
    member_count: int


class Associate(BaseModel):
    id: str
    user_id: str
    name: str
    email: str
    title: str
    team_id: str
    team_name: str
    cohort: str
    standing: Standing
    pathway_code: str
    current_month: int
    start_date: date
    mentor_id: Optional[str] = None
    mentor_name: Optional[str] = None
    sponsor_id: Optional[str] = None
    sponsor_name: Optional[str] = None


class User(BaseModel):
    id: str
    name: str
    email: str
    role: Role
    title: str
    team: Optional[str] = None
    avatar_initials: str


class ProgressSegment(BaseModel):
    label: str
    value: float
    target: float
    status: str


class NextAction(BaseModel):
    id: str
    title: str
    detail: str
    due: str
    priority: str
    kind: str


class MonthProgress(BaseModel):
    month: int
    label: str
    status: MilestoneStatus
    milestone: Optional[str] = None
    credits: int = 0


class DashboardData(BaseModel):
    associate: Associate
    current_month: int
    pathway: AssociatePathway
    overall_progress: float
    assessment_progress: float
    asm_progress: float
    credits_earned: int
    credits_target: int
    next_milestone: Optional[AssociateASMMilestone]
    readiness: float
    standing: Standing
    progress_segments: List[ProgressSegment]
    next_actions: List[NextAction]
    month_progress: List[MonthProgress]
    recent_credits: List[CreditEntry]
    assessments: List[AssociateAssessment]


# ---------------------------------------------------------------------------
# Phase 2 — Integrated Curriculum + Technical Assessment Platform
# ---------------------------------------------------------------------------

class Tier(str, Enum):
    BASIC = "Basic"
    NOVICE = "Novice"
    APPRENTICE = "Apprentice"
    EXPERT = "Expert"
    MASTER = "Master"


class CurriculumCourse(BaseModel):
    id: str
    code: str
    name: str
    domain: str
    difficulty: str
    progress: float
    assessment: str
    credits: int
    status: str


class QuestionOption(BaseModel):
    id: str
    text: str


class Question(BaseModel):
    id: str
    course_id: str
    tier: Tier
    question: str
    options: List[QuestionOption]
    correct_answer: str
    explanation: str
    domain: str


class AttemptQuestion(BaseModel):
    id: str
    tier: Tier
    question: str
    options: List[QuestionOption]
    domain: str


class AttemptSummary(BaseModel):
    id: str
    course_id: str
    course_code: str
    course_name: str
    associate_id: str
    status: str
    started_at: datetime
    time_limit_minutes: int
    total_questions: int
    answered: int
    marked_for_review: int
    current_index: int
    answers: dict
    marked: List[str]


class AnswerSubmission(BaseModel):
    question_id: str
    selected_option: str


class DomainScore(BaseModel):
    domain: str
    total: int
    correct: int
    incorrect: int
    skipped: int
    percentage: float


class TierPerformance(BaseModel):
    tier: str
    total: int
    correct: int
    incorrect: int
    skipped: int
    percentage: float


class PerformanceInsight(BaseModel):
    strongest_area: str
    improvement_area: str
    recommended_next_action: str


class AttemptResult(BaseModel):
    attempt_id: str
    course_id: str
    course_code: str
    course_name: str
    associate_id: str
    status: str
    score: int
    correct: int
    incorrect: int
    skipped: int
    total_questions: int
    passing_score: int
    passed: bool
    gate_status: str
    domain_scores: List[DomainScore]
    tier_performance: List[TierPerformance]
    insights: PerformanceInsight
    completed_at: datetime


# ---------------------------------------------------------------------------
# Phase 3 — Pathway Selection & Recommendation Engine
# ---------------------------------------------------------------------------

class PathwayInfo(BaseModel):
    id: str
    code: str
    name: str
    description: str
    focus: str
    duration_months: int
    total_credits: int


class SkillContribution(BaseModel):
    skill: str
    domain: str
    percentage: float
    weight: float
    contribution: float


class PathwayScore(BaseModel):
    pathway_code: str
    pathway_name: str
    score: float
    normalized_score: float
    confidence: float
    rank: int
    contributing_skills: List[SkillContribution]


class AssessmentPerformance(BaseModel):
    assessment_id: str
    assessment_title: str
    status: str
    score: Optional[int] = None
    domain: str


class PathwayRecommendation(BaseModel):
    associate_id: str
    associate_name: str
    assessment_performance: List[AssessmentPerformance]
    ranked_pathways: List[PathwayScore]
    system_recommendation: PathwayScore
    weights: dict
    generated_at: datetime


class MentorReview(BaseModel):
    associate_id: str
    mentor_id: str
    mentor_name: str
    recommended_pathway: str
    confidence: float
    strengths: str
    concerns: str
    comments: str
    submitted_at: datetime


class CommitteeDecision(BaseModel):
    id: str
    associate_id: str
    system_recommendation: str
    mentor_recommendation: str
    committee_decision: str
    reason: str
    timestamp: datetime
    status: str


class Reconciliation(BaseModel):
    system_recommendation: str
    mentor_recommendation: Optional[str]
    alignment: str
    reason: str


class PathwayHistoryEntry(BaseModel):
    id: str
    associate_id: str
    system_recommendation: str
    mentor_recommendation: Optional[str]
    committee_decision: str
    reason: str
    timestamp: datetime
    status: str


# ---------------------------------------------------------------------------
# Phase 4 — ASM Milestone Journey + Commissioning Path
# ---------------------------------------------------------------------------

class ASMMilestoneStatus(str, Enum):
    COMPLETED = "COMPLETED"
    CURRENT = "CURRENT"
    UPCOMING = "UPCOMING"
    AT_RISK = "AT_RISK"
    BLOCKED = "BLOCKED"
    WAIVED = "WAIVED"


class ASMSkillMaturity(BaseModel):
    skill: str
    domain: str
    maturity: float  # 0-1


class ASMReview(BaseModel):
    id: str
    milestone_id: str
    associate_id: str
    mentor_id: str
    mentor_name: str
    decision: str  # APPROVED | REQUEST_CHANGES | REJECTED
    comments: str
    reviewed_at: datetime


class ASMEvidence(BaseModel):
    id: str
    milestone_id: str
    associate_id: str
    description: str
    artifact_url: str
    submitted_at: datetime


class ASMDetail(BaseModel):
    id: str
    code: str
    title: str
    phase: str
    month: int
    credits: int
    status: ASMMilestoneStatus
    objective: str
    skills_evaluated: list[str]
    prerequisites: list[str]
    expected_outcome: str
    assessment_criteria: list[str]
    mentor: str
    skill_maturity: list[ASMSkillMaturity]
    evidence: list[ASMEvidence]
    review: Optional[ASMReview] = None
    fork: Optional[str] = None
    environment: Optional[str] = None
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None


class AssociateASMDetail(BaseModel):
    associate_id: str
    associate_name: str
    milestones: list[ASMDetail]
    credits_earned: int
    credits_target: int
    current_month: int
    overall_progress: float


class CommissioningStep(BaseModel):
    id: str
    label: str
    kind: str  # foundation | gate | pathway | asm | commission
    status: str  # COMPLETED | CURRENT | UPCOMING | BLOCKED
    month: Optional[int] = None
    milestone_code: Optional[str] = None
    credits: Optional[int] = None


class CommissioningPath(BaseModel):
    associate_id: str
    associate_name: str
    steps: list[CommissioningStep]
    commission_ready: bool
    readiness: float
    completed_steps: int
    total_steps: int


class StartASMRequest(BaseModel):
    associate_id: str = "as-ananya"


class SubmitASMRequest(BaseModel):
    associate_id: str = "as-ananya"
    evidence_description: str = ""
    artifact_url: str = ""


class ReviewASMRequest(BaseModel):
    associate_id: str = "as-ananya"
    mentor_id: str = "u-karthik"
    mentor_name: str = "Karthik Iyer"
    decision: str  # APPROVED | REQUEST_CHANGES | REJECTED
    comments: str = ""


class TechHeadReadinessRow(BaseModel):
    id: str
    associate: str
    track: str
    d2_level: str  # e.g. L300, L100, L0, L400
    d2_status: str  # green, red
    d3_level: str  # e.g. L100, L0, L400
    d3_status: str  # green, red


class BankCoverageRow(BaseModel):
    id: str
    course: str
    basic: int = 100
    novice: int = 100
    apprentice: int = 100
    expert: int = 100
    master: int = 100
    total: int = 500
    live_sample_status: str  # "Yes" or "Bank pending"


class AdminQuestionRow(BaseModel):
    id: str
    number: int
    question: str
    correct_answer: str


class SponsorApproval(BaseModel):
    id: str
    associate_id: str
    associate_name: str
    type: str  # "Fast-Track" or "One-Level-Up"
    requested_date: str
    cohort: str
    target_team: str
    status: str  # "PENDING", "APPROVED", "REJECTED"


class ArchitectDefense(BaseModel):
    id: str
    associate_id: str
    associate_name: str
    milestone: str
    topic: str
    panel: str
    date: str
    status: str
    stream: str = "STREAM 04/05"
    score: Optional[float] = None


class DefenseScoreRequest(BaseModel):
    associate_id: str
    milestone_id: Optional[str] = "asm-104"
    score: float


# -- Coding Challenge & HackerRank Execution Models ---------------------------

class TestCase(BaseModel):
    id: str
    input_data: str
    expected_output: str
    is_hidden: bool = False
    explanation: Optional[str] = None


class TestCaseResult(BaseModel):
    test_case_id: str
    status: str  # "PASSED", "FAILED", "RUNTIME_ERROR", "TIMEOUT"
    input_data: str
    expected_output: str
    actual_output: str
    is_hidden: bool = False
    stdout: Optional[str] = None
    stderr: Optional[str] = None
    execution_time_ms: float
    memory_used_mb: float


class CodingChallenge(BaseModel):
    id: str
    title: str
    slug: str
    difficulty: str  # "EASY", "MEDIUM", "HARD"
    domain: str  # "Distributed Systems", "Concurrency", "Algorithms", "AI / Embeddings", "Data Architecture"
    points: int
    credits_reward: int
    time_limit_minutes: int
    pass_percentage: float = 78.5
    description: str
    input_format: str
    output_format: str
    constraints: List[str]
    starter_code: Dict[str, str]  # e.g. {"java": "...", "python": "...", "typescript": "...", "sql": "..."}
    test_cases: List[TestCase]
    tags: List[str]


class CodeExecutionRequest(BaseModel):
    challenge_id: str
    language: str  # "java", "python", "typescript", "sql"
    code: str
    custom_input: Optional[str] = None


class CodeExecutionResponse(BaseModel):
    challenge_id: str
    language: str
    overall_status: str  # "ACCEPTED", "WRONG_ANSWER", "RUNTIME_ERROR", "COMPILATION_ERROR"
    total_test_cases: int
    passed_test_cases: int
    execution_time_ms: float
    memory_used_mb: float
    results: List[TestCaseResult]
    stdout_summary: str


class CodeSubmissionRequest(BaseModel):
    associate_id: str
    challenge_id: str
    language: str
    code: str


class CodeSubmissionResponse(BaseModel):
    submission_id: str
    associate_id: str
    challenge_id: str
    status: str  # "ACCEPTED", "REJECTED"
    score: int
    credits_awarded: int
    total_test_cases: int
    passed_test_cases: int
    execution_time_ms: float
    memory_used_mb: float
    submitted_at: datetime
    feedback: str


# -- Product Authoring & Administration Payloads -------------------------------

class CreateUserPayload(BaseModel):
    name: str
    email: str
    role: Role
    title: str
    avatar_initials: Optional[str] = None
    # If role == EARLY_TALENT
    cohort: Optional[str] = "Cohort 2025"
    team_name: Optional[str] = "Payments Engineering"
    pathway_code: Optional[str] = "SE"
    mentor_id: Optional[str] = "u-priya"
    sponsor_id: Optional[str] = "u-sponsor"
    current_month: Optional[int] = 1
    standing: Optional[Standing] = Standing.ON_TRACK


class UpdateUserPayload(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    role: Optional[Role] = None
    title: Optional[str] = None
    avatar_initials: Optional[str] = None
    team_name: Optional[str] = None
    pathway_code: Optional[str] = None
    mentor_id: Optional[str] = None
    sponsor_id: Optional[str] = None
    standing: Optional[Standing] = None



class CreateCoursePayload(BaseModel):
    code: str
    title: str
    description: str
    focus: str
    domain: str = "D1"  # "D1", "D2", "D3", "D4"
    tier: str = "Apprentice"  # "Basic", "Novice", "Apprentice", "Expert", "Master"
    duration_weeks: int = 4
    target_week: int = 8
    credits: int = 15
    prerequisites: List[str] = Field(default_factory=list)
    modules: List[str] = Field(default_factory=list)


class UpdateCoursePayload(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    focus: Optional[str] = None
    domain: Optional[str] = None
    tier: Optional[str] = None
    duration_weeks: Optional[int] = None
    target_week: Optional[int] = None
    credits: Optional[int] = None
    prerequisites: Optional[List[str]] = None
    modules: Optional[List[str]] = None


class CreateQuestionPayload(BaseModel):
    course_id: str
    tier: str = "Apprentice"
    question_text: str
    options: List[str]
    correct_option_index: int
    explanation: Optional[str] = None
    competency: Optional[str] = None
    domain: Optional[str] = "D1"


class UpdateQuestionPayload(BaseModel):
    question_text: Optional[str] = None
    options: Optional[List[str]] = None
    correct_option_index: Optional[int] = None
    explanation: Optional[str] = None
    competency: Optional[str] = None
    tier: Optional[str] = None


class CreateCodingChallengePayload(BaseModel):
    title: str
    slug: str
    difficulty: str  # "EASY", "MEDIUM", "HARD"
    domain: str
    points: int = 100
    credits_reward: int = 15
    time_limit_minutes: int = 45
    description: str
    input_format: str
    output_format: str
    constraints: List[str]
    starter_code: Dict[str, str]
    test_cases: List[TestCase]
    tags: List[str] = Field(default_factory=list)


# ---------------------------------------------------------------------------
# Skills Intelligence Platform Models (Phase 1)
# ---------------------------------------------------------------------------

class SkillItem(BaseModel):
    id: str
    code: str
    name: str
    category: str
    description: str
    target_score: float = 80.0
    target_level: str = "L3 — Advanced"
    business_importance: str = "High"  # Critical, High, Medium, Low
    icon: Optional[str] = None


class SkillTaxonomyCategory(BaseModel):
    category: str
    description: str
    skills: List[SkillItem]


class SkillEvidenceDetail(BaseModel):
    id: str
    source: str  # Assessment, Coding, Project, Mentor, Architecture, PR, Certification
    title: str
    score: float
    weight: float
    confidence: str  # HIGH, MEDIUM, LOW
    date: str
    url: Optional[str] = None
    details: Optional[str] = None


class EvidenceBreakdown(BaseModel):
    assessment: float
    coding: float
    project: float
    mentor: float
    architecture: float


class AssociateSkill(BaseModel):
    skill_id: str
    name: str
    category: str
    current_score: float
    current_level: str
    target_score: float
    target_level: str
    gap: float
    confidence: str
    evidence_count: int
    last_evaluated: str
    evidence_breakdown: EvidenceBreakdown
    evidence_items: List[SkillEvidenceDetail] = Field(default_factory=list)
    recommended_learning: str


class AssociateSkillProfile(BaseModel):
    associate_id: str
    associate_name: str
    overall_competency: float
    total_skills: int
    strong_skills_count: int
    gaps_count: int
    category_scores: Dict[str, float]
    skills: List[AssociateSkill]


class SkillGap(BaseModel):
    skill_id: str
    skill_name: str
    category: str
    current_level: str
    required_level: str
    current_score: float
    required_score: float
    gap: float
    business_importance: str
    priority: str  # Critical, High, Medium, Low
    recommended_course: str
    recommended_challenge: str
    recommended_project: str
    expected_completion_time: str


class PersonalizedLearningItem(BaseModel):
    id: str
    rank: int
    title: str
    category: str
    reason: str
    skill_name: str
    gap_points: float
    action_type: str  # Course, Challenge, Architecture Practice, Mentor Checkin
    action_url: str
    difficulty: str
    estimated_hours: int


# ---------------------------------------------------------------------------
# AI Talent Intelligence Platform Models (Phase 2)
# ---------------------------------------------------------------------------

class AIReadinessBreakdown(BaseModel):
    associate_id: str
    associate_name: str
    overall: float  # e.g. 82.0
    technical: float  # e.g. 88.0
    architecture: float  # e.g. 74.0
    cloud: float  # e.g. 79.0
    production: float  # e.g. 84.0
    leadership: float  # e.g. 81.0
    commissioning_ready: bool = False
    readiness_tier: str = "PRACTITIONER"  # FOUNDATION, PRACTITIONER, PRODUCTION_READY, ARCHITECT
    trajectory: str = "ON_TRACK"
    last_updated: str


class RiskIndicator(BaseModel):
    id: str
    label: str  # e.g. "Milestone Delay Risk", "Assessment Failure Risk"
    probability: float  # 0 to 100
    level: str  # LOW, MEDIUM, HIGH, CRITICAL
    explanation: str
    primary_factor: str
    action_suggestion: str


class AIReadinessPrediction(BaseModel):
    associate_id: str
    associate_name: str
    readiness_breakdown: AIReadinessBreakdown
    predicted_commission_date: str
    graduation_readiness_probability: float  # 0-100
    at_risk_probability: float  # 0-100
    risk_indicators: List[RiskIndicator]
    score_change_explanation: str
    historical_trajectory: List[Dict[str, float]]


class AICoachChatMessage(BaseModel):
    id: str
    sender: str  # "user" | "assistant"
    text: str
    timestamp: str
    suggested_prompts: List[str] = Field(default_factory=list)
    action_links: List[Dict[str, str]] = Field(default_factory=list)
    key_takeaways: List[str] = Field(default_factory=list)


class AICoachChatRequest(BaseModel):
    associate_id: str = "as-ananya"
    message: str
    context_topic: Optional[str] = None


class AIMentorBrief(BaseModel):
    associate_id: str
    associate_name: str
    cohort: str
    pathway: str
    status: str  # NEEDS_ATTENTION, ON_TRACK, FAST_TRACK
    overall_readiness: float
    primary_concern: str
    evidence_summary: Dict[str, str]
    recommended_actions: List[str]
    talking_points: List[str]
    generated_at: str


class AIExecutiveQueryRequest(BaseModel):
    query: str
    role: str = "SENIOR_LEADER_SPONSOR"


class AIExecutiveQueryResult(BaseModel):
    query: str
    answer_markdown: str
    key_metrics: List[Dict[str, str]]
    recommended_decisions: List[str]
    affected_cohorts: List[str]
    generated_at: str


# ---------------------------------------------------------------------------
# Configurable Workflow Engine & SLA Escalation Models (Phase 3)
# ---------------------------------------------------------------------------

class WorkflowNode(BaseModel):
    id: str
    label: str
    type: str  # START, APPROVAL, REVIEW, DECISION, CONDITION, NOTIFICATION, ASSIGNMENT, ESCALATION, END
    role: str = "MENTOR_COACH"
    sla_hours: int = 48
    warning_hours: int = 24
    escalation_role: Optional[str] = "SENIOR_LEADER_SPONSOR"
    config: Dict[str, str] = Field(default_factory=dict)
    position_x: float = 0.0
    position_y: float = 0.0


class WorkflowEdge(BaseModel):
    id: str
    source: str
    target: str
    label: Optional[str] = None
    condition: Optional[str] = None


class WorkflowDefinition(BaseModel):
    id: str
    code: str
    name: str
    description: str
    category: str  # WAIVER, PATHWAY, FAST_TRACK, PROMOTION, COMMISSIONING, ARCHITECT_BOARD
    nodes: List[WorkflowNode]
    edges: List[WorkflowEdge]
    is_active: bool = True
    version: int = 1
    updated_at: str


class WorkflowHistoryEntry(BaseModel):
    id: str
    step_id: str
    step_name: str
    actor_id: str
    actor_name: str
    actor_role: str
    action: str  # SUBMIT, APPROVE, REJECT, REQUEST_REWORK, ESCALATE, DELEGATE
    decision_reason: str
    comments: str
    timestamp: str
    sla_met: bool = True


class WorkflowInstance(BaseModel):
    id: str
    workflow_id: str
    workflow_code: str
    workflow_name: str
    associate_id: str
    associate_name: str
    current_step_id: str
    current_step_name: str
    current_assignee_role: str
    status: str  # PENDING, IN_REVIEW, APPROVED, REJECTED, REWORK, ESCALATED
    created_at: str
    due_date: str
    sla_hours: int
    sla_status: str  # HEALTHY, WARNING, BREACHED_ESCALATED
    history: List[WorkflowHistoryEntry] = Field(default_factory=list)
    payload: Dict[str, str] = Field(default_factory=dict)


class WorkflowTransitionRequest(BaseModel):
    instance_id: str
    action: str  # APPROVE, REJECT, REQUEST_REWORK, ESCALATE, DELEGATE
    actor_id: str = "u-priya"
    actor_name: str = "Priya Nair"
    actor_role: str = "MENTOR_COACH"
    comments: str = ""
    reason: str = ""
    delegate_to: Optional[str] = None


class SLADashboardMetrics(BaseModel):
    total_active: int
    within_sla: int
    warning_count: int
    breached_count: int
    average_cycle_time_hours: float
    recent_escalations: List[WorkflowInstance]


class NotificationItem(BaseModel):
    id: str
    user_id: str
    title: str
    message: str
    channel: str  # IN_APP, EMAIL, TEAMS, SLACK
    event_type: str  # ASSESSMENT_DEADLINE, FAILED_ASSESSMENT, NEW_ASSIGNMENT, MENTOR_REVIEW, APPROVAL_REQUIRED, APPROVAL_COMPLETED, MILESTONE_OVERDUE, SKILL_GAP_IDENTIFIED, CERTIFICATION_EARNED, WORKFLOW_ESCALATION
    is_read: bool = False
    urgency: str = "NORMAL"  # NORMAL, WARNING, CRITICAL
    created_at: str
    action_url: Optional[str] = None
    metadata: Dict[str, str] = Field(default_factory=dict)


class NotificationTemplate(BaseModel):
    id: str
    event_type: str
    name: str
    subject_template: str
    body_template: str
    default_channels: List[str]


# ---------------------------------------------------------------------------
# Adaptive Testing & Assessment Integrity Engine Models (Phase 4)
# ---------------------------------------------------------------------------

class Choice(BaseModel):
    id: str
    text: str


class AdaptiveQuestion(BaseModel):
    id: str
    course_id: str = "c-wf101"
    title: str
    prompt: str
    choices: List[Choice] = Field(default_factory=list)
    correct_choice_id: str
    explanation: str
    domain: Optional[str] = None
    difficulty: Optional[str] = None


class AdaptiveStartRequest(BaseModel):
    associate_id: str = "as-ananya"
    course_id: str = "c-wf101"
    target_domain: Optional[str] = "Software Engineering"


class AdaptiveTestSession(BaseModel):
    session_id: str
    associate_id: str
    course_id: str
    course_title: str
    current_theta: float = 0.0  # -3.0 to +3.0 IRT ability score
    current_sem: float = 0.85  # Standard Error of Measurement
    questions_answered: int = 0
    max_questions: int = 8
    target_sem_stop: float = 0.28
    is_completed: bool = False
    ability_history: List[float] = Field(default_factory=list)
    current_question: Optional[AdaptiveQuestion] = None
    domain_breakdown: Dict[str, int] = Field(default_factory=dict)


class AdaptiveAnswerSubmit(BaseModel):
    session_id: str
    question_id: str
    selected_choice_id: str
    time_spent_seconds: int = 35
    tab_switches_during_item: int = 0
    copy_paste_events: int = 0


class AdaptiveAnswerResult(BaseModel):
    is_correct: bool
    correct_choice_id: str
    updated_theta: float
    updated_sem: float
    ability_trajectory: str  # INCREASING, STEADY, DECREASING
    is_completed: bool
    final_grade: Optional[str] = None
    next_question: Optional[AdaptiveQuestion] = None
    explanation: str
    proctoring_flagged: bool = False


class PsychometricStats(BaseModel):
    p_value: float  # Item difficulty (0.0 to 1.0)
    discrimination_index: float  # r-point-biserial (-1.0 to +1.0)
    avg_response_time_seconds: float
    exposure_count: int
    distractor_frequencies: Dict[str, float] = Field(default_factory=dict)


class QuestionVersionChangelog(BaseModel):
    version: int
    author: str
    change_summary: str
    timestamp: str


class GovernanceQuestion(BaseModel):
    id: str
    code: str
    title: str
    prompt: str
    domain: str
    difficulty: str  # L100, L200, L300, L400
    status: str  # DRAFT, IN_REVIEW, ACTIVE, RETIRED, ARCHIVED
    version: int = 1
    author: str
    reviewer: Optional[str] = None
    irt_b_difficulty: float = 0.0
    irt_a_discrimination: float = 1.0
    psychometrics: PsychometricStats
    changelog: List[QuestionVersionChangelog] = Field(default_factory=list)
    choices: List[Choice] = Field(default_factory=list)
    correct_choice_id: str
    explanation: str


class ProctoringViolation(BaseModel):
    id: str
    event_type: str  # TAB_BLUR, COPY_PASTE, VELOCITY_ANOMALY, DUAL_DISPLAY
    description: str
    severity: str  # LOW, MEDIUM, HIGH
    timestamp: str


class ProctoringTelemetry(BaseModel):
    session_id: str
    associate_id: str
    tab_switch_count: int = 0
    copy_paste_count: int = 0
    window_blur_duration_seconds: int = 0
    keystroke_typing_wpm: float = 62.5
    submission_velocity_anomaly: bool = False
    integrity_score: int = 98  # 0 to 100
    risk_level: str = "LOW"  # LOW, MEDIUM, HIGH
    violations: List[ProctoringViolation] = Field(default_factory=list)


# ---------------------------------------------------------------------------
# Advanced ASM Project Lifecycle & Digital Credentials (Phase 5)
# ---------------------------------------------------------------------------

class ASMRubricScore(BaseModel):
    criterion: str  # ARCHITECTURE_DESIGN, CODE_QUALITY_TESTING, PRODUCTION_OBSERVABILITY, DEFENSE_PRESENTATION, BUSINESS_IMPACT
    criterion_label: str
    weight: float  # e.g. 0.25
    score: float  # 1.0 to 5.0
    comments: str = ""


class ASMPanelMember(BaseModel):
    examiner_id: str
    examiner_name: str
    examiner_role: str  # LEAD_ARCHITECT, SRE_LEAD, SECURITY_CHAMPION, SPONSOR
    rubric_scores: List[ASMRubricScore] = Field(default_factory=list)
    overall_score: float = 0.0
    recommendation: str = "APPROVED"  # APPROVED, APPROVED_WITH_CONDITIONS, REWORK_REQUIRED
    deliberation_notes: str = ""
    signed_at: Optional[str] = None


class ASMArtifacts(BaseModel):
    pr_url: str = "https://github.com/enterprise/ascend-payments/pull/14"
    rfc_doc_url: str = "https://wiki.enterprise.internal/rfc/PAY-402-idempotency"
    chaos_experiment_summary: str = "Chaos Mesh pod-kill latency benchmark: zero transaction drops, P99 stayed under 12ms."
    benchmark_p99_latency_ms: float = 6.4
    benchmark_throughput_tps: int = 4850
    security_scan_passed: bool = True
    security_vulnerabilities_found: int = 0
    deployment_manifest_url: str = "k8s/deployments/production-payments-v2.yaml"


class ASMProjectLifecycle(BaseModel):
    id: str
    project_code: str
    project_title: str
    associate_id: str
    associate_name: str
    pathway: str
    current_stage: str  # SCOPING, RFC_REVIEW, IMPLEMENTATION, AUTOMATED_VERIFICATION, PEER_REVIEW, BOARD_DEFENSE, PRODUCTION_GATE, ARCHIVED
    started_at: str
    target_completion: str
    artifacts: ASMArtifacts
    panel_examiners: List[ASMPanelMember] = Field(default_factory=list)
    composite_score: float = 0.0
    status: str = "IN_PROGRESS"  # IN_PROGRESS, DEFENDED, PRODUCTION_READY, REWORK


class DigitalCredential(BaseModel):
    id: str
    credential_code: str
    title: str
    badge_tier: str  # FOUNDATIONAL, PRACTITIONER, SPECIALIST, ARCHITECT, MASTER
    associate_id: str
    associate_name: str
    issue_date: str
    expiry_date: Optional[str] = None
    verification_hash_sha256: str
    public_verification_url: str
    skills_verified: List[str] = Field(default_factory=list)
    evidence_summary: Dict[str, str] = Field(default_factory=dict)
    issuing_authority: str = "ASCEND Engineering Excellence Board"
    status: str = "ACTIVE"
    qr_code_data: str


class IssueCredentialRequest(BaseModel):
    associate_id: str
    title: str
    badge_tier: str = "ARCHITECT"
    skills_verified: List[str] = Field(default_factory=list)
    evidence_summary: Dict[str, str] = Field(default_factory=dict)


# ---------------------------------------------------------------------------
# Internal Talent Marketplace & Strategic Workforce Planning (Phase 6)
# ---------------------------------------------------------------------------

class MarketplaceProject(BaseModel):
    id: str
    title: str
    business_unit: str
    team: str
    technical_stack: List[str] = Field(default_factory=list)
    target_competency_tier: str = "L300"  # L100, L200, L300, L400
    allocation_percentage: int = 50  # e.g. 50% or 100%
    duration_weeks: int = 8
    mentorship_available: bool = True
    business_impact: str
    open_seats: int = 2
    status: str = "OPEN"  # OPEN, FILLED, COMPLETED
    posted_by: str
    created_at: str


class MarketplaceApplication(BaseModel):
    id: str
    project_id: str
    project_title: str
    associate_id: str
    associate_name: str
    pathway: str
    match_score: float  # 0 to 100%
    match_breakdown: Dict[str, float] = Field(default_factory=dict)
    candidate_pitch: str
    status: str = "APPLIED"  # APPLIED, SHORTLISTED, INTERVIEW_SCHEDULED, OFFERED, COMMISSIONED
    applied_at: str


class MarketplaceApplyRequest(BaseModel):
    project_id: str
    associate_id: str
    candidate_pitch: Optional[str] = None


class WorkforceScenarioRequest(BaseModel):
    scenario_name: str = "Accelerated AI Transition Q4"
    cohort_intake_delta: int = 20  # +20 headcount
    ai_shift_percentage: float = 30.0  # 30% SE cohort shifts to AI/ML
    accelerated_weeks: int = 4  # 4 weeks faster
    simulated_attrition_rate: float = 4.5  # 4.5%


class WorkforceScenarioResult(BaseModel):
    scenario_name: str
    projected_graduates: int
    projected_avg_readiness: float
    domain_surplus_deficit: Dict[str, int]
    timeline_weeks: int
    quarterly_pipeline: List[Dict[str, Any]] = Field(default_factory=list)


# ---------------------------------------------------------------------------
# Executive Analytics, Custom Dashboard Builder & Reporting (Phase 7)
# ---------------------------------------------------------------------------

class AnalyticsKPI(BaseModel):
    metric_key: str
    label: str
    value: float
    formatted_value: str
    unit: str
    change_pct_30d: float
    trend_direction: str  # UP, DOWN, STABLE
    category: str  # EXECUTIVE, COHORT, SKILL, INTEGRITY


class ExecutiveAnalyticsData(BaseModel):
    executive_kpis: List[AnalyticsKPI] = Field(default_factory=list)
    cohort_progress: List[Dict[str, Any]] = Field(default_factory=list)
    skill_health_matrix: List[Dict[str, Any]] = Field(default_factory=list)
    assessment_integrity_metrics: Dict[str, Any] = Field(default_factory=dict)
    time_series_velocity: List[Dict[str, Any]] = Field(default_factory=list)


class DashboardWidgetConfig(BaseModel):
    id: str
    widget_type: str  # KPI_CARD, RADIAL_GAUGE, TIME_SERIES, SKILL_RADAR, FUNNEL_CHART, HEATMAP_MATRIX, LEADERBOARD, RISK_TICKER
    title: str
    size: str = "1x1"  # 1x1, 2x1, 2x2, full
    metric_source: str
    config: Dict[str, Any] = Field(default_factory=dict)


class CustomDashboardLayout(BaseModel):
    id: str
    title: str
    role: str = "SENIOR_LEADER_SPONSOR"
    is_default: bool = False
    widgets: List[DashboardWidgetConfig] = Field(default_factory=list)
    created_at: str
    updated_at: str


class ScheduledReport(BaseModel):
    id: str
    title: str
    report_type: str  # COHORT_PROGRESS, EXECUTIVE_BRIEF, SKILL_GAP, INTEGRITY_SUMMARY, COMMISSIONING_PACKAGE
    frequency: str  # DAILY, WEEKLY, BI_WEEKLY, MONTHLY, QUARTERLY
    delivery_channels: List[str] = Field(default_factory=list)
    recipients: List[str] = Field(default_factory=list)
    format: str = "PDF"  # PDF, EXCEL, PPTX
    next_run: str
    last_sent: str
    is_active: bool = True


class GenerateReportRequest(BaseModel):
    report_type: str
    format: str = "PDF"
    time_range_days: int = 30
    cohort_id: Optional[str] = None


# ---------------------------------------------------------------------------
# Data Governance, Metric Lineage & Audit Center (Phase 8)
# ---------------------------------------------------------------------------

class MetricLineageNode(BaseModel):
    id: str
    name: str
    category: str  # RAW_EVENT, INTERMEDIATE_INDICATOR, PILLAR_SCORE, COMPOSITE_METRIC
    formula_latex: str
    input_sources: List[str] = Field(default_factory=list)
    current_value: float
    formatted_value: str
    update_frequency: str = "REAL_TIME"
    owner: str = "ASCEND Engineering Excellence Board"
    sensitivity_weight: float = 0.25
    parent_node_ids: List[str] = Field(default_factory=list)


class AuditLogEvent(BaseModel):
    id: str
    timestamp: str
    actor_id: str
    actor_name: str
    actor_role: str
    ip_address: str = "10.240.12.8"
    action: str  # CREATE, UPDATE, APPROVE, REJECT, OVERRIDE, EXPORT, SECURITY_EVENT
    resource_type: str
    resource_id: str
    resource_name: str
    severity: str = "INFO"  # INFO, WARNING, SECURITY_EVENT, COMPLIANCE_VIOLATION
    before_state: Optional[Dict[str, Any]] = None
    after_state: Optional[Dict[str, Any]] = None
    hash_chain_sha256: str


class AuditChainVerificationResult(BaseModel):
    total_events_checked: int
    chain_valid: bool
    root_hash: str
    latest_block_hash: str
    tamper_detected: bool = False
    verified_at: str


class CurriculumVersion(BaseModel):
    id: str
    course_id: str
    course_code: str
    course_title: str
    version: str  # e.g. v2.1.0
    branch_name: str  # main, v3.0-preview-bedrock
    status: str = "ACTIVE"  # DRAFT, IN_REVIEW, ACTIVE, DEPRECATED, ARCHIVED
    author: str
    approved_by: Optional[str] = None
    changelog_summary: str
    modules_count: int = 6
    learning_objectives_diff: List[str] = Field(default_factory=list)
    assigned_cohorts: List[str] = Field(default_factory=list)
    created_at: str


class CurriculumBranchRequest(BaseModel):
    course_id: str
    base_version: str
    new_branch_name: str
    changelog_summary: str
    author: str


# ---------------------------------------------------------------------------
# Enterprise Integration Hub, Global Command Palette & Activity Stream (Phase 9)
# ---------------------------------------------------------------------------

class LMSConnector(BaseModel):
    id: str
    provider: str  # COURSERA, PLURALSIGHT, DEGREED, UDEMY, SCORM_XAPI
    name: str
    status: str = "CONNECTED"  # CONNECTED, SYNCING, ERROR, PAUSED
    sync_frequency: str = "HOURLY"
    last_synced_at: str
    total_records_synced: int = 1240
    health_score: float = 99.8
    credentials_masked: str = "client_id: asc_lms_prod_****"


class HRISConnector(BaseModel):
    id: str
    provider: str  # WORKDAY, SUCCESSFACTORS, GREENHOUSE, LEVER
    name: str
    status: str = "CONNECTED"  # CONNECTED, IDLE, SYNCING
    sync_direction: str = "BIDIRECTIONAL"  # BIDIRECTIONAL, INBOUND_ATS, OUTBOUND_HRIS
    last_synced_at: str
    active_pipeline_count: int = 48


class XAPIStatement(BaseModel):
    actor_email: str
    verb: str  # completed, mastered, scored, attempted
    activity_id: str
    activity_name: str
    score_scaled: Optional[float] = None  # 0.0 to 1.0
    mapped_skill_id: Optional[str] = None


class ActivityStreamEvent(BaseModel):
    id: str
    timestamp: str
    event_type: str  # ASSESSMENT_SUBMITTED, CODE_EXECUTED, DEFENSE_RATIFIED, CREDENTIAL_ISSUED, GIG_APPLIED, WORKFLOW_ESCALATED
    actor_id: str
    actor_name: str
    actor_avatar: Optional[str] = None
    description: str
    entity_type: str
    entity_id: str
    severity: str = "NORMAL"  # NORMAL, SUCCESS, WARNING


class PresenceSession(BaseModel):
    user_id: str
    user_name: str
    role: str
    status: str = "ONLINE"  # ONLINE, IN_ASSESSMENT, IN_DEFENSE_PANEL, IDLE
    current_activity: str
    active_device: str = "Desktop (Chrome / Windows)"
    last_ping: str


class GlobalSearchResult(BaseModel):
    id: str
    title: str
    subtitle: str
    category: str  # ASSOCIATE, SKILL, COURSE, PROJECT, APPROVAL, PAGE
    url: str
    badge: Optional[str] = None


# ---------------------------------------------------------------------------
# Dynamic Scoring Rules & Control Center (Phase 10)
# ---------------------------------------------------------------------------

class ScoringRuleConfig(BaseModel):
    id: str
    pathway: str  # SOFTWARE_ENGINEERING, AI_ENGINEERING, CLOUD_INFRASTRUCTURE, DATA_ENGINEERING
    technical_weight: float = 0.35
    architecture_weight: float = 0.25
    cloud_weight: float = 0.15
    production_weight: float = 0.15
    leadership_weight: float = 0.10
    cat_sem_target: float = 0.28
    minimum_passing_score: float = 80.0
    updated_at: str


class SystemHealthStatus(BaseModel):
    database_status: str = "HEALTHY"
    vector_store_status: str = "HEALTHY (pgvector / HNSW)"
    irt_engine_latency_ms: float = 14.2
    lrs_stream_status: str = "CONNECTED (xAPI / SCORM)"
    uptime_pct: float = 99.98
    active_feature_flags: Dict[str, bool] = Field(default_factory=dict)


class FeatureFlagUpdate(BaseModel):
    flags: Dict[str, bool]












