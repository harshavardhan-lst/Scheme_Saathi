import logging
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.models.user import User
from app.utils.security import hash_password, verify_password, create_access_token
from app.utils.exceptions import AuthError, DuplicateError

logger = logging.getLogger(__name__)


def register_user(db: Session, name: str, email: str, password: str) -> User:
    """
    Create a new user account.
    Raises DuplicateError if the email is already registered.
    """
    existing = db.query(User).filter(User.email == email.lower()).first()
    if existing:
        raise DuplicateError("Email already registered", code="EMAIL_EXISTS")

    user = User(
        name=name,
        email=email.lower(),
        password_hash=hash_password(password),
    )
    db.add(user)
    try:
        db.commit()
        db.refresh(user)
    except IntegrityError:
        db.rollback()
        raise DuplicateError("Email already registered", code="EMAIL_EXISTS")

    logger.info(f"Registered new user: {email}")
    return user


def authenticate_user(db: Session, email: str, password: str) -> str:
    """
    Validate credentials and return a signed JWT.
    Raises AuthError on invalid email or password.
    """
    user = db.query(User).filter(User.email == email.lower()).first()
    if not user or not verify_password(password, user.password_hash):
        raise AuthError("Invalid email or password")

    token = create_access_token(str(user.id), user.email)
    logger.info(f"User authenticated: {email}")
    return token
