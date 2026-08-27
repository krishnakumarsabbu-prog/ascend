from __future__ import annotations

from typing import List, Dict, Any
from app.models.schemas import (
    MetricLineageNode,
    AuditLogEvent,
    CurriculumVersion,
)

# ---------------------------------------------------------------------------
# Seed Metric Lineage DAG Nodes (Requirement 27)
# ---------------------------------------------------------------------------

DEFAULT_METRIC_LINEAGE_NODES: List[MetricLineageNode] = [
    MetricLineageNode(
        id="comp-readiness",
        name="Overall Cohort Production Readiness",
        category="COMPOSITE_METRIC",
        formula_latex=r"R = 0.35 \cdot P_{\text{Tech}} + 0.25 \cdot P_{\text{Arch}} + 0.15 \cdot P_{\text{Cloud}} + 0.15 \cdot P_{\text{Prod}} + 0.10 \cdot P_{\text{Lead}}",
        input_sources=["Technical Pillar", "Architecture Pillar", "Cloud Pillar", "Production Pillar", "Leadership Pillar"],
        current_value=84.5,
        formatted_value="84.5%",
        update_frequency="REAL_TIME",
        owner="Executive Engineering Board",
        sensitivity_weight=1.0,
        parent_node_ids=["pil-technical", "pil-architecture", "pil-cloud", "pil-production", "pil-leadership"],
    ),
    MetricLineageNode(
        id="pil-technical",
        name="Technical Execution Pillar",
        category="PILLAR_SCORE",
        formula_latex=r"P_{\text{Tech}} = 0.40 \cdot \theta_{\text{IRT}} + 0.35 \cdot Q_{\text{Code}} + 0.25 \cdot M_{\text{Passed}}",
        input_sources=["2PL IRT Ability Score", "Code Quality & Mutation Score", "WF Module Pass Rate"],
        current_value=88.2,
        formatted_value="88.2%",
        update_frequency="REAL_TIME",
        owner="Technical Curriculum Board",
        sensitivity_weight=0.35,
        parent_node_ids=["ind-irt-theta", "ind-code-quality", "ind-test-pass-rate"],
    ),
    MetricLineageNode(
        id="pil-architecture",
        name="Architecture & Systems Defense Pillar",
        category="PILLAR_SCORE",
        formula_latex=r"P_{\text{Arch}} = 0.60 \cdot S_{\text{Board}} + 0.40 \cdot S_{\text{RFC}}",
        input_sources=["Architect Defense Multi-Rubric", "RFC Document Score"],
        current_value=74.8,
        formatted_value="74.8%",
        update_frequency="UPON_PANEL_REVIEW",
        owner="Architecture Review Board",
        sensitivity_weight=0.25,
        parent_node_ids=["ind-board-rubric", "ind-rfc-doc"],
    ),
    MetricLineageNode(
        id="ind-irt-theta",
        name="Bayesian IRT Ability Parameter (θ)",
        category="INTERMEDIATE_INDICATOR",
        formula_latex=r"\theta_{t+1} = \theta_t + \frac{u_i - P_i(\theta_t)}{I(\theta_t)}",
        input_sources=["Adaptive Question Attempts", "Item Difficulty (b)", "Discrimination (a)"],
        current_value=1.45,
        formatted_value="+1.45 θ",
        update_frequency="PER_ITEM_SUBMIT",
        owner="Psychometrics Unit",
        sensitivity_weight=0.40,
        parent_node_ids=["raw-mcq-attempt"],
    ),
    MetricLineageNode(
        id="raw-mcq-attempt",
        name="Telemetry Stream: MCQ Assessment Responses",
        category="RAW_EVENT",
        formula_latex=r"\text{ItemEvent}(u \in \{0, 1\}, t_{\text{resp}})",
        input_sources=["PostgreSQL Assessment Ledger", "Proctoring Telemetry"],
        current_value=1.0,
        formatted_value="Raw Stream",
        update_frequency="REAL_TIME",
        owner="Assessment Platform",
        sensitivity_weight=0.20,
        parent_node_ids=[],
    ),
]


# ---------------------------------------------------------------------------
# Seed Cryptographically Chained Audit Events (Requirement 28)
# ---------------------------------------------------------------------------

