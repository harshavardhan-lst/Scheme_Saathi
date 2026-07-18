# Import all models here so Alembic autogenerate can detect them
from app.models.base import Base  # noqa: F401
from app.models.user import User  # noqa: F401
from app.models.scheme import Scheme  # noqa: F401
from app.models.chat_history import ChatHistory  # noqa: F401
from app.models.document_status import DocumentStatus  # noqa: F401
