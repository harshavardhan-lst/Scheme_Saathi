import uuid
import enum
from sqlalchemy import Column, String, DateTime, ForeignKey, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from app.models.base import Base


class DocumentStatusEnum(str, enum.Enum):
    missing = "missing"
    have = "have"


class DocumentStatus(Base):
    __tablename__ = "document_status"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    scheme_id = Column(UUID(as_uuid=True), ForeignKey("schemes.id", ondelete="CASCADE"), nullable=False)
    document_name = Column(String(500), nullable=False)
    status = Column(Enum(DocumentStatusEnum), nullable=False, default=DocumentStatusEnum.missing)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
