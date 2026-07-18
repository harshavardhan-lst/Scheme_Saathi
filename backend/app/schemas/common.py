from typing import Any, Optional
from pydantic import BaseModel


class ErrorDetail(BaseModel):
    code: str
    message: str


class ErrorEnvelope(BaseModel):
    error: ErrorDetail


class PaginatedMeta(BaseModel):
    total: int
    page: int
    page_size: int
    total_pages: int


class PaginatedResponse(BaseModel):
    data: list[Any]
    meta: PaginatedMeta
