import math
from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.scheme import SchemeResponse, SchemeListItem
from app.schemas.common import PaginatedResponse, PaginatedMeta
from app.services import scheme_service

router = APIRouter(prefix="/schemes", tags=["Schemes"])


@router.get("", response_model=PaginatedResponse)
def list_schemes(
    q: Optional[str] = Query(None, description="Keyword search"),
    state: Optional[str] = Query(None, description="Filter by state"),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    schemes, total = scheme_service.list_schemes(db, q=q, state=state, page=page, page_size=page_size)
    items = [
        {
            "id": str(s.id),
            "scheme_name": s.scheme_name,
            "description": s.description,
            "state": s.state,
            "deadline": s.deadline,
        }
        for s in schemes
    ]
    return {
        "data": items,
        "meta": {
            "total": total,
            "page": page,
            "page_size": page_size,
            "total_pages": math.ceil(total / page_size),
        },
    }


@router.get("/{scheme_id}", response_model=SchemeResponse)
def get_scheme(scheme_id: str, db: Session = Depends(get_db)):
    scheme = scheme_service.get_scheme(db, scheme_id)
    return {
        **scheme.__dict__,
        "id": str(scheme.id),
        "documents": scheme.documents if isinstance(scheme.documents, list) else [],
    }