DEFAULT_AUDIT_LOGS: List[AuditLogEvent] = [
    AuditLogEvent(
        id="audit-blk-001",
        timestamp="2026-08-26T16:30:00Z",
        actor_id="u-priya",
        actor_name="Priya Nair",
        actor_role="ENGINEERING_EXCELLENCE_COMMITTEE",
        ip_address="10.240.12.104",
        action="APPROVE",
        resource_type="ASM_DEFENSE_PANEL",
        resource_id="asm-proj-101",
        resource_name="ASM-104 Payments Ledger Capstone",
        severity="INFO",
        before_state={"status": "BOARD_DEFENSE", "composite_score": 0.0},
        after_state={"status": "DEFENDED", "composite_score": 4.65},
        hash_chain_sha256="7a8f90b1e42c589d31f08819cf24b17e33568c92a156df825b410de83b0c4429",
    ),
    AuditLogEvent(
        id="audit-blk-002",
        timestamp="2026-08-26T17:15:00Z",
        actor_id="u-priya",
        actor_name="Priya Nair",
        actor_role="ENGINEERING_EXCELLENCE_COMMITTEE",
        ip_address="10.240.12.104",
        action="CREATE",
        resource_type="DIGITAL_CREDENTIAL",
        resource_id="cred-asc-ananya-001",
        resource_name="ASCEND Certified Distributed Systems Architect",
        severity="INFO",
        before_state=None,
        after_state={"badge_tier": "ARCHITECT", "status": "ACTIVE"},
        hash_chain_sha256="9b5c3e41a87d00f419c836a9926fb92427ae41e4649b934ca495991b7852b855",
    ),
    AuditLogEvent(
        id="audit-blk-003",
        timestamp="2026-08-27T08:00:00Z",
        actor_id="u-vikram",
        actor_name="Vikram Desai",
        actor_role="TECHNOLOGY_HEAD",
        ip_address="10.240.14.88",
        action="OVERRIDE",
        resource_type="WORKFLOW_INSTANCE",
        resource_id="wf-inst-102",
        resource_name="Fast-Track Production Gate Waiver",
        severity="WARNING",
        before_state={"sla_state": "WARNING", "current_stage": "STAGE_SECURITY"},
        after_state={"sla_state": "OVERRIDDEN", "current_stage": "STAGE_PRODUCTION"},
        hash_chain_sha256="e1a2f3c4b5d6e7f80918273645a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6",
    ),
]


# ---------------------------------------------------------------------------
# Seed Curriculum Versioning & Branching (Requirement 30)
# ---------------------------------------------------------------------------

DEFAULT_CURRICULUM_VERSIONS: List[CurriculumVersion] = [
    CurriculumVersion(
        id="cver-101",
        course_id="c-wf101",
        course_code="WF-101",
        course_title="Advanced Distributed Systems & High-Throughput Java 21",
        version="v2.1.0",
        branch_name="main",
        status="ACTIVE",
        author="Priya Nair",
        approved_by="Engineering Excellence Board",
        changelog_summary="Added Kafka transactional producer idempotency lab and Virtual Threads concurrency module.",
        modules_count=6,
        learning_objectives_diff=["Virtual Threads performance benchmarks", "Transactional Outbox Pattern"],
        assigned_cohorts=["Cohort 2026-A", "Cohort 2026-B"],
        created_at="2026-07-15",
    ),
    CurriculumVersion(
        id="cver-102",
        course_id="c-wf101",
        course_code="WF-101",
        course_title="Advanced Distributed Systems & High-Throughput Java 21",
        version="v3.0.0-preview",
        branch_name="v3.0-preview-bedrock-rag",
        status="DRAFT",
        author="Vikram Desai",
        approved_by=None,
        changelog_summary="Experimental branch: Replaces legacy cache module with AWS Bedrock pgvector semantic caching.",
        modules_count=7,
        learning_objectives_diff=["pgvector HNSW indexing", "Semantic Cache Invalidation via Kafka Events"],
        assigned_cohorts=["AI Fast-Track Pilot"],
        created_at="2026-08-20",
    ),
]
