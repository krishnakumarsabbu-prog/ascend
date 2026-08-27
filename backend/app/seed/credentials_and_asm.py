from __future__ import annotations

from typing import List, Dict
from app.models.schemas import (
    ASMRubricScore,
    ASMPanelMember,
    ASMArtifacts,
    ASMProjectLifecycle,
    DigitalCredential,
)

# ---------------------------------------------------------------------------
# Seed ASM Project Lifecycle Data (Requirement 20)
# ---------------------------------------------------------------------------

DEFAULT_ASM_PROJECTS: List[ASMProjectLifecycle] = [
    ASMProjectLifecycle(
        id="asm-proj-101",
        project_code="ASM-104",
        project_title="Real-Time Payments Partitioning & Idempotent Ledger",
        associate_id="as-ananya",
        associate_name="Ananya Rao",
        pathway="Software Engineering (SE)",
        current_stage="BOARD_DEFENSE",
        started_at="2026-08-01",
        target_completion="2026-08-30",
        composite_score=4.65,
        status="DEFENDED",
        artifacts=ASMArtifacts(
            pr_url="https://github.com/enterprise/ascend-payments/pull/14",
            rfc_doc_url="https://wiki.enterprise.internal/rfc/PAY-402-idempotency",
            chaos_experiment_summary="Chaos Mesh partition injection: 0% message loss, P99 latency maintained under 12ms during 4-node failover.",
            benchmark_p99_latency_ms=6.4,
            benchmark_throughput_tps=4850,
            security_scan_passed=True,
            security_vulnerabilities_found=0,
            deployment_manifest_url="k8s/deployments/production-payments-v2.yaml",
        ),
        panel_examiners=[
            ASMPanelMember(
                examiner_id="u-priya",
                examiner_name="Priya Nair",
                examiner_role="LEAD_ARCHITECT",
                overall_score=4.8,
                recommendation="APPROVED",
                deliberation_notes="Flawless architectural defense. Candidate handled consensus partition edge cases with exceptional maturity.",
                signed_at="2026-08-26 16:30",
                rubric_scores=[
                    ASMRubricScore(criterion="ARCHITECTURE_DESIGN", criterion_label="Architecture & System Design", weight=0.25, score=4.9, comments="Exceptional event-driven architecture with clean outbox pattern."),
                    ASMRubricScore(criterion="CODE_QUALITY_TESTING", criterion_label="Code Quality & Test Coverage", weight=0.25, score=4.8, comments="94% line coverage with comprehensive mutation testing."),
                    ASMRubricScore(criterion="PRODUCTION_OBSERVABILITY", criterion_label="Production Readiness & SRE", weight=0.20, score=4.7, comments="Prometheus metrics and distributed tracing instrumentation verified."),
                    ASMRubricScore(criterion="DEFENSE_PRESENTATION", criterion_label="Board Defense Presentation", weight=0.15, score=4.9, comments="Articulate Q&A responses to split-brain scenarios."),
                    ASMRubricScore(criterion="BUSINESS_IMPACT", criterion_label="Enterprise Business Impact", weight=0.15, score=4.8, comments="Eliminates duplicate payments risk across $1.2B daily throughput."),
                ],
            ),
            ASMPanelMember(
                examiner_id="u-vikram",
                examiner_name="Vikram Desai",
                examiner_role="SRE_LEAD",
                overall_score=4.5,
                recommendation="APPROVED",
                deliberation_notes="P99 benchmark load profile is production grade. Zero deadlock conditions during 5,000 TPS stress test.",
                signed_at="2026-08-26 16:45",
                rubric_scores=[
                    ASMRubricScore(criterion="ARCHITECTURE_DESIGN", criterion_label="Architecture & System Design", weight=0.25, score=4.5),
                    ASMRubricScore(criterion="CODE_QUALITY_TESTING", criterion_label="Code Quality & Test Coverage", weight=0.25, score=4.6),
                    ASMRubricScore(criterion="PRODUCTION_OBSERVABILITY", criterion_label="Production Readiness & SRE", weight=0.20, score=4.8),
                    ASMRubricScore(criterion="DEFENSE_PRESENTATION", criterion_label="Board Defense Presentation", weight=0.15, score=4.4),
                    ASMRubricScore(criterion="BUSINESS_IMPACT", criterion_label="Enterprise Business Impact", weight=0.15, score=4.5),
                ],
            ),
            ASMPanelMember(
                examiner_id="u-suresh",
                examiner_name="Suresh Pillai",
                examiner_role="SECURITY_CHAMPION",
                overall_score=4.7,
                recommendation="APPROVED",
                deliberation_notes="Strict PCI-DSS encryption at rest and tokenized payload validation confirmed in code review.",
                signed_at="2026-08-26 17:00",
                rubric_scores=[
                    ASMRubricScore(criterion="ARCHITECTURE_DESIGN", criterion_label="Architecture & System Design", weight=0.25, score=4.7),
                    ASMRubricScore(criterion="CODE_QUALITY_TESTING", criterion_label="Code Quality & Test Coverage", weight=0.25, score=4.8),
                    ASMRubricScore(criterion="PRODUCTION_OBSERVABILITY", criterion_label="Production Readiness & SRE", weight=0.20, score=4.6),
                    ASMRubricScore(criterion="DEFENSE_PRESENTATION", criterion_label="Board Defense Presentation", weight=0.15, score=4.8),
                    ASMRubricScore(criterion="BUSINESS_IMPACT", criterion_label="Enterprise Business Impact", weight=0.15, score=4.7),
                ],
            ),
        ],
    ),
    ASMProjectLifecycle(
        id="asm-proj-102",
        project_code="ASM-103",
        project_title="Vector Similarity Search & Embedding Pipeline for Bedrock RAG",
        associate_id="as-rohan",
        associate_name="Rohan Mehta",
        pathway="AI Engineering (AIE)",
        current_stage="PEER_REVIEW",
        started_at="2026-08-10",
        target_completion="2026-09-05",
        composite_score=4.40,
        status="IN_PROGRESS",
        artifacts=ASMArtifacts(
            pr_url="https://github.com/enterprise/ascend-ai/pull/28",
            rfc_doc_url="https://wiki.enterprise.internal/rfc/AI-201-vector-search",
            chaos_experiment_summary="Vector index recall benchmark under node scaling: 98.4% top-k recall at 1.2M embeddings.",
            benchmark_p99_latency_ms=14.2,
            benchmark_throughput_tps=1200,
            security_scan_passed=True,
            security_vulnerabilities_found=0,
            deployment_manifest_url="k8s/deployments/production-rag-v1.yaml",
        ),
        panel_examiners=[
            ASMPanelMember(
                examiner_id="u-priya",
                examiner_name="Priya Nair",
                examiner_role="LEAD_ARCHITECT",
                overall_score=4.4,
                recommendation="APPROVED",
                deliberation_notes="Strong vector indexing implementation. Candidate is on track for upcoming board defense.",
                signed_at="2026-08-25 14:00",
                rubric_scores=[
                    ASMRubricScore(criterion="ARCHITECTURE_DESIGN", criterion_label="Architecture & System Design", weight=0.25, score=4.5),
                    ASMRubricScore(criterion="CODE_QUALITY_TESTING", criterion_label="Code Quality & Test Coverage", weight=0.25, score=4.3),
                    ASMRubricScore(criterion="PRODUCTION_OBSERVABILITY", criterion_label="Production Readiness & SRE", weight=0.20, score=4.4),
                    ASMRubricScore(criterion="DEFENSE_PRESENTATION", criterion_label="Board Defense Presentation", weight=0.15, score=4.5),
                    ASMRubricScore(criterion="BUSINESS_IMPACT", criterion_label="Enterprise Business Impact", weight=0.15, score=4.3),
                ],
            ),
        ],
    ),
]


