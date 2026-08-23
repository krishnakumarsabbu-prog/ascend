from __future__ import annotations

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.repositories.repository import get_repository
from app.services.dashboard_service import DashboardService
from app.services.assessment_service import AssessmentService

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
