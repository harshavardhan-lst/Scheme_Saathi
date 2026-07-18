from sqlalchemy.orm import Session
from app.models.user import User
from app.utils.exceptions import NotFoundError


def get_profile(db: Session, user_id: str) -> User:
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise NotFoundError("User not found")
    return user


def update_profile(db: Session, user_id: str, updates: dict) -> User:
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise NotFoundError("User not found")

    for field, value in updates.items():
        if value is not None:
            setattr(user, field, value)

    db.commit()
    db.refresh(user)
    return user
