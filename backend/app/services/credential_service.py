from __future__ import annotations

import hashlib
import uuid
from typing import List, Dict, Optional
from datetime import datetime, timezone

from app.models.schemas import DigitalCredential, IssueCredentialRequest
from app.seed.credentials_and_asm import DEFAULT_CREDENTIALS


class CredentialService:
    def __init__(self) -> None:
        self._credentials: Dict[str, DigitalCredential] = {c.id: c for c in DEFAULT_CREDENTIALS}

    def _compute_sha256(self, payload_str: str) -> str:
        return hashlib.sha256(payload_str.encode("utf-8")).hexdigest()

    def get_credentials(self, associate_id: Optional[str] = None) -> List[DigitalCredential]:
        items = list(self._credentials.values())
        if associate_id:
            items = [c for c in items if c.associate_id == associate_id]
        return items

    def get_credential(self, credential_id: str) -> Optional[DigitalCredential]:
        return self._credentials.get(credential_id)

    def issue_credential(self, req: IssueCredentialRequest) -> DigitalCredential:
        cred_id = f"cred-asc-{uuid.uuid4().hex[:8]}"
        issue_date = datetime.now(timezone.utc).strftime("%Y-%m-%d")
        
        raw_payload = f"{req.associate_id}:{req.title}:{issue_date}:{','.join(req.skills_verified)}"
        verification_hash = self._compute_sha256(raw_payload)

        new_cred = DigitalCredential(
            id=cred_id,
            credential_code=f"ASCEND-{req.badge_tier}-{uuid.uuid4().hex[:6].upper()}",
            title=req.title,
            badge_tier=req.badge_tier,
            associate_id=req.associate_id,
            associate_name="Ananya Rao" if req.associate_id == "as-ananya" else "Associate",
            issue_date=issue_date,
            expiry_date="2029-08-30",
            verification_hash_sha256=verification_hash,
            public_verification_url=f"/verify/{cred_id}",
            skills_verified=req.skills_verified,
            evidence_summary=req.evidence_summary,
            issuing_authority="ASCEND Global Engineering Excellence Board",
            status="ACTIVE",
            qr_code_data=f"https://ascend.enterprise.internal/verify/{cred_id}?sha={verification_hash[:16]}",
        )

        self._credentials[new_cred.id] = new_cred
        return new_cred


# Global singleton
_credential_service: Optional[CredentialService] = None


def get_credential_service() -> CredentialService:
    global _credential_service
    if _credential_service is None:
        _credential_service = CredentialService()
    return _credential_service
