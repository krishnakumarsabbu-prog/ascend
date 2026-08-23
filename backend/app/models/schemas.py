from __future__ import annotations

from datetime import date, datetime
from enum import Enum
from typing import List, Optional

from pydantic import BaseModel, Field


class Role(str, Enum):
    EARLY_TALENT = "EARLY_TALENT"
    MENTOR_COACH = "MENTOR_COACH"
    ENGINEERING_EXCELLENCE_COMMITTEE = "ENGINEERING_EXCELLENCE_COMMITTEE"
    SENIOR_LEADER_SPONSOR = "SENIOR_LEADER_SPONSOR"


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
