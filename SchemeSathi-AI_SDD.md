# Spec-Driven Development (SDD) Document
## SchemeSathi AI — AI-Powered Government Scheme Eligibility & Application Assistant

**Document Type:** Implementation Specification for AI-Assisted Development
**Target Consumers:** Autonomous coding agents (e.g., Antigravity), human engineers
**Version:** 1.0

---

## 1. Project Overview

SchemeSathi AI is a full-stack, AI-driven web application designed to close the gap between Indian citizens and the government welfare schemes they are legally entitled to but frequently unaware of. The system ingests a structured dataset of Central and State government schemes, combines it with a user-supplied demographic and socioeconomic profile, and uses a large language model (Gemini API) grounded via Retrieval-Augmented Generation (RAG) to produce personalized, explainable, multilingual scheme recommendations. The platform is composed of a React single-page application frontend, a FastAPI backend exposing a REST API, a relational database for structured records, and an AI service layer responsible for eligibility scoring, natural-language chat, and plain-language explanation generation. This document translates the original Software System Design (SSD) into an implementation-ready specification: every module, data model, endpoint, workflow, and business rule is defined explicitly enough that a coding agent can scaffold, implement, and test the system without requiring additional clarification from a human.

## 2. Vision and Objectives

The long-term vision for SchemeSathi AI is to become the default conversational entry point through which any Indian citizen — regardless of literacy level, language, or digital fluency — can discover and act on welfare entitlements within minutes of describing their situation in plain language. The primary objectives are to raise awareness of scheme existence, simplify the interpretation of eligibility criteria that are often written in dense bureaucratic language, reduce the friction and confusion associated with application procedures, and make the entire discovery-to-application journey accessible on low-end mobile devices with intermittent connectivity. Secondary objectives include supporting regional languages (English, Hindi, Telugu at launch), improving digital inclusion for rural and low-income populations, actively reducing misinformation by grounding all AI responses in a verified dataset rather than open-domain generation, and encouraging higher participation rates in existing welfare programs by removing informational barriers rather than requiring policy changes.

## 3. Problem Statement

India operates several hundred welfare schemes spread across ministries, departments, and state governments, but three structural failures prevent eligible citizens from benefiting: discoverability, comprehensibility, and accessibility. Discoverability fails because scheme information is fragmented across dozens of disconnected government portals with no unified search experience. Comprehensibility fails because eligibility clauses are written in formal administrative language full of jargon, cross-references, and conditional logic that is difficult for a layperson to parse correctly, leading to eligible citizens self-excluding out of uncertainty. Accessibility fails along two axes: digital literacy (rural and older users are not comfortable with multi-step web forms or keyword search) and language (most portals are English- or Hindi-only, excluding large non-Hindi-speaking populations). The compounding effect of these three failures is that a significant share of intended beneficiaries — particularly farmers, women, senior citizens, persons with disabilities, and low-income families — never receive benefits that already exist and that they already qualify for.

## 4. Proposed Solution

SchemeSathi AI addresses each failure mode directly. Discoverability is solved by centralizing a curated dataset of schemes (target: 50–150 schemes at MVP) into a single searchable and conversationally queryable system. Comprehensibility is solved by an AI Simplifier component that rewrites official eligibility and benefit text into plain, direct language, and by an Eligibility Recommendation Engine that performs deterministic rule matching against the user's profile so that eligibility is *computed*, not left for the user to self-assess. Accessibility is solved through a conversational chat interface (in addition to traditional forms) that accepts free-text queries such as "I'm a farmer from Telangana" and returns ranked, explained recommendations, combined with multilingual UI and AI response support. The system is architected so that AI-generated content is always grounded in retrieved, verified scheme records (RAG pattern) rather than relying on the model's unconstrained generative knowledge, which mitigates hallucination risk on a domain where factual accuracy (deadlines, documents, benefit amounts) is critical.

## 5. Scope

**In scope for the MVP release:** user registration and authentication; structured profile creation and editing; a rule-based eligibility engine cross-referenced against a static, curated scheme dataset; an AI chat assistant capable of free-text eligibility queries grounded via RAG; scheme detail pages showing benefits, eligibility, required documents, application links, and deadlines; a document-checklist generator per recommended scheme; multilingual support for English, Hindi, and Telugu on both UI strings and AI-generated responses; keyword and natural-language search over the scheme dataset; and a persisted chat history per user. **Out of scope for the MVP** (deferred to Future Enhancements, Section 25): voice input/output, OCR-based document verification, WhatsApp bot integration, offline-first mode, AI-assisted form auto-filling, SMS notifications, scheme-update push notifications, an administrative dashboard for scheme-data curation, and native mobile applications. Any coding agent implementing this spec should treat features outside the "in scope" list as explicitly not required for the initial release and should avoid building speculative infrastructure for them.

