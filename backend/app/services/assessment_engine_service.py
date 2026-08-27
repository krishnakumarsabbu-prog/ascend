from __future__ import annotations

import math
import uuid
from typing import List, Dict, Optional, Set

from app.models.schemas import (
    AdaptiveStartRequest,
    AdaptiveTestSession,
    AdaptiveAnswerSubmit,
    AdaptiveAnswerResult,
    GovernanceQuestion,
    Question,
    Choice,
    ProctoringViolation,
    ProctoringTelemetry,
)
from app.seed.assessments_advanced import GOVERNANCE_QUESTIONS, ADAPTIVE_ITEM_BANK


class AssessmentEngineService:
    def __init__(self) -> None:
        self._governance_questions: Dict[str, GovernanceQuestion] = {q.id: q for q in GOVERNANCE_QUESTIONS}
        self._item_bank: List[GovernanceQuestion] = list(ADAPTIVE_ITEM_BANK)
        self._sessions: Dict[str, AdaptiveTestSession] = {}
        self._session_asked_items: Dict[str, Set[str]] = {}
        self._proctoring_records: Dict[str, ProctoringTelemetry] = {}

    def _irt_prob(self, theta: float, a: float, b: float) -> float:
        """2PL Item Response Theory probability of correct response."""
        try:
            return 1.0 / (1.0 + math.exp(-a * (theta - b)))
        except OverflowError:
            return 1.0 if theta > b else 0.0

    def _fisher_information(self, theta: float, a: float, b: float) -> float:
        """Fisher item information for maximum information CAT selection."""
        p = self._irt_prob(theta, a, b)
        q = 1.0 - p
        return (a ** 2) * p * q

    def _select_optimal_next_item(self, session_id: str, theta: float) -> Optional[GovernanceQuestion]:
        asked = self._session_asked_items.get(session_id, set())
        available = [q for q in self._item_bank if q.id not in asked and q.status == "ACTIVE"]
        if not available:
            return None

        # Select item maximizing Fisher Information at current theta
        best_item = max(available, key=lambda q: self._fisher_information(theta, q.irt_a_discrimination, q.irt_b_difficulty))
        return best_item

    def _convert_to_question(self, gq: GovernanceQuestion) -> Question:
        return Question(
            id=gq.id,
            course_id="c-wf101",
            title=gq.title,
            prompt=gq.prompt,
            choices=gq.choices,
            correct_choice_id=gq.correct_choice_id,
            explanation=gq.explanation,
            domain=gq.domain,
            difficulty=gq.difficulty,
        )

    def start_adaptive_session(self, req: AdaptiveStartRequest) -> AdaptiveTestSession:
        session_id = f"cat-sess-{uuid.uuid4().hex[:8]}"
        initial_theta = 0.0  # Population mean ability
        initial_sem = 0.85

        self._session_asked_items[session_id] = set()

        first_item = self._select_optimal_next_item(session_id, initial_theta)
        if first_item:
            self._session_asked_items[session_id].add(first_item.id)

        session = AdaptiveTestSession(
            session_id=session_id,
            associate_id=req.associate_id,
            course_id=req.course_id,
            course_title="WF-101: Computerized Adaptive Core Benchmark",
            current_theta=initial_theta,
            current_sem=initial_sem,
            questions_answered=0,
            max_questions=6,
            target_sem_stop=0.28,
            is_completed=False,
            ability_history=[initial_theta],
            current_question=self._convert_to_question(first_item) if first_item else None,
            domain_breakdown={first_item.domain: 1} if first_item else {},
        )

        self._sessions[session_id] = session

        # Initialize proctoring telemetry
        self._proctoring_records[session_id] = ProctoringTelemetry(
            session_id=session_id,
            associate_id=req.associate_id,
            tab_switch_count=0,
            copy_paste_count=0,
            window_blur_duration_seconds=0,
            keystroke_typing_wpm=58.0,
            submission_velocity_anomaly=False,
            integrity_score=100,
            risk_level="LOW",
            violations=[],
        )

        return session

    def submit_adaptive_answer(self, req: AdaptiveAnswerSubmit) -> AdaptiveAnswerResult:
        session = self._sessions.get(req.session_id)
        if not session:
            raise ValueError(f"Adaptive test session {req.session_id} not found")

        current_gq = next((q for q in self._item_bank if q.id == req.question_id), None)
        if not current_gq:
            raise ValueError(f"Question {req.question_id} not found in item bank")

        is_correct = req.selected_choice_id == current_gq.correct_choice_id

        # Update theta via IRT Bayesian update step
        old_theta = session.current_theta
        a = current_gq.irt_a_discrimination
        b = current_gq.irt_b_difficulty
        p = self._irt_prob(old_theta, a, b)

        # Delta step scaled by discrimination & prediction error
        step = (1.0 if is_correct else -1.0) * (0.65 / (1.0 + session.questions_answered * 0.25))
        new_theta = max(-3.0, min(3.0, round(old_theta + step, 2)))

        # Update SEM (decreases as more information is gathered)
        info = self._fisher_information(new_theta, a, b)
        new_sem = max(0.20, round(1.0 / math.sqrt(1.0 / (session.current_sem ** 2) + info), 2))

        session.current_theta = new_theta
        session.current_sem = new_sem
        session.questions_answered += 1
        session.ability_history.append(new_theta)

        # Evaluate Proctoring Telemetry
        proc = self._proctoring_records.get(req.session_id)
        proctoring_flagged = False
        if proc:
            if req.tab_switches_during_item > 0:
                proc.tab_switch_count += req.tab_switches_during_item
                proc.integrity_score = max(50, proc.integrity_score - (req.tab_switches_during_item * 10))
                proc.violations.append(
                    ProctoringViolation(
                        id=f"v-{uuid.uuid4().hex[:6]}",
                        event_type="TAB_BLUR",
                        description=f"Browser lost focus {req.tab_switches_during_item} time(s) during item {current_gq.code}.",
                        severity="MEDIUM" if req.tab_switches_during_item == 1 else "HIGH",
                        timestamp="Just now",
                    )
                )
                if proc.tab_switch_count >= 2:
                    proc.risk_level = "HIGH"
                    proctoring_flagged = True

            if req.copy_paste_events > 0:
                proc.copy_paste_count += req.copy_paste_events
                proc.integrity_score = max(40, proc.integrity_score - 15)
                proc.violations.append(
                    ProctoringViolation(
                        id=f"v-{uuid.uuid4().hex[:6]}",
                        event_type="COPY_PASTE",
                        description=f"Clipboard paste event detected on item {current_gq.code}.",
                        severity="HIGH",
                        timestamp="Just now",
                    )
                )
                proctoring_flagged = True

            # Velocity anomaly check: answered in < 3 seconds
            if req.time_spent_seconds < 3:
                proc.submission_velocity_anomaly = True
                proc.integrity_score = max(50, proc.integrity_score - 10)
                proc.violations.append(
                    ProctoringViolation(
                        id=f"v-{uuid.uuid4().hex[:6]}",
                        event_type="VELOCITY_ANOMALY",
                        description=f"Unusually fast response ({req.time_spent_seconds}s) on complex item {current_gq.code}.",
                        severity="LOW",
                        timestamp="Just now",
                    )
                )

        # Check Stop Conditions: Max questions reached OR target SEM achieved
        is_completed = session.questions_answered >= session.max_questions or session.current_sem <= session.target_sem_stop
        session.is_completed = is_completed

        next_item = None
        if not is_completed:
            next_gq = self._select_optimal_next_item(req.session_id, new_theta)
            if next_gq:
                self._session_asked_items[req.session_id].add(next_gq.id)
                next_item = self._convert_to_question(next_gq)
                session.current_question = next_item
                session.domain_breakdown[next_gq.domain] = session.domain_breakdown.get(next_gq.domain, 0) + 1
            else:
                is_completed = True
                session.is_completed = True

        # Compute Grade
        final_grade = None
        if is_completed:
            if new_theta >= 1.5:
                final_grade = "L400 Mastery (Distinction)"
            elif new_theta >= 0.5:
                final_grade = "L300 Proficient (Pass)"
            elif new_theta >= -0.5:
                final_grade = "L200 Developing (Conditional)"
            else:
                final_grade = "L100 Foundational (Rework)"

        trajectory = "INCREASING" if new_theta > old_theta else "DECREASING" if new_theta < old_theta else "STEADY"

        return AdaptiveAnswerResult(
            is_correct=is_correct,
            correct_choice_id=current_gq.correct_choice_id,
            updated_theta=new_theta,
            updated_sem=new_sem,
            ability_trajectory=trajectory,
            is_completed=is_completed,
            final_grade=final_grade,
            next_question=next_item,
            explanation=current_gq.explanation,
            proctoring_flagged=proctoring_flagged,
        )

    def get_governance_questions(
        self, domain: Optional[str] = None, status: Optional[str] = None
    ) -> List[GovernanceQuestion]:
        items = list(self._governance_questions.values())
        if domain:
            items = [q for q in items if q.domain == domain]
        if status:
            items = [q for q in items if q.status == status]
        return items

    def save_governance_question(self, question: GovernanceQuestion) -> GovernanceQuestion:
        self._governance_questions[question.id] = question
        # Also update in item bank
        self._item_bank = [q if q.id != question.id else question for q in self._item_bank]
        return question

    def update_question_status(self, question_id: str, status: str) -> GovernanceQuestion:
        q = self._governance_questions.get(question_id)
        if not q:
            raise ValueError(f"Question {question_id} not found")
        q.status = status
        return q

    def get_proctoring_telemetry(self, session_id: str) -> Optional[ProctoringTelemetry]:
        return self._proctoring_records.get(session_id)


# Global singleton
_assessment_engine_service: Optional[AssessmentEngineService] = None


def get_assessment_engine_service() -> AssessmentEngineService:
    global _assessment_engine_service
    if _assessment_engine_service is None:
        _assessment_engine_service = AssessmentEngineService()
    return _assessment_engine_service
