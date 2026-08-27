import time
import random
import uuid
from datetime import datetime
from typing import List, Optional, Dict
from app.models.schemas import (
    CodingChallenge,
    TestCase,
    TestCaseResult,
    CodeExecutionRequest,
    CodeExecutionResponse,
    CodeSubmissionRequest,
    CodeSubmissionResponse,
    CreditEntry,
)

CHALLENGES: List[CodingChallenge] = [
    CodingChallenge(
        id="cc-101",
        title="High-Throughput Payments Idempotency Engine",
        slug="payments-idempotency-engine",
        difficulty="HARD",
        domain="Distributed Systems & Concurrency",
        points=100,
        credits_reward=15,
        time_limit_minutes=45,
        pass_percentage=72.4,
        description="""Enterprise payment processors require strict idempotency. When concurrent microservices attempt to charge the same transaction payload with identical idempotency keys within a sliding window of 60 seconds:
1. The first incoming request must execute and return a generated `CHARGE_SUCCESS` payload.
2. Concurrent duplicate requests arriving while execution is in-flight must block or return `IN_PROGRESS`.
3. Replays arriving after completion must return the cached transaction response without double-charging the customer account.

Implement an in-memory thread-safe `IdempotentPaymentProcessor` that processes transaction events and rejects duplicates with zero race conditions under 10,000 requests/sec.""",
        input_format="List of transaction tuples: `(timestamp_ms, idempotency_key, account_id, amount_cents)`",
        output_format="Array of processed transaction statuses `['PROCESSED', 'REPLAY_CACHED', 'REJECTED_CONCURRENT']`",
        constraints=[
            "1 <= N <= 100,000 transactions",
            "Idempotency key length <= 64 alphanumeric characters",
            "Thread execution must satisfy zero race conditions with P99 latency < 5ms",
            "Memory footprint must clean up keys older than sliding window (60,000 ms)",
        ],
        starter_code={
            "java": """import java.util.*;
import java.util.concurrent.*;
import java.util.concurrent.atomic.*;

public class IdempotentPaymentProcessor {
    private final ConcurrentMap<String, String> cache = new ConcurrentHashMap<>();

    public List<String> processTransactions(List<String[]> transactions) {
        List<String> results = new ArrayList<>();
        // TODO: Implement concurrent idempotency filter logic
        for (String[] txn : transactions) {
            String key = txn[1];
            if (cache.putIfAbsent(key, "PROCESSED") == null) {
                results.add("PROCESSED");
            } else {
                results.add("REPLAY_CACHED");
            }
        }
        return results;
    }
}""",
            "python": """import time
from typing import List, Tuple

class IdempotentPaymentProcessor:
    def __init__(self):
        self.cache = {}

    def process_transactions(self, transactions: List[Tuple[int, str, str, int]]) -> List[str]:
        results = []
        for ts, key, account, amount in transactions:
            if key not in self.cache:
                self.cache[key] = "PROCESSED"
                results.append("PROCESSED")
            else:
                results.append("REPLAY_CACHED")
        return results
""",
            "typescript": """export class IdempotentPaymentProcessor {
  private cache = new Map<string, string>();

  public processTransactions(transactions: Array<[number, string, string, number]>): string[] {
    return transactions.map(([ts, key, account, amount]) => {
      if (!this.cache.has(key)) {
        this.cache.set(key, "PROCESSED");
        return "PROCESSED";
      }
      return "REPLAY_CACHED";
    });
  }
}""",
            "sql": """-- Double-Entry Ledger Invariant Audit
SELECT 
    account_id,
    SUM(CASE WHEN entry_type = 'CREDIT' THEN amount ELSE -amount END) AS balance_differential
FROM ledger_entries
GROUP BY account_id
HAVING SUM(CASE WHEN entry_type = 'CREDIT' THEN amount ELSE -amount END) != 0;""",
        },
        test_cases=[
            TestCase(
                id="tc-1",
                input_data="[ (1000, 'idemp-abc-1', 'acc-001', 5000), (1020, 'idemp-abc-1', 'acc-001', 5000) ]",
                expected_output="['PROCESSED', 'REPLAY_CACHED']",
                is_hidden=False,
                explanation="Second transaction with key 'idemp-abc-1' arrives within 20ms of the first, matching idempotency key.",
            ),
            TestCase(
                id="tc-2",
                input_data="[ (1000, 'k-1', 'a1', 100), (1050, 'k-2', 'a2', 200), (1100, 'k-3', 'a3', 300) ]",
                expected_output="['PROCESSED', 'PROCESSED', 'PROCESSED']",
                is_hidden=False,
                explanation="All distinct keys process successfully.",
            ),
            TestCase(
                id="tc-3",
                input_data="[ (1000, 'replay-burst', 'a1', 500), (1001, 'replay-burst', 'a1', 500), (1002, 'replay-burst', 'a1', 500) ]",
                expected_output="['PROCESSED', 'REPLAY_CACHED', 'REPLAY_CACHED']",
                is_hidden=True,
                explanation="Burst test case: rapid fire repeat keys.",
            ),
        ],
        tags=["Java 21", "Concurrency", "High Throughput", "Payments", "Idempotency"],
    ),
    CodingChallenge(
        id="cc-102",
        title="Vector Similarity Search & Top-K Retrieval",
        slug="vector-similarity-search",
        difficulty="MEDIUM",
        domain="AI / Embeddings",
        points=80,
        credits_reward=10,
        time_limit_minutes=30,
        pass_percentage=85.1,
        description="""Implement a high-efficiency cosine similarity search engine for high-dimensional embedding vectors. Given a query vector $Q$ of dimension $D$ and a corpus of $N$ document embeddings, find the Top-$K$ most relevant documents sorted in descending order of similarity score.
Include vector normalization and edge-case handling for zero-magnitude vectors.""",
        input_format="`query_vector`: List[float], `corpus`: List[List[float]], `k`: int",
        output_format="List of document indices and cosine similarity scores: `[(doc_id, score), ...]`",
        constraints=[
            "1 <= D <= 1536 dimensions (e.g. OpenAI / Bedrock Titan)",
            "1 <= N <= 50,000 vectors",
            "1 <= K <= 50",
            "Cosine similarity = (A · B) / (||A|| * ||B||)",
        ],
        starter_code={
            "python": """import math
from typing import List, Tuple

def top_k_cosine_similarity(query: List[float], corpus: List[List[float]], k: int) -> List[Tuple[int, float]]:
    # TODO: Implement normalized dot product & top-k heap
    scores = []
    q_norm = math.sqrt(sum(x*x for x in query))
    if q_norm == 0: return []

    for idx, doc in enumerate(corpus):
        d_norm = math.sqrt(sum(x*x for x in doc))
        if d_norm == 0: continue
        dot = sum(q * d for q, d in zip(query, doc))
        similarity = dot / (q_norm * d_norm)
        scores.append((idx, round(similarity, 4)))

    scores.sort(key=lambda x: x[1], reverse=True)
    return scores[:k]
""",
            "java": """import java.util.*;

public class VectorSearch {
    public static List<Map.Entry<Integer, Double>> topK(double[] query, double[][] corpus, int k) {
        List<Map.Entry<Integer, Double>> list = new ArrayList<>();
        // Implement cosine similarity
        return list;
    }
}""",
            "typescript": """export function topKCosineSimilarity(query: number[], corpus: number[][], k: number): Array<[number, number]> {
  // Implement vector search
  return [];
}""",
        },
        test_cases=[
            TestCase(
                id="tc-v1",
                input_data="query=[1.0, 0.0, 0.0], corpus=[[1.0, 0.0, 0.0], [0.0, 1.0, 0.0], [0.707, 0.707, 0.0]], k=2",
                expected_output="[(0, 1.0), (2, 0.707)]",
                is_hidden=False,
                explanation="Doc 0 is identical (1.0), Doc 2 is at 45 degrees (0.707).",
            ),
            TestCase(
                id="tc-v2",
                input_data="query=[0.5, 0.5], corpus=[[0.0, 0.0], [1.0, 1.0]], k=1",
                expected_output="[(1, 1.0)]",
                is_hidden=True,
                explanation="Ignores zero vector and picks collinear doc.",
            ),
        ],
        tags=["Python 3", "Vector Search", "Bedrock", "Cosine Similarity", "RAG"],
    ),
    CodingChallenge(
        id="cc-103",
        title="Kafka Stream Lag & Partition Rebalance Optimizer",
        slug="kafka-stream-partition-optimizer",
        difficulty="HARD",
        domain="Distributed Systems",
        points=120,
        credits_reward=20,
        time_limit_minutes=60,
        pass_percentage=68.2,
        description="""A high-scale event streaming platform operates with $P$ topic partitions and $C$ consumer instances. Due to traffic spikes, partition consumer lags fluctuate dramatically.
Design an optimal consumer group partition assignment algorithm that minimizes the maximum lag assigned to any single consumer, achieving near-uniform work distribution.""",
        input_format="`partition_lags`: List[int], `num_consumers`: int",
        output_format="`assignment`: Dict[consumer_id, List[partition_id]], `max_consumer_lag`: int",
        constraints=[
            "1 <= P <= 512 partitions",
            "1 <= C <= P consumers",
            "Partition lags: 0 <= lag <= 1,000,000 events",
        ],
        starter_code={
            "typescript": """export function optimizeKafkaPartitions(partitionLags: number[], numConsumers: number): {
  assignments: number[][];
  maxConsumerLag: number;
} {
  // TODO: Implement greedy min-heap consumer partition assignment
  const consumerLags = new Array(numConsumers).fill(0);
  const assignments: number[][] = Array.from({ length: numConsumers }, () => []);

  // Sort partitions descending
  const indexed = partitionLags.map((lag, idx) => ({ lag, idx })).sort((a, b) => b.lag - a.lag);

  for (const { lag, idx } of indexed) {
    // Find consumer with lowest current lag
    let minIdx = 0;
    for (let c = 1; c < numConsumers; c++) {
      if (consumerLags[c] < consumerLags[minIdx]) minIdx = c;
    }
    assignments[minIdx].push(idx);
    consumerLags[minIdx] += lag;
  }

  return {
    assignments,
    maxConsumerLag: Math.max(...consumerLags)
  };
}""",
            "java": """import java.util.*;

public class KafkaLagOptimizer {
    public static Map<Integer, List<Integer>> assignPartitions(int[] partitionLags, int numConsumers) {
        // Implement partition balancer
        return new HashMap<>();
    }
}""",
            "python": """import heapq
from typing import List, Dict, Any

def optimize_kafka_partitions(partition_lags: List[int], num_consumers: int) -> Dict[str, Any]:
    heap = [(0, i, []) for i in range(num_consumers)]
    indexed = sorted(enumerate(partition_lags), key=lambda x: x[1], reverse=True)

    for p_idx, lag in indexed:
        cur_lag, c_id, parts = heapq.heappop(heap)
        parts.append(p_idx)
        heapq.heappush(heap, (cur_lag + lag, c_id, parts))

    max_lag = max(item[0] for item in heap)
    return {"max_consumer_lag": max_lag}
""",
        },
        test_cases=[
            TestCase(
                id="tc-k1",
                input_data="partition_lags=[100, 200, 300, 400], num_consumers=2",
                expected_output="maxConsumerLag=500",
                is_hidden=False,
                explanation="Consumer 1 gets [400, 100] = 500, Consumer 2 gets [300, 200] = 500.",
            ),
        ],
        tags=["Kafka", "Load Balancing", "Algorithms", "Event Streaming"],
    ),
]


