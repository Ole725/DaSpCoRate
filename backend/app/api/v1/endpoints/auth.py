# /DaSpCoRate/backend/app/api/v1/endpoints/auth.py

from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.core import security
from app.core.config import settings
# Korrekter Import für die DB-Dependency
from app.dependencies.dependencies import get_db 
from app.crud import trainer as crud_trainer
from app.crud import couple as crud_couple
from app.schemas import trainer as schemas_trainer
from app.schemas import couple as schemas_couple
from app.schemas.token import Token
from app import crud

router = APIRouter()

@router.post("/register/trainer", response_model=schemas_trainer.TrainerInDB, status_code=status.HTTP_201_CREATED)
def register_trainer(
    trainer_in: schemas_trainer.TrainerCreate,
    db: Session = Depends(get_db)
):
    # KORREKTUR: Verwende den Alias 'get_by_email'
    db_trainer = crud_trainer.get_by_email(db, email=trainer_in.email)
    if db_trainer:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    hashed_password = security.get_password_hash(trainer_in.password)
    # KORREKTUR: Verwende den Alias 'create'
    trainer = crud_trainer.create(db=db, trainer=trainer_in, password_hash=hashed_password)
    return trainer

@router.post("/register/couple", response_model=schemas_couple.CoupleInDB, status_code=status.HTTP_201_CREATED)
def register_couple(
    couple_in: schemas_couple.CoupleCreate,
    db: Session = Depends(get_db)
):
    # KORREKTUR: Verwende den Alias 'get_by_email'
    db_couple = crud_couple.get_by_email(db, email=couple_in.email)
    if db_couple:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered for a couple."
        )
    hashed_password = security.get_password_hash(couple_in.password)
    # KORREKTUR: Verwende den Alias 'create'
    couple = crud_couple.create(db=db, couple=couple_in, password_hash=hashed_password)
    return couple

@router.post("/token", response_model=Token)
def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    print("\n--- AUTH-ENPUNKT: Login-Versuch gestartet ---")
    print(f"    Username vom Formular: '{form_data.username}'")

    user = crud.user.authenticate(
        db, email=form_data.username, password=form_data.password
    )

    if not user:
        print("    ERGEBNIS: Authentifizierung fehlgeschlagen (User/Passwort falsch).")
        print("-------------------------------------------\n")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user_role = "trainer" if hasattr(user, 'last_name') else "couple"
    print(f"    ERGEBNIS: Authentifizierung erfolgreich. Rolle: {user_role}")

    token_payload = {"sub": user.email, "role": user_role}
    
    if user_role == 'couple':
        token_payload['mrs_first_name'] = user.mrs_first_name
        token_payload['mr_first_name'] = user.mr_first_name

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(
        data=token_payload,
        expires_delta=access_token_expires
    )
    print("    Token erfolgreich erstellt.")
    print("-------------------------------------------\n")

    return {"access_token": access_token, "token_type": "bearer"}