from __future__ import annotations

from app.models.schemas import CurriculumCourse, Question, QuestionOption, Tier

COURSES: list[CurriculumCourse] = [
    CurriculumCourse(id="c-wf101", code="WF-101", name="Java 21 & Secure AI Prompting", domain="Foundation", difficulty="Core", progress=1.0, assessment="Completed", credits=6, status="Completed"),
    CurriculumCourse(id="c-wf102", code="WF-102", name="Spring Boot & Data Integrity", domain="Foundation", difficulty="Core", progress=1.0, assessment="Completed", credits=6, status="Completed"),
    CurriculumCourse(id="c-wf103", code="WF-103", name="Spring Security & Cloud Foundations", domain="Foundation", difficulty="Core", progress=0.65, assessment="In Progress", credits=6, status="In Progress"),
    CurriculumCourse(id="c-wf104", code="WF-104", name="Event Integration & Observability", domain="Foundation", difficulty="Core", progress=0.30, assessment="Not Started", credits=6, status="Not Started"),
    CurriculumCourse(id="c-wf201", code="WF-201", name="Microservices at Cloud Scale", domain="Engineering", difficulty="Intermediate", progress=0.0, assessment="Not Started", credits=12, status="Not Started"),
    CurriculumCourse(id="c-wf202", code="WF-202", name="Distributed Resilience Engineering", domain="Engineering", difficulty="Intermediate", progress=0.0, assessment="Not Started", credits=12, status="Not Started"),
    CurriculumCourse(id="c-wf203", code="WF-203", name="Spring AI & Enterprise RAG", domain="AI", difficulty="Intermediate", progress=0.0, assessment="Not Started", credits=12, status="Not Started"),
]

COURSE_META: dict[str, dict] = {
    "c-wf101": {"code": "WF-101", "name": "Java 21 & Secure AI Prompting", "domain": "Foundation", "passing_score": 75, "time_limit": 60},
    "c-wf102": {"code": "WF-102", "name": "Spring Boot & Data Integrity", "domain": "Foundation", "passing_score": 75, "time_limit": 60},
    "c-wf103": {"code": "WF-103", "name": "Spring Security & Cloud Foundations", "domain": "Foundation", "passing_score": 75, "time_limit": 60},
    "c-wf104": {"code": "WF-104", "name": "Event Integration & Observability", "domain": "Foundation", "passing_score": 75, "time_limit": 60},
    "c-wf201": {"code": "WF-201", "name": "Microservices at Cloud Scale", "domain": "Engineering", "passing_score": 80, "time_limit": 90},
    "c-wf202": {"code": "WF-202", "name": "Distributed Resilience Engineering", "domain": "Engineering", "passing_score": 80, "time_limit": 90},
    "c-wf203": {"code": "WF-203", "name": "Spring AI & Enterprise RAG", "domain": "AI", "passing_score": 80, "time_limit": 90},
}

TIERS = [Tier.BASIC, Tier.NOVICE, Tier.APPRENTICE, Tier.EXPERT, Tier.MASTER]


def _opt(letter: str, text: str) -> QuestionOption:
    return QuestionOption(id=letter, text=text)


def _q(
    course_id: str,
    tier: Tier,
    index: int,
    question: str,
    options: list[tuple[str, str]],
    correct: str,
    explanation: str,
    domain: str,
) -> Question:
    return Question(
        id=f"{course_id}-{tier.value.lower()}-{index}",
        course_id=course_id,
        tier=tier,
        question=question,
        options=[_opt(o[0], o[1]) for o in options],
        correct_answer=correct,
        explanation=explanation,
        domain=domain,
    )


def seed_curriculum_courses() -> list[CurriculumCourse]:
    return list(COURSES)


def seed_questions() -> list[Question]:
    questions: list[Question] = []
    questions.extend(_wf101_questions())
    questions.extend(_wf102_questions())
    questions.extend(_wf103_questions())
    questions.extend(_wf104_questions())
    questions.extend(_wf201_questions())
    questions.extend(_wf202_questions())
    questions.extend(_wf203_questions())
    return questions


# ---------------------------------------------------------------------------
# WF-101 — Java 21 & Secure AI Prompting
# ---------------------------------------------------------------------------

def _wf101_questions() -> list[Question]:
    cid = "c-wf101"
    domain = "Foundation"
    qs: list[Question] = []

    # Basic
    qs.append(_q(cid, Tier.BASIC, 1, "Which Java keyword declares a variable that cannot be reassigned after initialization?",
        [("A", "final"), ("B", "static"), ("C", "const"), ("D", "immutable")], "A",
        "In Java, 'final' declares a variable whose reference cannot be reassigned after initialization. Java has no 'const' keyword (unlike C/C++).", domain))
    qs.append(_q(cid, Tier.BASIC, 2, "What is the file extension for compiled Java bytecode?",
        [("A", ".java"), ("B", ".class"), ("C", ".bytecode"), ("D", ".jar")], "B",
        "The Java compiler (javac) produces .class files containing JVM bytecode. .java files are source, .jar is an archive format.", domain))
    qs.append(_q(cid, Tier.BASIC, 3, "Which Java 21 feature allows pattern matching directly in switch statements?",
        [("A", "Sealed classes"), ("B", "Pattern matching for switch"), ("C", "Virtual threads"), ("D", "Record patterns")], "B",
        "Pattern matching for switch, finalized in Java 21, allows type patterns and guards directly in switch labels.", domain))
    qs.append(_q(cid, Tier.BASIC, 4, "What does the 'var' keyword introduced in Java 10 enable?",
        [("A", "Dynamic typing at runtime"), ("B", "Local variable type inference"), ("C", "Variable-length arguments"), ("D", "Variance in generics")], "B",
        "'var' enables local variable type inference — the compiler infers the type from the initializer. Java remains statically typed.", domain))
    qs.append(_q(cid, Tier.BASIC, 5, "Which package contains the core Java collections framework?",
        [("A", "java.util"), ("B", "java.collections"), ("C", "java.lang"), ("D", "java.io")], "A",
        "java.util contains List, Set, Map, and the rest of the Java Collections Framework. java.lang has core language classes.", domain))

    # Novice
    qs.append(_q(cid, Tier.NOVICE, 1, "What is a record in Java 21?",
        [("A", "A mutable data holder class"), ("B", "An immutable data carrier with auto-generated accessors, equals, hashCode, and toString"), ("C", "A logging mechanism"), ("D", "A type of enum")], "B",
        "Records are immutable data carriers that auto-generate constructors, accessors, equals, hashCode, and toString. They are ideal for DTOs.", domain))
    qs.append(_q(cid, Tier.NOVICE, 2, "Which Java 21 feature provides lightweight, user-mode threads?",
        [("A", "Platform threads"), ("B", "Virtual threads"), ("C", "Fiber channels"), ("D", "Reactive streams")], "B",
        "Virtual threads, finalized in Java 21, are lightweight JVM-managed threads that dramatically improve concurrency throughput for I/O-bound work.", domain))
    qs.append(_q(cid, Tier.NOVICE, 3, "What is the primary purpose of a sealed class hierarchy in Java?",
        [("A", "To prevent subclassing entirely"), ("B", "To restrict which classes can extend or implement it, enabling exhaustive pattern matching"), ("C", "To make all fields final"), ("D", "To enforce thread safety")], "B",
        "Sealed classes restrict which types can extend them, enabling the compiler to verify exhaustiveness in pattern matching switch expressions.", domain))
    qs.append(_q(cid, Tier.NOVICE, 4, "In the context of AI prompting, what does 'prompt injection' refer to?",
        [("A", "Injecting code via a prompt to execute on the server"), ("B", "Crafting user input that overrides the system prompt to manipulate model behavior"), ("C", "A performance optimization technique"), ("D", "A type of dependency injection for prompts")], "B",
        "Prompt injection is an attack where user-supplied content overrides or bypasses the system prompt, potentially causing the model to reveal secrets or perform unintended actions.", domain))
    qs.append(_q(cid, Tier.NOVICE, 5, "Which Java 21 collection factory method creates an unmodifiable list?",
        [("A", "List.of(...)"), ("B", "new ArrayList<>(...)"), ("C", "Collections.synchronizedList(...)"), ("D", "List.copyOf(...)")], "A",
        "List.of(...) creates an unmodifiable list. List.copyOf(...) also returns an unmodifiable copy. Both throw UnsupportedOperationException on mutation.", domain))

    # Apprentice
    qs.append(_q(cid, Tier.APPRENTICE, 1, "When using virtual threads, which operation should you avoid to prevent thread pinning?",
        [("A", "Using synchronized blocks with long I/O waits"), ("B", "Using var declarations"), ("C", "Using record types"), ("D", "Using sealed interfaces")], "A",
        "Virtual threads can become 'pinned' to their carrier thread inside synchronized blocks during blocking I/O, negating their scalability benefit. Use ReentrantLock instead for long blocking sections.", domain))
    qs.append(_q(cid, Tier.APPRENTICE, 2, "What is a 'system prompt' in the context of LLM-based applications?",
        [("A", "The operating system's command prompt"), ("B", "A hidden instruction set that defines the model's role, constraints, and behavior boundaries"), ("C", "A Java system property"), ("D", "A type of shell script")], "B",
        "The system prompt is a hidden instruction that defines the model's persona, rules, and constraints. It must be protected from user-injected content to maintain application integrity.", domain))
    qs.append(_q(cid, Tier.APPRENTICE, 3, "Which Java 21 feature allows destructuring nested record components in a single pattern?",
        [("A", "Sealed patterns"), ("B", "Record patterns"), ("C", "Guard patterns"), ("D", "Switch expressions")], "B",
        "Record patterns allow destructuring nested record components directly in pattern matching, e.g., case Point(int x, int y) -> ....", domain))
    qs.append(_q(cid, Tier.APPRENTICE, 4, "What is the recommended approach to sanitize user input before including it in an LLM prompt?",
        [("A", "Base64 encode the input"), ("B", "Treat all user input as untrusted data, use structured templates with clear delimiters, and validate against an allowlist"), ("C", "Hash the input before sending"), ("D", "Encrypt the input with AES")], "B",
        "Treat user input as untrusted data. Use structured prompt templates with clear delimiters (e.g., XML tags), validate against allowlists, and separate instructions from data to reduce injection risk.", domain))
    qs.append(_q(cid, Tier.APPRENTICE, 5, "Which Java 21 string template feature was introduced as a preview?",
        [("A", "String templates (STR processor)"), ("B", "GString interpolation"), ("C", "Formatted strings"), ("D", "Text blocks")], "A",
        "Java 21 introduced string templates as a preview feature (STR processor), enabling inline interpolation like STR.\"Hello \{name}\".", domain))

    # Expert
    qs.append(_q(cid, Tier.EXPERT, 1, "In the context of secure AI prompting, what is 'jailbreaking'?",
        [("A", "Breaking out of a Java sandbox"), ("B", "Crafting prompts that bypass safety guardrails to extract restricted model capabilities"), ("C", "A JVM optimization technique"), ("D", "A type of garbage collection")], "B",
        "Jailbreaking refers to crafting prompts that circumvent a model's safety guardrails, causing it to produce content it was designed to refuse. Defense requires layered guardrails and output validation.", domain))
    qs.append(_q(cid, Tier.EXPERT, 2, "How does the StructuredTaskScope API in Java 21 improve concurrent code?",
        [("A", "By replacing the ExecutorService entirely"), ("B", "By providing structured concurrency that makes error handling and cancellation propagation automatic and scope-bounded"), ("C", "By removing the need for threads"), ("D", "By making all operations synchronous")], "B",
        "StructuredTaskScope (preview in Java 21) makes concurrency scope-bounded: child tasks are automatically tracked, cancelled, and their errors propagated, similar to structured exception handling.", domain))
    qs.append(_q(cid, Tier.EXPERT, 3, "What is the security implication of passing unvalidated user input directly into an LLM system prompt?",
        [("A", "No risk — the model handles it safely"), ("B", "Prompt injection can override system instructions, leak sensitive data, or cause the model to perform unauthorized actions"), ("C", "It causes a compilation error"), ("D", "It only affects performance, not security")], "B",
        "Unvalidated user input in a system prompt enables prompt injection attacks. The model may follow injected instructions, bypassing intended guardrails and potentially leaking secrets or producing harmful output.", domain))
    qs.append(_q(cid, Tier.EXPERT, 4, "Which Java memory model guarantee ensures that a final field's value is visible to other threads after construction?",
        [("A", "The volatile keyword"), ("B", "The final field semantics guarantee — final fields are safely published upon construction completion"), ("C", "The synchronized keyword"), ("D", "The happens-before relationship of locks")], "B",
        "The JMM guarantees that final fields are visible to all threads after the constructor completes, provided the reference to the object doesn't escape during construction. This is why immutable objects are thread-safe by default.", domain))
    qs.append(_q(cid, Tier.EXPERT, 5, "What is 'data poisoning' in the context of AI/ML security?",
        [("A", "Corrupting a Java object's fields at runtime"), ("B", "Injecting malicious data into a training set to degrade or manipulate model behavior"), ("C", "A SQL injection variant"), ("D", "A type of cache invalidation")], "B",
        "Data poisoning involves injecting crafted data into a model's training pipeline to introduce biases, backdoors, or degraded performance. It is a supply-chain attack on ML systems.", domain))

    # Master
    qs.append(_q(cid, Tier.MASTER, 1, "When designing a secure LLM gateway in Java, which architecture best mitigates prompt injection while maintaining usability?",
        [("A", "Concatenate user input directly into the system prompt"), ("B", "Use a layered architecture: input allowlisting, structured prompt templates with data/instruction separation, output validation, and rate limiting"), ("C", "Rely solely on the LLM provider's built-in safety filters"), ("D", "Encrypt all prompts before sending")], "B",
        "Defense in depth is required: allowlist input validation, separate instructions from data using structured templates, validate model output against expected schemas, and enforce rate limits. No single layer is sufficient.", domain))
    qs.append(_q(cid, Tier.MASTER, 2, "In Java 21's structured concurrency model, what happens to sibling tasks when one child task fails with ShutdownOnFailure?",
        [("A", "They continue running to completion"), ("B", "They are automatically cancelled and the scope completes exceptionally"), ("C", "They are paused indefinitely"), ("D", "They are retried automatically")], "B",
        "With ShutdownOnFailure policy, when one child fails, all remaining siblings are cancelled and the scope propagates the first exception. This mirrors how try-catch blocks handle exceptions in sequential code.", domain))
    qs.append(_q(cid, Tier.MASTER, 3, "What is the theoretical risk of 'model inversion attacks' against an LLM-based system?",
        [("A", "They invert the model's output to produce invalid responses"), ("B", "They can extract training data or sensitive information embedded in the model by crafting targeted queries"), ("C", "They reverse the JVM bytecode"), ("D", "They cause stack overflow errors")], "B",
        "Model inversion attacks craft queries that cause the model to regurgitate memorized training data, potentially exposing PII or proprietary information. Defense includes differential privacy training and output filtering.", domain))
    qs.append(_q(cid, Tier.MASTER, 4, "Which JVM flag controls the carrier thread pool size for virtual threads in Java 21?",
        [("A", "-XX:VirtualThreadCarrierCount"), ("B", "jdk.virtualThreadParallelism"), ("C", "There is no direct flag — the carrier pool is derived from the ForkJoinPool parallelism"), ("D", "-XX:ThreadStackSize")], "C",
        "Virtual thread carriers are managed by the ForkJoinPool. You can influence parallelism via -Djdk.virtualThreadParallelism=N (preview) but there is no dedicated stable JVM flag for carrier count.", domain))
    qs.append(_q(cid, Tier.MASTER, 5, "When building a Java service that proxies LLM calls, what is the most critical security control for preventing data exfiltration?",
        [("A", "Using HTTPS for the LLM API call"), ("B", "Implementing output filtering and content scanning on model responses before returning them to the user, plus logging and alerting on anomalous outputs"), ("C", "Using a connection pool"), ("D", "Compressing the response payload")], "B",
        "The model's output is an untrusted boundary. Implement content scanning, schema validation, and PII detection on responses. Log anomalies and alert on potential exfiltration patterns. HTTPS alone does not prevent the model from leaking data.", domain))

    return qs


