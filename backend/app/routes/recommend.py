from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.user import User
from app.schemas.recommend import RecommendResponse, RecommendationItem
from app.services import recommend_service
from app.utils.dependencies import get_current_user

router = APIRouter(prefix="/recommend", tags=["Recommend"])


@router.post("", response_model=RecommendResponse)
def recommend(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    results = recommend_service.get_recommendations(db, current_user)
    recommendations = [
        RecommendationItem(
            scheme_id=r.scheme_id,
            scheme_name=r.scheme_name,
            score=r.score,
            explanation=r.explanation,
            deadline=r.deadline,
            state=r.state,
            benefits=r.benefits,
        )
        for r in results
    ]
    return RecommendResponse(recommendations=recommendations)
