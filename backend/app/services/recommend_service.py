from sqlalchemy.orm import Session
from app.models.user import User
from app.services.scheme_service import get_all_schemes
from app.ai.eligibility_engine import evaluate, EligibilityResult
from app.utils.exceptions import IncompleteProfileError

REQUIRED_PROFILE_FIELDS = ["age", "gender", "income", "occupation", "state", "category"]


def get_recommendations(db: Session, user: User) -> list[EligibilityResult]:
    """
    Load all schemes, run the deterministic eligibility engine, return ranked results.
    Raises IncompleteProfileError if mandatory profile fields are missing.
    """
    missing = [f for f in REQUIRED_PROFILE_FIELDS if getattr(user, f) is None]
    if missing:
        raise IncompleteProfileError(missing_fields=missing)

    profile = {
        "age": user.age,
        "gender": user.gender,
        "income": user.income,
        "occupation": user.occupation,
        "state": user.state,
        "category": user.category,
        "disability": user.disability or False,
    }

    schemes = get_all_schemes(db)
    return evaluate(profile, schemes)