# ---------------------------------------------------------------------------
# WF-102 — Spring Boot & Data Integrity
# ---------------------------------------------------------------------------

def _wf102_questions() -> list[Question]:
    cid = "c-wf102"
    domain = "Foundation"
    qs: list[Question] = []

    # Basic
    qs.append(_q(cid, Tier.BASIC, 1, "Which annotation marks a class as a Spring Boot application entry point?",
        [("A", "@Component"), ("B", "@SpringBootApplication"), ("C", "@Configuration"), ("D", "@EnableAutoConfiguration")], "B",
        "@SpringBootApplication is a composite annotation combining @SpringBootConfiguration, @EnableAutoConfiguration, and @ComponentScan.", domain))
    qs.append(_q(cid, Tier.BASIC, 2, "What is the default embedded server in Spring Boot?",
        [("A", "Jetty"), ("B", "Undertow"), ("C", "Tomcat"), ("D", "Netty")], "C",
        "Spring Boot defaults to Tomcat as its embedded servlet container. Jetty and Undertow are available as alternatives via dependency swapping.", domain))
    qs.append(_q(cid, Tier.BASIC, 3, "Which file is commonly used for externalized configuration in Spring Boot?",
        [("A", "application.xml"), ("B", "application.properties or application.yml"), ("C", "config.json"), ("D", "settings.ini")], "B",
        "Spring Boot supports application.properties and application.yml for externalized configuration, loaded via Spring's Environment abstraction.", domain))
    qs.append(_q(cid, Tier.BASIC, 4, "What does the @Autowired annotation do?",
        [("A", "Automatically generates getter methods"), ("B", "Injects a dependency by type during bean initialization"), ("C", "Configures auto-reconnect for databases"), ("D", "Enables auto-restart on code changes")], "B",
        "@Autowired tells Spring to inject a collaborating bean by type during the initialization phase of the dependent bean's lifecycle.", domain))
    qs.append(_q(cid, Tier.BASIC, 5, "Which Spring Data annotation marks a domain entity mapped to a database table?",
        [("A", "@Table"), ("B", "@Entity"), ("C", "@Model"), ("D", "@Record")], "B",
        "@Entity (from jakarta.persistence) marks a class as a JPA entity mapped to a database table. @Table customizes the table name.", domain))

    # Novice
    qs.append(_q(cid, Tier.NOVICE, 1, "What is the purpose of the @Transactional annotation in Spring?",
        [("A", "To schedule tasks"), ("B", "To define transaction boundaries for methods, ensuring atomic commit or rollback"), ("C", "To translate exceptions"), ("D", "To configure thread pools")], "B",
        "@Transactional wraps a method (or class) in a transaction. If a runtime exception occurs, the transaction rolls back; otherwise it commits.", domain))
    qs.append(_q(cid, Tier.NOVICE, 2, "Which validation annotation ensures a field is not null in Spring Boot?",
        [("A", "@NotNull"), ("B", "@NotEmpty"), ("C", "@NotBlank"), ("D", "@Valid")], "A",
        "@NotNull validates that a field is not null. @NotEmpty checks non-null and non-empty for collections/strings. @NotBlank requires a non-whitespace string.", domain))
    qs.append(_q(cid, Tier.NOVICE, 3, "What is 'data integrity' in the context of a Spring Boot application?",
        [("A", "Ensuring the UI renders correctly"), ("B", "The accuracy, consistency, and reliability of data throughout its lifecycle — enforced via constraints, validation, and transactions"), ("C", "A type of database indexing"), ("D", "A frontend validation library")], "B",
        "Data integrity encompasses accuracy, consistency, and reliability of data. In Spring Boot, it is enforced via Bean Validation, database constraints, and transactional boundaries.", domain))
    qs.append(_q(cid, Tier.NOVICE, 4, "Which Spring Boot starter includes data validation dependencies?",
        [("A", "spring-boot-starter-web"), ("B", "spring-boot-starter-validation"), ("C", "spring-boot-starter-data-jpa"), ("D", "spring-boot-starter-security")], "B",
        "spring-boot-starter-validation includes the Hibernate Validator (Bean Validation / Jakarta Validation API) for declarative validation.", domain))
    qs.append(_q(cid, Tier.NOVICE, 5, "What does the @Repository stereotype annotation primarily signal?",
        [("A", "A REST controller"), ("B", "A data access component, with automatic exception translation to Spring's DataAccessException hierarchy"), ("C", "A configuration class"), ("D", "A service endpoint")], "B",
        "@Repository marks a data access class and enables automatic translation of persistence exceptions into Spring's unified DataAccessException hierarchy.", domain))

    # Apprentice
    qs.append(_q(cid, Tier.APPRENTICE, 1, "What is the difference between @Valid and @Validated in Spring Boot?",
        [("A", "They are identical"), ("B", "@Valid is standard Jakarta Validation; @Validated is Spring's extension supporting validation groups"), ("C", "@Validated is for JPA entities only"), ("D", "@Valid is for request bodies, @Validated for path variables")], "B",
        "@Valid is the standard Jakarta Validation annotation. @Validated is Spring's extension that adds support for validation groups, allowing partial validation based on context.", domain))
    qs.append(_q(cid, Tier.APPRENTICE, 2, "Which isolation level prevents dirty reads but allows non-repeatable reads?",
        [("A", "READ_UNCOMMITTED"), ("B", "READ_COMMITTED"), ("C", "REPEATABLE_READ"), ("D", "SERIALIZABLE")], "B",
        "READ_COMMITTED prevents dirty reads (uncommitted data from other transactions) but allows non-repeatable reads — the same query may return different rows within a transaction.", domain))
    qs.append(_q(cid, Tier.APPRENTICE, 3, "What is optimistic locking in Spring Data JPA?",
        [("A", "A pattern that locks all rows before any read"), ("B", "A version-based concurrency control using @Version, detecting conflicts at flush time without holding database locks"), ("C", "A type of read-only transaction"), ("D", "Automatic retry of failed transactions")], "B",
        "Optimistic locking uses a @Version field. At flush, JPA checks the version — if another transaction modified the row, an OptimisticLockException is thrown. No database-level lock is held during the transaction.", domain))
    qs.append(_q(cid, Tier.APPRENTICE, 4, "Which Spring Boot mechanism provides automatic schema validation and migration?",
        [("A", "Spring Data REST"), ("B", "Flyway or Liquibase integration via spring-boot-starter"), ("C", "Hibernate auto-DDL"), ("D", "Spring Cloud Config")], "B",
        "Spring Boot integrates Flyway and Liquibase for version-controlled schema migrations. Hibernate's ddl-auto=validate can check schema compatibility but is not a migration tool.", domain))
    qs.append(_q(cid, Tier.APPRENTICE, 5, "What is the purpose of a DTO (Data Transfer Object) in a Spring Boot application?",
        [("A", "To replace JPA entities entirely"), ("B", "To decouple the API contract from the domain model, controlling what data is exposed and validated at the boundary"), ("C", "To improve database query performance"), ("D", "To manage thread pools")], "B",
        "DTOs decouple the external API contract from internal domain entities. They prevent over-exposure of entity fields and allow independent evolution of the API and persistence model.", domain))

    # Expert
    qs.append(_q(cid, Tier.EXPERT, 1, "What is the 'n+1 selects' problem in Spring Data JPA, and how is it resolved?",
        [("A", "A security vulnerability resolved by encryption"), ("B", "Fetching N entities triggers N+1 SQL queries; resolved via JOIN FETCH, EntityGraphs, or batch fetching"), ("C", "A transaction isolation issue resolved by SERIALIZABLE"), ("D", "A caching issue resolved by @Cacheable")], "B",
        "The n+1 problem occurs when lazy associations trigger one query per entity. Solutions include JOIN FETCH, @EntityGraph, @BatchSize, or restructuring the query to fetch associations in a single round trip.", domain))
    qs.append(_q(cid, Tier.EXPERT, 2, "When should you use @Transactional(readOnly = true)?",
        [("A", "Never — it has no effect"), ("B", "On read-only operations to enable Hibernate session flush mode MANUAL, skip dirty checking, and hint the database for read optimization"), ("C", "Only for JPA entities with no relationships"), ("D", "For all service methods")], "B",
        "readOnly=true disables flushing, skips dirty checking (performance boost), and some databases optimize for read-only transactions. Use it for query-only methods.", domain))
    qs.append(_q(cid, Tier.EXPERT, 3, "What is the impact of using @Transactional on a method called from within the same class (self-invocation)?",
        [("A", "It works normally"), ("B", "The proxy is bypassed and the transaction boundary is not applied — the annotation has no effect on self-invoked methods"), ("C", "It creates a nested transaction"), ("D", "It throws a runtime exception")], "B",
        "Spring's @Transactional works via a proxy. Self-invocation (calling a @Transactional method from another method in the same class) bypasses the proxy, so the transaction is not applied. Extract the method to a separate bean or use AspectJ weaving.", domain))
    qs.append(_q(cid, Tier.EXPERT, 4, "Which constraint ensures referential integrity at the database level for a JPA @ManyToOne relationship?",
        [("A", "@JoinColumn with foreign key constraint"), ("B", "@Column(nullable = false)"), ("C", "@OrderBy"), ("D", "@Index")], "A",
        "@JoinColumn defines the foreign key column. By default, Hibernate generates a foreign key constraint, enforcing referential integrity at the database level. nullable = false on the column adds a NOT NULL constraint.", domain))
    qs.append(_q(cid, Tier.EXPERT, 5, "What is the difference between persist() and merge() in JPA?",
        [("A", "They are identical"), ("B", "persist() adds a new entity as managed; merge() copies the state of a detached entity into a managed instance and returns it"), ("C", "persist() is for updates, merge() for inserts"), ("D", "persist() is for queries, merge() for writes")], "B",
        "persist() transitions a new entity to the managed state. merge() takes a detached entity, copies its state into the persistence context (or creates a new managed instance), and returns the managed copy. The original remains detached.", domain))

    # Master
    qs.append(_q(cid, Tier.MASTER, 1, "In a high-concurrency Spring Boot service, what is the risk of using @Transactional with the default isolation level on a read-modify-write sequence?",
        [("A", "No risk — transactions handle all concurrency"), ("B", "Lost updates can occur under READ_COMMITTED when two transactions read the same row, modify, and commit — one update is silently lost"), ("C", "The application crashes"), ("D", "JPA throws a compile-time error")], "B",
        "Under READ_COMMITTED (default for many databases), a read-modify-write sequence can lose updates. Solutions: optimistic locking (@Version), pessimistic locking (SELECT FOR UPDATE), or atomic conditional UPDATE statements.", domain))
    qs.append(_q(cid, Tier.MASTER, 2, "What is the 'first-level cache' in Hibernate, and what is its scope?",
        [("A", "A distributed cache shared across JVMs"), ("B", "The persistence context (Session), scoped to a single transaction — cleared when the transaction completes"), ("C", "A second-level cache provider"), ("D", "An HTTP session cache")], "B",
        "The first-level cache is the persistence context itself, scoped to one Session/transaction. It ensures that within a transaction, repeated retrieval of the same entity returns the same managed instance. It is not shared across transactions.", domain))
    qs.append(_q(cid, Tier.MASTER, 3, "When designing an idempotent POST endpoint in Spring Boot for financial transactions, which approach guarantees idempotency at the data layer?",
        [("A", "Using @Transactional alone"), ("B", "Using a unique idempotency key column with a database constraint, so duplicate requests are rejected atomically"), ("C", "Adding a sleep delay"), ("D", "Using @Async")], "B",
        "A unique constraint on an idempotency key column ensures that only the first request with a given key succeeds; duplicates violate the constraint and are handled gracefully. This is the standard pattern for payment APIs.", domain))
    qs.append(_q(cid, Tier.MASTER, 4, "What is the risk of exposing JPA entities directly as API responses in Spring Boot?",
        [("A", "No risk — it is the recommended approach"), ("B", "Lazy-loaded associations can trigger unexpected queries (n+1), serialization can expose sensitive fields, and the API contract is coupled to the schema"), ("C", "It improves performance"), ("D", "It simplifies testing")], "B",
        "Exposing entities directly risks lazy-loading side effects during serialization, over-exposure of sensitive fields, and tight coupling between the API and database schema. DTOs or projections should be used at the API boundary.", domain))
    qs.append(_q(cid, Tier.MASTER, 5, "Which Spring Boot configuration ensures that Hibernate validates the schema against entities on startup without modifying it?",
        [("A", "spring.jpa.hibernate.ddl-auto=create"), ("B", "spring.jpa.hibernate.ddl-auto=validate"), ("C", "spring.jpa.hibernate.ddl-auto=update"), ("D", "spring.jpa.hibernate.ddl-auto=none")], "B",
        "ddl-auto=validate checks that the existing schema matches the entity mappings on startup, throwing if there is a mismatch. It does not modify the schema. Use Flyway/Liquibase for migrations and set validate in production.", domain))

    return qs