## 6. Stakeholders and User Personas

The **primary user base** consists of individual citizens seeking welfare benefits, spanning several personas: (1) *Rural Farmer* — moderate digital literacy, prefers voice-like conversational queries over forms, primarily interested in agricultural subsidy and crop insurance schemes; (2) *Student/Job Seeker* — higher digital literacy, mobile-first, interested in scholarship and skill-development schemes, comfortable with structured search; (3) *Woman Entrepreneur* — interested in loan and grant schemes targeted at women-led businesses, values clear document checklists; (4) *Senior Citizen* — lower digital literacy, benefits most from simplified language and larger UI affordances, primarily interested in pension and healthcare schemes; (5) *Person with Disability* — requires accessibility-conscious UI (screen-reader compatibility, high contrast) and is interested in disability-specific welfare and reservation schemes. **Secondary stakeholders** who do not use the core recommendation flow directly but interact with the ecosystem include NGOs and community volunteers (who may use the platform on behalf of beneficiaries), government service center staff (who may reference scheme details for walk-in citizens), and social workers. The system's data model and UI should not assume the end user is always the beneficiary themselves — profile creation should be usable by an intermediary filling in details for another person.

## 7. Functional Requirements

**User Management.** The system shall support account registration via email and password, secure login issuing a signed JWT, and authenticated profile creation/editing covering: full name, age, gender, annual household income, occupation, state of residence, social category (General/OBC/SC/ST/EWS), and disability status (boolean plus optional disability type). Profile fields are the direct inputs to the eligibility engine, so validation must enforce: age as a positive integer between 0 and 120; income as a non-negative integer; gender, state, and category constrained to enumerated value sets; and disability as boolean with a conditional disability-type string.

**Scheme Recommendation.** The system shall accept a completed user profile, evaluate it against every scheme's structured eligibility rules, return the subset of schemes for which all mandatory criteria are satisfied, assign each matched scheme a confidence/relevance score (see Section 17 for scoring formula), rank results descending by score, and attach a human-readable explanation string per recommendation describing which profile attributes drove the match.

**AI Chat Assistant.** The system shall accept free-text natural-language queries (e.g., "I'm a farmer from Telangana," "I need education support," "Which schemes help women entrepreneurs?"), retrieve the top-k semantically relevant scheme records using embedding similarity search, and pass the retrieved context plus the user's query to the Gemini API to produce a grounded, conversational response. Every chat exchange (question, answer, timestamp) shall be persisted against the requesting user's ID.

**Scheme Details.** Each scheme detail view shall render: scheme name, plain-language description, full eligibility criteria (both raw and AI-simplified), benefits, required documents list, official application link, issuing state or "Central," and application deadline where applicable (nullable field for open-ended schemes).

**Multilingual Support.** UI strings and AI-generated explanations shall be renderable in English, Hindi, and Telugu, selected via a persisted user language preference; the AI Simplifier and chat responses must be generated (or translated) in the selected language.

**Document Guidance.** For any scheme in a user's recommended list, the system shall generate a checklist of required documents and shall support marking documents as "have" or "missing" per user, persisting this state for return visits.

**Search.** The system shall support keyword search (exact/partial string match against scheme name and description) and natural-language search (semantic similarity via the same embedding pipeline used for chat retrieval) over the scheme catalog, with voice input explicitly deferred to Future Enhancements.

## 8. Non-Functional Requirements

| Category | Requirement |
|---|---|
| Performance | 95th-percentile API response time under 3 seconds for recommendation and chat endpoints; under 500ms for CRUD endpoints |
| Security | Passwords hashed with bcrypt (cost factor ≥ 12); all traffic over HTTPS/TLS 1.2+; stateless JWT authentication with 24-hour access token expiry |
| Availability | Target 99% monthly uptime for backend and database services |
| Scalability | Backend must be horizontally scalable (stateless request handling, no in-memory session state); database connection pooling required |
| Usability | Mobile-first responsive layout (minimum supported viewport width 320px); WCAG 2.1 AA color contrast for core flows |
| Maintainability | Backend organized into routes/services/models layers (Section 24) to allow independent modification of AI logic without touching persistence logic |
| Observability | All API errors logged with request ID, endpoint, and stack trace; AI service calls logged with latency and token usage |

