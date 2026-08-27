from __future__ import annotations

from typing import List, Dict
from app.models.schemas import ScoringRuleConfig, SystemHealthStatus

# ---------------------------------------------------------------------------
# Seed Scoring Rules per Pathway (Requirement 35)
# ---------------------------------------------------------------------------

DEFAULT_SCORING_RULES: List[ScoringRuleConfig] = [
    ScoringRuleConfig(
        id="score-rule-se",
        pathway="SOFTWARE_ENGINEERING",
        technical_weight=0.35,
        architecture_weight=0.25,
        cloud_weight=0.15,
        production_weight=0.15,
        leadership_weight=0.10,
        cat_sem_target=0.28,
        minimum_passing_score=80.0,
        updated_at="2026-08-25",
    ),
    ScoringRuleConfig(
        id="score-rule-ai",
        pathway="AI_ENGINEERING",
        technical_weight=0.30,
        architecture_weight=0.20,
        cloud_weight=0.15,
        production_weight=0.25,
        leadership_weight=0.10,
        cat_sem_target=0.25,
        minimum_passing_score=82.0,
        updated_at="2026-08-26",
    ),
    ScoringRuleConfig(
        id="score-rule-cloud",
        pathway="CLOUD_INFRASTRUCTURE",
        technical_weight=0.25,
        architecture_weight=0.25,
        cloud_weight=0.30,
        production_weight=0.10,
        leadership_weight=0.10,
        cat_sem_target=0.28,
        minimum_passing_score=78.0,
        updated_at="2026-08-24",
    ),
]

DEFAULT_FEATURE_FLAGS: Dict[str, bool] = {
    "enable_cat_adaptive_testing": True,
    "enable_ai_coach": True,
    "enable_talent_marketplace": True,
    "enable_cryptographic_verification": True,
    "enable_auto_escalation_slas": True,
    "enable_proctoring_telemetry": True,
    "enable_xapi_stream_ingestion": True,
}