# ---------------------------------------------------------------------------
# WF-103 — Spring Security & Cloud Foundations
# ---------------------------------------------------------------------------

def _wf103_questions() -> list[Question]:
    cid = "c-wf103"
    domain = "Foundation"
    qs: list[Question] = []

    # Basic
    qs.append(_q(cid, Tier.BASIC, 1, "Which Spring Security class represents the current authenticated user?",
        [("A", "Authentication"), ("B", "UserDetails"), ("C", "SecurityContext"), ("D", "GrantedAuthority")], "A",
        "The Authentication object represents the current authenticated principal, containing credentials, authorities, and details. It is stored in the SecurityContext.", domain))
    qs.append(_q(cid, Tier.BASIC, 2, "What is OAuth 2.0?",
        [("A", "A database protocol"), ("B", "An authorization framework that allows third-party applications to access resources on behalf of a user without sharing credentials"), ("C", "A Java library"), ("D", "A type of encryption")], "B",
        "OAuth 2.0 is an authorization framework (RFC 6749) enabling third-party access to resources via access tokens, without the resource owner sharing their credentials with the third party.", domain))
    qs.append(_q(cid, Tier.BASIC, 3, "Which annotation enables method-level security in Spring Boot?",
        [("A", "@Secured"), ("B", "@EnableMethodSecurity"), ("C", "@EnableWebSecurity"), ("D", "@SecurityConfig")], "B",
        "@EnableMethodSecurity (Spring Security 6) enables @PreAuthorize, @PostAuthorize, and @Secured annotations. It replaces the deprecated @EnableGlobalMethodSecurity.", domain))
    qs.append(_q(cid, Tier.BASIC, 4, "What is the default port for a Spring Boot application?",
        [("A", "9090"), ("B", "3000"), ("C", "8080"), ("D", "8000")], "C",
        "Spring Boot defaults to port 8080. It can be changed via server.port in application.properties/yml.", domain))
    qs.append(_q(cid, Tier.BASIC, 5, "Which cloud computing model provides virtualized computing resources over the internet?",
        [("A", "SaaS"), ("B", "IaaS"), ("C", "PaaS"), ("D", "FaaS")], "B",
        "IaaS (Infrastructure as a Service) provides virtualized computing resources — VMs, storage, networking. SaaS is software, PaaS is a platform, FaaS is serverless functions.", domain))

    # Novice
    qs.append(_q(cid, Tier.NOVICE, 1, "What is a JWT (JSON Web Token)?",
        [("A", "A Java Web Template"), ("B", "A compact, URL-safe token format for securely transmitting claims between parties as a JSON object"), ("C", "A database query format"), ("D", "A frontend framework")], "B",
        "JWT (RFC 7519) is a compact token format with three parts — header, payload, signature — enabling stateless authentication and claims transmission between parties.", domain))
    qs.append(_q(cid, Tier.NOVICE, 2, "Which Spring Security filter is responsible for processing JWT tokens in a typical stateless configuration?",
        [("A", "UsernamePasswordAuthenticationFilter"), ("B", "A custom OncePerRequestFilter that extracts and validates the JWT from the Authorization header"), ("C", "BasicAuthenticationFilter"), ("D", "CorsFilter")], "B",
        "In stateless JWT configurations, a custom OncePerRequestFilter extracts the token from the Authorization header, validates it, and sets the SecurityContext. Spring Security does not provide a built-in JWT filter.", domain))
    qs.append(_q(cid, Tier.NOVICE, 3, "What is the difference between authentication and authorization?",
        [("A", "They are the same thing"), ("B", "Authentication verifies who you are; authorization determines what you are allowed to do"), ("C", "Authentication is for APIs, authorization for databases"), ("D", "Authentication is frontend, authorization is backend")], "B",
        "Authentication (authn) verifies identity (who are you?). Authorization (authz) determines permissions (what can you do?). Spring Security separates these concerns into distinct filter chains.", domain))
    qs.append(_q(cid, Tier.NOVICE, 4, "Which cloud provider service is equivalent to AWS IAM?",
        [("A", "AWS S3"), ("B", "Google Cloud IAM / Azure RBAC"), ("C", "AWS Lambda"), ("D", "Google Cloud Storage")], "B",
        "Google Cloud IAM and Azure RBAC are the equivalents of AWS IAM — all provide identity and access management for cloud resources.", domain))
    qs.append(_q(cid, Tier.NOVICE, 5, "What is the purpose of a SecurityFilterChain in Spring Security 6?",
        [("A", "To log security events"), ("B", "To define a chain of filters that process security for specific URL patterns"), ("C", "To encrypt database connections"), ("D", "To manage thread pools")], "B",
        "SecurityFilterChain defines which filters apply to which URL patterns. Multiple chains can be configured for different API paths, each with distinct security rules.", domain))

    # Apprentice
    qs.append(_q(cid, Tier.APPRENTICE, 1, "What is a CSRF attack, and how does Spring Security mitigate it by default?",
        [("A", "A database attack mitigated by encryption"), ("B", "An attack that forces a user to execute unwanted actions; Spring Security mitigates it with a CSRF token for state-changing requests"), ("C", "A frontend bug fixed by CSS"), ("D", "A network issue resolved by load balancing")], "B",
        "CSRF (Cross-Site Request Forgery) tricks an authenticated user into submitting unwanted requests. Spring Security generates a CSRF token that must be included in state-changing requests (POST, PUT, DELETE). For stateless APIs with JWT, CSRF is typically disabled.", domain))
    qs.append(_q(cid, Tier.APPRENTICE, 2, "Which Spring Security annotation allows SpEL-based authorization rules?",
        [("A", "@Secured"), ("B", "@PreAuthorize"), ("C", "@RolesAllowed"), ("D", "@DenyAll")], "B",
        "@PreAuthorize supports SpEL expressions like @PreAuthorize(\"hasRole('ADMIN') or #ownerId == authentication.principal.id\"), enabling complex, context-aware authorization rules.", domain))
    qs.append(_q(cid, Tier.APPRENTICE, 3, "What is the principle of least privilege in cloud security?",
        [("A", "Giving users admin access for convenience"), ("B", "Granting only the minimum permissions required to perform a task"), ("C", "Using a single shared credential"), ("D", "Disabling all security controls")], "B",
        "Least privilege means granting the minimum permissions necessary. In cloud environments, this means scoped IAM roles, not broad admin access. It limits blast radius if credentials are compromised.", domain))
    qs.append(_q(cid, Tier.APPRENTICE, 4, "Which Spring Security component handles password hashing?",
        [("A", "PasswordEncoder"), ("B", "AuthenticationManager"), ("C", "UserDetailsService"), ("D", "SecurityContextHolder")], "A",
        "PasswordEncoder (e.g., BCryptPasswordEncoder) hashes passwords for storage and verification. Spring Security recommends BCrypt, Argon2, or PBKDF2 for password hashing.", domain))
    qs.append(_q(cid, Tier.APPRENTICE, 5, "What is the role of a VPC (Virtual Private Cloud) in cloud architecture?",
        [("A", "A public web hosting service"), ("B", "An isolated, private network partition for cloud resources, providing network-level isolation and control"), ("C", "A CDN service"), ("D", "A database cluster")], "B",
        "A VPC provides an isolated network partition where cloud resources run. It enables custom IP ranges, subnets, route tables, and security groups for network-level isolation and access control.", domain))

    # Expert
    qs.append(_q(cid, Tier.EXPERT, 1, "In Spring Security 6, how should you configure a stateless JWT-based security chain?",
        [("A", "Use sessionManagement(session -> session.sessionCreationPolicy(ALWAYS))"), ("B", "Set sessionCreationPolicy(STATELESS), add a JWT filter before UsernamePasswordAuthenticationFilter, and disable CSRF"), ("C", "Use @EnableWebSecurity only"), ("D", "Set sessionCreationPolicy(NEVER) and keep CSRF enabled")], "B",
        "For stateless JWT: set sessionCreationPolicy to STATELESS, register the JWT filter before UsernamePasswordAuthenticationFilter, and disable CSRF (since there is no session/cookie to protect). The token itself is the credential.", domain))
    qs.append(_q(cid, Tier.EXPERT, 2, "What is the security risk of storing JWT secrets in application.yml for a cloud-deployed Spring Boot app?",
        [("A", "No risk — yml is secure"), ("B", "Secrets in config files are visible in container images, version control, and logs; use cloud secret managers (AWS Secrets Manager, Vault) or environment injection"), ("C", "It causes a compilation error"), ("D", "It only affects development environments")], "B",
        "Config-file secrets leak into container images, git history, and potentially logs. Use cloud-native secret managers (AWS Secrets Manager, GCP Secret Manager, HashiCorp Vault) or Kubernetes secrets with environment variable injection.", domain))
    qs.append(_q(cid, Tier.EXPERT, 3, "What is the OIDC (OpenID Connect) flow in Spring Security?",
        [("A", "A database connection pool"), ("B", "An identity layer on top of OAuth 2.0 providing authentication and user identity claims via ID tokens"), ("C", "A Java networking library"), ("D", "A type of load balancer")], "B",
        "OIDC is an identity layer on OAuth 2.0. It adds an ID token (a JWT with user identity claims) and a standardized userinfo endpoint. Spring Security supports it via oauth2ResourceServer().jwt() and oauth2Login().", domain))
    qs.append(_q(cid, Tier.EXPERT, 4, "Which AWS service provides network-level traffic filtering for EC2 instances?",
        [("A", "IAM"), ("B", "Security Groups"), ("C", "S3"), ("D", "CloudFront")], "B",
        "Security Groups act as virtual firewalls for EC2 instances, controlling inbound and outbound traffic at the network level. They are stateful and operate at the instance or subnet (NACL) level.", domain))
    qs.append(_q(cid, Tier.EXPERT, 5, "What is the 'confused deputy' problem in OAuth 2.0, and how is it mitigated?",
        [("A", "A deputy who is confused about the law"), ("B", "A token meant for one resource server is sent to another; mitigated by audience (aud) claim validation on each resource server"), ("C", "A frontend rendering bug"), ("D", "A database deadlock")], "B",
        "The confused deputy problem occurs when a token intended for one API is accepted by another. Mitigation: each resource server validates the aud (audience) claim to ensure the token was issued for it specifically.", domain))

    # Master
    qs.append(_q(cid, Tier.MASTER, 1, "When implementing multi-tenancy in Spring Security, which approach correctly isolates tenant authorization?",
        [("A", "A single shared SecurityContext for all tenants"), ("B", "Include tenant_id in JWT claims, validate it on every request via a filter, and enforce tenant-scoped queries with @PreAuthorize or row-level security"), ("C", "Use a global admin role for all tenants"), ("D", "Store tenant_id in a cookie only")], "B",
        "Multi-tenant isolation requires tenant_id in the token, validated per-request via a filter, and enforced at the data layer via row-level security or tenant-scoped queries. Authorization must check both role and tenant membership.", domain))
    qs.append(_q(cid, Tier.MASTER, 2, "What is the key difference between a symmetric JWT signature (HS256) and an asymmetric one (RS256)?",
        [("A", "HS256 is faster; RS256 is more secure"), ("B", "HS256 uses a shared secret for signing and verification; RS256 uses a private key to sign and a public key to verify, enabling distributed verification"), ("C", "HS256 is for databases, RS256 for APIs"), ("D", "There is no difference")], "B",
        "HS256 uses a shared secret (both sides must trust each other). RS256 uses a private/public key pair — only the issuer has the private key, but any resource server can verify with the public key. RS256 is standard for distributed systems.", domain))
    qs.append(_q(cid, Tier.MASTER, 3, "In a zero-trust cloud architecture, which principle replaces traditional network-boundary security?",
        [("A", "Trust all internal traffic"), ("B", "Every request is authenticated, authorized, and encrypted regardless of network location — no implicit trust based on network position"), ("C", "Disable all authentication"), ("D", "Use a single firewall rule")], "B",
        "Zero trust means no implicit trust based on network location. Every request is authenticated, authorized, and encrypted, whether it originates inside or outside the network perimeter. Identity, not network, is the primary security boundary.", domain))
    qs.append(_q(cid, Tier.MASTER, 4, "Which Spring Security mechanism allows claims-based authorization using JWT token content?",
        [("A", "@Secured roles only"), ("B", "JwtAuthenticationConverter to map claims to authorities, combined with @PreAuthorize SpEL expressions referencing authentication.claims"), ("C", "BasicAuthenticationFilter"), ("D", "Session management")], "B",
        "JwtAuthenticationConverter maps JWT claims to GrantedAuthorities. You can customize it to extract custom claims (e.g., scope, roles, tenant_id) and use @PreAuthorize with SpEL to enforce claims-based authorization rules.", domain))
    qs.append(_q(cid, Tier.MASTER, 5, "What is the security implication of using server-side session management vs. stateless JWT in a cloud-native, horizontally-scaled Spring Boot deployment?",
        [("A", "Sessions are always better"), ("B", "Sessions require sticky sessions or a shared session store (Redis); JWT is stateless and works with any instance, but token revocation requires a blacklist or short expiry"), ("C", "JWT cannot be used in cloud"), ("D", "Sessions are faster than JWT")], "B",
        "Sessions in a horizontally-scaled environment require sticky sessions or a shared session store (e.g., Redis). JWT is stateless and works with any instance, but revocation is harder — you need short expiry, refresh tokens, or a revocation list. The tradeoff is statelessness vs. revocation flexibility.", domain))

    return qs