## 9. System Architecture

The system follows a three-tier architecture with an explicit AI service layer sitting alongside, rather than inside, the core backend, so that AI provider changes do not require rewriting business logic.

```
                        ┌─────────────────────┐
                        │      Client Layer     │
                        │ React + Vite (SPA)    │
                        │ Tailwind CSS UI       │
                        └──────────┬────────────┘
                                   │ HTTPS / JSON (REST)
                        ┌──────────▼────────────┐
                        │   FastAPI Backend      │
                        │  (Application Layer)   │
                        │  routes → services     │
                        └────┬────────────┬──────┘
                             │            │
              ┌──────────────▼───┐   ┌────▼────────────────┐
              │  Eligibility      │   │   AI Service Layer   │
              │  Engine (rule-    │   │  - Embedding search  │
              │  based, in-       │   │  - RAG orchestration │
              │  process)         │   │  - Gemini API client │
              └──────────┬────────┘   └────┬─────────────────┘
                         │                 │
                ┌────────▼─────────────────▼────────┐
                │        PostgreSQL Database          │
                │  users | schemes | chat_history     │
                │  | documents_status                 │
                └──────────────────────────────────────┘
```

Requests from the frontend always pass through the FastAPI routing layer, which authenticates the request, delegates to the appropriate service (eligibility, chat, scheme CRUD), and returns a normalized JSON response. The Eligibility Engine and AI Service Layer are implemented as independent Python service modules so that the deterministic rule-matching logic (Eligibility Engine) can be unit tested without any network calls, while the AI Service Layer isolates all external API dependency (Gemini) behind a single client abstraction.

## 10. Technology Stack

| Layer | Technology | Notes |
|---|---|---|
| Frontend | React 18 + Vite | SPA build tooling, fast HMR |
| Styling | Tailwind CSS | Utility-first, mobile-responsive |
| Routing | React Router v6 | Client-side route management |
| Backend | FastAPI (Python 3.11+) | Async-capable REST framework |
| ORM | SQLAlchemy 2.x + Alembic | Migrations required from day one |
| Database | PostgreSQL (Neon) | Chosen over MongoDB for relational integrity between users, schemes, and chat history |
| AI Provider | Google Gemini API | Chat generation, simplification, embeddings |
| Embeddings/Similarity | Sentence Transformers or Gemini embeddings | Used for RAG retrieval and semantic search |
| Auth | python-jose (JWT) + passlib (bcrypt) | Stateless token auth |
| Frontend Hosting | Vercel | CI/CD from main branch |
| Backend Hosting | Render | Autoscaling web service |
| Database Hosting | Neon (managed PostgreSQL) | Serverless Postgres with branching |

**Decision note:** PostgreSQL is selected over MongoDB as the primary datastore because the domain has clear relational structure (users ↔ chat_history ↔ schemes) that benefits from foreign-key integrity and JOIN-based queries; scheme-specific semi-structured fields (`eligibility`, `documents`) are stored as native `JSONB` columns, giving schema flexibility without abandoning relational guarantees elsewhere.

## 11. Detailed Module Breakdown

**Auth Module** — handles registration, login, JWT issuance/verification, and password hashing; exposes no business logic beyond identity.
**Profile Module** — owns the `users` table CRUD operations and profile validation rules described in Section 7.
**Scheme Catalog Module** — owns CRUD (read-only at MVP, seeded from `datasets/schemes.json`) over the `schemes` table, and implements keyword search.
**Eligibility Engine Module** — pure-function rule evaluator; takes a user profile object and the full scheme list, returns ranked matches with scores and explanations (Section 17 defines the algorithm).
**AI Service Module** — subdivided into three responsibilities: (a) *Embedding & Retrieval* — generates and stores scheme embeddings, performs top-k similarity search; (b) *RAG Orchestrator* — assembles retrieved context plus user query into a Gemini prompt and parses the response; (c) *Simplifier* — takes raw eligibility/benefit text and a target language, returns simplified text via a dedicated prompt template.
**Chat Module** — exposes the conversational endpoint, persists chat turns, and delegates language understanding to the AI Service Module.
**Document Checklist Module** — derives a per-user, per-scheme checklist from the scheme's `documents` field and tracks completion status.
**Localization Module** — resolves UI strings and passes a `language` parameter through to AI Service calls; maintains a static translation dictionary for non-AI-generated UI text.

