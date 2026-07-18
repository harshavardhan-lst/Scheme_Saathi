from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.auth import RegisterRequest, LoginRequest, TokenResponse, RegisterResponse
from app.services import auth_service

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/register", response_model=RegisterResponse, status_code=201)
def register(body: RegisterRequest, db: Session = Depends(get_db)):
    user = auth_service.register_user(db, name=body.name, email=body.email, password=body.password)
    return {"id": str(user.id), "email": user.email}


@router.post("/login", response_model=TokenResponse)
def login(body: LoginRequest, db: Session = Depends(get_db)):
    token = auth_service.authenticate_user(db, email=body.email, password=body.password)
    return {"access_token": token, "token_type": "bearer"}