# ---------------------------------------------------------------------------
# WF-104 — Event Integration & Observability
# ---------------------------------------------------------------------------

def _wf104_questions() -> list[Question]:
    cid = "c-wf104"
    domain = "Foundation"
    qs: list[Question] = []

    # Basic
    qs.append(_q(cid, Tier.BASIC, 1, "What is an event-driven architecture?",
        [("A", "A UI framework"), ("B", "A paradigm where services communicate by producing and consuming events asynchronously"), ("C", "A database design pattern"), ("D", "A testing methodology")], "B",
        "Event-driven architecture (EDA) is a paradigm where services communicate via events — producers emit events, consumers react to them asynchronously, enabling loose coupling.", domain))
    qs.append(_q(cid, Tier.BASIC, 2, "Which protocol is commonly used for message brokering in Spring Boot event-driven systems?",
        [("A", "HTTP"), ("B", "AMQP (e.g., RabbitMQ) or Kafka protocol"), ("C", "FTP"), ("D", "SMTP")], "B",
        "AMQP (used by RabbitMQ) and the Kafka protocol are the most common messaging protocols in Spring Boot event-driven systems. Spring integrates both via spring-amqp and spring-kafka.", domain))
    qs.append(_q(cid, Tier.BASIC, 3, "What is observability in software systems?",
        [("A", "The ability to watch a UI"), ("B", "The ability to understand a system's internal state from its external outputs — logs, metrics, and traces"), ("C", "A type of monitoring dashboard"), ("D", "A frontend debugging tool")], "B",
        "Observability is the ability to infer a system's internal state from its outputs. The three pillars are logs, metrics, and traces (distributed tracing). It goes beyond monitoring by enabling exploration of unknown unknowns.", domain))
    qs.append(_q(cid, Tier.BASIC, 4, "Which Spring Boot annotation publishes a domain event?",
        [("A", "@EventListener"), ("B", "ApplicationEventPublisher.publishEvent()"), ("C", "@Scheduled"), ("D", "@Async")], "B",
        "ApplicationEventPublisher.publishEvent() publishes a domain event. @EventListener marks a method that consumes events. Spring Boot 3+ also supports @DomainEvents on aggregate roots.", domain))
    qs.append(_q(cid, Tier.BASIC, 5, "What are the three pillars of observability?",
        [("A", "Logs, metrics, and traces"), ("B", "CPU, memory, disk"), ("C", "Frontend, backend, database"), ("D", "Build, test, deploy")], "A",
        "The three pillars of observability are logs (discrete events), metrics (numeric measurements over time), and traces (request flow across services). Together they provide full system visibility.", domain))

    # Novice
    qs.append(_q(cid, Tier.NOVICE, 1, "What is the difference between a queue and a topic in messaging systems?",
        [("A", "They are identical"), ("B", "A queue delivers each message to one consumer (point-to-point); a topic delivers to all subscribers (publish-subscribe)"), ("C", "A queue is faster, a topic is slower"), ("D", "A queue is for reads, a topic for writes")], "B",
        "A queue is point-to-point: each message is consumed by exactly one consumer. A topic is publish-subscribe: each message is delivered to all active subscribers. JMS and AMQP support both patterns.", domain))
    qs.append(_q(cid, Tier.NOVICE, 2, "Which Spring Boot actuator endpoint provides application health status?",
        [("A", "/actuator/health"), ("B", "/actuator/info"), ("C", "/actuator/metrics"), ("D", "/actuator/env")], "A",
        "/actuator/health returns the application's health status (UP/DOWN), including database, disk, and custom health indicators. It is commonly used by load balancers and orchestrators.", domain))
    qs.append(_q(cid, Tier.NOVICE, 3, "What is distributed tracing?",
        [("A", "Tracing a single method call"), ("B", "Tracking a single request as it propagates across multiple services, using trace and span IDs"), ("C", "A type of logging"), ("D", "A database query plan")], "B",
        "Distributed tracing tracks a request across service boundaries using trace IDs (one per request) and span IDs (one per service hop). Tools like Zipkin, Jaeger, and OpenTelemetry visualize the full call chain.", domain))
    qs.append(_q(cid, Tier.NOVICE, 4, "Which Spring annotation marks a method as an event listener?",
        [("A", "@EventHandler"), ("B", "@EventListener"), ("C", "@Subscribe"), ("D", "@Observe")], "B",
        "@EventListener marks a method that should be invoked when a matching event is published. In Spring 4.2+, it can be placed on any managed bean method.", domain))
    qs.append(_q(cid, Tier.NOVICE, 5, "What is idempotency in the context of event consumers?",
        [("A", "Processing events as fast as possible"), ("B", "Processing the same event multiple times produces the same result as processing it once"), ("C", "Ignoring all events"), ("D", "Storing events permanently")], "B",
        "Idempotency means reprocessing the same event (due to retries or at-least-once delivery) yields the same result. Consumers must deduplicate by event ID or use idempotent operations to handle redelivery safely.", domain))

    # Apprentice
    qs.append(_q(cid, Tier.APPRENTICE, 1, "What is the 'at-least-once' delivery guarantee, and what risk does it introduce?",
        [("A", "Each message is delivered exactly once with no risk"), ("B", "Messages may be delivered more than once; consumers must be idempotent to handle duplicates"), ("C", "Messages may be lost"), ("D", "Messages are never delivered")], "B",
        "At-least-once delivery guarantees no message loss but allows duplicates. Consumers must be idempotent — processing the same message twice must not cause side effects like double-charging or duplicate database rows.", domain))
    qs.append(_q(cid, Tier.APPRENTICE, 2, "Which OpenTelemetry concept represents a single unit of work in a distributed trace?",
        [("A", "Trace"), ("B", "Span"), ("C", "Baggage"), ("D", "Context")], "B",
        "A span represents a single unit of work (e.g., an HTTP request, a database query) within a trace. Multiple spans form a trace. Each span has a start time, duration, attributes, and parent span reference.", domain))
    qs.append(_q(cid, Tier.APPRENTICE, 3, "What is a dead letter queue (DLQ)?",
        [("A", "A queue for high-priority messages"), ("B", "A queue where messages that cannot be processed after retry limits are sent for later analysis"), ("C", "A queue for logging"), ("D", "A queue for expired messages")], "B",
        "A DLQ stores messages that failed processing after exhausting retry attempts. It enables manual inspection, replay, or alerting without blocking the main queue. It is essential for resilient event-driven systems.", domain))
    qs.append(_q(cid, Tier.APPRENTICE, 4, "Which Micrometer metric type counts occurrences of events?",
        [("A", "Gauge"), ("B", "Counter"), ("C", "Timer"), ("D", "Distribution Summary")], "B",
        "Counter monotonically increases — it counts events (e.g., total requests, total errors). Gauge represents a current value (e.g., queue depth). Timer measures duration and count together.", domain))
    qs.append(_q(cid, Tier.APPRENTICE, 5, "What is the saga pattern in event-driven microservices?",
        [("A", "A single large transaction across services"), ("B", "A sequence of local transactions coordinated by events, with compensating actions for rollback"), ("C", "A type of message queue"), ("D", "A logging framework")], "B",
        "The saga pattern coordinates a multi-step business process across services via events. Each step is a local transaction. If a step fails, compensating events undo prior steps, achieving eventual consistency without distributed transactions.", domain))

    # Expert
    qs.append(_q(cid, Tier.EXPERT, 1, "What is the difference between a choreography-based and orchestration-based saga?",
        [("A", "They are identical"), ("B", "Choreography: services react to events independently; Orchestration: a central coordinator commands each step"), ("C", "Choreography is faster, orchestration is safer"), ("D", "Choreography is for monoliths, orchestration for microservices")], "B",
        "Choreography: each service reacts to events and emits new ones — decentralized but harder to trace. Orchestration: a central orchestrator (e.g., a state machine) commands each step — more visible but introduces a coordinator dependency.", domain))
    qs.append(_q(cid, Tier.EXPERT, 2, "Which Kafka consumer configuration controls how the consumer commits offsets?",
        [("A", "enable.auto.commit"), ("B", "auto.offset.reset"), ("C", "max.poll.records"), ("D", "session.timeout.ms")], "A",
        "enable.auto.commit=true (default) auto-commits offsets periodically. For exactly-once or precise control, set it to false and commit manually after successful processing. auto.offset.reset controls behavior when no committed offset exists.", domain))
    qs.append(_q(cid, Tier.EXPERT, 3, "What is the 'exactly-once' semantics in Kafka, and how is it achieved?",
        [("A", "It is impossible in Kafka"), ("B", "Transactional producers with transactional.id, idempotent producers, and read_committed consumers ensure exactly-once processing"), ("C", "By disabling retries"), ("D", "By using a single partition")], "B",
        "Kafka exactly-once requires: idempotent producers (enable.idempotence=true), transactional producers (transactional.id), and read_committed consumers. This ensures no duplicates and no data loss across producer-consumer chains.", domain))
    qs.append(_q(cid, Tier.EXPERT, 4, "Which observability signal is best for diagnosing WHY a request is slow across multiple services?",
        [("A", "Logs only"), ("B", "Distributed traces — they show the full call chain with per-span latency"), ("C", "Metrics only"), ("D", "Health checks")], "B",
        "Distributed traces show the complete request path across services with per-span duration, revealing which service hop or database call is the bottleneck. Metrics tell you WHAT is slow; traces tell you WHY.", domain))
    qs.append(_q(cid, Tier.EXPERT, 5, "What is the risk of using synchronous HTTP calls between microservices instead of events?",
        [("A", "No risk — it is the recommended approach"), ("B", "Tight temporal coupling: if a downstream service is slow or down, the caller blocks, cascading failures across the system"), ("C", "It improves performance"), ("D", "It simplifies deployment")], "B",
        "Synchronous calls create temporal coupling — the caller must wait for the callee. If the callee is slow, the caller's resources are held, potentially cascading into system-wide failure. Events decouple producers from consumers temporally.", domain))

    # Master
    qs.append(_q(cid, Tier.MASTER, 1, "When designing an event-sourced system with Kafka, what is the risk of producing an event and updating a database in the same transaction without the transactional outbox pattern?",
        [("A", "No risk — Kafka handles it"), ("B", "Dual-write problem: if either the DB commit or Kafka send fails independently, the system enters an inconsistent state with no safe retry path"), ("C", "It causes a memory leak"), ("D", "It improves throughput")], "B",
        "The dual-write problem: you cannot atomically commit to a database and publish to Kafka. If one succeeds and the other fails, the system is inconsistent. The transactional outbox pattern writes events to a DB table in the same transaction, then a relay publishes to Kafka, ensuring atomicity.", domain))
    qs.append(_q(cid, Tier.MASTER, 2, "In OpenTelemetry, what is the purpose of baggage, and what is its security implication?",
        [("A", "Baggage is for luggage tracking"), ("B", "Baggage propagates key-value context across service boundaries; it can leak sensitive data if not filtered, as it is visible to all downstream services"), ("C", "Baggage is a type of metric"), ("D", "Baggage is a logging level")], "B",
        "Baggage is cross-service context (key-value pairs) that propagates with the trace. It is visible to all downstream services and can be logged or exposed. Sensitive data must not be placed in baggage without explicit filtering at trust boundaries.", domain))
    qs.append(_q(cid, Tier.MASTER, 3, "What is the 'competing consumers' pattern, and what trade-off does it introduce?",
        [("A", "Consumers compete for resources, causing crashes"), ("B", "Multiple consumers process messages from the same queue in parallel for throughput; ordering is not guaranteed across consumers"), ("C", "A single consumer handles all messages"), ("D", "Consumers vote on message processing")], "B",
        "Competing consumers: multiple consumer instances read from one queue for parallelism and throughput. Trade-off: message ordering is lost across consumers. If ordering matters, use a single consumer or partition by key so related messages go to the same consumer.", domain))
    qs.append(_q(cid, Tier.MASTER, 4, "When implementing a transactional outbox in Spring Boot, which approach ensures reliable event delivery without dual-write risk?",
        [("A", "Publish to Kafka after the DB commit with a try-catch"), ("B", "Write the event to an outbox table in the same DB transaction, then use a polling publisher or CDC (Debezium) to relay to Kafka"), ("C", "Use @TransactionalEventListener only"), ("D", "Publish before the DB commit")], "B",
        "The outbox pattern: write the event to an outbox table atomically with the business transaction. A separate relay (polling publisher or CDC via Debezium) reads the outbox and publishes to Kafka. This guarantees the event is published exactly once, even if the relay crashes.", domain))
    qs.append(_q(cid, Tier.MASTER, 5, "In a high-throughput event pipeline, which observability metric best detects consumer lag before it impacts users?",
        [("A", "CPU utilization of the consumer"), ("B", "Consumer lag — the difference between the latest produced offset and the consumer's committed offset"), ("C", "Heap memory usage"), ("D", "Thread count")], "B",
        "Consumer lag (offset lag) directly measures how far behind the consumer is. Rising lag indicates the consumer cannot keep up with production. Alert on lag growth rate, not absolute lag, to catch issues before they impact downstream services.", domain))

    return qs


