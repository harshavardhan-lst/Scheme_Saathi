from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.user import User
from app.schemas.eligibility import (
    EligibilityRequest, EligibilityResponse,
    ExplainRequest, ExplainResponse,
)
from app.services import eligibility_service
from app.utils.dependencies import get_current_user

router = APIRouter(tags=["Eligibility"])


@router.post("/eligibility", response_model=EligibilityResponse)
def check_eligibility(
    body: EligibilityRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    result = eligibility_service.check_single_scheme(db, current_user, body.scheme_id)
    return result


@router.post("/explain", response_model=ExplainResponse)
def explain(
    body: ExplainRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    language = body.language or current_user.language_pref or "en"
    result = eligibility_service.explain_scheme(db, body.scheme_id, language=language)
    return result