## 12. AI Components and Their Responsibilities

The **Eligibility Recommendation Engine** is deterministic, not AI-generated: it accepts the structured profile fields listed in Section 7 as input and evaluates them against each scheme's `eligibility` JSON rule set, producing a boolean match plus a numeric confidence score and a templated explanation string (e.g., "Matched because occupation = Farmer and state = Telangana meet this scheme's criteria"). This determinism is intentional — eligibility outcomes must be reproducible and auditable, so no generative model is used for the match decision itself. The **Natural Language Processing / Chat component** uses the Gemini API to interpret free-text queries, extract implicit profile signals (e.g., inferring occupation = "Farmer" from "I'm a farmer from Telangana"), and generate conversational responses; extracted signals may optionally be offered back to the user to pre-fill their profile, but are never persisted to the profile without explicit user confirmation. The **AI Simplifier** is a narrowly-scoped prompt template whose sole responsibility is rewriting a given block of official scheme text into plain language in the requested locale, without adding facts not present in the source text — the prompt must explicitly instruct the model to simplify wording only, not to introduce new claims. The **RAG pipeline** retrieves the top-k (default k=5) most relevant scheme records via embedding similarity before every chat or eligibility-explanation call, and the assembled prompt must include these retrieved records verbatim in the context window so that Gemini's response is grounded and traceable back to specific scheme IDs, which should be included in the API response for frontend citation.

## 13. Database Design

```
users                          schemes                      chat_history
─────                          ───────                      ────────────
id            UUID PK          id              UUID PK       id          UUID PK
name          VARCHAR          scheme_name     VARCHAR       user_id     UUID FK -> users.id
email         VARCHAR UNIQUE   description     TEXT          question    TEXT
password_hash VARCHAR          eligibility     JSONB         answer      TEXT
age           INTEGER          benefits        TEXT          scheme_refs UUID[] (nullable)
gender        VARCHAR          documents       JSONB         timestamp   TIMESTAMPTZ
income        INTEGER          application_link VARCHAR
occupation    VARCHAR          state           VARCHAR                  document_status
state         VARCHAR          deadline        DATE (nullable)          ────────────────
category      VARCHAR          embedding       VECTOR(768)              id          UUID PK
disability    BOOLEAN          created_at      TIMESTAMPTZ              user_id     UUID FK -> users.id
disability_type VARCHAR (nullable)                                      scheme_id   UUID FK -> schemes.id
language_pref VARCHAR default 'en'                                      document_name VARCHAR
created_at    TIMESTAMPTZ                                               status      ENUM('missing','have')
```

The `eligibility` JSONB column on `schemes` stores a structured rule object such as `{"min_age": 18, "max_age": 60, "occupation": ["Farmer"], "max_income": 250000, "states": ["Telangana", "AP"], "category": ["General","OBC","SC","ST"], "disability_required": false}`; the Eligibility Engine reads this structure directly, so all seeded scheme data must conform to this schema. The `embedding` column stores a vector representation (dimension 768, matching the chosen embedding model) used for pgvector-based similarity search; if pgvector is unavailable in the deployment target, embeddings may instead be stored as JSON arrays with similarity computed in the application layer, but pgvector is the preferred approach for query performance. `chat_history.scheme_refs` records which scheme IDs were retrieved and cited for a given answer, supporting response traceability and future analytics on which schemes are most frequently discussed.

## 14. API Specification

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | No | Creates a user account; body: `{name, email, password}`; returns `{id, email}` |
| POST | `/auth/login` | No | Validates credentials; returns `{access_token, token_type: "bearer"}` |
| GET | `/profile` | Yes | Returns the authenticated user's full profile |
| PUT | `/profile` | Yes | Updates profile fields; validates per Section 7 rules |
| GET | `/schemes` | No | Returns paginated scheme list; supports `?q=` keyword and `?state=` filters |
| GET | `/schemes/{id}` | No | Returns full scheme detail including AI-simplified text (cached) |
| POST | `/recommend` | Yes | Body: none (uses stored profile) or optional profile override; returns ranked matches with scores + explanations |
| POST | `/chat` | Yes | Body: `{message: string}`; returns `{answer: string, scheme_refs: [uuid], language: string}` |
| POST | `/eligibility` | Yes | Body: `{scheme_id}`; returns boolean match + explanation for a single scheme against the caller's profile |
| POST | `/explain` | Yes | Body: `{scheme_id, language}`; returns AI-simplified eligibility/benefits text |
| GET | `/documents/{scheme_id}` | Yes | Returns document checklist with per-user status |
| PUT | `/documents/{scheme_id}` | Yes | Body: `{document_name, status}`; updates checklist item |

