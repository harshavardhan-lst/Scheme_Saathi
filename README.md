# SchemeSathi AI 🇮🇳

> **AI-Powered Government Scheme Eligibility & Application Assistant**

SchemeSathi AI helps Indian citizens discover and apply for government welfare schemes they qualify for — in minutes, in their own language.

---

## 📌 Submission Overview

### 1. Problem Statement
* **The Challenge:** Welfare scheme access in India suffers from three structural bottlenecks: Fragmented discoverability (hundreds of schemes spread across disconnected portals), hard-to-parse comprehensibility (dense bureaucratic jargon and legal language leading to self-exclusion), and digital/language barriers (portals are mostly English/Hindi-only, excluding regional populations).
* **Who is Affected:** Underprivileged and marginalized citizens across India (rural farmers, low-income families, women entrepreneurs, students, senior citizens, and persons with disabilities) who are legally entitled to benefits but do not receive them due to informational barriers.
* **Why Solving It Matters:** Millions of rupees allocated to social security and welfare budgets go underutilized, failing to reach those in dire need. Correcting this informational barrier can directly lift families out of poverty and support rural development.

### 2. Solution Description
* **How It Works:**
  * **User Profiling:** Users complete a simple demographic/socioeconomic profile (age, gender, state, occupation, income, category, disability status).
  * **Deterministic Eligibility Engine:** Evaluates user profile parameters against a target catalog of schemes, instantly returning ranked matches with clear explanations of *why* they qualify.
  * **AI Chat Assistant (Grounded RAG):** An interactive chat interface allows users to ask questions in plain natural language (supporting English, Hindi, and Telugu). It uses vector search (`pgvector`) to retrieve relevant schemes and feeds them to the Google Gemini API to generate grounded, conversational answers.
  * **Plain-Language Simplifier:** Summarizes complex bureaucratic text into a simple Class-7-level reading format.
  * **Document Checklist & Tracker:** Persistently tracks required paperwork (e.g., Aadhaar, income certificate) as "have" or "missing" for each matched scheme.
* **Key Features:** Smart Eligibility Engine, Grounded RAG Chat Assistant, Multilingual Support (English, Hindi, Telugu), AI Plain-Language Simplifier, and Interactive Document Guidance.
* **How AI is Used:** Powered by the Google Gemini API for natural language processing, chat generation, text simplification, and translation, coupled with vector embeddings stored in PostgreSQL (`pgvector`) for context-grounded retrieval.
* **Why It is Effective:** It uses a hybrid approach where critical eligibility decisions are computed deterministically (no AI hallucinations), while AI is leveraged for fluid conversational interface and text simplification.

### 3. Tech Stack & AI Models
* **Frontend:** React 18 + Vite + Tailwind CSS + React Router v6
* **Backend:** FastAPI (Python 3.11+) + Uvicorn
* **Database:** PostgreSQL (Neon Serverless Postgres) + `pgvector` for vector embeddings
* **AI API / Models:** Google Gemini API (chat, embeddings, simplification)
* **Authentication:** JWT (python-jose) + bcrypt (passlib)
* **Deployment:** Vercel (Frontend) + Render (Backend)

### 4. Project Links
* **GitHub Repository:** [https://github.com/harshavardhan-lst/Scheme_Saathi](https://github.com/harshavardhan-lst/Scheme_Saathi)
* **Live Deployment:** [https://scheme-saathi.vercel.app](https://scheme-saathi.vercel.app) *(Note: Please replace with your exact live Vercel URL if different)*

---


## Features

- 🔍 **Smart Eligibility Matching** — Deterministic rule engine evaluates your profile against 50–150 Central & State schemes
- 🤖 **AI Chat Assistant** — Ask in plain language ("I'm a farmer from Telangana") and get grounded, cited answers via Gemini + RAG
- 🌐 **Multilingual** — English, Hindi, and Telugu support for both UI and AI responses
- 📋 **Document Checklists** — Know exactly what papers you need, and track what you have
- 🔒 **Secure & Private** — JWT auth, bcrypt passwords, row-level data isolation

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + Tailwind CSS |
| Backend | FastAPI (Python 3.11+) |
| Database | PostgreSQL via Neon (pgvector for embeddings) |
| AI | Google Gemini API (chat, embeddings, simplification) |
| Auth | JWT (python-jose) + bcrypt (passlib) |
| Deploy | Vercel (frontend) + Render (backend) |

---

## Project Structure

```
SchemeSathi-AI/
├── frontend/        # React 18 + Vite SPA
├── backend/         # FastAPI REST API + AI service layer
├── datasets/        # schemes.json seed data
└── docs/            # SDD and design documents
```

---

## Quick Start

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Copy and configure environment
cp .env.example .env

# Run database migrations
alembic upgrade head

# Seed scheme data
python -m app.utils.seed

# Start server
uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm install

# Copy and configure environment
cp .env.example .env

npm run dev
```

---

## Environment Variables

### Backend (`.env`)
```
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
GEMINI_API_KEY=your-gemini-api-key
```

### Frontend (`.env`)
```
VITE_API_BASE_URL=http://localhost:8000
```

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | No | Create account |
| POST | `/auth/login` | No | Get JWT token |
| GET/PUT | `/profile` | Yes | User profile |
| GET | `/schemes` | No | Browse schemes |
| GET | `/schemes/{id}` | No | Scheme detail |
| POST | `/recommend` | Yes | Get ranked matches |
| POST | `/chat` | Yes | AI chat |
| POST | `/eligibility` | Yes | Check one scheme |
| POST | `/explain` | Yes | AI simplification |
| GET/PUT | `/documents/{scheme_id}` | Yes | Document checklist |

---

## License

MIT
