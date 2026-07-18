# SchemeSathi AI 🇮🇳

> **AI-Powered Government Scheme Eligibility & Application Assistant**

SchemeSathi AI helps Indian citizens discover and apply for government welfare schemes they qualify for — in minutes, in their own language.

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