**Example — POST `/recommend` response:**
```json
{
  "recommendations": [
    {
      "scheme_id": "b3f1...",
      "scheme_name": "PM Kisan Samman Nidhi",
      "score": 0.92,
      "explanation": "Matched: occupation=Farmer, state=Telangana, income below threshold.",
      "deadline": null
    }
  ]
}
```
All endpoints return errors in a normalized envelope: `{"error": {"code": "VALIDATION_ERROR", "message": "..."}}` with an appropriate HTTP status code, so the frontend can render errors generically without per-endpoint special-casing.

## 15. Authentication and Authorization

Authentication is stateless and JWT-based: on successful login, the backend issues a signed access token (HS256, 24-hour expiry) containing the user's `id` and `email` as claims. Every protected endpoint requires an `Authorization: Bearer <token>` header, validated by a shared FastAPI dependency that decodes and verifies the token, returning HTTP 401 on expiry or invalid signature. There is no separate role-based authorization tier at MVP — all authenticated users have identical permissions over their own resources only; row-level ownership checks (e.g., a user may only read/update their own `chat_history` and `document_status` rows) must be enforced in every service function by filtering on the authenticated `user_id`, not merely by resource ID, to prevent horizontal privilege escalation (e.g., User A reading User B's chat history by guessing a chat record ID). Passwords are never stored or logged in plaintext; bcrypt hashing with a minimum cost factor of 12 is mandatory. Refresh tokens are out of scope for MVP — token expiry simply requires re-login.

## 16. User Workflows

```
[Landing Page]
      │
      ▼
[Register / Login] ──(existing user)──▶ [Home Dashboard]
      │
      ▼ (new user)
[Create Profile: age, gender, income, occupation, state, category, disability]
      │
      ▼
[AI Eligibility Analysis] (POST /recommend, ranked results)
      │
      ▼
[Recommended Schemes List] ──▶ [Scheme Detail View]
      │                              │
      ▼                              ▼
[Ask AI Follow-up Question]   [Document Checklist]
   (POST /chat, grounded            │
    in same scheme context)         ▼
                              [Application Guide / External Link]
```

A returning user who has already created a profile bypasses profile creation and lands directly on the Recommended Schemes list, re-fetched on each session to reflect any dataset updates. The chat interface is globally accessible (not scoped to a single scheme) but automatically includes the currently viewed scheme, if any, as retrieval context so follow-up questions like "what documents do I need for this one?" resolve correctly without the user re-stating the scheme name.

## 17. Business Logic

The Eligibility Engine's matching algorithm evaluates a scheme as eligible only if **all** mandatory criteria in its `eligibility` JSON are satisfied by the user's profile: age within `[min_age, max_age]` inclusive, `income <= max_income` if specified, `occupation` present in the scheme's occupation list (case-insensitive) if specified, `state` present in the scheme's state list or the scheme is marked Central/all-state, `category` present in the allowed category list if specified, and `disability_required` (if true) matched against the user's `disability` boolean. A scheme with any unmet mandatory criterion is excluded entirely (no partial matches are surfaced as recommendations). For included schemes, a **relevance score** between 0 and 1 is computed as a weighted sum: base score 0.6 for meeting all mandatory criteria, +0.1 for each additional "soft" alignment such as income significantly below the threshold (more than 30% margin) or exact state match versus a broader regional match, capped at 1.0. Results are sorted descending by this score, and ties are broken by nearer deadline (schemes with an upcoming deadline rank above open-ended ones). Chat responses must never assert eligibility for a scheme without first invoking the same deterministic Eligibility Engine internally — the AI is permitted to explain and converse, but the underlying yes/no eligibility claim always originates from the rule engine, never from free-form generation, to prevent hallucinated eligibility claims.

## 18. Data Flow

