from __future__ import annotations

import uuid
from typing import List, Dict, Optional
from datetime import datetime, timezone

from app.models.schemas import CurriculumVersion, CurriculumBranchRequest
from app.seed.governance_and_audit import DEFAULT_CURRICULUM_VERSIONS


class CurriculumVersionService:
    def __init__(self) -> None:
        self._versions: Dict[str, CurriculumVersion] = {v.id: v for v in DEFAULT_CURRICULUM_VERSIONS}

    def get_versions(self, course_id: Optional[str] = None) -> List[CurriculumVersion]:
        items = list(self._versions.values())
        if course_id:
            items = [v for v in items if v.course_id == course_id]
        return items

    def create_branch(self, req: CurriculumBranchRequest) -> CurriculumVersion:
        new_id = f"cver-{uuid.uuid4().hex[:6]}"
        now_str = datetime.now(timezone.utc).strftime("%Y-%m-%d")

        new_version = CurriculumVersion(
            id=new_id,
            course_id=req.course_id,
            course_code="WF-101",
            course_title="Advanced Distributed Systems & High-Throughput Java 21",
            version=f"{req.base_version}-branch",
            branch_name=req.new_branch_name,
            status="DRAFT",
            author=req.author,
            approved_by=None,
            changelog_summary=req.changelog_summary,
            modules_count=7,
            learning_objectives_diff=["New branch experiment modules"],
            assigned_cohorts=[],
            created_at=now_str,
        )

        self._versions[new_version.id] = new_version
        return new_version


# Global singleton
_curriculum_version_service: Optional[CurriculumVersionService] = None


def get_curriculum_version_service() -> CurriculumVersionService:
    global _curriculum_version_service
    if _curriculum_version_service is None:
        _curriculum_version_service = CurriculumVersionService()
    return _curriculum_version_service
