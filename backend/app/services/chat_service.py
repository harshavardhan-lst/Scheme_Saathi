import logging
from sqlalchemy.orm import Session
from app.models.user import User
from app.models.chat_history import ChatHistory
from app.ai.rag_pipeline import run_rag

logger = logging.getLogger(__name__)


def handle_chat(db: Session, user: User, message: str) -> tuple[str, list[str]]:
    """
    Orchestrate a chat turn: run RAG, persist the exchange, return answer + scheme refs.
    """
    answer, scheme_refs = run_rag(db, user, message)

    # Persist chat turn
    chat_entry = ChatHistory(
        user_id=user.id,
        question=message,
        answer=answer,
        scheme_refs=[str(sid) for sid in scheme_refs] if scheme_refs else None,
    )
    db.add(chat_entry)
    db.commit()
    logger.info(f"Chat turn saved for user {user.id}")

    return answer, scheme_refs


def get_chat_history(db: Session, user_id: str) -> list[ChatHistory]:
    """Return all chat turns for a user, ordered by timestamp."""
    return (
        db.query(ChatHistory)
        .filter(ChatHistory.user_id == user_id)
        .order_by(ChatHistory.timestamp.asc())
        .all()
    )