1. Client submits profile data → FastAPI `/profile` validates and persists to `users` table.
2. Client requests `/recommend` → backend loads the user's profile row and the full `schemes` table → Eligibility Engine evaluates each scheme synchronously (in-process, no external calls) → ranked JSON list returned.
3. Client sends a chat message to `/chat` → backend embeds the query text → performs vector similarity search against `schemes.embedding` → top-k scheme records assembled into a prompt with the user's profile as additional context → Gemini API called → response parsed and returned alongside the scheme IDs cited → the full turn (question, answer, scheme_refs, timestamp) is written to `chat_history`.
4. Client requests `/explain` for a specific scheme → backend checks a simplification cache (keyed by `scheme_id + language`) → on cache miss, calls the AI Simplifier prompt against Gemini, stores the result, and returns it — this caching step is required to avoid repeated identical Gemini calls for static, unchanging scheme text.

## 19. Error Handling Strategy

Every service-layer function must raise typed exceptions (e.g., `ValidationError`, `NotFoundError`, `AuthError`, `AIServiceError`) rather than generic exceptions, and a FastAPI exception handler middleware must translate each type to the corresponding HTTP status (400, 404, 401, 502 respectively) and the normalized error envelope described in Section 14. Specific edge cases that must be handled explicitly: (a) Gemini API timeout or non-200 response — the `/chat` and `/explain` endpoints must catch this and return HTTP 502 with `code: "AI_SERVICE_UNAVAILABLE"`, and the frontend must show a retry affordance rather than a blank screen; (b) a profile missing required fields when `/recommend` is called — return HTTP 400 with `code: "INCOMPLETE_PROFILE"` and a list of missing field names so the frontend can redirect to the specific incomplete profile section; (c) a scheme with malformed `eligibility` JSON — the Eligibility Engine must skip that scheme and log a data-integrity warning rather than crash the entire recommendation request; (d) duplicate email on registration — return HTTP 409 with `code: "EMAIL_EXISTS"`; (e) expired or malformed JWT — return HTTP 401 with `code: "TOKEN_INVALID"`, prompting frontend re-authentication. No endpoint may return an unhandled 500 for a foreseeable input condition — 500s are reserved strictly for genuinely unexpected failures.

## 20. Security Considerations

All backend endpoints must enforce input validation via Pydantic models with explicit field constraints (types, ranges, enumerated values) rather than relying on database-level constraints alone. All communication between frontend, backend, and third-party APIs (Gemini) must use HTTPS/TLS. Secrets (database URL, JWT signing key, Gemini API key) must be supplied via environment variables and never committed to source control or logged. Row-level ownership checks described in Section 15 must be applied consistently across `chat_history` and `document_status` queries. Rate limiting should be applied at the reverse-proxy or FastAPI middleware level on `/auth/login` (to mitigate credential brute-forcing) and on `/chat` (to bound Gemini API cost exposure per user). User-supplied free text sent to Gemini must be treated as untrusted input — the RAG prompt template must clearly delimit system instructions from user-supplied content to reduce prompt-injection risk, and the model must be instructed never to reveal internal system prompts or unrelated user data.

## 21. Scalability Strategy

