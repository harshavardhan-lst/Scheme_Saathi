from typing import Literal
from pydantic import BaseModel


class ChecklistItem(BaseModel):
    document_name: str
    status: Literal["missing", "have"]


class ChecklistResponse(BaseModel):
    scheme_id: str
    items: list[ChecklistItem]


class UpdateStatusRequest(BaseModel):
    document_name: str
    status: Literal["missing", "have"]
