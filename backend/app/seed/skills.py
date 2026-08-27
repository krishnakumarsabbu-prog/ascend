from __future__ import annotations

from typing import List, Dict
from app.models.schemas import (
    SkillItem,
    SkillTaxonomyCategory,
    SkillEvidenceDetail,
    EvidenceBreakdown,
    AssociateSkill,
    AssociateSkillProfile,
    SkillGap,
    PersonalizedLearningItem,
)

# ---------------------------------------------------------------------------
# Central Enterprise Skill Taxonomy (Requirement 2 & 3)
# ---------------------------------------------------------------------------

SKILL_TAXONOMY: List[SkillTaxonomyCategory] = [
    SkillTaxonomyCategory(
        category="Software Engineering",
        description="Core language masteries, algorithmic design, concurrent systems, and modern software engineering practices.",
        skills=[
            SkillItem(id="sk-java", code="JAVA", name="Java (21+)", category="Software Engineering", description="Virtual threads, modern language features, JVM internals, memory management, garbage collection tuning.", target_score=85.0, target_level="L3 — Advanced", business_importance="Critical"),
            SkillItem(id="sk-python", code="PY", name="Python (3.12+)", category="Software Engineering", description="Asynchronous programming (asyncio), typing, performance optimization, package architecture.", target_score=80.0, target_level="L3 — Advanced", business_importance="High"),
            SkillItem(id="sk-typescript", code="TS", name="TypeScript (5.7+)", category="Software Engineering", description="Advanced generics, utility types, modern frontend/Node.js runtime architectural patterns.", target_score=75.0, target_level="L2 — Practitioner", business_importance="Medium"),
            SkillItem(id="sk-algorithms", code="ALGO", name="Algorithms", category="Software Engineering", description="Graph algorithms, dynamic programming, tree traversals, computational complexity (Big-O).", target_score=85.0, target_level="L3 — Advanced", business_importance="High"),
            SkillItem(id="sk-datastructures", code="DS", name="Data Structures", category="Software Engineering", description="B-Trees, lock-free queues, hash tables, skip lists, concurrent collections.", target_score=85.0, target_level="L3 — Advanced", business_importance="High"),
            SkillItem(id="sk-concurrency", code="CONC", name="Concurrency & Multithreading", category="Software Engineering", description="Atomic operations, mutexes, read-write locks, actor models, deadlock prevention.", target_score=80.0, target_level="L3 — Advanced", business_importance="Critical"),
            SkillItem(id="sk-apidesign", code="API", name="API Design", category="Software Engineering", description="RESTful API maturity, gRPC/Protobuf protocols, GraphQL, OpenAPI 3.0 specs, API versioning.", target_score=80.0, target_level="L3 — Advanced", business_importance="High"),
            SkillItem(id="sk-microservices", code="MSVC", name="Microservices", category="Software Engineering", description="Domain-driven design, service discovery, circuit breakers, service mesh, saga orchestration.", target_score=80.0, target_level="L3 — Advanced", business_importance="High"),
            SkillItem(id="sk-testing", code="TEST", name="Testing & QA Automation", category="Software Engineering", description="TDD/BDD, unit testing, integration tests, contract testing (Pact), mutation testing.", target_score=85.0, target_level="L3 — Advanced", business_importance="High"),
            SkillItem(id="sk-designpatterns", code="DP", name="Design Patterns", category="Software Engineering", description="GoF behavioral, creational, structural patterns applied to modern cloud-native systems.", target_score=80.0, target_level="L3 — Advanced", business_importance="Medium"),
        ],
    ),
    SkillTaxonomyCategory(
        category="Cloud",
        description="Multi-cloud architectures, container orchestration, networking, and Zero-Trust infrastructure security.",
        skills=[
            SkillItem(id="sk-aws", code="AWS", name="AWS Platform", category="Cloud", description="ECS/EKS, IAM policies, DynamoDB, S3, KMS, VPC peering, Lambda serverless patterns.", target_score=80.0, target_level="L3 — Advanced", business_importance="Critical"),
            SkillItem(id="sk-azure", code="AZURE", name="Azure Platform", category="Cloud", description="AKS, Azure AD/Entra ID integration, Cosmos DB, Event Grid, App Services.", target_score=75.0, target_level="L2 — Practitioner", business_importance="High"),
            SkillItem(id="sk-gcp", code="GCP", name="GCP Platform", category="Cloud", description="GKE, BigQuery integration, Pub/Sub, Cloud Armor, IAM federations.", target_score=70.0, target_level="L2 — Practitioner", business_importance="Medium"),
            SkillItem(id="sk-k8s", code="K8S", name="Kubernetes", category="Cloud", description="Pod autoscaling (HPA), Helm charts, Ingress controllers, stateful sets, CRDs.", target_score=80.0, target_level="L3 — Advanced", business_importance="Critical"),
            SkillItem(id="sk-docker", code="DOCKER", name="Docker & Containers", category="Cloud", description="Multi-stage builds, rootless container security, image optimization, distroless images.", target_score=85.0, target_level="L3 — Advanced", business_importance="High"),
            SkillItem(id="sk-infra", code="IAC", name="Infrastructure as Code (Terraform)", category="Cloud", description="Terraform modules, state locking with S3/DynamoDB, policy-as-code (OPA/Sentinel).", target_score=75.0, target_level="L2 — Practitioner", business_importance="High"),
            SkillItem(id="sk-networking", code="NET", name="Cloud Networking & DNS", category="Cloud", description="CIDR routing, subnetting, Transit Gateways, NAT, Load Balancers, TLS 1.3 termination.", target_score=75.0, target_level="L2 — Practitioner", business_importance="Medium"),
            SkillItem(id="sk-cloudsec", code="CSEC", name="Cloud Security", category="Cloud", description="Zero Trust architecture, secrets management (Vault), encryption at rest & transit, SAST/DAST.", target_score=80.0, target_level="L3 — Advanced", business_importance="Critical"),
        ],
    ),
    SkillTaxonomyCategory(
        category="Data Engineering",
        description="Scalable streaming pipelines, data modeling, batch processing, and analytics platforms.",
        skills=[
            SkillItem(id="sk-sql", code="SQL", name="SQL & Relational Databases", category="Data Engineering", description="Complex query optimization, PostgreSQL explain plans, indexing strategies, ACID guarantees.", target_score=85.0, target_level="L3 — Advanced", business_importance="Critical"),
            SkillItem(id="sk-spark", code="SPARK", name="Apache Spark", category="Data Engineering", description="PySpark, Spark SQL, partitioned DataFrames, DAG optimization, shuffle tuning.", target_score=75.0, target_level="L2 — Practitioner", business_importance="High"),
            SkillItem(id="sk-datamodeling", code="DMOD", name="Data Modeling", category="Data Engineering", description="Star/Snowflake schema, dimensional modeling, Data Vault 2.0, normalization vs denormalization.", target_score=80.0, target_level="L3 — Advanced", business_importance="High"),
            SkillItem(id="sk-etl", code="ETL", name="ETL / ELT Pipelines", category="Data Engineering", description="Airflow DAGs, DBT transformation modeling, idempotent batch ingestion pipelines.", target_score=80.0, target_level="L3 — Advanced", business_importance="High"),
            SkillItem(id="sk-streaming", code="STREAM", name="Event Streaming", category="Data Engineering", description="Exactly-once processing semantics, stream joins, stateful stream processing, watermarks.", target_score=80.0, target_level="L3 — Advanced", business_importance="Critical"),
            SkillItem(id="sk-kafka", code="KAFKA", name="Apache Kafka", category="Data Engineering", description="Topic partition rebalancing, consumer groups, schema registry (Avro/JSON), ISR replication.", target_score=80.0, target_level="L3 — Advanced", business_importance="Critical"),
            SkillItem(id="sk-dataquality", code="DQ", name="Data Quality & Governance", category="Data Engineering", description="Great Expectations assertions, lineage tracking, anomaly detection, schema evolution.", target_score=75.0, target_level="L2 — Practitioner", business_importance="Medium"),
            SkillItem(id="sk-analytics", code="ANALYTICS", name="Analytics & OLAP", category="Data Engineering", description="ClickHouse, Snowflake data warehousing, materialized views, columnar storage optimizations.", target_score=75.0, target_level="L2 — Practitioner", business_importance="Medium"),
        ],
    ),
    SkillTaxonomyCategory(
        category="Architecture",
        description="High-availability enterprise systems, fault tolerance, consensus protocols, and enterprise architecture.",
        skills=[
            SkillItem(id="sk-distsys", code="DIST", name="Distributed Systems", category="Architecture", description="CAP theorem, Raft/Paxos consensus, two-phase commit vs Saga, vector clocks, gossip protocols.", target_score=85.0, target_level="L3 — Advanced", business_importance="Critical"),
            SkillItem(id="sk-scalability", code="SCALE", name="Scalability", category="Architecture", description="Horizontal vs vertical scaling, database sharding, caching tiers (Redis/Memcached), backpressure.", target_score=80.0, target_level="L3 — Advanced", business_importance="Critical"),
            SkillItem(id="sk-reliability", code="REL", name="Reliability & SRE", category="Architecture", description="SLI/SLO/SLA definitions, error budgets, blameless post-mortems, chaos engineering principles.", target_score=80.0, target_level="L3 — Advanced", business_importance="High"),
            SkillItem(id="sk-resilience", code="RES", name="Resilience & Fault Tolerance", category="Architecture", description="Rate limiting (token bucket), bulkhead patterns, exponential backoff, failover automation.", target_score=80.0, target_level="L3 — Advanced", business_importance="High"),
            SkillItem(id="sk-eda", code="EDA", name="Event Driven Architecture", category="Architecture", description="CQRS, Event Sourcing, Outbox pattern, idempotency keys, dead letter queues.", target_score=80.0, target_level="L3 — Advanced", business_importance="Critical"),
            SkillItem(id="sk-apiarch", code="APIARCH", name="API Architecture", category="Architecture", description="API Gateways (Kong/Envoy), rate limiters, token validation, backend-for-frontend (BFF).", target_score=80.0, target_level="L3 — Advanced", business_importance="High"),
            SkillItem(id="sk-sysdesign", code="SYSDESIGN", name="System Design", category="Architecture", description="End-to-end multi-tier architecture defense, threat modeling, capacity estimation, RFC creation.", target_score=85.0, target_level="L3 — Advanced", business_importance="Critical"),
        ],
    ),
    SkillTaxonomyCategory(
        category="AI Engineering",
        description="Generative AI systems, LLM application architecture, vector retrieval, and enterprise AI safety.",
        skills=[
            SkillItem(id="sk-prompting", code="PROMPT", name="Prompt Engineering", category="AI Engineering", description="Few-shot prompting, chain-of-thought, system instruction structuring, prompt injection defense.", target_score=80.0, target_level="L3 — Advanced", business_importance="High"),
            SkillItem(id="sk-llmapps", code="LLM", name="LLM Applications (LangChain / LlamaIndex)", category="AI Engineering", description="Tool calling, structured output parsing, context window management, conversational memory.", target_score=80.0, target_level="L3 — Advanced", business_importance="Critical"),
            SkillItem(id="sk-rag", code="RAG", name="Retrieval Augmented Generation (RAG)", category="AI Engineering", description="Vector embeddings, hybrid search (dense+sparse BM25), chunking strategies, re-ranking models.", target_score=80.0, target_level="L3 — Advanced", business_importance="Critical"),
            SkillItem(id="sk-aiagents", code="AGENTS", name="AI Agents & Autonomous Workflows", category="AI Engineering", description="ReAct loop architecture, multi-agent coordination, human-in-the-loop workflows, state graphs.", target_score=75.0, target_level="L2 — Practitioner", business_importance="High"),
            SkillItem(id="sk-modeleval", code="EVAL", name="Model Evaluation & Benchmarking", category="AI Engineering", description="RAGAS evaluation metrics, hallucination scoring, automated golden dataset testing.", target_score=75.0, target_level="L2 — Practitioner", business_importance="Medium"),
            SkillItem(id="sk-aisafety", code="SAFETY", name="AI Safety & Governance", category="AI Engineering", description="Guardrails (NVIDIA NeMo), PII filtering, toxicity detection, alignment, model risk management.", target_score=80.0, target_level="L3 — Advanced", business_importance="High"),
            SkillItem(id="sk-mlfundamentals", code="ML", name="ML Fundamentals", category="AI Engineering", description="Loss functions, gradient descent, feature engineering, classification metrics (F1/AUC-ROC).", target_score=70.0, target_level="L2 — Practitioner", business_importance="Medium"),
        ],
    ),
]


