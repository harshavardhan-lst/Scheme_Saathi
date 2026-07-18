import logging
from sqlalchemy.orm import Session
from app.models.user import User
from app.models.scheme import Scheme
from app.services.scheme_service import get_scheme
from app.ai.eligibility_engine import evaluate_scheme
from app.ai.simplifier import simplify_text
from app.utils.exceptions import NotFoundError

logger = logging.getLogger(__name__)


def check_single_scheme(db: Session, user: User, scheme_id: str) -> dict:
    """
    Check eligibility for a single scheme using the deterministic engine.
    The AI never makes the yes/no eligibility claim — only the rule engine does.
    """
    scheme = get_scheme(db, scheme_id)
    profile = {
        "age": user.age,
        "gender": user.gender,
        "income": user.income,
        "occupation": user.occupation,
        "state": user.state,
        "category": user.category,
        "disability": user.disability or False,
    }
    result = evaluate_scheme(
        profile=profile,
        scheme_id=str(scheme.id),
        scheme_name=scheme.scheme_name,
        eligibility=scheme.eligibility or {},
        deadline=scheme.deadline,
        state=scheme.state,
        benefits=scheme.benefits,
    )
    if result:
        return {"scheme_id": scheme_id, "eligible": True, "explanation": result.explanation}
    else:
        return {"scheme_id": scheme_id, "eligible": False, "explanation": "One or more eligibility criteria not met for your profile."}


def explain_scheme(db: Session, scheme_id: str, language: str = "en") -> dict:
    """
    Return AI-simplified eligibility and benefits text.
    Caches result per scheme_id + language to avoid repeated Gemini calls.
    """
    scheme = get_scheme(db, scheme_id)
    cache_key = f"simplified_{language}"
    existing_cache = scheme.simplified_cache or {}

    if cache_key not in existing_cache:
        import json
        eligibility_text = json.dumps(scheme.eligibility, indent=2)
        combined_text = f"ELIGIBILITY CRITERIA:\n{eligibility_text}\n\nBENEFITS:\n{scheme.benefits}"
        simplified = simplify_text(combined_text, language=language)
        # Store in cache
        existing_cache[cache_key] = simplified
        scheme.simplified_cache = existing_cache
        db.commit()
        logger.info(f"Cached simplification for scheme {scheme_id} in '{language}'")
    else:
        simplified = existing_cache[cache_key]

    return {
        "scheme_id": scheme_id,
        "language": language,
        "simplified_eligibility": simplified,
        "simplified_benefits": scheme.benefits,
    }
