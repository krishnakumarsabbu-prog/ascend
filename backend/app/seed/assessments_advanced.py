from __future__ import annotations

from typing import List, Dict
from app.models.schemas import (
    Choice,
    GovernanceQuestion,
    PsychometricStats,
    QuestionVersionChangelog,
    ProctoringViolation,
    ProctoringTelemetry,
)

# ---------------------------------------------------------------------------
# Calibrated Question Bank with Psychometrics & IRT Parameters (Req 16 & 17)
# ---------------------------------------------------------------------------

GOVERNANCE_QUESTIONS: List[GovernanceQuestion] = [
    GovernanceQuestion(
        id="gq-101",
        code="WF-JAVA-201",
        title="Virtual Threads & ForkJoinPool Synchronization",
        prompt="In Java 21 Project Loom, which of the following operations causes a Virtual Thread to pin its underlying carrier thread to the OS thread pool?",
        domain="Software Engineering",
        difficulty="L300",
        status="ACTIVE",
        version=3,
        author="Vikram Desai (Principal Architect)",
        reviewer="Engineering Excellence Committee",
        irt_b_difficulty=1.15,
        irt_a_discrimination=1.45,
        psychometrics=PsychometricStats(
            p_value=0.64,
            discrimination_index=0.52,
            avg_response_time_seconds=42.0,
            exposure_count=182,
            distractor_frequencies={"c-1": 0.12, "c-2": 0.64, "c-3": 0.16, "c-4": 0.08},
        ),
        changelog=[
            QuestionVersionChangelog(version=1, author="Vikram Desai", change_summary="Initial authoring for Java 21 curriculum.", timestamp="2026-07-10"),
            QuestionVersionChangelog(version=2, author="Priya Nair", change_summary="Refined distractor choices on native memory allocation.", timestamp="2026-07-25"),
            QuestionVersionChangelog(version=3, author="Committee Board", change_summary="Psychometrically validated with r=0.52 discrimination.", timestamp="2026-08-01"),
        ],
        choices=[
            Choice(id="c-1", text="Calling non-blocking SocketChannel.read() in an async loop"),
            Choice(id="c-2", text="Executing inside a synchronized block or calling native JNI methods"),
            Choice(id="c-3", text="Using ReentrantLock with a 500ms tryLock() timeout"),
            Choice(id="c-4", text="Spawning an executor with Executors.newVirtualThreadPerTaskExecutor()"),
        ],
        correct_choice_id="c-2",
        explanation="Virtual threads pin the carrier thread when executing inside a synchronized block or when invoking native C/C++ methods via JNI, preventing task suspension onto the unpinned continuation stack.",
    ),
    GovernanceQuestion(
        id="gq-102",
        code="WF-DIST-301",
        title="Raft Leader Election & Split-Brain Quorum Math",
        prompt="In a distributed cluster of N=7 nodes using Raft consensus, what is the minimum quorum size required to elect a new leader and avoid split-brain states?",
        domain="Architecture",
        difficulty="L300",
        status="ACTIVE",
        version=2,
        author="Suresh Pillai (Distinguished Engineer)",
        reviewer="Priya Nair",
        irt_b_difficulty=0.85,
        irt_a_discrimination=1.38,
        psychometrics=PsychometricStats(
            p_value=0.71,
            discrimination_index=0.48,
            avg_response_time_seconds=36.5,
            exposure_count=145,
            distractor_frequencies={"c-1": 0.08, "c-2": 0.71, "c-3": 0.14, "c-4": 0.07},
        ),
        changelog=[
            QuestionVersionChangelog(version=1, author="Suresh Pillai", change_summary="Created for Distributed Consensus assessment.", timestamp="2026-06-15"),
            QuestionVersionChangelog(version=2, author="Priya Nair", change_summary="Clarified node failure boundaries.", timestamp="2026-07-18"),
        ],
        choices=[
            Choice(id="c-1", text="3 nodes (Simple minority)"),
            Choice(id="c-2", text="4 nodes (Strict majority quorum: floor(7/2) + 1)"),
            Choice(id="c-3", text="5 nodes (Supermajority 2/3)"),
            Choice(id="c-4", text="7 nodes (Full unanimous agreement)"),
        ],
        correct_choice_id="c-2",
        explanation="In Raft/Paxos majority consensus, the minimum quorum is floor(N/2) + 1. For N=7 nodes, floor(7/2)+1 = 4 nodes, guaranteeing any two quorums overlap by at least one node.",
    ),
    GovernanceQuestion(
        id="gq-103",
        code="WF-KAFKA-401",
        title="Kafka Rebalance Protocol & Cooperative Sticky Assignor",
        prompt="Why is the CooperativeStickyAssignor preferred over the Eager Partition Assignor in enterprise high-throughput Kafka consumers?",
        domain="Cloud",
        difficulty="L400",
        status="ACTIVE",
        version=1,
        author="Karthik Iyer",
        reviewer="Engineering Excellence Committee",
        irt_b_difficulty=1.85,
        irt_a_discrimination=1.62,
        psychometrics=PsychometricStats(
            p_value=0.48,
            discrimination_index=0.61,
            avg_response_time_seconds=55.0,
            exposure_count=98,
            distractor_frequencies={"c-1": 0.48, "c-2": 0.22, "c-3": 0.18, "c-4": 0.12},
        ),
        changelog=[
            QuestionVersionChangelog(version=1, author="Karthik Iyer", change_summary="Authored for L400 Streaming Capstone gate.", timestamp="2026-08-05"),
        ],
        choices=[
            Choice(id="c-1", text="It executes incremental rebalances without triggering a 'stop-the-world' consumer pause on unaffected partitions"),
            Choice(id="c-2", text="It eliminates consumer offsets committing to the internal __consumer_offsets topic"),
            Choice(id="c-3", text="It forces all consumer instances to consume identical partition subsets concurrently"),
            Choice(id="c-4", text="It bypasses group coordinator heartbeat verification"),
        ],
        correct_choice_id="c-1",
        explanation="The Cooperative Sticky Assignor performs two-phase cooperative rebalancing, allowing active consumers to continue processing data on unaffected partitions while migrating only reassigned partitions.",
    ),
    GovernanceQuestion(
        id="gq-104",
        code="WF-PROMPT-101",
        title="Few-Shot Exemplar Formatting & Token Attention",
        prompt="When constructing production few-shot prompts for LLM code reasoning, what is the primary benefit of including negative exemplars with explicit error explanations?",
        domain="AI Engineering",
        difficulty="L200",
        status="ACTIVE",
        version=2,
        author="Dr. Maya Lin",
        reviewer="Vikram Desai",
        irt_b_difficulty=-0.35,
        irt_a_discrimination=1.12,
        psychometrics=PsychometricStats(
            p_value=0.82,
            discrimination_index=0.38,
            avg_response_time_seconds=28.0,
            exposure_count=210,
            distractor_frequencies={"c-1": 0.06, "c-2": 0.08, "c-3": 0.82, "c-4": 0.04},
        ),
        changelog=[
            QuestionVersionChangelog(version=1, author="Dr. Maya Lin", change_summary="Initial authoring for LLM engineering module.", timestamp="2026-07-01"),
            QuestionVersionChangelog(version=2, author="Dr. Maya Lin", change_summary="Added distractor benchmarking.", timestamp="2026-07-20"),
        ],
        choices=[
            Choice(id="c-1", text="It compresses the KV-cache memory requirement by 50%"),
            Choice(id="c-2", text="It removes the requirement for temperature parameters in OpenAI API calls"),
            Choice(id="c-3", text="It steers attention away from common edge-case hallucinations by bounding the token probability space"),
            Choice(id="c-4", text="It forces deterministic greedy sampling without argmax computation"),
        ],
        correct_choice_id="c-3",
        explanation="Negative exemplars with error diagnostics teach the model decision boundary constraints, reducing edge-case hallucinations by down-weighting erroneous completion tokens.",
    ),
]


