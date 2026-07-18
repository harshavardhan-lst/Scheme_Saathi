from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.user import User
from app.schemas.chat import ChatRequest, ChatResponse
from app.services import chat_service
from app.utils.dependencies import get_current_user

router = APIRouter(prefix="/chat", tags=["Chat"])


@router.post("", response_model=ChatResponse)
def chat(
    body: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    answer, scheme_refs = chat_service.handle_chat(db, current_user, body.message)
    return ChatResponse(
        answer=answer,
        scheme_refs=[str(sid) for sid in scheme_refs],
        language=current_user.language_pref or "en",
    )