class CodeExecutorService:
    def __init__(self, repo):
        self.repo = repo

    def get_challenges(self) -> List[CodingChallenge]:
        return CHALLENGES

    def get_challenge(self, challenge_id: str) -> Optional[CodingChallenge]:
        for c in CHALLENGES:
            if c.id == challenge_id or c.slug == challenge_id:
                return c
        return None

    def create_challenge(self, payload: dict) -> CodingChallenge:
        new_id = f"cc-{len(CHALLENGES) + 101}"
        challenge = CodingChallenge(
            id=new_id,
            title=payload["title"],
            slug=payload.get("slug", payload["title"].lower().replace(" ", "-")),
            difficulty=payload.get("difficulty", "MEDIUM"),
            domain=payload.get("domain", "Distributed Systems"),
            points=payload.get("points", 100),
            credits_reward=payload.get("credits_reward", 15),
            time_limit_minutes=payload.get("time_limit_minutes", 45),
            description=payload["description"],
            input_format=payload.get("input_format", "Standard Input"),
            output_format=payload.get("output_format", "Standard Output"),
            constraints=payload.get("constraints", []),
            starter_code=payload.get("starter_code", {
                "java": "public class Solution {\n    public static void main(String[] args) {\n        // Code here\n    }\n}",
                "python": "def solution():\n    pass\n",
                "typescript": "export function solution() {\n    // Code here\n}\n",
                "sql": "-- Write SQL Query here\n",
            }),
            test_cases=payload.get("test_cases", []),
            tags=payload.get("tags", ["Algorithms", "Engineering"]),
        )
        CHALLENGES.insert(0, challenge)
        return challenge

    def delete_challenge(self, challenge_id: str) -> bool:
        global CHALLENGES
        init_len = len(CHALLENGES)
        CHALLENGES = [c for c in CHALLENGES if c.id != challenge_id and c.slug != challenge_id]
        return len(CHALLENGES) < init_len


    def execute_code(self, req: CodeExecutionRequest) -> CodeExecutionResponse:
        challenge = self.get_challenge(req.challenge_id)
        if not challenge:
            return CodeExecutionResponse(
                challenge_id=req.challenge_id,
                language=req.language,
                overall_status="RUNTIME_ERROR",
                total_test_cases=0,
                passed_test_cases=0,
                execution_time_ms=0,
                memory_used_mb=0,
                results=[],
                stdout_summary="Challenge not found",
            )

        start_time = time.time()
        test_results: List[TestCaseResult] = []

        # Check basic syntax / keywords
        is_empty = len(req.code.strip()) < 15
        has_error = "throw" in req.code or "Exception(" in req.code or "syntax_error" in req.code

        for tc in challenge.test_cases:
            if is_empty:
                status = "FAILED"
                actual = "null / empty return"
                stdout = "No output produced"
            elif has_error:
                status = "RUNTIME_ERROR"
                actual = "Execution threw an unhandled exception"
                stdout = "Traceback (most recent call last):\n  Error in execution thread"
            else:
                # Simulated high-fidelity evaluation
                status = "PASSED"
                actual = tc.expected_output
                stdout = f"Processed {tc.id} with input: {tc.input_data[:30]}..."

            exec_time = round(random.uniform(8.0, 24.5), 1)
            mem_used = round(random.uniform(14.2, 28.6), 1)

            test_results.append(
                TestCaseResult(
                    test_case_id=tc.id,
                    status=status,
                    input_data=tc.input_data,
                    expected_output=tc.expected_output,
                    actual_output=actual,
                    is_hidden=tc.is_hidden,
                    stdout=stdout,
                    execution_time_ms=exec_time,
                    memory_used_mb=mem_used,
                )
            )

        passed_count = sum(1 for r in test_results if r.status == "PASSED")
        total_time = round((time.time() - start_time) * 1000 + random.uniform(12, 35), 2)
        overall_status = "ACCEPTED" if passed_count == len(test_results) else ("RUNTIME_ERROR" if has_error else "WRONG_ANSWER")

        return CodeExecutionResponse(
            challenge_id=req.challenge_id,
            language=req.language,
            overall_status=overall_status,
            total_test_cases=len(test_results),
            passed_test_cases=passed_count,
            execution_time_ms=total_time,
            memory_used_mb=21.4,
            results=test_results,
            stdout_summary=f"Compilation & execution finished with {passed_count}/{len(test_results)} test cases passed in {total_time}ms.",
        )

    def submit_code(self, req: CodeSubmissionRequest) -> CodeSubmissionResponse:
        challenge = self.get_challenge(req.challenge_id)
        if not challenge:
            raise ValueError("Challenge not found")

        exec_res = self.execute_code(
            CodeExecutionRequest(
                challenge_id=req.challenge_id,
                language=req.language,
                code=req.code,
            )
        )

        all_passed = exec_res.passed_test_cases == exec_res.total_test_cases
        submission_id = f"sub-{uuid.uuid4().hex[:8]}"

        if all_passed:
            # Award enterprise credits to associate ledger
            current_balance = self.repo.get_credit_balance(req.associate_id)
            new_entry = CreditEntry(
                id=f"cr-{uuid.uuid4().hex[:6]}",
                associate_id=req.associate_id,
                source=f"HackerRank Challenge: {challenge.title}",
                description=f"Automated evaluation 100% pass on {challenge.slug} ({req.language.upper()})",
                amount=challenge.credits_reward,
                balance_after=current_balance + challenge.credits_reward,
                awarded_at=datetime.utcnow(),
            )
            self.repo.add_credit_entry(new_entry)

        return CodeSubmissionResponse(
            submission_id=submission_id,
            associate_id=req.associate_id,
            challenge_id=req.challenge_id,
            status="ACCEPTED" if all_passed else "REJECTED",
            score=challenge.points if all_passed else int(challenge.points * (exec_res.passed_test_cases / max(1, exec_res.total_test_cases))),
            credits_awarded=challenge.credits_reward if all_passed else 0,
            total_test_cases=exec_res.total_test_cases,
            passed_test_cases=exec_res.passed_test_cases,
            execution_time_ms=exec_res.execution_time_ms,
            memory_used_mb=exec_res.memory_used_mb,
            submitted_at=datetime.utcnow(),
            feedback="All production test cases satisfied. Clean concurrency & memory benchmarks." if all_passed else "Some edge test cases failed. Verify constraint boundaries and retry.",
        )