# ---------------------------------------------------------------------------
# Helper: Level Calculation from numeric score
# ---------------------------------------------------------------------------

def score_to_level(score: float) -> str:
    if score >= 90:
        return "L4 — Expert"
    elif score >= 75:
        return "L3 — Advanced"
    elif score >= 60:
        return "L2 — Practitioner"
    elif score >= 40:
        return "L1 — Beginner"
    return "L0 — Awareness"


# ---------------------------------------------------------------------------
# Mock Associate Evidence & Profiles Seed Data (Requirement 4, 5, 6)
# ---------------------------------------------------------------------------

def generate_ananya_skills() -> List[AssociateSkill]:
    skills_data = [
        {
            "id": "sk-concurrency", "name": "Concurrency & Multithreading", "category": "Software Engineering",
            "score": 62.0, "target": 80.0, "confidence": "HIGH", "last_evaluated": "2026-08-24",
            "recommended": "Complete Advanced Concurrency Challenge & Lock-Free Queue Workshop",
            "breakdown": EvidenceBreakdown(assessment=68.0, coding=72.0, project=55.0, mentor=60.0, architecture=55.0),
            "evidence": [
                SkillEvidenceDetail(id="ev-1", source="Assessment", title="WF-101 Concurrency Gate Assessment", score=68.0, weight=0.25, confidence="HIGH", date="2026-08-10", details="Scored 68% - Dropped points on Deadlock conditions in ReentrantLocks"),
                SkillEvidenceDetail(id="ev-2", source="Coding", title="Payments Idempotency Concurrent Hash Lock", score=72.0, weight=0.25, confidence="HIGH", date="2026-08-18", details="Code passed 7/10 test cases; timed out on race condition edge case"),
                SkillEvidenceDetail(id="ev-3", source="Project", title="ASM-102 High Throughput Pipeline", score=55.0, weight=0.20, confidence="MEDIUM", date="2026-08-22", details="PR #14 thread pool executor configuration reviewed"),
                SkillEvidenceDetail(id="ev-4", source="Mentor", title="Mentor Review: Priya Nair", score=60.0, weight=0.15, confidence="HIGH", date="2026-08-24", details="Needs deeper understanding of lock striping and volatile memory visibility"),
                SkillEvidenceDetail(id="ev-5", source="Architecture", title="Architect Board Mini-Defense", score=55.0, weight=0.15, confidence="MEDIUM", date="2026-08-15", details="Challenged on thread starvation in consumer pools"),
            ]
        },
        {
            "id": "sk-kafka", "name": "Apache Kafka", "category": "Data Engineering",
            "score": 62.0, "target": 80.0, "confidence": "HIGH", "last_evaluated": "2026-08-25",
            "recommended": "Complete Kafka Partition Rebalance Challenge",
            "breakdown": EvidenceBreakdown(assessment=64.0, coding=68.0, project=60.0, mentor=65.0, architecture=53.0),
            "evidence": [
                SkillEvidenceDetail(id="ev-6", source="Assessment", title="WF-202 Cloud & Distributed Systems", score=64.0, weight=0.30, confidence="HIGH", date="2026-08-12", details="Partition assignment strategy questions missed"),
                SkillEvidenceDetail(id="ev-7", source="Coding", title="Kafka Stream Lag & Partition Rebalance Optimizer", score=68.0, weight=0.30, confidence="HIGH", date="2026-08-20", details="Submitted solution with 68% efficiency score"),
                SkillEvidenceDetail(id="ev-8", source="Project", title="ASM-103 Streaming Transactions", score=60.0, weight=0.25, confidence="HIGH", date="2026-08-23", details="Consumer lag detected during test fire"),
                SkillEvidenceDetail(id="ev-9", source="Mentor", title="Mentor Technical Checkin", score=65.0, weight=0.15, confidence="HIGH", date="2026-08-25", details="Recommend reviewing consumer coordinator heartbeat mechanism"),
            ]
        },
        {
            "id": "sk-distsys", "name": "Distributed Systems", "category": "Architecture",
            "score": 61.0, "target": 85.0, "confidence": "HIGH", "last_evaluated": "2026-08-26",
            "recommended": "Schedule Architecture Defense Coaching & Review Raft Consensus",
            "breakdown": EvidenceBreakdown(assessment=61.0, coding=72.0, project=58.0, mentor=60.0, architecture=54.0),
            "evidence": [
                SkillEvidenceDetail(id="ev-10", source="Assessment", title="WF-202 Distributed Systems Tier Exam", score=61.0, weight=0.30, confidence="HIGH", date="2026-08-14", details="Consensus protocols and split-brain scenarios need reinforcement"),
                SkillEvidenceDetail(id="ev-11", source="Coding", title="Distributed Idempotent Cache Sync", score=72.0, weight=0.25, confidence="HIGH", date="2026-08-21", details="Implemented two-phase lock skeleton successfully"),
                SkillEvidenceDetail(id="ev-12", source="Architecture", title="Architect Board Trial Panel", score=54.0, weight=0.25, confidence="HIGH", date="2026-08-26", details="Panel feedback: Explain quorum math under network partitions"),
                SkillEvidenceDetail(id="ev-13", source="Mentor", title="Priya Nair Architecture Checkin", score=60.0, weight=0.20, confidence="HIGH", date="2026-08-26", details="Assigned reading: Designing Data-Intensive Applications Ch 8-9"),
            ]
        },
        {
            "id": "sk-java", "name": "Java (21+)", "category": "Software Engineering",
            "score": 82.0, "target": 85.0, "confidence": "HIGH", "last_evaluated": "2026-08-22",
            "recommended": "Explore Virtual Threads & Structured Concurrency JEP 453",
            "breakdown": EvidenceBreakdown(assessment=82.0, coding=91.0, project=78.0, mentor=85.0, architecture=74.0),
            "evidence": [
                SkillEvidenceDetail(id="ev-14", source="Assessment", title="WF-101 Java Core Mastery Assessment", score=82.0, weight=0.25, confidence="HIGH", date="2026-08-05", details="Passed foundational gate with high score"),
                SkillEvidenceDetail(id="ev-15", source="Coding", title="High-Throughput Financial Calculation Engine", score=91.0, weight=0.35, confidence="HIGH", date="2026-08-16", details="Passed 10/10 test cases; execution time 142ms"),
                SkillEvidenceDetail(id="ev-16", source="Project", title="ASM-101 Gateway Pipeline", score=78.0, weight=0.20, confidence="HIGH", date="2026-08-20", details="Production PR approved without rework"),
                SkillEvidenceDetail(id="ev-17", source="Mentor", title="Mentor Review: Priya Nair", score=85.0, weight=0.20, confidence="HIGH", date="2026-08-22", details="Strong idiomatic Java syntax and clean architecture"),
            ]
        },
        {
            "id": "sk-rag", "name": "Retrieval Augmented Generation (RAG)", "category": "AI Engineering",
            "score": 84.0, "target": 80.0, "confidence": "HIGH", "last_evaluated": "2026-08-20",
            "recommended": "Target Exceeded! Explore Multi-Vector Retrieval Techniques",
            "breakdown": EvidenceBreakdown(assessment=88.0, coding=85.0, project=82.0, mentor=82.0, architecture=83.0),
            "evidence": [
                SkillEvidenceDetail(id="ev-18", source="Assessment", title="WF-101 AI Prompting & Vector Retrieval", score=88.0, weight=0.30, confidence="HIGH", date="2026-08-08", details="Perfect score on chunking and dense vector indexing"),
                SkillEvidenceDetail(id="ev-19", source="Coding", title="Vector Similarity Search & Top-K Retrieval", score=85.0, weight=0.35, confidence="HIGH", date="2026-08-17", details="Passed all cosine distance test cases"),
                SkillEvidenceDetail(id="ev-20", source="Project", title="Internal Knowledge Assistant Integration", score=82.0, weight=0.35, confidence="HIGH", date="2026-08-20", details="Implemented LangChain vector store connector"),
            ]
        },
        {
            "id": "sk-aws", "name": "AWS Platform", "category": "Cloud",
            "score": 76.0, "target": 80.0, "confidence": "HIGH", "last_evaluated": "2026-08-19",
            "recommended": "Complete AWS KMS & VPC Security Sandbox Intensive",
            "breakdown": EvidenceBreakdown(assessment=78.0, coding=80.0, project=74.0, mentor=75.0, architecture=73.0),
            "evidence": [
                SkillEvidenceDetail(id="ev-21", source="Assessment", title="WF-202 Cloud Infrastructure Exam", score=78.0, weight=0.30, confidence="HIGH", date="2026-08-11", details="Strong on ECS and S3; minor gaps in IAM role assumption"),
                SkillEvidenceDetail(id="ev-22", source="Project", title="ASM-102 EKS Sandbox Deployment", score=74.0, weight=0.40, confidence="HIGH", date="2026-08-19", details="Deployed microservice pod to AWS staging cluster"),
                SkillEvidenceDetail(id="ev-23", source="Mentor", title="Cloud Practice Evaluation", score=75.0, weight=0.30, confidence="HIGH", date="2026-08-19", details="Solid cloud deployment discipline"),
            ]
        },
        {
            "id": "sk-k8s", "name": "Kubernetes", "category": "Cloud",
            "score": 74.0, "target": 80.0, "confidence": "MEDIUM", "last_evaluated": "2026-08-21",
            "recommended": "Review HPA Metric Server configuration and Ingress TLS",
            "breakdown": EvidenceBreakdown(assessment=75.0, coding=70.0, project=78.0, mentor=73.0, architecture=74.0),
            "evidence": [
                SkillEvidenceDetail(id="ev-24", source="Assessment", title="WF-202 K8s Module Quiz", score=75.0, weight=0.35, confidence="MEDIUM", date="2026-08-13", details="Solid understanding of Deployments and Services"),
                SkillEvidenceDetail(id="ev-25", source="Project", title="Helm Chart Packaging for Microservices", score=78.0, weight=0.65, confidence="HIGH", date="2026-08-21", details="Configured values.yaml and secrets injection"),
            ]
        },
        {
            "id": "sk-sql", "name": "SQL & Relational Databases", "category": "Data Engineering",
            "score": 86.0, "target": 85.0, "confidence": "HIGH", "last_evaluated": "2026-08-15",
            "recommended": "Target Met — Deep dive into PostgreSQL Partitioning & BRIN Indexes",
            "breakdown": EvidenceBreakdown(assessment=88.0, coding=92.0, project=84.0, mentor=85.0, architecture=81.0),
            "evidence": [
                SkillEvidenceDetail(id="ev-26", source="Assessment", title="WF-203 Database Architecture", score=88.0, weight=0.30, confidence="HIGH", date="2026-08-09", details="Excellent query plan analysis"),
                SkillEvidenceDetail(id="ev-27", source="Coding", title="Transactional Ledger Isolation Challenge", score=92.0, weight=0.40, confidence="HIGH", date="2026-08-15", details="Passed serialization anomaly tests"),
                SkillEvidenceDetail(id="ev-28", source="Project", title="Payments Schema Migration", score=84.0, weight=0.30, confidence="HIGH", date="2026-08-15", details="Flyway migration scripts approved"),
            ]
        },
        {
            "id": "sk-prompting", "name": "Prompt Engineering", "category": "AI Engineering",
            "score": 88.0, "target": 80.0, "confidence": "HIGH", "last_evaluated": "2026-08-18",
            "recommended": "Target Exceeded! Advance to Multi-Agent StateGraph Architecture",
            "breakdown": EvidenceBreakdown(assessment=90.0, coding=88.0, project=86.0, mentor=88.0, architecture=88.0),
            "evidence": [
                SkillEvidenceDetail(id="ev-29", source="Assessment", title="WF-101 Prompting Benchmark", score=90.0, weight=0.50, confidence="HIGH", date="2026-08-07", details="Top 5% cohort score in structured few-shot design"),
                SkillEvidenceDetail(id="ev-30", source="Project", title="AI Test Generator Prompt Template", score=86.0, weight=0.50, confidence="HIGH", date="2026-08-18", details="Integrated into build pipeline"),
            ]
        },
        {
            "id": "sk-testing", "name": "Testing & QA Automation", "category": "Software Engineering",
            "score": 79.0, "target": 85.0, "confidence": "HIGH", "last_evaluated": "2026-08-23",
            "recommended": "Add Mutation Testing & Contract Tests (Pact) to ASM Pipeline",
            "breakdown": EvidenceBreakdown(assessment=80.0, coding=82.0, project=78.0, mentor=76.0, architecture=80.0),
            "evidence": [
                SkillEvidenceDetail(id="ev-31", source="Assessment", title="WF-101 Testing Standards", score=80.0, weight=0.30, confidence="HIGH", date="2026-08-06", details="Solid JUnit 5 / Mockito fundamentals"),
                SkillEvidenceDetail(id="ev-32", source="Coding", title="Test Suite Construction Challenge", score=82.0, weight=0.35, confidence="HIGH", date="2026-08-14", details="Achieved 88% branch coverage"),
                SkillEvidenceDetail(id="ev-33", source="Project", title="PR #19 Unit Test Suite", score=78.0, weight=0.35, confidence="HIGH", date="2026-08-23", details="Tested all boundary conditions"),
            ]
        }
    ]

    associate_skills: List[AssociateSkill] = []
    for item in skills_data:
        gap_val = round(max(0.0, item["target"] - item["score"]), 1)
        associate_skills.append(
            AssociateSkill(
                skill_id=item["id"],
                name=item["name"],
                category=item["category"],
                current_score=item["score"],
                current_level=score_to_level(item["score"]),
                target_score=item["target"],
                target_level=score_to_level(item["target"]),
                gap=gap_val,
                confidence=item["confidence"],
                evidence_count=len(item["evidence"]),
                last_evaluated=item["last_evaluated"],
                evidence_breakdown=item["breakdown"],
                evidence_items=item["evidence"],
                recommended_learning=item["recommended"],
            )
        )

    return associate_skills


