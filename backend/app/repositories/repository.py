from __future__ import annotations

from typing import Optional

from app.models.schemas import (
    ASMMilestone,
    Assessment,
    Associate,
    AssociateASMMilestone,
    AssociateAssessment,
    AssociatePathway,
    Course,
    CreditEntry,
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


# Module-level singleton so data persists across requests within a process.
_repo: Optional[Repository] = None


def get_repository() -> Repository:
    global _repo
    if _repo is None:
        _repo = Repository()
    return _repo
