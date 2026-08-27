from __future__ import annotations

from typing import List, Optional
from app.models.schemas import (
    SkillTaxonomyCategory,
    AssociateSkillProfile,
    SkillGap,
    PersonalizedLearningItem,
    SkillEvidenceDetail,
    AssociateSkill,
)
from app.seed.skills import (
    SKILL_TAXONOMY,
    build_associate_profile,
    generate_skill_gaps,
    generate_personalized_recommendations,
)


class SkillService:
    def __init__(self) -> None:
        self._profiles: dict[str, AssociateSkillProfile] = {}
        # Pre-initialize Ananya Rao profile
        self._profiles["as-ananya"] = build_associate_profile("as-ananya", "Ananya Rao")
        self._profiles["as-rohan"] = build_associate_profile("as-rohan", "Rohan Mehta")
        self._profiles["as-fatima"] = build_associate_profile("as-fatima", "Fatima Sheikh")
        self._profiles["as-karthik"] = build_associate_profile("as-karthik", "Karthik Iyer")

    def get_taxonomy(self) -> List[SkillTaxonomyCategory]:
        return SKILL_TAXONOMY

    def get_profile(self, associate_id: str, associate_name: Optional[str] = None) -> AssociateSkillProfile:
        if associate_id not in self._profiles:
            name = associate_name or f"Associate {associate_id}"
            self._profiles[associate_id] = build_associate_profile(associate_id, name)
        return self._profiles[associate_id]

    def get_gaps(self, associate_id: str) -> List[SkillGap]:
        profile = self.get_profile(associate_id)
        return generate_skill_gaps(profile.skills)

    def get_recommendations(self, associate_id: str) -> List[PersonalizedLearningItem]:
        gaps = self.get_gaps(associate_id)
        return generate_personalized_recommendations(gaps)

    def get_skill_evidence(self, associate_id: str, skill_id: str) -> Optional[AssociateSkill]:
        profile = self.get_profile(associate_id)
        for s in profile.skills:
            if s.skill_id == skill_id:
                return s
        return None


# Global singleton
_skill_service: Optional[SkillService] = None


def get_skill_service() -> SkillService:
    global _skill_service
    if _skill_service is None:
        _skill_service = SkillService()
    return _skill_service