def generate_skill_gaps(associate_skills: List[AssociateSkill]) -> List[SkillGap]:
    gaps: List[SkillGap] = []
    for s in associate_skills:
        if s.gap > 0:
            if s.gap >= 15:
                priority = "Critical"
                hours = "16 hrs"
            elif s.gap >= 8:
                priority = "High"
                hours = "10 hrs"
            elif s.gap >= 4:
                priority = "Medium"
                hours = "6 hrs"
            else:
                priority = "Low"
                hours = "3 hrs"

            gaps.append(
                SkillGap(
                    skill_id=s.skill_id,
                    skill_name=s.name,
                    category=s.category,
                    current_level=s.current_level,
                    required_level=s.target_level,
                    current_score=s.current_score,
                    required_score=s.target_score,
                    gap=s.gap,
                    business_importance="Critical" if s.category in ["Architecture", "Software Engineering"] and s.gap > 10 else "High",
                    priority=priority,
                    recommended_course=f"WF-202: Advanced {s.category}",
                    recommended_challenge=f"Production Challenge: {s.name} Mastery",
                    recommended_project=f"ASM Milestone Track: {s.name} Evidence",
                    expected_completion_time=hours,
                )
            )
    
    # Sort with Critical first, then High
    priority_order = {"Critical": 0, "High": 1, "Medium": 2, "Low": 3}
    gaps.sort(key=lambda g: (priority_order.get(g.priority, 4), -g.gap))
    return gaps


