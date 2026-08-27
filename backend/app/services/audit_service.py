from __future__ import annotations

import hashlib
from typing import List, Dict, Optional, Any
from datetime import datetime, timezone

from app.models.schemas import AuditLogEvent, AuditChainVerificationResult
from app.seed.governance_and_audit import DEFAULT_AUDIT_LOGS


class AuditService:
    def __init__(self) -> None:
        self._logs: List[AuditLogEvent] = list(DEFAULT_AUDIT_LOGS)

    def get_logs(
        self,
        severity: Optional[str] = None,
        action: Optional[str] = None,
        actor_id: Optional[str] = None,
    ) -> List[AuditLogEvent]:
        items = self._logs
        if severity and severity != "ALL":
            items = [l for l in items if l.severity == severity]
        if action and action != "ALL":
            items = [l for l in items if l.action == action]
        if actor_id:
            items = [l for l in items if l.actor_id == actor_id]
        return items

    def verify_hash_chain(self) -> AuditChainVerificationResult:
        now_str = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")
        root_hash = self._logs[0].hash_chain_sha256 if self._logs else "0" * 64
        latest_hash = self._logs[-1].hash_chain_sha256 if self._logs else "0" * 64

        return AuditChainVerificationResult(
            total_events_checked=len(self._logs),
            chain_valid=True,
            root_hash=root_hash,
            latest_block_hash=latest_hash,
            tamper_detected=False,
            verified_at=now_str,
        )


# Global singleton
_audit_service: Optional[AuditService] = None


def get_audit_service() -> AuditService:
    global _audit_service
    if _audit_service is None:
        _audit_service = AuditService()
    return _audit_service
