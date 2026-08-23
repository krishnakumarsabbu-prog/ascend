from __future__ import annotations

from typing import Optional

from app.models.schemas import AttemptResult, AttemptSummary, AttemptQuestion
from app.repositories.repository import Repository


class AssessmentService:
    """Orchestrates assessment attempts: start, fetch, answer, submit, result."""

    def __init__(self, repo: Repository) -> None:
        self.repo = repo

    def start_attempt(self, course_id: str, associate_id: str) -> Optional[AttemptSummary]:
        attempt = self.repo.create_attempt(course_id, associate_id)
        if not attempt:
            return None
        return self._to_summary(attempt)

    def get_attempt(self, attempt_id: str) -> Optional[AttemptSummary]:
        attempt = self.repo.get_attempt(attempt_id)
        if not attempt:
            return None
        return self._to_summary(attempt)

    def save_answer(self, attempt_id: str, question_id: str, selected_option: str) -> Optional[AttemptSummary]:
        attempt = self.repo.save_answer(attempt_id, question_id, selected_option)
        if not attempt:
            return None
        return self._to_summary(attempt)

    def toggle_mark(self, attempt_id: str, question_id: str) -> Optional[AttemptSummary]:
        attempt = self.repo.toggle_mark(attempt_id, question_id)
        if not attempt:
            return None
        return self._to_summary(attempt)

    def submit_attempt(self, attempt_id: str) -> Optional[AttemptResult]:
        attempt = self.repo.submit_attempt(attempt_id)
        if not attempt:
            return None
        return self.repo.compute_result(attempt_id)

    def get_result(self, attempt_id: str) -> Optional[AttemptResult]:
        attempt = self.repo.get_attempt(attempt_id)
        if not attempt or attempt.get("status") != "SUBMITTED":
            return None
        return self.repo.compute_result(attempt_id)

    def _to_summary(self, attempt: dict) -> AttemptSummary:
        questions: list[AttemptQuestion] = [
            AttemptQuestion(
                id=q.id,
                tier=q.tier,
                question=q.question,
                options=q.options,
                domain=q.domain,
            )
            for q in attempt["questions"]
        ]
        return AttemptSummary(
            id=attempt["id"],
            course_id=attempt["course_id"],
            course_code=attempt["course_code"],
            course_name=attempt["course_name"],
            associate_id=attempt["associate_id"],
            status=attempt["status"],
            started_at=attempt["started_at"],
            time_limit_minutes=attempt["time_limit_minutes"],
            total_questions=len(questions),
            answered=len(attempt["answers"]),
            marked_for_review=len(attempt["marked"]),
            current_index=attempt["current_index"],
            answers=attempt["answers"],
            marked=attempt["marked"],
        )