# ---------------------------------------------------------------------------
# WF-201 — Microservices at Cloud Scale
# ---------------------------------------------------------------------------

def _wf201_questions() -> list[Question]:
    cid = "c-wf201"
    domain = "Engineering"
    qs: list[Question] = []

    # Basic
    qs.append(_q(cid, Tier.BASIC, 1, "What is a microservice?",
        [("A", "A very small database"), ("B", "An independently deployable service that owns its own data and implements a specific business capability"), ("C", "A UI component"), ("D", "A testing tool")], "B",
        "A microservice is an independently deployable service with its own data store, implementing a bounded business context. It communicates with other services via well-defined APIs or events.", domain))
    qs.append(_q(cid, Tier.BASIC, 2, "Which pattern is used to route external requests to appropriate microservices?",
        [("A", "API Gateway"), ("B", "Singleton"), ("C", "Factory"), ("D", "Observer")], "A",
        "An API Gateway is the entry point for external clients, routing requests to the appropriate microservice. It can also handle cross-cutting concerns like auth, rate limiting, and response aggregation.", domain))
    qs.append(_q(cid, Tier.BASIC, 3, "What does 'cloud-native' mean?",
        [("A", "Built only for AWS"), ("B", "Designed to leverage cloud computing capabilities: elasticity, scalability, managed services, and DevOps automation"), ("C", "A type of database"), ("D", "A frontend framework")], "B",
        "Cloud-native applications are designed to exploit cloud capabilities — elastic scaling, managed services, containerization, CI/CD, and declarive infrastructure. They are not just 'hosted in the cloud' but architected for it.", domain))
    qs.append(_q(cid, Tier.BASIC, 4, "Which container orchestration platform is the industry standard?",
        [("A", "Docker Swarm"), ("B", "Kubernetes"), ("C", "Nomad"), ("D", "Mesos")], "B",
        "Kubernetes is the industry-standard container orchestration platform, providing deployment, scaling, service discovery, and self-healing for containerized microservices.", domain))
    qs.append(_q(cid, Tier.BASIC, 5, "What is a service mesh?",
        [("A", "A type of database"), ("B", "An infrastructure layer for service-to-service communication, handling routing, security, and observability via sidecar proxies"), ("C", "A frontend layout system"), ("D", "A network cable type")], "B",
        "A service mesh (e.g., Istio, Linkerd) abstracts inter-service communication via sidecar proxies. It provides traffic management, mTLS, retries, circuit breaking, and observability without code changes.", domain))

    # Novice
    qs.append(_q(cid, Tier.NOVICE, 1, "What is the database-per-service pattern in microservices?",
        [("A", "All services share one database"), ("B", "Each microservice owns its own database, ensuring loose coupling and independent scaling"), ("C", "A database for each user"), ("D", "No databases at all")], "B",
        "Database-per-service means each service owns its data store. This prevents services from coupling through shared schemas and allows independent technology choices, scaling, and deployment.", domain))
    qs.append(_q(cid, Tier.NOVICE, 2, "Which pattern handles partial failures in microservice communication?",
        [("A", "Circuit Breaker"), ("B", "Singleton"), ("C", "Adapter"), ("D", "Bridge")], "A",
        "A Circuit Breaker stops calling a failing downstream service after a threshold of failures, returning an error or fallback immediately. This prevents cascading failures and allows the downstream service time to recover.", domain))
    qs.append(_q(cid, Tier.NOVICE, 3, "What is service discovery in a microservices architecture?",
        [("A", "Finding bugs in services"), ("B", "The mechanism by which services dynamically locate and communicate with each other without hardcoded addresses"), ("C", "A type of logging"), ("D", "A deployment strategy")], "B",
        "Service discovery allows services to find each other dynamically. Client-side discovery (e.g., Eureka) has the client query a registry. Server-side discovery (e.g., Kubernetes Services) uses an intermediary. This enables elastic scaling.", domain))
    qs.append(_q(cid, Tier.NOVICE, 4, "Which Spring Cloud component provides a circuit breaker implementation?",
        [("A", "Spring Cloud Config"), ("B", "Spring Cloud Circuit Breaker (Resilience4j)"), ("C", "Spring Cloud Gateway"), ("D", "Spring Cloud Stream")], "B",
        "Spring Cloud Circuit Breaker provides an abstraction over circuit breaker implementations. Resilience4j is the recommended implementation, replacing the deprecated Hystrix.", domain))
    qs.append(_q(cid, Tier.NOVICE, 5, "What is the CAP theorem?",
        [("A", "A theorem about caching"), ("B", "In a distributed system, you can guarantee at most two of: Consistency, Availability, Partition tolerance — not all three simultaneously"), ("C", "A security model"), ("D", "A database indexing strategy")], "B",
        "The CAP theorem states that during a network partition, a distributed system must choose between consistency and availability. Since partitions are inevitable, the real choice is CP or AP.", domain))

    # Apprentice
    qs.append(_q(cid, Tier.APPRENTICE, 1, "What is the difference between orchestration and choreography in microservices?",
        [("A", "They are identical"), ("B", "Orchestration: a central coordinator controls the flow; Choreography: services react to events independently without a central controller"), ("C", "Orchestration is for databases, choreography for APIs"), ("D", "Orchestration is faster")], "B",
        "Orchestration has a central coordinator (e.g., a saga orchestrator) that commands each service. Choreography has no central controller — services react to events. Orchestration is more visible but creates a coordinator dependency.", domain))
    qs.append(_q(cid, Tier.APPRENTICE, 2, "Which Kubernetes resource manages a set of replicated pods and ensures a desired number are always running?",
        [("A", "ConfigMap"), ("B", "Deployment"), ("C", "Service"), ("D", "Ingress")], "B",
        "A Deployment manages a set of replicated pods via a ReplicaSet, ensuring the desired number of replicas are running. It supports rolling updates and rollbacks. A Service provides stable networking to the pods.", domain))
    qs.append(_q(cid, Tier.APPRENTICE, 3, "What is the CQRS pattern?",
        [("A", "A database replication strategy"), ("B", "Command Query Responsibility Segregation — separating write (command) and read (query) models for independent optimization"), ("C", "A security framework"), ("D", "A testing pattern")], "B",
        "CQRS separates the write side (commands, mutations) from the read side (queries). This allows independent scaling, optimization, and technology choices for reads vs. writes. Often combined with event sourcing.", domain))
    qs.append(_q(cid, Tier.APPRENTICE, 4, "Which API Gateway pattern best supports client-specific response aggregation?",
        [("A", "Backend for Frontend (BFF)"), ("B", "Reverse Proxy"), ("C", "Load Balancer"), ("D", "CDN")], "A",
        "The BFF (Backend for Frontend) pattern creates a dedicated gateway per client type (web, mobile, etc.) that aggregates responses from multiple services tailored to that client's needs, reducing client-side complexity.", domain))
    qs.append(_q(cid, Tier.APPRENTICE, 5, "What is the strangler fig pattern for migrating a monolith to microservices?",
        [("A", "Deleting the monolith and starting over"), ("B", "Gradually replacing monolith functionality with microservices by intercepting routes via an API gateway, until the monolith is fully replaced"), ("C", "A testing strategy"), ("D", "A database migration tool")], "B",
        "The strangler fig pattern incrementally routes specific endpoints from the monolith to new microservices via an API gateway. Over time, more functionality moves to microservices until the monolith can be retired — reducing migration risk.", domain))

    # Expert
    qs.append(_q(cid, Tier.EXPERT, 1, "What is the 'two-phase commit' (2PC) protocol, and why is it problematic in microservices?",
        [("A", "It is the best pattern for microservices"), ("B", "A distributed transaction protocol that coordinates commit/abort across all participants; it is problematic due to blocking, latency, and single points of failure"), ("C", "A deployment strategy"), ("D", "A caching pattern")], "B",
        "2PC coordinates a commit across all participants via a coordinator. It blocks during the prepare phase, is slow, and if the coordinator fails, participants are blocked indefinitely. Microservices prefer sagas or eventual consistency.", domain))
    qs.append(_q(cid, Tier.EXPERT, 2, "Which Kubernetes feature enables progressive delivery by gradually shifting traffic to a new version?",
        [("A", "ReplicaSet"), ("B", "Canary deployment via Istio/Argo Rollouts, using weighted routing"), ("C", "ConfigMap"), ("D", "PersistentVolume")], "B",
        "Canary deployments gradually shift traffic to a new version (e.g., 5%, 25%, 50%, 100%) using weighted routing. Istio or Argo Rollouts provide this on Kubernetes, enabling automated rollback on error rate spikes.", domain))
    qs.append(_q(cid, Tier.EXPERT, 3, "What is 'eventual consistency' in a distributed system, and when is it acceptable?",
        [("A", "Data is always immediately consistent"), ("B", "Given enough time without new writes, all replicas converge to the same state; acceptable when temporary inconsistency does not violate business invariants"), ("C", "Data is never consistent"), ("D", "A type of caching")], "B",
        "Eventual consistency means replicas converge to the same state once writes stop. It is acceptable when the business can tolerate temporary inconsistency (e.g., product catalog, social feeds) but not for financial transactions requiring strong consistency.", domain))
    qs.append(_q(cid, Tier.EXPERT, 4, "Which distributed tracing context propagation format is standard in OpenTelemetry?",
        [("A", "B3"), ("B", "W3C Trace Context"), ("C", "Jaeger"), ("D", "Zipkin")], "B",
        "W3C Trace Context (traceparent/tracestate headers) is the standard propagation format in OpenTelemetry. B3 (Zipkin) is supported for backwards compatibility but W3C is the recommended default.", domain))
    qs.append(_q(cid, Tier.EXPERT, 5, "What is the 'bulkhead' pattern in microservices resilience?",
        [("A", "A pattern for database partitioning"), ("B", "Isolating resources (thread pools, connections) per service or downstream so that a failure in one does not exhaust resources for others"), ("C", "A security pattern"), ("D", "A logging pattern")], "B",
        "The bulkhead pattern isolates resources — separate thread pools or connection pools per downstream service. If one downstream fails and holds resources, only that bulkhead is affected, not the entire system. Named after ship compartment bulkheads.", domain))

    # Master
    qs.append(_q(cid, Tier.MASTER, 1, "When designing a microservice for cloud scale, which approach correctly handles the tension between data consistency and service autonomy?",
        [("A", "Use distributed transactions (2PC) across all services"), ("B", "Embrace eventual consistency with sagas, use outbox pattern for reliable events, and enforce invariants within a single service boundary"), ("C", "Share a single database across all services"), ("D", "Disable all transactions")], "B",
        "Service autonomy requires owning its data. Embrace eventual consistency via sagas, use the transactional outbox for reliable event publishing, and enforce strong consistency only within a single service's boundary. Cross-service invariants are maintained via compensating actions.", domain))
    qs.append(_q(cid, Tier.MASTER, 2, "In a service mesh with sidecar proxies, what is the performance overhead and how is it mitigated at scale?",
        [("A", "No overhead — sidecars are free"), ("B", "Sidecars add latency (extra hop) and resource overhead; mitigated via sidecarless (Cilium eBPF) or shared proxy (node-level) architectures"), ("C", "Sidecars improve performance"), ("D", "Sidecars are only for security")], "B",
        "Sidecar proxies add a network hop (inter-process communication) and consume CPU/memory per pod. At scale, this is significant. Alternatives: Cilium (eBPF-based, sidecarless), node-level shared proxies (Envoy), or ambient mesh architectures reduce overhead.", domain))
    qs.append(_q(cid, Tier.MASTER, 3, "What is the 'cell-based architecture' (cell architecture) for cloud-scale microservices?",
        [("A", "A biology-inspired testing framework"), ("B", "Grouping related services into a self-contained 'cell' with its own data, networking, and deployment boundary, enabling independent scaling and blast-radius containment"), ("C", "A type of database sharding"), ("D", "A frontend layout system")], "B",
        "Cell-based architecture groups related services into a unit (cell) with its own data, networking, and deployment pipeline. Each cell is independently scalable and failure-isolated. It reduces blast radius and enables unit-level deployment autonomy at extreme scale.", domain))
    qs.append(_q(cid, Tier.MASTER, 4, "When implementing a saga across 5 microservices, what is the correct strategy for handling a failure at step 4?",
        [("A", "Abort and leave the system in its current state"), ("B", "Execute compensating transactions for steps 3, 2, and 1 in reverse order to semantically undo the partial work"), ("C", "Retry step 4 indefinitely"), ("D", "Restart all services")], "B",
        "In a saga, a failure at step N triggers compensating transactions for steps N-1, N-2, ..., 1 in reverse order. Each compensating action semantically undoes its corresponding forward action (e.g., refund a payment, cancel a reservation). This achieves eventual consistency without distributed transactions.", domain))
    qs.append(_q(cid, Tier.MASTER, 5, "Which Kubernetes autoscaling strategy correctly handles both traffic spikes and resource efficiency for a microservice with variable load?",
        [("A", "Fixed replica count"), ("B", "HPA (Horizontal Pod Autoscaler) based on CPU/memory, combined with KEDA for event-driven scaling and VPA for right-sizing"), ("C", "Manual scaling only"), ("D", "Cluster autoscaler alone")], "B",
        "HPA scales pods based on CPU/memory metrics. KEDA extends this to event-driven scaling (e.g., queue depth, Kafka lag). VPA right-sizes resource requests. The Cluster Autoscaler adds nodes. Together they handle traffic spikes (HPA/KEDA) and resource efficiency (VPA) at the pod and node level.", domain))

    return qs


