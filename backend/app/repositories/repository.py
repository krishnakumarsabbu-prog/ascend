from __future__ import annotations

from datetime import datetime, timezone
from typing import Optional
import uuid

from app.models.schemas import (
    ASMMilestone,
    Assessment,
    Associate,
    AssociateASMMilestone,
    AssociateAssessment,
    AssociatePathway,
    AttemptResult,
    AttemptSummary,
    Course,
    CreditEntry,
    CurriculumCourse,
    DomainScore,
    PerformanceInsight,
    Question,
    Tier,
    TierPerformance,
    Pathway,
    Role,
    Team,
    User,
)
from app.seed.data import (
    seed_asm_milestones,
    seed_associate_asm_milestones,
    seed_associate_assessments,
    seed_associate_pathways,
    seed_associates,
    seed_assessments,
    seed_courses,
    seed_credits,
    seed_pathways,
    seed_roles,
    seed_teams,
    seed_users,
)
from app.seed.curriculum import (
    COURSE_META,
    seed_curriculum_courses,
    seed_questions,
)


class Repository:
    """In-memory data layer.

    Behaves like a real data layer (query, get-by-id, filter) so it can be
    swapped for a real database later without changing service code.
    """

    def __init__(self) -> None:
        self._users: list[User] = seed_users()
        self._roles: list[dict] = seed_roles()
        self._teams: list[Team] = seed_teams()
        self._pathways: list[Pathway] = seed_pathways()
        self._courses: list[Course] = seed_courses()
        self._assessments: list[Assessment] = seed_assessments()
        self._asm_milestones: list[ASMMilestone] = seed_asm_milestones()
        self._associates: list[Associate] = seed_associates()
        self._associate_assessments: list[AssociateAssessment] = seed_associate_assessments()
        self._associate_asm_milestones: list[AssociateASMMilestone] = seed_associate_asm_milestones()
        self._credits: list[CreditEntry] = seed_credits()
        self._associate_pathways: list[AssociatePathway] = seed_associate_pathways()
        # Phase 2
        self._curriculum_courses: list[CurriculumCourse] = seed_curriculum_courses()
        self._questions: list[Question] = seed_questions()
        self._attempts: dict[str, dict] = {}

    # Roles
    def get_roles(self) -> list[dict]:
        return list(self._roles)

    # Users
    def get_users(self) -> list[User]:
        return list(self._users)

    def get_user(self, user_id: str) -> Optional[User]:
        for u in self._users:
            if u.id == user_id:
                return u
        return None

    def get_users_by_role(self, role: Role) -> list[User]:
        return [u for u in self._users if u.role == role]

    # Teams
    def get_teams(self) -> list[Team]:
        return list(self._teams)

    # Pathways
    def get_pathways(self) -> list[Pathway]:
        return list(self._pathways)

    def get_pathway(self, pathway_id: str) -> Optional[Pathway]:
        for p in self._pathways:
            if p.id == pathway_id:
                return p
        return None

    def get_pathway_by_code(self, code: str) -> Optional[Pathway]:
        for p in self._pathways:
            if p.code == code:
                return p
        return None

    def get_associate_pathway(self, associate_id: str) -> Optional[AssociatePathway]:
        for ap in self._associate_pathways:
            if ap.code and associate_id == self._associate_id_for_pathway(ap):
                return ap
        # fallback: match by pathway code on associate
        assoc = self.get_associate(associate_id)
        if not assoc:
            return None
        for ap in self._associate_pathways:
            if ap.code == assoc.pathway_code:
                return ap
        return None

    def _associate_id_for_pathway(self, ap: AssociatePathway) -> Optional[str]:
        # associate_pathways are ordered to match associates list
        idx = self._associate_pathways.index(ap)
        if idx < len(self._associates):
            return self._associates[idx].id
        return None

    # Courses
    def get_courses(self) -> list[Course]:
        return list(self._courses)

    def get_course(self, course_id: str) -> Optional[Course]:
        for c in self._courses:
            if c.id == course_id:
                return c
        return None

    # Assessments
    def get_assessments(self) -> list[Assessment]:
        return list(self._assessments)

    def get_assessment(self, assessment_id: str) -> Optional[Assessment]:
        for a in self._assessments:
            if a.id == assessment_id:
                return a
        return None

    def get_associate_assessments(self, associate_id: str) -> list[AssociateAssessment]:
        return [a for a in self._associate_assessments if a.associate_id == associate_id]

    # ASM Milestones
    def get_asm_milestones(self) -> list[ASMMilestone]:
        return list(self._asm_milestones)

    def get_asm_milestone(self, milestone_id: str) -> Optional[ASMMilestone]:
        for m in self._asm_milestones:
            if m.id == milestone_id:
                return m
        return None

    def get_associate_asm_milestones(self, associate_id: str) -> list[AssociateASMMilestone]:
        return [m for m in self._associate_asm_milestones if m.associate_id == associate_id]

    # Associates
    def get_associates(self) -> list[Associate]:
        return list(self._associates)

    def get_associate(self, associate_id: str) -> Optional[Associate]:
        for a in self._associates:
            if a.id == associate_id:
                return a
        return None

    def get_associate_by_user(self, user_id: str) -> Optional[Associate]:
        for a in self._associates:
            if a.user_id == user_id:
                return a
        return None

    def get_associates_by_mentor(self, mentor_user_id: str) -> list[Associate]:
        return [a for a in self._associates if a.mentor_id == mentor_user_id]

    def get_associates_by_sponsor(self, sponsor_user_id: str) -> list[Associate]:
        return [a for a in self._associates if a.sponsor_id == sponsor_user_id]

    # Credits
    def get_credits(self, associate_id: str) -> list[CreditEntry]:
        return [c for c in self._credits if c.associate_id == associate_id]

    def get_credit_balance(self, associate_id: str) -> int:
        entries = self.get_credits(associate_id)
        if not entries:
            return 0
        return max(c.balance_after for c in entries)

    # ------------------------------------------------------------------
    # Phase 2 — Curriculum, Question Bank, Assessment Attempts
    # ------------------------------------------------------------------

    def get_curriculum_courses(self) -> list[CurriculumCourse]:
        return list(self._curriculum_courses)

    def get_curriculum_course(self, course_id: str) -> Optional[CurriculumCourse]:
        for c in self._curriculum_courses:
            if c.id == course_id:
                return c
        return None

    def get_course_meta(self, course_id: str) -> Optional[dict]:
        return COURSE_META.get(course_id)

    def get_questions_by_course(self, course_id: str) -> list[Question]:
        return [q for q in self._questions if q.course_id == course_id]

    def get_question(self, question_id: str) -> Optional[Question]:
        for q in self._questions:
            if q.id == question_id:
                return q
        return None

    def create_attempt(self, course_id: str, associate_id: str) -> dict:
        meta = self.get_course_meta(course_id)
        if not meta:
            return {}
        questions = self.get_questions_by_course(course_id)
        attempt_id = f"att-{uuid.uuid4().hex[:12]}"
        attempt = {
            "id": attempt_id,
            "course_id": course_id,
            "course_code": meta["code"],
            "course_name": meta["name"],
            "domain": meta["domain"],
            "associate_id": associate_id,
            "status": "IN_PROGRESS",
            "started_at": datetime.now(timezone.utc),
            "time_limit_minutes": meta["time_limit"],
            "passing_score": meta["passing_score"],
            "questions": questions,
            "answers": {},
            "marked": [],
            "current_index": 0,
        }
        self._attempts[attempt_id] = attempt
        return attempt

    def get_attempt(self, attempt_id: str) -> Optional[dict]:
        return self._attempts.get(attempt_id)

    def save_answer(self, attempt_id: str, question_id: str, selected_option: str) -> Optional[dict]:
        attempt = self._attempts.get(attempt_id)
        if not attempt:
            return None
        attempt["answers"][question_id] = selected_option
        return attempt

    def toggle_mark(self, attempt_id: str, question_id: str) -> Optional[dict]:
        attempt = self._attempts.get(attempt_id)
        if not attempt:
            return None
        if question_id in attempt["marked"]:
            attempt["marked"].remove(question_id)
        else:
            attempt["marked"].append(question_id)
        return attempt

    def set_current_index(self, attempt_id: str, index: int) -> Optional[dict]:
        attempt = self._attempts.get(attempt_id)
        if not attempt:
            return None
        attempt["current_index"] = index
        return attempt

    def submit_attempt(self, attempt_id: str) -> Optional[dict]:
        attempt = self._attempts.get(attempt_id)
        if not attempt:
            return None
        attempt["status"] = "SUBMITTED"
        attempt["completed_at"] = datetime.now(timezone.utc)
        return attempt

    def compute_result(self, attempt_id: str) -> Optional[AttemptResult]:
        attempt = self._attempts.get(attempt_id)
        if not attempt:
            return None
        questions: list[Question] = attempt["questions"]
        answers: dict[str, str] = attempt["answers"]
        total = len(questions)
        correct = 0
        incorrect = 0
        skipped = 0
        domain_map: dict[str, dict] = {}
        tier_map: dict[str, dict] = {}

        for q in questions:
            selected = answers.get(q.id)
            domain = q.domain
            tier = q.tier.value

            if domain not in domain_map:
                domain_map[domain] = {"total": 0, "correct": 0, "incorrect": 0, "skipped": 0}
            if tier not in tier_map:
                tier_map[tier] = {"total": 0, "correct": 0, "incorrect": 0, "skipped": 0}

            domain_map[domain]["total"] += 1
            tier_map[tier]["total"] += 1

            if selected is None:
                skipped += 1
                domain_map[domain]["skipped"] += 1
                tier_map[tier]["skipped"] += 1
            elif selected == q.correct_answer:
                correct += 1
                domain_map[domain]["correct"] += 1
                tier_map[tier]["correct"] += 1
            else:
                incorrect += 1
                domain_map[domain]["incorrect"] += 1
                tier_map[tier]["incorrect"] += 1

        score = round((correct / total * 100)) if total > 0 else 0
        passing_score = attempt["passing_score"]
        passed = score >= passing_score

        domain_scores = [
            DomainScore(
                domain=d,
                total=v["total"],
                correct=v["correct"],
                incorrect=v["incorrect"],
                skipped=v["skipped"],
                percentage=round((v["correct"] / v["total"] * 100)) if v["total"] > 0 else 0,
            )
            for d, v in domain_map.items()
        ]
        tier_performance = [
            TierPerformance(
                tier=t,
                total=v["total"],
                correct=v["correct"],
                incorrect=v["incorrect"],
                skipped=v["skipped"],
                percentage=round((v["correct"] / v["total"] * 100)) if v["total"] > 0 else 0,
            )
            for t, v in tier_map.items()
        ]

        strongest = max(domain_scores, key=lambda d: d.percentage, default=None)
        weakest = min(domain_scores, key=lambda d: d.percentage, default=None)
        strongest_area = strongest.domain if strongest else "N/A"
        improvement_area = weakest.domain if weakest else "N/A"

        if passed:
            recommended = f"Advance to the next course in the {attempt['domain']} track."
        else:
            recommended = f"Review {improvement_area} concepts and retake the assessment."

        insights = PerformanceInsight(
            strongest_area=strongest_area,
            improvement_area=improvement_area,
            recommended_next_action=recommended,
        )

        return AttemptResult(
            attempt_id=attempt_id,
            course_id=attempt["course_id"],
            course_code=attempt["course_code"],
            course_name=attempt["course_name"],
            associate_id=attempt["associate_id"],
            status="COMPLETED",
            score=score,
            correct=correct,
            incorrect=incorrect,
            skipped=skipped,
            total_questions=total,
            passing_score=passing_score,
            passed=passed,
            gate_status="PASSED" if passed else "NEEDS_IMPROVEMENT",
            domain_scores=domain_scores,
            tier_performance=tier_performance,
            insights=insights,
            completed_at=attempt.get("completed_at") or datetime.now(timezone.utc),
        )


# Module-level singleton so data persists across requests within a process.
_repo: Optional[Repository] = None


def get_repository() -> Repository:
    global _repo
    if _repo is None:
        _repo = Repository()
    return _repo
