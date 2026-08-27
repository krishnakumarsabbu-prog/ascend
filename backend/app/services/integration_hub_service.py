from __future__ import annotations

from typing import List, Dict, Optional, Any
from datetime import datetime, timezone
from app.models.schemas import LMSConnector, HRISConnector, XAPIStatement
from app.seed.integrations_and_stream import DEFAULT_LMS_CONNECTORS, DEFAULT_HRIS_CONNECTORS


class IntegrationHubService:
    def __init__(self) -> None:
        self._lms: Dict[str, LMSConnector] = {c.id: c for c in DEFAULT_LMS_CONNECTORS}
        self._hris: Dict[str, HRISConnector] = {h.id: h for h in DEFAULT_HRIS_CONNECTORS}

    def get_lms_connectors(self) -> List[LMSConnector]:
        return list(self._lms.values())

    def trigger_lms_sync(self, connector_id: str) -> LMSConnector:
        connector = self._lms.get(connector_id)
        if not connector:
            raise ValueError(f"LMS connector '{connector_id}' not found")

        now_str = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")
        connector.status = "CONNECTED"
        connector.last_synced_at = now_str
        connector.total_records_synced += 24
        return connector

    def get_hris_connectors(self) -> List[HRISConnector]:
        return list(self._hris.values())

    def ingest_xapi_statement(self, stmt: XAPIStatement) -> Dict[str, Any]:
        return {
            "status": "INGESTED",
            "actor": stmt.actor_email,
            "verb": stmt.verb,
            "activity": stmt.activity_name,
            "mapped_skill_id": stmt.mapped_skill_id or "sk-distributed-systems",
            "evidence_ledger_entry_id": "ev-xapi-90412",
            "message": f"Successfully ingested xAPI record and credited competency evidence to {stmt.actor_email}.",
        }


# Global singleton
_integration_hub_service: Optional[IntegrationHubService] = None


def get_integration_hub_service() -> IntegrationHubService:
    global _integration_hub_service
    if _integration_hub_service is None:
        _integration_hub_service = IntegrationHubService()
    return _integration_hub_service
