from typing import Optional, Any
from datetime import date
from pydantic import BaseModel


class SchemeResponse(BaseModel):
    id: str
    scheme_name: str
    description: str
    benefits: str
    documents: list[str]
    application_link: Optional[str]
    state: str
    deadline: Optional[date]
    eligibility: dict[str, Any]
    simplified_cache: Optional[dict[str, Any]] = None

    class Config:
        from_attributes = True


class SchemeListItem(BaseModel):
    id: str
    scheme_name: str
    description: str
    state: str
    deadline: Optional[date]

    class Config:
        from_attributes = True
