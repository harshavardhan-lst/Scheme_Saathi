import uuid
from sqlalchemy import Column, Text, DateTime, ForeignKey, ARRAY
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from app.models.base import Base


class ChatHistory(Base):
    __tablename__ = "chat_history"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    question = Column(Text, nullable=False)
    answer = Column(Text, nullable=False)
    # UUIDs of scheme records retrieved and cited in the answer
    scheme_refs = Column(ARRAY(UUID(as_uuid=True)), nullable=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
