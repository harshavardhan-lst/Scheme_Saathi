from typing import Optional
from datetime import date
from pydantic import BaseModel


class RecommendationItem(BaseModel):
    scheme_id: str
    scheme_name: str
    score: float
    explanation: str
    deadline: Optional[date]
    state: str
    benefits: str


class RecommendResponse(BaseModel):
    recommendations: list[RecommendationItem]
