from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.user import User
from app.schemas.document import ChecklistResponse, UpdateStatusRequest
from app.services import document_service
from app.utils.dependencies import get_current_user

router = APIRouter(prefix="/documents", tags=["Documents"])


@router.get("/{scheme_id}", response_model=ChecklistResponse)
def get_checklist(
    scheme_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    items = document_service.get_checklist(db, str(current_user.id), scheme_id)
    return ChecklistResponse(scheme_id=scheme_id, items=items)


@router.put("/{scheme_id}")
def update_checklist_item(
    scheme_id: str,
    body: UpdateStatusRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    result = document_service.update_checklist_item(
        db, str(current_user.id), scheme_id, body.document_name, body.status
    )
    return result
