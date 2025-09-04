# /DaSpCoRate/backend/api/app/api/v1/endpoints/auth.py

from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm # Für den Login-Formular-Standard
from sqlalchemy.orm import Session

from app.core import security
from app.core.config import settings
from app.core.database import get_db
from app.crud import trainer as crud_trainer # Importiert unsere CRUD-Operationen für Trainer
from app.crud import couple as crud_couple
from app.schemas import trainer as schemas_trainer
from app.schemas import couple as schemas_couple
from app.schemas.token import Token # Wir brauchen noch ein Token-Schema!

router = APIRouter()

# Endpunkt für die Registrierung eines neuen Trainers
@router.post("/register/trainer", response_model=schemas_trainer.TrainerInDB, status_code=status.HTTP_201_CREATED)
def register_trainer(
    trainer_in: schemas_trainer.TrainerCreate,
    db: Session = Depends(get_db)
):
    db_trainer = crud_trainer.get_trainer_by_email(db, email=trainer_in.email)
    if db_trainer:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    hashed_password = security.get_password_hash(trainer_in.password)
    trainer = crud_trainer.create_trainer(db=db, trainer=trainer_in, password_hash=hashed_password)
    return trainer

# Endpunkt für die Registrierung eines neuen Paares
@router.post("/register/couple", response_model=schemas_couple.CoupleInDB, status_code=status.HTTP_201_CREATED)
def register_couple(
    couple_in: schemas_couple.CoupleCreate,
    db: Session = Depends(get_db)
):
    db_couple = crud_couple.get_couple_by_email(db, email=couple_in.email)
    if db_couple:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered for a couple."
        )
    hashed_password = security.get_password_hash(couple_in.password)
    couple = crud_couple.create_couple(db=db, couple=couple_in, password_hash=hashed_password)
    return couple

# Endpunkt für den Login und die Erstellung eines Access Tokens
@router.post("/token", response_model=Token)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = None
    user_role = None

    # Zuerst versuchen, als Trainer zu authentifizieren
    trainer = crud_trainer.get_trainer_by_email(db, email=form_data.username)
    if trainer and security.verify_password(form_data.password, trainer.password_hash):
        user = trainer
        user_role = "trainer"
    
    # Wenn kein Trainer gefunden oder Passwort falsch, versuche als Paar zu authentifizieren
    if user is None:
        couple = crud_couple.get_couple_by_email(db, email=form_data.username)
        if couple and security.verify_password(form_data.password, couple.password_hash):
            user = couple
            user_role = "couple"

    if user is None: # Immer noch kein Benutzer gefunden oder Passwort falsch
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Token generieren
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(
        # Wichtig: Der 'sub' Claim sollte einen eindeutigen Identifier enthalten, hier die E-Mail
        # Die 'role' ist jetzt dynamisch und wird mit im Token gespeichert
        data={"sub": user.email, "role": user_role},
        expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

# Endpunkt für den Login und die Erstellung eines Access Tokens
@router.post("/token", response_model=Token)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(), # Standard-Formular für User/Passwort
    db: Session = Depends(get_db)
):
    # Versuche, den Benutzer als Trainer zu finden und zu authentifizieren
    user = crud_trainer.get_trainer_by_email(db, email=form_data.username)
    if not user or not security.verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Token generieren
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(
        data={"sub": user.email, "role": "trainer"}, # 'sub' ist Standard für den User-Identifier
        expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}