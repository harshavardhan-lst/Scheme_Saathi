from pydantic import BaseModel


class EligibilityRequest(BaseModel):
    scheme_id: str


class EligibilityResponse(BaseModel):
    scheme_id: str
    eligible: bool
    explanation: str


class ExplainRequest(BaseModel):
    scheme_id: str
    language: str = "en"


class ExplainResponse(BaseModel):
    scheme_id: str
    language: str
    simplified_eligibility: str
    simplified_benefits: str
