import uuid
from sqlalchemy import Column, String, Integer, Boolean, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from app.models.base import Base


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False, unique=True, index=True)
    password_hash = Column(String(255), nullable=False)
    age = Column(Integer, nullable=True)
    gender = Column(String(50), nullable=True)
    income = Column(Integer, nullable=True)
    occupation = Column(String(100), nullable=True)
    state = Column(String(100), nullable=True)
    category = Column(String(50), nullable=True)
    disability = Column(Boolean, nullable=True, default=False)
    disability_type = Column(String(200), nullable=True)
    language_pref = Column(String(10), nullable=False, default="en")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
