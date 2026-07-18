from typing import Optional, Literal
from pydantic import BaseModel, field_validator

GENDERS = ["Male", "Female", "Other", "Prefer not to say"]
CATEGORIES = ["General", "OBC", "SC", "ST", "EWS"]
LANGUAGES = ["en", "hi", "te"]

INDIAN_STATES = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
    "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi",
    "Jammu and Kashmir", "Ladakh", "Puducherry", "Chandigarh", "Other"
]


class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    income: Optional[int] = None
    occupation: Optional[str] = None
    state: Optional[str] = None
    category: Optional[str] = None
    disability: Optional[bool] = None
    disability_type: Optional[str] = None
    language_pref: Optional[str] = None

    @field_validator("age")
    @classmethod
    def validate_age(cls, v):
        if v is not None and not (0 <= v <= 120):
            raise ValueError("Age must be between 0 and 120")
        return v

    @field_validator("income")
    @classmethod
    def validate_income(cls, v):
        if v is not None and v < 0:
            raise ValueError("Income must be non-negative")
        return v

    @field_validator("gender")
    @classmethod
    def validate_gender(cls, v):
        if v is not None and v not in GENDERS:
            raise ValueError(f"Gender must be one of {GENDERS}")
        return v

    @field_validator("category")
    @classmethod
    def validate_category(cls, v):
        if v is not None and v not in CATEGORIES:
            raise ValueError(f"Category must be one of {CATEGORIES}")
        return v

    @field_validator("state")
    @classmethod
    def validate_state(cls, v):
        if v is not None and v not in INDIAN_STATES:
            raise ValueError(f"State not recognized")
        return v

    @field_validator("language_pref")
    @classmethod
    def validate_language(cls, v):
        if v is not None and v not in LANGUAGES:
            raise ValueError(f"Language must be one of {LANGUAGES}")
        return v


class ProfileResponse(BaseModel):
    id: str
    name: str
    email: str
    age: Optional[int]
    gender: Optional[str]
    income: Optional[int]
    occupation: Optional[str]
    state: Optional[str]
    category: Optional[str]
    disability: Optional[bool]
    disability_type: Optional[str]
    language_pref: str

    class Config:
        from_attributes = True
