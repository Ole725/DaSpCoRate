# /DaSpCoRate/backend/app/api/v1/endpoints/auth.py

from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app import crud
from app.core import security
from app.core.config import settings
from app.dependencies.dependencies import get_db, get_current_admin
from app.models.admin import Admin
from app.models.trainer import Trainer
from app.models.couple import Couple
from app.schemas import token as schemas_token
from app.schemas import trainer as schemas_trainer
from app.schemas import admin as schemas_admin
from app.crud import admin as crud_admin
from app.crud import trainer as crud_trainer

router = APIRouter()

@router.post("/token", response_model=schemas_token.Token, tags=["Auth"])
def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)
):
    user = crud.user.authenticate(db, email=form_data.username, password=form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user_role = user.role

    token_payload = {"sub": user.email, "role": user_role}
    access_token = security.create_access_token(data=token_payload)
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/register/trainer", response_model=schemas_trainer.TrainerInDB, status_code=status.HTTP_201_CREATED, tags=["Admins"])
def create_trainer_by_admin(
    trainer_in: schemas_trainer.TrainerCreate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    db_trainer = crud_trainer.get_by_email(db, email=trainer_in.email)
    if db_trainer:
        raise HTTPException(status_code=400, detail="Ein Trainer mit dieser E-Mail existiert bereits.")
    return crud_trainer.create(db=db, trainer=trainer_in)

@router.post("/register-initial-admin", response_model=schemas_admin.Admin, tags=["Auth"])
def register_initial_admin(admin_in: schemas_admin.AdminCreate, db: Session = Depends(get_db)):
    if db.query(Admin).first():
        raise HTTPException(status_code=403, detail="Ein Admin-Account existiert bereits.")
    return crud_admin.create_admin(db=db, admin=admin_in)