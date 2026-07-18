import uuid
from sqlalchemy import Column, String, Text, Date, DateTime
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
from app.models.base import Base

# pgvector support — gracefully degrade if extension not available
try:
    from pgvector.sqlalchemy import Vector
    VECTOR_AVAILABLE = True
except ImportError:
    VECTOR_AVAILABLE = False


class Scheme(Base):
    __tablename__ = "schemes"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    scheme_name = Column(String(500), nullable=False, index=True)
    description = Column(Text, nullable=False)
    benefits = Column(Text, nullable=False)
    documents = Column(JSONB, nullable=False, default=list)
    application_link = Column(String(1000), nullable=True)
    state = Column(String(100), nullable=False, default="Central")
    deadline = Column(Date, nullable=True)
    eligibility = Column(JSONB, nullable=False, default=dict)

    # AI-simplified text cache (keyed per language inside JSON)
    simplified_cache = Column(JSONB, nullable=True, default=dict)

    # pgvector embedding (768-dim); stored as JSONB array if pgvector unavailable
    embedding = Column(Vector(768) if VECTOR_AVAILABLE else JSONB, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