# ---------------------------------------------------------------------------
# Seed Verifiable Digital Credentials (Requirement 21)
# ---------------------------------------------------------------------------

DEFAULT_CREDENTIALS: List[DigitalCredential] = [
    DigitalCredential(
        id="cred-asc-ananya-001",
        credential_code="ASCEND-D2-DISTRIBUTED-L400",
        title="ASCEND Certified Distributed Systems Architect",
        badge_tier="ARCHITECT",
        associate_id="as-ananya",
        associate_name="Ananya Rao",
        issue_date="2026-08-26",
        expiry_date="2029-08-26",
        verification_hash_sha256="e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        public_verification_url="/verify/cred-asc-ananya-001",
        skills_verified=[
            "Distributed Systems Architecture (L400)",
            "Kafka Event Streaming & Idempotency",
            "High-Throughput Concurrency & Java 21",
            "Chaos Engineering & Resilience Verification",
            "Architect Board Defense Ratification (4.65/5.0)",
        ],
        evidence_summary={
            "ASM Milestone": "ASM-104 Payments Ledger Capstone",
            "Defense Score": "4.65 / 5.0 (Unanimous Approval)",
            "Load Profile": "P99 6.4ms @ 4,850 TPS",
            "Assessment Score": "94.2% on WF-202 Final",
            "Pull Request": "enterprise/ascend-payments #14 (Merged)",
        },
        issuing_authority="ASCEND Global Engineering Excellence Board",
        status="ACTIVE",
        qr_code_data="https://ascend.enterprise.internal/verify/cred-asc-ananya-001?sha=e3b0c44298fc1c14",
    ),
    DigitalCredential(
        id="cred-asc-rohan-002",
        credential_code="ASCEND-D3-AI-SPECIALIST-L300",
        title="ASCEND Certified AI Platform Specialist",
        badge_tier="SPECIALIST",
        associate_id="as-rohan",
        associate_name="Rohan Mehta",
        issue_date="2026-08-24",
        expiry_date="2029-08-24",
        verification_hash_sha256="7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069",
        public_verification_url="/verify/cred-asc-rohan-002",
        skills_verified=[
            "Enterprise RAG & Embedding Pipelines (L300)",
            "Vector Database Clustering & pgvector",
            "Prompt Engineering & Evaluation Benchmarks",
        ],
        evidence_summary={
            "ASM Milestone": "ASM-103 Vector Similarity Pipeline",
            "Assessment Score": "91.0% on WF-301 AI Gateway",
            "Execution Benchmark": "95.0% Vector Recall Score",
        },
        issuing_authority="ASCEND Global Engineering Excellence Board",
        status="ACTIVE",
        qr_code_data="https://ascend.enterprise.internal/verify/cred-asc-rohan-002?sha=7f83b1657ff1fc53",
    ),
]
