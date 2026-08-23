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