# ---------------------------------------------------------------------------
# WF-202 — Distributed Resilience Engineering
# ---------------------------------------------------------------------------

def _wf202_questions() -> list[Question]:
    cid = "c-wf202"
    domain = "Engineering"
    qs: list[Question] = []

    # Basic
    qs.append(_q(cid, Tier.BASIC, 1, "What is resilience in software engineering?",
        [("A", "The ability to never fail"), ("B", "The ability of a system to maintain acceptable behavior despite failures, adapting and recovering gracefully"), ("C", "A type of encryption"), ("D", "A testing tool")], "B",
        "Resilience is the ability to maintain acceptable behavior despite component failures. It is not about never failing but about graceful degradation, recovery, and adaptation when failures occur.", domain))
    qs.append(_q(cid, Tier.BASIC, 2, "What is a timeout in the context of distributed systems?",
        [("A", "A type of error message"), ("B", "A maximum duration after which an operation is aborted if it has not completed, preventing indefinite blocking"), ("C", "A logging level"), ("D", "A deployment strategy")], "B",
        "A timeout is a deadline for an operation. If it doesn't complete within the timeout, the operation is aborted. Timeouts prevent indefinite blocking and resource exhaustion when a downstream service is slow or unresponsive.", domain))
    qs.append(_q(cid, Tier.BASIC, 3, "Which pattern provides a fallback response when a service call fails?",
        [("A", "Circuit Breaker fallback"), ("B", "Adapter"), ("C", "Singleton"), ("D", "Proxy")], "A",
        "A circuit breaker can provide a fallback response (e.g., cached data, default value, or error message) when the downstream service is unavailable, allowing the caller to continue operating in a degraded mode.", domain))
    qs.append(_q(cid, Tier.BASIC, 4, "What is a retry in distributed systems?",
        [("A", "A type of database query"), ("B", "Re-attempting a failed operation, typically with a delay, to handle transient failures"), ("C", "A frontend animation"), ("D", "A security control")], "B",
        "Retries re-attempt failed operations to handle transient failures (network blips, temporary overload). They should use exponential backoff and jitter to avoid thundering-herd effects and must be bounded.", domain))
    qs.append(_q(cid, Tier.BASIC, 5, "What does SLA stand for?",
        [("A", "System Level Architecture"), ("B", "Service Level Agreement — a commitment to a specific level of service availability or performance"), ("C", "Single Layer Application"), ("D", "Standard Logging API")], "B",
        "An SLA (Service Level Agreement) is a commitment to a specific level of service — e.g., 99.9% availability or <200ms latency. Violating an SLA typically has business consequences (credits, penalties).", domain))

    # Novice
    qs.append(_q(cid, Tier.NOVICE, 1, "What is exponential backoff?",
        [("A", "Exponentially increasing the retry delay after each failure to reduce load on the failing service"), ("B", "Exponentially increasing the number of retries"), ("C", "A type of database index"), ("D", "A frontend optimization")], "A",
        "Exponential backoff increases the delay between retries exponentially (e.g., 1s, 2s, 4s, 8s). This reduces load on the failing service and gives it time to recover. Adding jitter (random variation) prevents synchronized retry storms.", domain))
    qs.append(_q(cid, Tier.NOVICE, 2, "What is the difference between a retry and a circuit breaker?",
        [("A", "They are the same"), ("B", "Retries re-attempt transient failures; circuit breakers stop calling a persistently failing service to prevent cascading failures"), ("C", "Retries are for reads, circuit breakers for writes"), ("D", "Circuit breakers are faster")], "B",
        "Retries handle transient failures by re-attempting. Circuit breakers handle persistent failures by stopping calls after a threshold, preventing resource exhaustion and cascading failures. They are complementary: retry within a circuit breaker that is closed.", domain))
    qs.append(_q(cid, Tier.NOVICE, 3, "What is a rate limiter?",
        [("A", "A tool that limits code execution speed"), ("B", "A mechanism that controls the rate of incoming requests to prevent overload and ensure fair resource allocation"), ("C", "A database constraint"), ("D", "A type of timeout")], "B",
        "A rate limiter restricts the number of requests per time window (e.g., 100 req/sec). It protects services from overload, prevents abuse, and ensures fair resource allocation. Common algorithms: token bucket, leaky bucket, sliding window.", domain))
    qs.append(_q(cid, Tier.NOVICE, 4, "What is graceful degradation?",
        [("A", "The system shuts down gracefully"), ("B", "The system continues to provide reduced but useful functionality when components fail, rather than failing completely"), ("C", "A type of logging"), ("D", "A UI animation")], "B",
        "Graceful degradation means a system provides reduced functionality when components fail. For example, an e-commerce site might disable recommendations but still allow checkout when the recommendation service is down.", domain))
    qs.append(_q(cid, Tier.NOVICE, 5, "What is the purpose of a health check in distributed systems?",
        [("A", "To check if developers are healthy"), ("B", "To determine if a service instance is ready to receive traffic, enabling orchestration to route or restart appropriately"), ("C", "A type of metric"), ("D", "A security scan")], "B",
        "Health checks (liveness and readiness) tell orchestrators whether a service is alive and ready to handle requests. Liveness: should the container be restarted? Readiness: should traffic be routed to it? Kubernetes uses these for self-healing.", domain))

    # Apprentice
    qs.append(_q(cid, Tier.APPRENTICE, 1, "What is the difference between a liveness probe and a readiness probe in Kubernetes?",
        [("A", "They are identical"), ("B", "Liveness: is the app running (restart if failed)? Readiness: can it handle traffic (remove from service if failed)?"), ("C", "Liveness is for databases, readiness for APIs"), ("D", "Liveness is faster than readiness")], "B",
        "Liveness probe checks if the container is running — if it fails, Kubernetes restarts the container. Readiness probe checks if the container can serve traffic — if it fails, Kubernetes removes it from the Service's endpoints without restarting.", domain))
    qs.append(_q(cid, Tier.APPRENTICE, 2, "What is the 'thundering herd' problem in retry logic?",
        [("A", "A database deadlock"), ("B", "When many clients retry simultaneously after a service recovers, causing a second spike of load that can re-trigger the failure"), ("C", "A type of memory leak"), ("D", "A network protocol")], "B",
        "The thundering herd occurs when all clients retry simultaneously after a service recovers, causing a load spike that can crash it again. Mitigated by jitter (random delay variation) so retries are spread over time.", domain))
    qs.append(_q(cid, Tier.APPRENTICE, 3, "Which Resilience4j feature limits the number of concurrent calls to a downstream service?",
        [("A", "Bulkhead"), ("B", "Circuit Breaker"), ("C", "Retry"), ("D", "Time Limiter")], "A",
        "Resilience4j Bulkhead limits concurrent calls to a downstream service using a semaphore or thread pool. This prevents resource exhaustion and isolates failures — if the bulkhead is full, new calls are rejected immediately.", domain))
    qs.append(_q(cid, Tier.APPRENTICE, 4, "What is a chaos engineering experiment?",
        [("A", "Randomly deleting code"), ("B", "Deliberately injecting failures (e.g., killing pods, adding latency) to proactively discover resilience weaknesses before they occur in production"), ("C", "A type of load test"), ("D", "A debugging technique")], "B",
        "Chaos engineering (e.g., Chaos Monkey, Gremlin) injects controlled failures into production or staging to test resilience assumptions. It reveals hidden dependencies, missing fallbacks, and inadequate monitoring before real failures expose them.", domain))
    qs.append(_q(cid, Tier.APPRENTICE, 5, "What is an SLO (Service Level Objective)?",
        [("A", "A type of database index"), ("B", "An internal target for service reliability (e.g., 99.9% availability over 30 days), tighter than the SLA to provide a safety margin"), ("C", "A frontend framework"), ("D", "A testing tool")], "B",
        "An SLO is an internal reliability target, stricter than the customer-facing SLA. For example, an SLA of 99.9% might have an internal SLO of 99.95%, providing a budget for incidents before the SLA is breached. The difference is the error budget.", domain))

    # Expert
    qs.append(_q(cid, Tier.EXPERT, 1, "What is an 'error budget' in the context of SLOs?",
        [("A", "The money spent on errors"), ("B", "The allowable amount of unreliability (100% - SLO); it balances innovation speed against reliability — when it is spent, feature launches slow down"), ("C", "A type of database transaction"), ("D", "A logging level")], "B",
        "The error budget is the inverse of the SLO. If the SLO is 99.9% availability, the error budget is 0.1% downtime per period. Teams 'spend' it on incidents or feature launches. When exhausted, focus shifts to reliability. This balances innovation vs. stability.", domain))
    qs.append(_q(cid, Tier.EXPERT, 2, "Which circuit breaker state allows a limited number of test requests to check if the downstream service has recovered?",
        [("A", "Closed"), ("B", "Open"), ("C", "Half-Open"), ("D", "Disabled")], "C",
        "In the half-open state, the circuit breaker allows a limited number of test requests through. If they succeed, the breaker closes (resumes normal operation). If they fail, it reopens. This probes for recovery without overwhelming the service.", domain))
    qs.append(_q(cid, Tier.EXPERT, 3, "What is 'retry amplification' and how does it cause cascading failures?",
        [("A", "Retries improve performance"), ("B", "When multiple layers retry independently, the total retries multiply exponentially, overwhelming downstream services and accelerating failure"), ("C", "A type of caching"), ("D", "A load balancing strategy")], "B",
        "Retry amplification occurs when multiple layers (client, gateway, service, database) each retry. If each layer retries 3x, a single request can generate 3^n attempts. This multiplies load and accelerates cascading failures. Mitigate by retrying at one layer only, or using budget-based retry.", domain))
    qs.append(_q(cid, Tier.EXPERT, 4, "Which distributed system concept describes a system that continues to function correctly even as nodes fail?",
        [("A", "High availability"), ("B", "Fault tolerance — the system tolerates a defined number of failures without incorrect behavior"), ("C", "Load balancing"), ("D", "Sharding")], "B",
        "Fault tolerance means a system continues to function correctly (producing correct results) despite a defined number of node failures. It typically requires redundancy (replicas) and consensus protocols (Raft, Paxos) to maintain consistency.", domain))
    qs.append(_q(cid, Tier.EXPERT, 5, "What is the 'fallback' strategy when a circuit breaker is open, and what must it guarantee?",
        [("A", "It must retry the original call"), ("B", "It provides an alternative response (cached, default, or partial) that is safe for the business context and does not violate data integrity"), ("C", "It throws an error"), ("D", "It shuts down the service")], "B",
        "A fallback provides an alternative when the circuit is open — cached data, a default value, or a partial response. It must be business-safe: for a payments service, a fallback might reject the transaction (fail-closed) rather than return a default 'success'.", domain))

    # Master
    qs.append(_q(cid, Tier.MASTER, 1, "When designing a multi-region active-active deployment, which consistency model correctly balances latency and correctness for a financial ledger?",
        [("A", "Eventual consistency with no coordination"), ("B", "Strong consistency via consensus (Raft/Paxos) for writes, ensuring no duplicate or lost transactions, accepting higher write latency"), ("C", "Read-any-write-any with async replication"), ("D", "No consistency guarantees")], "B",
        "A financial ledger requires strong consistency — no duplicate or lost transactions. Use consensus-based replication (Raft/Paxos) for writes across regions, accepting higher write latency. Reads can be local if linearizable reads are not required, but writes must be globally ordered.", domain))
    qs.append(_q(cid, Tier.MASTER, 2, "In a system with bulkheads, circuit breakers, retries, and timeouts, what is the correct composition order for a downstream call?",
        [("A", "Retry → CircuitBreaker → Bulkhead → TimeLimiter → call"), ("B", "CircuitBreaker → Bulkhead → TimeLimiter → Retry → call"), ("C", "Bulkhead → Retry → CircuitBreaker → call"), ("D", "TimeLimiter → Retry → Bulkhead → CircuitBreaker → call")], "B",
        "Resilience4j recommends: CircuitBreaker (outermost, stops all calls if failing) → Bulkhead (limits concurrency) → TimeLimiter (bounds duration) → Retry (innermost, re-attempts transient failures within the time limit) → actual call. This composition prevents retry amplification and resource exhaustion.", domain))
    qs.append(_q(cid, Tier.MASTER, 3, "What is the 'hedging' technique for latency reduction in distributed systems?",
        [("A", "Placing bets on outcomes"), ("B", "Sending the same request to multiple replicas and using the first response, canceling the rest, to reduce tail latency"), ("C", "A type of caching"), ("D", "A database partitioning strategy")], "B",
        "Hedging sends duplicate requests to multiple replicas and takes the first response, canceling the others. It reduces tail latency (p99) at the cost of extra load. Used by Google's Hedged Requests. Best combined with load shedding to avoid amplifying load.", domain))
    qs.append(_q(cid, Tier.MASTER, 4, "Which approach correctly implements 'request hedging' without amplifying load during a partial outage?",
        [("A", "Always send 3 duplicate requests"), ("B", "Send the first request, and only if it exceeds the p95 latency, send a hedge to a second replica; tie the hedging to a request budget that disables hedging under high load"), ("C", "Send hedged requests only to the same replica"), ("D", "Disable hedging entirely")], "B",
        "Tied hedging: send the first request, and only hedge to a second replica if the first exceeds p95 latency. This avoids the 3x load of naive hedging. Additionally, tie hedging to a request budget — if the system is under high load, disable hedging to avoid amplifying the outage.", domain))
    qs.append(_q(cid, Tier.MASTER, 5, "In the context of chaos engineering, what is a 'blast radius' and how is it controlled during an experiment?",
        [("A", "The size of the explosion"), ("B", "The scope of impact a failure can have; controlled by starting in staging, limiting to non-critical services, business hours only, with abort criteria and automated rollback"), ("C", "A type of metric"), ("D", "A deployment strategy")], "B",
        "Blast radius is the scope of potential impact. Control it by: starting in staging, then a single prod instance, then a zone; limiting to business hours with on-call present; defining abort criteria (error rate threshold) with automated rollback. Gradually increase blast radius as confidence grows.", domain))

    return qs