def generate_personalized_recommendations(gaps: List[SkillGap]) -> List[PersonalizedLearningItem]:
    recommendations: List[PersonalizedLearningItem] = [
        PersonalizedLearningItem(
            id="rec-1",
            rank=1,
            title="Complete Kafka Fundamentals & Partitioning Workshop",
            category="Data Engineering",
            reason="Streaming competency is 18.0 points below pathway threshold (Target: 80.0, Current: 62.0).",
            skill_name="Apache Kafka",
            gap_points=18.0,
            action_type="Course",
            action_url="/curriculum",
            difficulty="Hard",
            estimated_hours=6,
        ),
        PersonalizedLearningItem(
            id="rec-2",
            rank=2,
            title="Attempt Kafka Rebalancing & High-Throughput Challenge",
            category="Software Engineering",
            reason="Reinforces current streaming and concurrency gap identified in recent assessment attempt.",
            skill_name="Concurrency & Multithreading",
            gap_points=18.0,
            action_type="Challenge",
            action_url="/coding/cc-103",
            difficulty="Hard",
            estimated_hours=2,
        ),
        PersonalizedLearningItem(
            id="rec-3",
            rank=3,
            title="Schedule Distributed Systems Architecture Defense Practice",
            category="Architecture",
            reason="Distributed-system architecture competency (61.0%) is below pathway readiness threshold (85.0%).",
            skill_name="Distributed Systems",
            gap_points=24.0,
            action_type="Architecture Practice",
            action_url="/architect-board",
            difficulty="Expert",
            estimated_hours=4,
        ),
        PersonalizedLearningItem(
            id="rec-4",
            rank=4,
            title="Complete AWS KMS & IAM Policy Sandbox",
            category="Cloud",
            reason="Cloud platform competency is 4.0 points away from target L3 Practitioner benchmark.",
            skill_name="AWS Platform",
            gap_points=4.0,
            action_type="Course",
            action_url="/asm-fork",
            difficulty="Medium",
            estimated_hours=3,
        ),
    ]
    return recommendations


def build_associate_profile(associate_id: str, associate_name: str) -> AssociateSkillProfile:
    skills = generate_ananya_skills()
    gaps = generate_skill_gaps(skills)
    
    # Calculate category averages
    cat_totals: Dict[str, List[float]] = {}
    for s in skills:
        cat_totals.setdefault(s.category, []).append(s.current_score)
    
    category_scores = {cat: round(sum(scores) / len(scores), 1) for cat, scores in cat_totals.items()}
    overall = round(sum(s.current_score for s in skills) / len(skills), 1) if skills else 75.0
    strong_count = sum(1 for s in skills if s.current_score >= s.target_score)

    return AssociateSkillProfile(
        associate_id=associate_id,
        associate_name=associate_name,
        overall_competency=overall,
        total_skills=len(skills),
        strong_skills_count=strong_count,
        gaps_count=len(gaps),
        category_scores=category_scores,
        skills=skills,
    )