The backend is designed to be stateless at the request level — no session data is held in server memory, allowing the Render web service to be scaled horizontally behind a load balancer without sticky sessions, since all durable state lives in PostgreSQL. Database connection pooling (via SQLAlchemy's pool settings) is required to avoid exhausting Neon's connection limits under concurrent load. The scheme catalog and its embeddings are read-heavy and effectively static between data refreshes, making them strong candidates for an in-memory or CDN-level cache layer (e.g., caching `/schemes` and `/schemes/{id}` responses for a short TTL) to reduce database load as user volume grows. AI Simplifier outputs are cached per `scheme_id + language` (Section 18) specifically to bound Gemini API cost and latency as usage scales, since the underlying scheme text does not change between requests.

## 22. Performance Optimization

To meet the sub-3-second response target for AI-backed endpoints, the vector similarity search must use an indexed approach (pgvector's IVFFlat or HNSW index) rather than a full-table brute-force scan once the scheme catalog exceeds a few hundred records. The Eligibility Engine, being pure in-process computation over a bounded dataset (tens to low hundreds of schemes at MVP), should complete in well under 100ms and requires no caching at this scale, though a future in-memory cache of the full scheme list (refreshed on write) is recommended once the catalog grows into the thousands. Gemini API calls should specify reasonable `max_output_tokens` limits appropriate to each prompt type (short for `/eligibility` explanations, longer for open-ended `/chat`) to reduce both latency and cost. Frontend bundle size should be kept lean via Vite's code-splitting, and scheme list/detail pages should implement pagination (default page size 20) rather than fetching the entire catalog client-side.

## 23. Deployment Architecture

The frontend (React/Vite build output) is deployed to Vercel with continuous deployment triggered from the `main` branch, serving static assets globally via Vercel's CDN. The backend (FastAPI) is deployed to Render as an autoscaling web service, configured with environment variables for `DATABASE_URL`, `JWT_SECRET`, and `GEMINI_API_KEY`, and health-checked via a lightweight `/health` endpoint that Render polls to determine service liveness. The database runs on Neon's managed serverless PostgreSQL, which provides connection pooling and branch-based environments (recommended: separate `dev` and `production` branches to isolate testing from live data). CORS on the FastAPI backend must be explicitly configured to allow only the deployed Vercel frontend origin (plus `localhost` during development), rather than a wildcard, to prevent unauthorized cross-origin API use.

## 24. Folder Structure

```
SchemeSathi-AI/
├── frontend/
│   ├── src/
│   │   ├── pages/            # Route-level views (Home, Login, Profile, Recommendations, SchemeDetail, Chat)
│   │   ├── components/       # Reusable UI components (Card, Navbar, LanguageSwitcher, ChecklistItem)
│   │   ├── hooks/             # Custom hooks (useAuth, useProfile, useChat)
│   │   ├── services/          # API client wrappers (api.js, auth.js)
│   │   ├── locales/            # en.json, hi.json, te.json translation dictionaries
│   │   └── assets/
│   └── vite.config.js
├── backend/
│   ├── app/
│   │   ├── main.py             # FastAPI app instantiation, CORS, middleware registration
│   │   ├── routes/             # auth.py, profile.py, schemes.py, chat.py, eligibility.py
│   │   ├── models/              # SQLAlchemy models: User, Scheme, ChatHistory, DocumentStatus
│   │   ├── schemas/              # Pydantic request/response models
│   │   ├── services/               # eligibility_engine.py, scheme_service.py, document_service.py
│   │   ├── ai/                       # gemini_client.py, rag_pipeline.py, simplifier.py, embeddings.py
│   │   ├── database/                   # session.py, base.py, migrations (Alembic)
│   │   └── utils/                        # security.py (JWT/bcrypt), exceptions.py
│   └── requirements.txt
├── datasets/
│   └── schemes.json            # Seed data conforming to the schemas.eligibility JSON structure (Section 13)
├── docs/
│   ├── SSD.pdf
│   └── SDD.md                  # This document
└── README.md
```

## 25. Future Enhancements

Beyond the MVP scope defined in Section 5, the following are planned as post-launch iterations, in rough priority order: an administrative dashboard allowing non-technical staff to add, edit, and retire scheme records without direct database access (this should be prioritized first, since dataset freshness directly determines recommendation quality); voice input and output for the chat interface to further improve accessibility for low-literacy users; OCR-based document verification allowing users to photograph documents for automated completeness checks against the checklist; a WhatsApp bot integration exposing the same chat and recommendation functionality through a channel already familiar to target users; AI-assisted form auto-filling that pre-populates official application forms from the user's stored profile; SMS notifications for deadline reminders and scheme updates for users without reliable data connectivity; an offline-first mode caching the last-known recommendation set for viewing without network access; and a native mobile application wrapping the same backend API.

## 26. Expected Outcomes

Upon successful implementation, SchemeSathi AI is expected to measurably reduce the time required for a citizen to identify schemes they qualify for, from the current baseline of manual multi-site research (often hours to days) down to a single conversational session (minutes). Explainable, rule-grounded eligibility matching should increase user trust and reduce eligible-citizen self-exclusion caused by ambiguous official language. Multilingual and conversational access is expected to extend usable reach to populations previously excluded by English/Hindi-only portals and complex form-based interfaces. The document-checklist and plain-language explanation features are expected to reduce application rejection or delay rates caused by missing paperwork or misunderstood criteria, and the underlying architecture — a static, curated dataset paired with a deterministic eligibility engine and a strictly grounded RAG layer — is designed to scale in scheme coverage and language support without compromising the factual accuracy that a welfare-benefits product requires.
