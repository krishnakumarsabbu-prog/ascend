# ASCEND Platform — Comprehensive Feature Catalog

ASCEND is an enterprise-grade **Graduate Developer Accelerator (GDA) & Talent Engineering Platform** built for high-stakes enterprise engineering organizations (modeled on Wells Fargo's engineering excellence standards). It accelerates early talent from onboarding to production architecture through structured curriculum, automated coding assessments, architect defense boards, and multi-stakeholder governance.

---

## 1. Authentication, Multi-Role RBAC & Persona Switcher

- **Dedicated Enterprise Login Portal (`/login`)**:
  - Secure login interface with Wells Fargo & ASCEND branding.
  - **1-Click Persona Switcher Cards** for instantaneous testing across all 5 enterprise personas:
    1. **Early Talent (GDA Associate)** — *Ananya Rao, Fatima Sheikh, Rohan Mehta, Karthik Iyer*
    2. **Mentor / Coach** — *Priya Nair (Lead Systems Architect)*
    3. **Engineering Excellence Committee** — *Governance & Curriculum Board*
    4. **Senior Leader Sponsor** — *Head of Engineering Talent & Sponsoring VP*
    5. **Technology Head** — *Chief Technology Officer / Global Tech Head*
- **Role-Based Access Control (RBAC)**:
  - Global `AuthContext` with session token persistence and role switching.
  - `ProtectedRoute` component guarding routes with permission checks and role elevation shortcuts.
- **Dynamic Associate Switcher**:
  - In-app switcher for Early Talent personas allowing instant switching between associates with different pathways, standings, and progress states.

---

## 2. Early Talent (GDA Associate) Experience

- **Associate Dashboard (`/`)**:
  - **Readiness & Progress Gauges**: Real-time progress segments across curriculum, technical assessments, and ASM milestones.
  - **Associate Standing Indicators**: `ON_TRACK`, `FAST_TRACK`, `AT_RISK`, and `BLOCKED` status badges.
  - **Month Progression Timeline**: 24-month roadmap with month-by-month milestone status and earned credits.
  - **Next Actions & Tasks**: Prioritized action items with due dates and urgency indicators.
  - **Recent Credit Activity**: Live feed of credits earned from assessments, milestones, and challenges.
- **Integrated Curriculum (`/curriculum`)**:
  - Catalog of foundational and intermediate engineering courses (`WF-101` to `WF-203`).
  - Domain mapping: **D1** (Core Java & AI Prompting), **D2** (Cloud & Distributed Systems), **D3** (Platform Stacks), and **D4** (Live Fire).
  - Course status tracking (`Not Started`, `In Progress`, `Completed`), duration, prerequisites, and credit values.
- **Pathway Recommendation & Selection Engine (`/pathways`)**:
  - **Automated Skill Contribution Analysis**: Evaluates assessment scores across domains to compute normalized pathway affinity.
  - **Supported Pathways**:
    - **SE** (Software Engineering)
    - **DE** (Data Engineering & Analytics)
    - **CSE** (Cyber Security & Site Reliability Engineering)
    - **IE** (Integration & Platform Engineering)
  - **Tri-Party Reconciliation**: System algorithmic recommendation vs. Mentor Coach evaluation vs. Committee final decision.
  - **Audit History**: Complete timeline of pathway decision history and reasoning.
- **Commissioning Path & Milestone Journey (`/commissioning`, `/asm`)**:
  - 24-month milestone progression from **Foundational Gates** to **Capstone Projects**.
  - Milestone detail modals with learning objectives, evaluated skills, prerequisites, and evaluation criteria.
  - **Evidence Submission Workflow**: Associates submit pull request URLs and implementation evidence for mentor review.
- **Specialized Associate Subviews**:
  - **WF Course Assessments (`/wf-assessments`)**: Pre-assessment opt-in waivers and assessment readiness overview.
  - **ASM Fork & Environments (`/asm-fork`)**: GitHub fork tracking and cloud sandbox deployments (AWS/EKS/Local).
  - **Advanced Intensives (`/advanced-intensives`)**: Deep-dive technical tracks for fast-track candidates.
  - **Architect Board Defense (`/architect-board`)**: Defense scheduling, RFC topic allocations, and panel scoring.
  - **Credit Ledger (`/credit-ledger`)**: Double-entry ledger audit of all credits earned across instruments.
  - **Program Overview (`/program-overview`)**: End-to-end framework methodology and graduation criteria.

---

## 3. HackerRank-Grade Code Execution & Assessment Engine

- **In-Browser Split-Pane IDE (`/coding/:challengeId`)**:
  - **Left Problem Pane**:
    - Detailed problem statement, input/output formats, and production constraints.
    - Sample test cases with expected outputs and explanations.
    - Historical submissions and execution metrics.
  - **Right Editor Pane**:
    - Live code editor with line numbers, syntax indentation, and boilerplate reset.
    - Multi-language support: **Java 21**, **Python 3.12**, **TypeScript 5.7**, and **PostgreSQL 16**.
    - Pre-configured production boilerplates with concurrent data structures and algorithm skeletons.
  - **Execution Output Terminal**:
    - Per-test-case status pills (`PASSED`, `FAILED`, `RUNTIME_ERROR`, `TIMEOUT`).
    - Runtime latency measurements (ms) and memory footprint (MB).
    - Stdout diff inspector comparing expected vs. actual outputs.
  - **Execution Engine Actions**:
    - **`▶ Run Code`**: Evaluates user code against visible sample test cases.
    - **`✓ Submit Solution`**: Evaluates against hidden verification test cases, calculates score, and automatically deposits credits into the associate's ledger.
- **Practice Challenges Catalog (`/challenges`)**:
  - Production-grade real-world engineering challenges:
    - *High-Throughput Payments Idempotency Engine* (Java 21 / Atomic concurrent hash locks)
    - *Vector Similarity Search & Top-K Retrieval* (Python 3 / Embeddings & Cosine Dot Product)
    - *Kafka Stream Lag & Partition Rebalance Optimizer* (TypeScript / Load balancing)
  - Filtering by difficulty (`EASY`, `MEDIUM`, `HARD`), domain tags, points, and credit rewards.

---

## 4. Technical Assessment & MCQ Examination Engine

- **Timed Assessment Runner (`/assessment/:courseId`)**:
  - Full-screen timed examination environment with countdown clock and auto-submit warning.
  - Question drawer with live indicators for *Answered*, *Unanswered*, and *Marked for Review*.
  - Instant answer autosave with optimistic UI updates.
- **Assessment Analytics & Result Inspector (`/assessment/result/:attemptId`)**:
  - Overall score percentage with passing gate threshold evaluation (`PASSED` vs. `NEEDS_IMPROVEMENT`).
  - **Domain Competency Breakdown**: Granular scoring per domain (D1–D4) with percentage bars.
  - **Difficulty Tier Performance**: Performance breakdown across 5 tiers (`Basic`, `Novice`, `Apprentice`, `Expert`, `Master`).
  - **Actionable AI Insights**: Automatically identifies the associate's strongest area, key improvement area, and recommended next step.

---

## 5. Mentor / Coach Portal (`/mentor`)

- **My Mentees Directory**:
  - Real-time roster of assigned early talent associates.
  - Holistic readiness score (45% assessment performance + 55% milestone clearance).
  - Risk categorization badges (`ON_TRACK`, `NEEDS_ATTENTION`, `AT_RISK`).
- **Mentee Profile & Development Plan**:
  - Comprehensive mentee dossiers including assessment transcripts, credits, and ASM status.
  - **Interactive Development Goals**: Create and track developmental goals with target months and priorities (`High`, `Medium`, `Low`).
  - **Mentor Check-in Notes**: Persistent mentor coaching logs and meeting summaries.
- **Course Waiver Recommendations**:
  - Review system-suggested course waivers for mentees demonstrating accelerated competence.
  - Submit `RECOMMEND` or `DO_NOT_RECOMMEND` decisions with written justification before routing to the Committee.
- **Pathway Review Panel**:
  - Submit formal mentor pathway recommendations with confidence ratings (0–100%), key strengths, and growth areas.

---

## 6. Engineering Excellence Committee Governance (`/committee`)

- **Cohort Overview & Health Metrics**:
  - Aggregate metrics: Total associates, assessment completion rate, ASM milestone rate, and at-risk count.
  - Pathway distribution visualizations across SE, DE, CSE, and IE.
  - Audit event stream tracking framework operations, question rotations, and waiver decisions.
- **Question Bank Maintenance**:
  - Course-by-course question coverage matrix across all 5 difficulty tiers (500-question target capacity).
  - Live vs. draft sample status toggles and rotation date trackers.
- **ASM Library Administration**:
  - Central repository of ASM milestones with rubric focuses, target months, credit values, and active/deactivated toggles.
- **Waiver Request Governance**:
  - Final decision board for course waivers with full audit history and mentor recommendation context.
- **Dynamic Difficulty Calibration Engine**:
  - Live average score and pass rate monitoring across courses.
  - Calibration engine classifying courses as `Too Easy`, `Balanced`, or `Too Difficult` with automatic delta adjustments.
- **Enterprise Credit Ledger Audit**:
  - Comprehensive transaction log of all credit entries across assessments, ASM completions, and coding challenges.

---

## 7. Senior Leader Sponsor Portal (`/sponsor`)

- **Demand & Pipeline Intelligence**:
  - Team-by-team workforce demand tracking across business divisions (Payments, Core Banking, Wealth, Cloud).
  - Pipeline stage breakdown: Associates in *Foundation*, *Pathway Specialization*, and *Commission Ready*.
  - AI-assisted talent matching recommendations aligned with upcoming team headcount needs.
- **Sponsored ASM Milestones**:
  - Sponsoring real-world business initiatives as high-impact ASM milestones (e.g. *Resilience Chaos Simulator*, *Event Ledger Reconciler*).
- **Fast-Track & Elevation Approvals**:
  - Review and decisioning (`APPROVE` / `REJECT`) for Fast-Track and One-Level-Up promotion requests.
- **Architect Board Defense Participation**:
  - Review candidates scheduled for RFC Board Defenses with scoring capabilities.

---

## 8. Technology Head Portal (`/techhead`)

- **Cloud & Platform Readiness Heatmap**:
  - Matrix assessing associate readiness across **D2** (Cloud & Distributed Systems) and **D3** (Platform & Vendor Stacks).
  - Level evaluations from `L0` to `L400` with green/red competency thresholds.
- **Technology Stack Coverage**:
  - Enterprise stack mastery monitoring across Java 21, Spring Boot, Kafka, AWS, Kubernetes, and AI/Bedrock.
- **Commissioning Sign-Off**:
  - Final technology governance sign-off gate before associates transition into permanent production engineering teams.

---

## 9. Administration & Authoring Studios (`/admin/*`)

- **User & Associate Management Studio (`/admin/users`)**:
  - Searchable directory of all users and associates with email, title, role, cohort, and standing.
  - Filter by role (`All`, `Early Talent`, `Mentor`, `Committee`, `Sponsor`, `Tech Head`).
  - **"+ Create New User" Modal**:
    - Dynamic provisioning of accounts across all roles.
    - Automatic GDA associate record creation with team selection, mentor assignment, sponsor mapping, pathway code, and starting month.
  - User deletion and profile updates with optimistic query invalidation.
- **Course & Curriculum Authoring Studio (`/admin/courses`)**:
  - Visual grid of curriculum courses with domain tags, difficulty tiers, and credit values.
  - Filter by domain (`Foundation`, `Engineering`, `AI`, `D1`–`D4`).
  - **"+ Author New Course" Modal**:
    - Code (`WF-105`), title, description, focus area, domain competency, and difficulty tier.
    - **Interactive Syllabus Module Builder**: Dynamically add and remove course module items.
  - Course deletion and catalog synchronization.
- **Question & Coding Problem Bank Studio (`/admin/questions`)**:
  - **Dual Studio Tabs**:
    1. **MCQ Question Bank Studio**:
       - Course and tier selector.
       - Table of questions with **Admin Answer Key View** (correct answer preview and rationale).
       - **"+ Add MCQ Question" Modal**: Question prompt, 4 choices with radio selector for correct answer, difficulty tier, and explanation.
    2. **HackerRank Coding Challenge Studio**:
       - Catalog of coding challenges with difficulty, domain, points, and credits.
       - **"+ Create Coding Challenge" Modal**:
         - Challenge title, slug, difficulty, domain, points, credit rewards, and time limits.
         - Problem description, input/output format specifications, and constraints.
         - **Multi-Language Starter Code**: Boilerplates for Java 21, Python 3, TypeScript, and SQL.
         - **Interactive Test Case Builder**: Input data, expected output, and `is_hidden` toggle for verification test cases.

---

## 10. Backend Architecture & API Layer

- **Technology**: Built with **FastAPI** and **Python 3.12+** / **Pydantic v2**.
- **Architecture Highlights**:
  - **In-Memory Enterprise Repository**: Clean repository pattern simulating a relational database with realistic seed data.
  - **High-Fidelity Code Executor Service**: Simulates realistic multi-language execution latencies (8–25ms), memory footprints (14–28MB), and automated scoring.
  - **Double-Entry Credit Ledger**: Ensures integrity of credit awards with balance tracking and transaction history.
  - **REST API Endpoints**:
    - `/api/roles`, `/api/users`, `/api/associates`
    - `/api/courses`, `/api/curriculum/courses`, `/api/questions`
    - `/api/assessments/start`, `/api/assessments/{id}/answer`, `/api/assessments/{id}/submit`
    - `/api/pathways`, `/api/pathways/recommendation/{id}`, `/api/pathways/mentor-review`, `/api/pathways/committee-decision`
    - `/api/asm`, `/api/asm/{id}/start`, `/api/asm/{id}/submit`, `/api/asm/{id}/review`
    - `/api/coding/challenges`, `/api/code/run`, `/api/code/submit`
    - `/api/mentors/{id}/mentees`, `/api/mentees/{id}/development-plan`, `/api/waivers`
    - `/api/committee/overview`, `/api/committee/bank-coverage`, `/api/committee/difficulty`, `/api/committee/ledger`
    - `/api/demand`, `/api/pipeline`, `/api/sponsor/approvals`, `/api/architect-board/defenses`
    - `/api/techhead/readiness-heatmap`
