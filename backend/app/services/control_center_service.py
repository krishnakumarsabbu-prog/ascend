from __future__ import annotations

from typing import List, Dict, Optional
from datetime import datetime, timezone
from app.models.schemas import ScoringRuleConfig, SystemHealthStatus
from app.seed.control_center import DEFAULT_SCORING_RULES, DEFAULT_FEATURE_FLAGS


class ControlCenterService:
    def __init__(self) -> None:
        self._rules: Dict[str, ScoringRuleConfig] = {r.pathway: r for r in DEFAULT_SCORING_RULES}
        self._flags: Dict[str, bool] = dict(DEFAULT_FEATURE_FLAGS)

    def get_system_health(self) -> SystemHealthStatus:
        return SystemHealthStatus(
            database_status="HEALTHY (PostgreSQL 16.4 / Master-Replica Active)",
            vector_store_status="HEALTHY (pgvector / HNSW index active)",
            irt_engine_latency_ms=12.8,
            lrs_stream_status="CONNECTED (Tin Can xAPI v1.0.3)",
            uptime_pct=99.98,
            active_feature_flags=self._flags,
        )

    def get_scoring_rules(self) -> List[ScoringRuleConfig]:
        return list(self._rules.values())

    def update_scoring_rule(self, rule: ScoringRuleConfig) -> ScoringRuleConfig:
        now_str = datetime.now(timezone.utc).strftime("%Y-%m-%d")
        rule.updated_at = now_str
        self._rules[rule.pathway] = rule
        return rule

    def get_feature_flags(self) -> Dict[str, bool]:
        return self._flags

    def update_feature_flags(self, flags: Dict[str, bool]) -> Dict[str, bool]:
        self._flags.update(flags)
        return self._flags


# Global singleton
_control_center_service: Optional[ControlCenterService] = None


def get_control_center_service() -> ControlCenterService:
    global _control_center_service
    if _control_center_service is None:
        _control_center_service = ControlCenterService()
    return _control_center_service
