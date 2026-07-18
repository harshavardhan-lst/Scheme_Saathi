import logging
from sqlalchemy.orm import Session
from app.models.scheme import Scheme
from app.utils.exceptions import NotFoundError

logger = logging.getLogger(__name__)


def list_schemes(db: Session, q: str | None = None, state: str | None = None,
                 page: int = 1, page_size: int = 20) -> tuple[list[Scheme], int]:
    """Return paginated scheme list with optional keyword and state filters."""
    query = db.query(Scheme)
    if q:
        query = query.filter(
            Scheme.scheme_name.ilike(f"%{q}%") | Scheme.description.ilike(f"%{q}%")
        )
    if state:
        query = query.filter((Scheme.state == state) | (Scheme.state == "Central"))

    total = query.count()
    schemes = query.offset((page - 1) * page_size).limit(page_size).all()
    return schemes, total


def get_scheme(db: Session, scheme_id: str) -> Scheme:
    scheme = db.query(Scheme).filter(Scheme.id == scheme_id).first()
    if not scheme:
        raise NotFoundError(f"Scheme {scheme_id} not found")
    return scheme


def get_all_schemes(db: Session) -> list[Scheme]:
    """Load all schemes — used by the eligibility engine."""
    return db.query(Scheme).all()
