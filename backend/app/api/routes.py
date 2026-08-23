from __future__ import annotations

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.repositories.repository import get_repository
from app.services.dashboard_service import DashboardService
from app.services.assessment_service import AssessmentService
from app.services.pathway_service import PathwayService

router = APIRouter(prefix="/api", tags=["ascend"])


class StartAttemptRequest(BaseModel):
    course_id: str
    associate_id: str = "as-ananya"


class AnswerRequest(BaseModel):
    question_id: str
    selected_option: str


class MarkRequest(BaseModel):
    question_id: str


class CurrentIndexRequest(BaseModel):
    index: int


class DevelopmentPlanRequest(BaseModel):
    associate_id: str
    goal: str
    description: str
    priority: str
    target_month: int
    status: str = "NOT_STARTED"


class WaiverReviewRequest(BaseModel):
    mentor_id: str
    recommendation: str


@router.get("/health")
def health():
    return {"status": "ok", "service": "ascend-backend", "version": "1.0.0"}


@router.get("/roles")
def get_roles():
    repo = get_repository()
    return repo.get_roles()


@router.get("/users")
def get_users():
    repo = get_repository()
    return repo.get_users()


@router.get("/associates")
def get_associates():
    repo = get_repository()
    return repo.get_associates()


@router.get("/associates/{associate_id}")
def get_associate(associate_id: str):
    repo = get_repository()
    associate = repo.get_associate(associate_id)
    if not associate:
        raise HTTPException(status_code=404, detail="Associate not found")
    return associate


@router.get("/dashboard/{associate_id}")
def get_dashboard(associate_id: str):
    repo = get_repository()
    service = DashboardService(repo)
    dashboard = service.build_dashboard(associate_id)
    if not dashboard:
        raise HTTPException(status_code=404, detail="Associate not found")
    return dashboard


# ---------------------------------------------------------------------------
# Phase 5 — Mentor / Coach Portal
# ---------------------------------------------------------------------------

@router.get("/mentors/{mentor_id}/mentees")
def get_mentor_mentees(mentor_id: str):
    return get_repository().get_mentor_mentees(mentor_id)


@router.get("/mentees/{associate_id}")
def get_mentee_profile(associate_id: str):
    profile = get_repository().get_mentee_profile(associate_id)
    if not profile:
        raise HTTPException(status_code=404, detail="Mentee not found")
    return profile


@router.get("/mentees/{associate_id}/development-plan")
def get_development_plan(associate_id: str):
    if not get_repository().get_associate(associate_id):
        raise HTTPException(status_code=404, detail="Mentee not found")
    return get_repository().get_development_plan(associate_id)


@router.post("/development-plan")
def create_development_plan(body: DevelopmentPlanRequest):
    if not get_repository().get_associate(body.associate_id):
        raise HTTPException(status_code=404, detail="Mentee not found")
    return get_repository().create_development_plan(body.model_dump())


@router.get("/waivers")
def get_waivers():
    return get_repository().get_waivers()


@router.post("/waivers/{waiver_id}/mentor-review")
def review_waiver(waiver_id: str, body: WaiverReviewRequest):
    if body.recommendation not in ("RECOMMEND", "DO_NOT_RECOMMEND"):
        raise HTTPException(status_code=400, detail="Invalid recommendation")
    waiver = get_repository().review_waiver(waiver_id, body.recommendation, body.mentor_id)
    if not waiver:
        raise HTTPException(status_code=404, detail="Waiver not found")
    return waiver


# ---------------------------------------------------------------------------
# Phase 6 — Engineering Excellence Committee Governance
# ---------------------------------------------------------------------------

@router.get("/committee/overview")
def get_committee_overview():
    return get_repository().get_committee_overview()


@router.get("/committee/question-bank")
def get_question_bank():
    return get_repository().get_question_bank()


@router.get("/committee/asm-library")
def get_asm_library():
    return get_repository().get_asm_library()


@router.get("/committee/waivers")
def get_governance_waivers():
    return get_repository().get_governance_waivers()


@router.get("/committee/difficulty")
def get_difficulty_engine():
    return get_repository().get_difficulty_engine()


@router.get("/committee/ledger")
def get_ledger_audit():
    return get_repository().get_ledger_audit()


@router.post("/committee/{area}/{item_id}/{action}")
def update_governance(area: str, item_id: str, action: str):
    result = get_repository().update_governance(area, item_id, action)
    if not result:
        raise HTTPException(status_code=404, detail="Governance item not found")
    return result


@router.get("/courses")
def get_courses():
    repo = get_repository()
    return repo.get_courses()


@router.get("/asm-milestones")
def get_asm_milestones():
    repo = get_repository()
    return repo.get_asm_milestones()


@router.get("/credits/{associate_id}")
def get_credits(associate_id: str):
    repo = get_repository()
    return repo.get_credits(associate_id)


# ---------------------------------------------------------------------------
# Phase 2 — Curriculum + Assessment Engine
# ---------------------------------------------------------------------------

