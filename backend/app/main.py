import os
import logging
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv

from app.routes import auth, profile, schemes, recommend, chat, eligibility, documents, health
from app.utils.exceptions import (
    ValidationError, NotFoundError, AuthError, AIServiceError,
    DuplicateError, IncompleteProfileError,
)

load_dotenv()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="SchemeSathi AI",
    description="AI-Powered Government Scheme Eligibility & Application Assistant",
    version="1.0.0",
)

# ── CORS ─────────────────────────────────────────────────────────────────────
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173").rstrip("/")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL, "http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Exception Handlers ────────────────────────────────────────────────────────
@app.exception_handler(ValidationError)
async def validation_error_handler(request: Request, exc: ValidationError):
    body = {"error": {"code": "VALIDATION_ERROR", "message": exc.message}}
    if exc.fields:
        body["error"]["fields"] = exc.fields
    return JSONResponse(status_code=400, content=body)


@app.exception_handler(IncompleteProfileError)
async def incomplete_profile_handler(request: Request, exc: IncompleteProfileError):
    return JSONResponse(
        status_code=400,
        content={"error": {"code": "INCOMPLETE_PROFILE", "message": exc.message, "missing_fields": exc.missing_fields}},
    )


@app.exception_handler(NotFoundError)
async def not_found_handler(request: Request, exc: NotFoundError):
    return JSONResponse(status_code=404, content={"error": {"code": "NOT_FOUND", "message": exc.message}})


@app.exception_handler(AuthError)
async def auth_error_handler(request: Request, exc: AuthError):
    return JSONResponse(status_code=401, content={"error": {"code": "AUTH_ERROR", "message": exc.message}})


@app.exception_handler(AIServiceError)
async def ai_service_error_handler(request: Request, exc: AIServiceError):
    return JSONResponse(status_code=502, content={"error": {"code": "AI_SERVICE_UNAVAILABLE", "message": exc.message}})


@app.exception_handler(DuplicateError)
async def duplicate_error_handler(request: Request, exc: DuplicateError):
    return JSONResponse(status_code=409, content={"error": {"code": exc.code, "message": exc.message}})


# ── Routers ───────────────────────────────────────────────────────────────────
app.include_router(health.router)
app.include_router(auth.router)
app.include_router(profile.router)
app.include_router(schemes.router)
app.include_router(recommend.router)
app.include_router(chat.router)
app.include_router(eligibility.router)
app.include_router(documents.router)


@app.on_event("startup")
async def startup_event():
    logger.info("SchemeSathi AI backend starting up...")
