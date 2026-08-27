from __future__ import annotations

from typing import List
from app.models.schemas import (
    LMSConnector,
    HRISConnector,
    ActivityStreamEvent,
    PresenceSession,
)

# ---------------------------------------------------------------------------
# Seed LMS / LXP Integration Connectors (Requirement 31)
# ---------------------------------------------------------------------------

DEFAULT_LMS_CONNECTORS: List[LMSConnector] = [
    LMSConnector(
        id="lms-coursera",
        provider="COURSERA",
        name="Coursera for Business Enterprise",
        status="CONNECTED",
        sync_frequency="REAL_TIME_WEBHOOK",
        last_synced_at="2026-08-27 12:45:00 UTC",
        total_records_synced=3420,
        health_score=99.9,
        credentials_masked="oauth_client_id: cser_ent_94883****, cert: valid",
    ),
    LMSConnector(
        id="lms-pluralsight",
        provider="PLURALSIGHT",
        name="Pluralsight Skills & Role IQ",
        status="CONNECTED",
        sync_frequency="HOURLY",
        last_synced_at="2026-08-27 12:00:00 UTC",
        total_records_synced=1850,
        health_score=99.4,
        credentials_masked="api_key: ps_live_sec_****, tenant: enterprise",
    ),
    LMSConnector(
        id="lms-degreed",
        provider="DEGREED",
        name="Degreed LXP Pathway Sync",
        status="CONNECTED",
        sync_frequency="DAILY",
        last_synced_at="2026-08-27 06:00:00 UTC",
        total_records_synced=4210,
        health_score=100.0,
        credentials_masked="client_secret: dgr_prod_sec_****, org_id: 1042",
    ),
    LMSConnector(
        id="lms-xapi-scorm",
        provider="SCORM_XAPI",
        name="Tin Can (xAPI) Learning Record Store (LRS)",
        status="CONNECTED",
        sync_frequency="REAL_TIME_STREAM",
        last_synced_at="2026-08-27 13:00:00 UTC",
        total_records_synced=8920,
        health_score=99.8,
        credentials_masked="endpoint: https://lrs.internal.ascend/xAPI, auth: Bearer ****",
    ),
]


# ---------------------------------------------------------------------------
# Seed HRIS / ATS Connectors (Requirement 32)
# ---------------------------------------------------------------------------

DEFAULT_HRIS_CONNECTORS: List[HRISConnector] = [
    DEFAULT_HRIS_WORKDAY := HRISConnector(
        id="hris-workday",
        provider="WORKDAY",
        name="Workday Human Capital Management (HCM)",
        status="CONNECTED",
        sync_direction="BIDIRECTIONAL",
        last_synced_at="2026-08-27 11:30:00 UTC",
        active_pipeline_count=52,
    ),
    HRISConnector(
        id="hris-greenhouse",
        provider="GREENHOUSE",
        name="Greenhouse ATS Pre-Onboarding Ingestion",
        status="CONNECTED",
        sync_direction="INBOUND_ATS",
        last_synced_at="2026-08-27 12:15:00 UTC",
        active_pipeline_count=38,
    ),
    HRISConnector(
        id="hris-successfactors",
        provider="SUCCESSFACTORS",
        name="SAP SuccessFactors Talent & Performance",
        status="IDLE",
        sync_direction="OUTBOUND_HRIS",
        last_synced_at="2026-08-26 18:00:00 UTC",
        active_pipeline_count=14,
    ),
]


# ---------------------------------------------------------------------------
# Seed Global Activity Stream & Presence (Requirement 34)
# ---------------------------------------------------------------------------

DEFAULT_ACTIVITY_STREAM: List[ActivityStreamEvent] = [
    ActivityStreamEvent(
        id="evt-101",
        timestamp="2 mins ago",
        event_type="CREDENTIAL_ISSUED",
        actor_id="u-priya",
        actor_name="Priya Nair",
        actor_avatar="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
        description="Minted cryptographically verified certificate 'ASCEND Certified Distributed Systems Architect' for Ananya Rao.",
        entity_type="CREDENTIAL",
        entity_id="cred-asc-ananya-001",
        severity="SUCCESS",
    ),
    ActivityStreamEvent(
        id="evt-102",
        timestamp="8 mins ago",
        event_type="GIG_APPLIED",
        actor_id="u-rohan",
        actor_name="Rohan Mehta",
        actor_avatar="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
        description="Submitted 1-click application for marketplace gig 'Kafka Partitioning & Outbox Deduplication Engine'.",
        entity_type="GIG",
        entity_id="gig-kafka-outbox",
        severity="NORMAL",
    ),
    ActivityStreamEvent(
        id="evt-103",
        timestamp="15 mins ago",
        event_type="DEFENSE_RATIFIED",
        actor_id="u-priya",
        actor_name="Priya Nair",
        actor_avatar="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
        description="Ratified 5-part rubric score (4.65/5.00) on Capstone Defense for ASM-104 Payments Ledger.",
        entity_type="ASM_PROJECT",
        entity_id="asm-proj-101",
        severity="SUCCESS",
    ),
    ActivityStreamEvent(
        id="evt-104",
        timestamp="24 mins ago",
        event_type="ASSESSMENT_SUBMITTED",
        actor_id="u-ananya",
        actor_name="Ananya Rao",
        actor_avatar="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
        description="Completed Computerized Adaptive Test in Distributed Systems with ability score θ = +1.45 (Standard Error ≤ 0.26).",
        entity_type="ASSESSMENT",
        entity_id="cat-session-001",
        severity="NORMAL",
    ),
    ActivityStreamEvent(
        id="evt-105",
        timestamp="35 mins ago",
        event_type="CODE_EXECUTED",
        actor_id="u-rohan",
        actor_name="Rohan Mehta",
        actor_avatar="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
        description="Executed HackerRank Code Challenge 'Deadlock-Free Two-Phase Commit' with 10/10 test cases passed in 42ms.",
        entity_type="CODE_RUN",
        entity_id="cc-101",
        severity="SUCCESS",
    ),
]

DEFAULT_PRESENCE_SESSIONS: List[PresenceSession] = [
    PresenceSession(
        user_id="u-ananya",
        user_name="Ananya Rao",
        role="EARLY_TALENT",
        status="IN_ASSESSMENT",
        current_activity="Taking Adaptive IRT Exam on Virtual Threads Concurrency",
        active_device="Desktop (Edge / Windows)",
        last_ping="Just now",
    ),
    PresenceSession(
        user_id="u-rohan",
        user_name="Rohan Mehta",
        role="EARLY_TALENT",
        status="ONLINE",
        current_activity="Browsing Talent Marketplace Gigs",
        active_device="Desktop (Chrome / macOS)",
        last_ping="1 min ago",
    ),
    PresenceSession(
        user_id="u-priya",
        user_name="Priya Nair",
        role="ENGINEERING_EXCELLENCE_COMMITTEE",
        status="IN_DEFENSE_PANEL",
        current_activity="Deliberating Architect Board Rubric for ASM-104",
        active_device="Desktop (Chrome / Windows)",
        last_ping="Just now",
    ),
    PresenceSession(
        user_id="u-vikram",
        user_name="Vikram Desai",
        role="TECHNOLOGY_HEAD",
        status="ONLINE",
        current_activity="Reviewing Strategic Workforce Scenario Simulations",
        active_device="iPad Pro (Safari / iOS)",
        last_ping="3 mins ago",
    ),
]
