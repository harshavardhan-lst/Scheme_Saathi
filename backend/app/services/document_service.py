from sqlalchemy.orm import Session
from app.models.document_status import DocumentStatus, DocumentStatusEnum
from app.models.scheme import Scheme
from app.utils.exceptions import NotFoundError


def get_checklist(db: Session, user_id: str, scheme_id: str) -> list[dict]:
    """
    Return the document checklist for a scheme with per-user status.
    Initializes missing entries as 'missing' on first access.
    """
    scheme = db.query(Scheme).filter(Scheme.id == scheme_id).first()
    if not scheme:
        raise NotFoundError(f"Scheme {scheme_id} not found")

    documents = scheme.documents or []

    # Fetch existing statuses
    existing = {
        row.document_name: row.status.value
        for row in db.query(DocumentStatus)
        .filter(DocumentStatus.user_id == user_id, DocumentStatus.scheme_id == scheme_id)
        .all()
    }

    # Initialize missing entries
    for doc_name in documents:
        if doc_name not in existing:
            entry = DocumentStatus(
                user_id=user_id,
                scheme_id=scheme_id,
                document_name=doc_name,
                status=DocumentStatusEnum.missing,
            )
            db.add(entry)
            existing[doc_name] = "missing"

    db.commit()

    return [{"document_name": doc, "status": existing.get(doc, "missing")} for doc in documents]


def update_checklist_item(db: Session, user_id: str, scheme_id: str,
                           document_name: str, status: str) -> dict:
    """Update or create a single document status entry."""
    row = (
        db.query(DocumentStatus)
        .filter(
            DocumentStatus.user_id == user_id,
            DocumentStatus.scheme_id == scheme_id,
            DocumentStatus.document_name == document_name,
        )
        .first()
    )
    if not row:
        row = DocumentStatus(
            user_id=user_id,
            scheme_id=scheme_id,
            document_name=document_name,
            status=DocumentStatusEnum(status),
        )
        db.add(row)
    else:
        row.status = DocumentStatusEnum(status)
    db.commit()
    return {"document_name": document_name, "status": status}