# ---------------------------------------------------------------------------
# WF-203 — Spring AI & Enterprise RAG
# ---------------------------------------------------------------------------

def _wf203_questions() -> list[Question]:
    cid = "c-wf203"
    domain = "AI"
    qs: list[Question] = []

    # Basic
    qs.append(_q(cid, Tier.BASIC, 1, "What is RAG (Retrieval-Augmented Generation)?",
        [("A", "A database indexing technique"), ("B", "A pattern that retrieves relevant documents from a knowledge base and provides them as context to an LLM to generate grounded answers"), ("C", "A frontend framework"), ("D", "A type of encryption")], "B",
        "RAG retrieves relevant documents from a knowledge base using semantic search, then provides them as context to the LLM. This grounds the model's response in factual data, reducing hallucinations.", domain))
    qs.append(_q(cid, Tier.BASIC, 2, "What is an embedding in the context of AI?",
        [("A", "A type of database index"), ("B", "A numerical vector representation of text that captures semantic meaning, enabling similarity comparison"), ("C", "A UI component"), ("D", "A security token")], "B",
        "An embedding is a vector (array of floats) representing the semantic meaning of text. Similar texts have similar vectors. Embeddings enable semantic search, clustering, and retrieval in RAG systems.", domain))
    qs.append(_q(cid, Tier.BASIC, 3, "Which Spring AI class is used to interact with an LLM model?",
        [("A", "ChatClient"), ("B", "EntityManager"), ("C", "RestTemplate"), ("D", "JdbcTemplate")], "A",
        "Spring AI's ChatClient provides a fluent API for interacting with LLM models (OpenAI, Azure OpenAI, Ollama, etc.), supporting prompts, system messages, and structured output.", domain))
    qs.append(_q(cid, Tier.BASIC, 4, "What is a vector database?",
        [("A", "A database for vector graphics"), ("B", "A database optimized for storing and querying high-dimensional vectors (embeddings) for similarity search"), ("C", "A relational database"), ("D", "A graph database")], "B",
        "A vector database (e.g., Pinecone, Milvus, pgvector) stores embeddings and performs fast approximate nearest neighbor (ANN) search to find the most similar vectors to a query embedding.", domain))
    qs.append(_q(cid, Tier.BASIC, 5, "What is a 'hallucination' in the context of LLMs?",
        [("A", "A visual glitch"), ("B", "When an LLM generates plausible but factually incorrect or fabricated information"), ("C", "A type of error message"), ("D", "A security vulnerability")], "B",
        "A hallucination is when an LLM produces confident, plausible-sounding but factually wrong output. RAG mitigates this by grounding responses in retrieved documents, but does not eliminate it entirely.", domain))

    # Novice
    qs.append(_q(cid, Tier.NOVICE, 1, "What is the role of a document store in a RAG pipeline?",
        [("A", "To store user sessions"), ("B", "To store and retrieve document chunks along with their embeddings for context retrieval"), ("C", "To store model weights"), ("D", "To store API keys")], "B",
        "A document store (vector store) holds document chunks and their embeddings. During retrieval, the query is embedded and compared against stored embeddings to find the most relevant chunks for the LLM context.", domain))
    qs.append(_q(cid, Tier.NOVICE, 2, "What is 'chunking' in the context of RAG?",
        [("A", "A type of database partitioning"), ("B", "Splitting large documents into smaller, semantically meaningful pieces for embedding and retrieval"), ("C", "A compression technique"), ("D", "A security pattern")], "B",
        "Chunking splits documents into smaller pieces (e.g., by paragraph, sentence, or token count) so that retrieval can find the most relevant sections. Chunk size and overlap affect retrieval quality.", domain))
    qs.append(_q(cid, Tier.NOVICE, 3, "Which Spring AI interface defines a vector store for storing and retrieving embeddings?",
        [("A", "VectorStore"), ("B", "EmbeddingStore"), ("C", "DocumentRepository"), ("D", "KnowledgeBase")], "A",
        "Spring AI's VectorStore interface defines add(), delete(), and similaritySearch() operations. Implementations include PgVectorStore, RedisVectorStore, PineconeVectorStore, and others.", domain))
    qs.append(_q(cid, Tier.NOVICE, 4, "What is 'semantic search'?",
        [("A", "Searching for HTML tags"), ("B", "Searching based on the meaning of content rather than exact keyword matches, using embeddings"), ("C", "A type of SQL query"), ("D", "A frontend search bar")], "B",
        "Semantic search uses embeddings to find content with similar meaning, not just matching keywords. For example, searching 'car' can find 'automobile' because their embeddings are close in vector space.", domain))
    qs.append(_q(cid, Tier.NOVICE, 5, "What is a 'prompt template' in Spring AI?",
        [("A", "A UI template"), ("B", "A parameterized prompt with placeholders that are filled at runtime with variables like {question} or {context}"), ("C", "A database template"), ("D", "A type of configuration file")], "B",
        "Spring AI's PromptTemplate allows parameterized prompts with placeholders (e.g., {question}, {context}). At runtime, variables are substituted, enabling dynamic prompt construction for RAG pipelines.", domain))

    # Apprentice
    qs.append(_q(cid, Tier.APPRENTICE, 1, "What is the purpose of the 'top-k' parameter in a RAG retrieval step?",
        [("A", "It limits the number of LLM tokens"), ("B", "It controls how many of the most similar document chunks are retrieved and provided as context"), ("C", "A database limit"), ("D", "A timeout value")], "B",
        "Top-k controls how many document chunks are retrieved. A higher k provides more context but increases token cost and may introduce noise. A lower k is cheaper but may miss relevant information. Typical values: 3-10.", domain))
    qs.append(_q(cid, Tier.APPRENTICE, 2, "What is 'cosine similarity' in the context of embeddings?",
        [("A", "A trigonometric function"), ("B", "A metric measuring the angle between two vectors, used to compare semantic similarity of embeddings — 1 means identical, 0 means unrelated"), ("C", "A type of database index"), ("D", "A frontend animation")], "B",
        "Cosine similarity measures the cosine of the angle between two vectors. For embeddings, a value close to 1 means semantically similar, close to 0 means unrelated. It is the standard metric for vector similarity search.", domain))
    qs.append(_q(cid, Tier.APPRENTICE, 3, "Which technique improves RAG retrieval quality by adding metadata to document chunks?",
        [("A", "Data augmentation"), ("B", "Adding metadata (source, title, section, timestamp) to chunks for filtering and reranking during retrieval"), ("C", "Compression"), ("D", "Encryption")], "B",
        "Adding metadata (source document, section title, page number, timestamp) to chunks enables pre-filtering (e.g., only search recent documents) and post-retrieval reranking, improving answer relevance and traceability.", domain))
    qs.append(_q(cid, Tier.APPRENTICE, 4, "What is 'grounding' in the context of LLM responses?",
        [("A", "Electrical grounding"), ("B", "Constraining LLM output to be based on retrieved factual context rather than the model's parametric memory alone"), ("C", "A type of caching"), ("D", "A database connection")], "B",
        "Grounding constrains the LLM to base its response on retrieved documents rather than its internal parameters. This reduces hallucinations and enables citation of sources. The system prompt instructs the model to use only the provided context.", domain))
    qs.append(_q(cid, Tier.APPRENTICE, 5, "What is the risk of including too much context in a RAG prompt?",
        [("A", "No risk — more is always better"), ("B", "Exceeding the model's context window, diluting relevant information, increasing cost, and potentially causing the model to 'get lost in the middle'"), ("C", "It improves accuracy"), ("D", "It has no cost impact")], "B",
        "Too much context can exceed the token limit, dilute relevant information among irrelevant chunks, increase cost (tokens are billed), and cause the 'lost in the middle' phenomenon where models pay less attention to information in the middle of long contexts.", domain))

    # Expert
    qs.append(_q(cid, Tier.EXPERT, 1, "What is 'retrieval reranking' and why is it used in enterprise RAG systems?",
        [("A", "Reordering search results randomly"), ("B", "Using a cross-encoder model to re-score the top-k retrieved chunks for relevance, improving precision over initial bi-encoder retrieval"), ("C", "A type of caching"), ("D", "A database index")], "B",
        "Initial retrieval uses a fast bi-encoder (embedding similarity). Reranking uses a slower but more accurate cross-encoder to re-score the top-k results by analyzing the query and each chunk together. This significantly improves precision at the cost of latency.", domain))
    qs.append(_q(cid, Tier.EXPERT, 2, "Which approach correctly handles streaming LLM responses in Spring AI?",
        [("A", "Blocking until the full response is generated"), ("B", "Using ChatClient.prompt().stream() to return a Flux<String> for token-by-token streaming to the client"), ("C", "Using JdbcTemplate"), ("D", "Using @Async")], "B",
        "Spring AI supports streaming via ChatClient.prompt().stream(), which returns a Reactor Flux<String>. Each token is emitted as it is generated, enabling real-time UI updates and lower perceived latency for the user.", domain))
    qs.append(_q(cid, Tier.EXPERT, 3, "What is 'query expansion' in a RAG pipeline?",
        [("A", "Expanding the database schema"), ("B", "Reformulating or expanding the user's query (e.g., generating sub-queries or synonyms) to improve retrieval recall"), ("C", "A type of caching"), ("D", "A compression technique")], "B",
        "Query expansion uses an LLM to reformulate the user's query — generating sub-queries, synonyms, or hypothetical answers — to improve retrieval recall. For example, 'How do I deploy?' might expand to include 'deployment guide', 'CI/CD pipeline', etc.", domain))
    qs.append(_q(cid, Tier.EXPERT, 4, "What is the 'lost in the middle' phenomenon in LLM context processing?",
        [("A", "A database deadlock"), ("B", "LLMs pay less attention to information positioned in the middle of long contexts, favoring the beginning and end"), ("C", "A network timeout"), ("D", "A frontend rendering issue")], "B",
        "Research shows LLMs attend more to information at the beginning and end of long contexts, neglecting the middle. In RAG, this means the most relevant chunk should be placed at the beginning or end of the context, not buried in the middle.", domain))
    qs.append(_q(cid, Tier.EXPERT, 5, "Which security control is critical when a RAG system retrieves documents containing sensitive information?",
        [("A", "Encrypting the vector database"), ("B", "Applying access control at the retrieval layer — filtering chunks by the user's authorization level before including them in the LLM context"), ("C", "Using HTTPS"), ("D", "Adding more chunks")], "B",
        "Access control must be applied at the retrieval layer. If a user lacks permission to see a document, its chunks must be filtered out before retrieval. Otherwise, the LLM may surface sensitive information from unauthorized documents in its response. This is a critical enterprise RAG security control.", domain))

    # Master
    qs.append(_q(cid, Tier.MASTER, 1, "When designing an enterprise RAG system with multi-tenancy, which architecture correctly isolates tenant data at the vector store level?",
        [("A", "Store all tenants' data in one collection with no filtering"), ("B", "Use per-tenant collections/namespaces in the vector store, or a tenant_id metadata filter on every query, with access enforcement at the retrieval layer"), ("C", "Use a single shared embedding model for all tenants"), ("D", "Store tenant data in separate databases only")], "B",
        "Multi-tenant RAG isolation: use per-tenant collections/namespaces (physical isolation) or a tenant_id metadata filter on every query (logical isolation). The latter is more cost-efficient. Access must be enforced at the retrieval layer — never rely on the LLM to filter sensitive content.", domain))
    qs.append(_q(cid, Tier.MASTER, 2, "What is 'HyDE' (Hypothetical Document Embeddings) and how does it improve RAG retrieval?",
        [("A", "A type of database index"), ("B", "Generating a hypothetical answer to the query using the LLM, embedding that answer, and using it for retrieval — improving semantic match with document content"), ("C", "A compression technique"), ("D", "A security pattern")], "B",
        "HyDE generates a hypothetical answer to the user's query using the LLM, then embeds this hypothetical answer (not the original query) for retrieval. Since documents contain answers (not questions), the hypothetical answer's embedding matches document embeddings better, improving retrieval recall.", domain))
    qs.append(_q(cid, Tier.MASTER, 3, "In a RAG system, what is the 'generation-evaluation gap' and how is it addressed in production?",
        [("A", "The gap between dev and prod environments"), ("B", "The gap between retrieval relevance and answer quality; addressed via RAG evaluation metrics (faithfulness, answer relevance, context precision) and automated evaluation pipelines"), ("C", "A network latency issue"), ("D", "A frontend rendering gap")], "B",
        "The generation-evaluation gap: good retrieval does not guarantee good answers. Production RAG systems use evaluation frameworks (RAGAS, TruLens) to measure faithfulness (is the answer grounded in context?), answer relevance, and context precision. These metrics drive iterative improvement of chunking, retrieval, and prompt strategies.", domain))
    qs.append(_q(cid, Tier.MASTER, 4, "Which approach correctly implements 'structured output' from an LLM in Spring AI for a RAG response that includes citations?",
        [("A", "Parse the raw text response with regex"), ("B", "Use BeanOutputConverter or the entity() method with a strongly-typed response class containing answer and citations fields, enforcing schema via the model's function-calling or JSON mode"), ("C", "Use JdbcTemplate"), ("D", "Split the response by newlines")], "B",
        "Spring AI's BeanOutputConverter generates a JSON schema from a Java record/class and instructs the LLM to produce JSON conforming to it. The entity() method deserializes the response into a typed object. This enforces structure (answer + citations array) without fragile text parsing.", domain))
    qs.append(_q(cid, Tier.MASTER, 5, "When building a production RAG system, which strategy best balances cost, latency, and answer quality for a high-volume enterprise knowledge base?",
        [("A", "Always use the largest model with maximum context"), ("B", "Use a tiered approach: fast embedding model for retrieval, reranker for top-k precision, smaller model for simple queries, larger model for complex ones, with semantic caching for repeated queries"), ("C", "Use a single model for everything"), ("D", "Disable caching to ensure freshness")], "B",
        "A tiered approach optimizes cost/latency/quality: a fast embedding model for initial retrieval, a cross-encoder reranker for precision, model routing (small model for simple queries, large for complex), and semantic caching (cache similar queries' answers). This reduces cost by 40-70% while maintaining answer quality for high-volume enterprise use.", domain))

    return qs
