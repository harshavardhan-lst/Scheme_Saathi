from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.user import User
from app.schemas.profile import ProfileUpdate, ProfileResponse
from app.services import profile_service
from app.utils.dependencies import get_current_user

router = APIRouter(prefix="/profile", tags=["Profile"])


@router.get("", response_model=ProfileResponse)
def get_profile(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    user = profile_service.get_profile(db, str(current_user.id))
    return {**user.__dict__, "id": str(user.id)}


@router.put("", response_model=ProfileResponse)
def update_profile(
    body: ProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    updates = body.model_dump(exclude_none=True)
    user = profile_service.update_profile(db, str(current_user.id), updates)
    return {**user.__dict__, "id": str(user.id)}