@router.get("/curriculum/courses")
def get_curriculum_courses():
    repo = get_repository()
    return repo.get_curriculum_courses()


@router.get("/curriculum/courses/{course_id}")
def get_curriculum_course(course_id: str):
    repo = get_repository()
    course = repo.get_curriculum_course(course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return course


@router.get("/curriculum/courses/{course_id}/questions")
def get_course_questions(course_id: str):
    repo = get_repository()
    course = repo.get_curriculum_course(course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    questions = repo.get_questions_by_course(course_id)
    # Strip correct_answer and explanation for the client
    return [
        {
            "id": q.id,
            "course_id": q.course_id,
            "tier": q.tier,
            "question": q.question,
            "options": q.options,
            "domain": q.domain,
        }
        for q in questions
    ]


@router.post("/assessments/start")
def start_assessment(body: StartAttemptRequest):
    repo = get_repository()
    service = AssessmentService(repo)
    summary = service.start_attempt(body.course_id, body.associate_id)
    if not summary:
        raise HTTPException(status_code=404, detail="Course not found")
    return summary


@router.get("/assessments/{attempt_id}")
def get_assessment(attempt_id: str):
    repo = get_repository()
    service = AssessmentService(repo)
    summary = service.get_attempt(attempt_id)
    if not summary:
        raise HTTPException(status_code=404, detail="Assessment attempt not found")
    return summary


@router.post("/assessments/{attempt_id}/answer")
def save_answer(attempt_id: str, body: AnswerRequest):
    repo = get_repository()
    service = AssessmentService(repo)
    summary = service.save_answer(attempt_id, body.question_id, body.selected_option)
    if not summary:
        raise HTTPException(status_code=404, detail="Assessment attempt not found")
    return summary


@router.post("/assessments/{attempt_id}/mark")
def toggle_mark(attempt_id: str, body: MarkRequest):
    repo = get_repository()
    service = AssessmentService(repo)
    summary = service.toggle_mark(attempt_id, body.question_id)
    if not summary:
        raise HTTPException(status_code=404, detail="Assessment attempt not found")
    return summary


@router.post("/assessments/{attempt_id}/current")
def set_current(attempt_id: str, body: CurrentIndexRequest):
    repo = get_repository()
    attempt = repo.set_current_index(attempt_id, body.index)
    if not attempt:
        raise HTTPException(status_code=404, detail="Assessment attempt not found")
    return {"status": "ok"}


@router.post("/assessments/{attempt_id}/submit")
def submit_assessment(attempt_id: str):
    repo = get_repository()
    service = AssessmentService(repo)
    result = service.submit_attempt(attempt_id)
    if not result:
        raise HTTPException(status_code=404, detail="Assessment attempt not found")
    return result


@router.get("/assessments/{attempt_id}/result")
def get_assessment_result(attempt_id: str):
    repo = get_repository()
    service = AssessmentService(repo)
    result = service.get_result(attempt_id)
    if not result:
        raise HTTPException(status_code=404, detail="Result not available")
    return result


# ---------------------------------------------------------------------------
# Phase 3 — Pathway Selection & Recommendation Engine
# ---------------------------------------------------------------------------

class MentorReviewRequest(BaseModel):
    associate_id: str
    mentor_id: str
    mentor_name: str
    recommended_pathway: str
    confidence: float
    strengths: str
    concerns: str
    comments: str


class CommitteeDecisionRequest(BaseModel):
    associate_id: str
    system_recommendation: str
    mentor_recommendation: str = ""
    committee_decision: str
    reason: str
    status: str = "CONFIRMED"


@router.get("/pathways")
def get_pathways():
    repo = get_repository()
    service = PathwayService(repo)
    return service.get_pathways()


@router.get("/pathways/recommendation/{associate_id}")
def get_pathway_recommendation(associate_id: str):
    repo = get_repository()
    service = PathwayService(repo)
    recommendation = service.get_recommendation(associate_id)
    if not recommendation:
        raise HTTPException(status_code=404, detail="Associate not found")
    # Attach mentor review and reconciliation if available
    mentor_review = service.get_mentor_review(associate_id)
    system_code = recommendation.system_recommendation.pathway_code if recommendation.system_recommendation else ""
    mentor_code = mentor_review.recommended_pathway if mentor_review else None
    reconciliation = service.reconcile(system_code, mentor_code)
    return {
        **recommendation.model_dump(),
        "mentor_review": mentor_review.model_dump() if mentor_review else None,
        "reconciliation": reconciliation.model_dump(),
    }


@router.post("/pathways/mentor-review")
def submit_mentor_review(body: MentorReviewRequest):
    repo = get_repository()
    service = PathwayService(repo)
    from datetime import datetime, timezone
    review = MentorReview(
        associate_id=body.associate_id,
        mentor_id=body.mentor_id,
        mentor_name=body.mentor_name,
        recommended_pathway=body.recommended_pathway,
        confidence=body.confidence,
        strengths=body.strengths,
        concerns=body.concerns,
        comments=body.comments,
        submitted_at=datetime.now(timezone.utc),
    )
    saved = service.save_mentor_review(review)
    # Return reconciliation alongside the review
    recommendation = service.get_recommendation(body.associate_id)
    system_code = recommendation.system_recommendation.pathway_code if recommendation and recommendation.system_recommendation else ""
    reconciliation = service.reconcile(system_code, saved.recommended_pathway)
    return {**saved.model_dump(), "reconciliation": reconciliation.model_dump()}


@router.post("/pathways/committee-decision")
def submit_committee_decision(body: CommitteeDecisionRequest):
    repo = get_repository()
    service = PathwayService(repo)
    from datetime import datetime, timezone
    import uuid
    decision = CommitteeDecision(
        id=f"cd-{uuid.uuid4().hex[:12]}",
        associate_id=body.associate_id,
        system_recommendation=body.system_recommendation,
        mentor_recommendation=body.mentor_recommendation,
        committee_decision=body.committee_decision,
        reason=body.reason,
        timestamp=datetime.now(timezone.utc),
        status=body.status,
    )
    saved = service.save_committee_decision(decision)
    return saved.model_dump()


@router.get("/pathways/history/{associate_id}")
def get_pathway_history(associate_id: str):
    repo = get_repository()
    service = PathwayService(repo)
    return service.get_history(associate_id)


# ---------------------------------------------------------------------------
# Phase 4 — ASM Milestone Journey + Commissioning Path
# ---------------------------------------------------------------------------

from app.services.asm_service import ASMService
from app.models.schemas import StartASMRequest, SubmitASMRequest, ReviewASMRequest


@router.get("/asm")
def get_asm_milestones_v2():
    repo = get_repository()
    service = ASMService(repo)
    return [m.model_dump() for m in service.get_all_asm()]


@router.get("/asm/{milestone_id}")
def get_asm_detail(milestone_id: str):
    repo = get_repository()
    service = ASMService(repo)
    detail = service.get_asm(milestone_id)
    if not detail:
        raise HTTPException(status_code=404, detail="ASM milestone not found")
    return detail.model_dump()


@router.get("/associates/{associate_id}/asm")
def get_associate_asm(associate_id: str):
    repo = get_repository()
    service = ASMService(repo)
    detail = service.get_associate_asm(associate_id)
    if not detail:
        raise HTTPException(status_code=404, detail="Associate not found")
    return detail.model_dump()


@router.post("/asm/{milestone_id}/start")
def start_asm(milestone_id: str, body: StartASMRequest):
    repo = get_repository()
    service = ASMService(repo)
    detail = service.start_milestone(milestone_id, body.associate_id)
    if not detail:
        raise HTTPException(status_code=404, detail="ASM milestone not found")
    return detail.model_dump()


@router.post("/asm/{milestone_id}/submit")
def submit_asm_evidence(milestone_id: str, body: SubmitASMRequest):
    repo = get_repository()
    service = ASMService(repo)
    detail = service.submit_evidence(
        milestone_id, body.associate_id, body.evidence_description, body.artifact_url
    )
    if not detail:
        raise HTTPException(status_code=404, detail="ASM milestone not found")
    return detail.model_dump()


@router.post("/asm/{milestone_id}/review")
def review_asm(milestone_id: str, body: ReviewASMRequest):
    repo = get_repository()
    service = ASMService(repo)
    detail = service.review_milestone(
        milestone_id, body.associate_id, body.mentor_id, body.mentor_name, body.decision, body.comments
    )
    if not detail:
        raise HTTPException(status_code=404, detail="ASM milestone not found")
    return detail.model_dump()


@router.get("/associates/{associate_id}/commissioning")
def get_commissioning(associate_id: str):
    repo = get_repository()
    service = ASMService(repo)
    path = service.get_commissioning(associate_id)
    if not path:
        raise HTTPException(status_code=404, detail="Associate not found")
    return path.model_dump()


@router.get("/associates/{associate_id}/credits")
def get_associate_credits(associate_id: str):
    repo = get_repository()
    return repo.get_credits(associate_id)


# ---------------------------------------------------------------------------
# Phase 7 — Senior Leader Sponsor: Demand & Pipeline Intelligence
# ---------------------------------------------------------------------------

from app.services.demand_service import DemandService


def _demand_service():
    return DemandService(get_repository())


@router.get("/demand")
def get_demand():
    return _demand_service().get_demand_overview()


@router.get("/demand/teams")
def get_demand_teams():
    return _demand_service().get_teams()


@router.get("/demand/{team_id}")
def get_demand_team(team_id: str):
    team = _demand_service().get_team(team_id)
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    return team


@router.get("/pipeline")
def get_pipeline():
    return _demand_service().get_pipeline_overview()


@router.get("/pipeline/{team_id}")
def get_pipeline_team(team_id: str):
    team = _demand_service().get_team_pipeline(team_id)
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    return team


@router.get("/workforce/recommendations")
def get_workforce_recommendations():
    return _demand_service().get_recommendations()


@router.get("/sponsored-asm")
def get_sponsored_asm():
    return _demand_service().get_sponsored_asm()