# ---------------------------------------------------------------------------
# Calibrated Adaptive Testing Item Bank (Requirement 16)
# ---------------------------------------------------------------------------

ADAPTIVE_ITEM_BANK: List[GovernanceQuestion] = GOVERNANCE_QUESTIONS + [
    GovernanceQuestion(
        id="gq-105",
        code="WF-SQL-202",
        title="B-Tree Index Cardinality & Composite Index Prefix Rule",
        prompt="Given composite index (tenant_id, status, created_at), which query CANNOT utilize index range scanning?",
        domain="Data Engineering",
        difficulty="L200",
        status="ACTIVE",
        version=1,
        author="Suresh Pillai",
        reviewer="Vikram Desai",
        irt_b_difficulty=0.20,
        irt_a_discrimination=1.25,
        psychometrics=PsychometricStats(p_value=0.74, discrimination_index=0.45, avg_response_time_seconds=32.0, exposure_count=130),
        choices=[
            Choice(id="c-1", text="SELECT * WHERE tenant_id = 'T1' AND status = 'ACTIVE'"),
            Choice(id="c-2", text="SELECT * WHERE tenant_id = 'T1' AND created_at > '2026-01-01'"),
            Choice(id="c-3", text="SELECT * WHERE status = 'ACTIVE' AND created_at > '2026-01-01'"),
            Choice(id="c-4", text="SELECT * WHERE tenant_id = 'T1'"),
        ],
        correct_choice_id="c-3",
        explanation="Under the leftmost prefix rule, queries omitting the leading column (tenant_id) cannot utilize the B-Tree index for range scanning.",
    ),
    GovernanceQuestion(
        id="gq-106",
        code="WF-RESIL-402",
        title="Two-Phase Commit (2PC) vs Saga Choreography",
        prompt="In microservices with high write contention across polyglot databases, why is Saga preferred over 2PC distributed transactions?",
        domain="Architecture",
        difficulty="L400",
        status="ACTIVE",
        version=1,
        author="Vikram Desai",
        reviewer="Engineering Committee",
        irt_b_difficulty=1.95,
        irt_a_discrimination=1.55,
        psychometrics=PsychometricStats(p_value=0.42, discrimination_index=0.65, avg_response_time_seconds=60.0, exposure_count=85),
        choices=[
            Choice(id="c-1", text="Sagas maintain non-blocking local commits with compensating events, avoiding coordinator lock-holding bottlenecks"),
            Choice(id="c-2", text="Sagas guarantee strict ACID serializability without eventual consistency"),
            Choice(id="c-3", text="Sagas eliminate the need for message brokers like Kafka"),
            Choice(id="c-4", text="2PC is natively supported across all NoSQL stores without coordinator failure risks"),
        ],
        correct_choice_id="c-1",
        explanation="2PC holds database locks across distributed participants for the duration of the commit protocol, creating severe latency bottlenecks. Sagas execute non-blocking local transactions with compensating rollback transactions.",
    ),
]
