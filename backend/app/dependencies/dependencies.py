# /DaSpCoRate/backend/app/dependencies/dependencies.py

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from jose import JWTError
from typing import Union

from app.core import security
from app.core.database import get_db
from app.crud import trainer as crud_trainer, couple as crud_couple, admin as crud_admin
from app.models.trainer import Trainer
from app.models.couple import Couple
from app.models.admin import Admin
from app.schemas.token import TokenData
from app.crud import user as crud_user
from app.core.database import SessionLocal, engine
from app.core import security
from app import models, schemas

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/token")

def get_token_data(token: str = Depends(oauth2_scheme)) -> TokenData:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = security.decode_access_token(token)
        email = payload.get("sub")
        role = payload.get("role")
        if not email or not role:
            raise credentials_exception
        return TokenData(email=email, role=role)
    except JWTError:
        raise credentials_exception

# --- DIE ZENTRALE "GEHIRN"-FUNKTION ---
def get_current_user(
    db: Session = Depends(get_db),
    token_data: TokenData = Depends(get_token_data)
) -> Union[Trainer, Couple, Admin]:
    """Holt den korrekten Benutzer aus der DB basierend auf der Rolle im Token."""
    user = None
    if token_data.role == "trainer":
        user = crud_trainer.get_by_email(db=db, email=token_data.email)
    elif token_data.role == "couple":
        user = crud_couple.get_by_email(db=db, email=token_data.email)
    elif token_data.role == "admin":
        user = crud_admin.get_admin_by_email(db=db, email=token_data.email)

    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found.")
    return user

# --- SPEZIFISCHE WÄCHTER-FUNKTIONEN, DIE AUF get_current_user AUFBAUEN ---
def get_current_trainer(current_user: Union[Trainer, Couple, Admin] = Depends(get_current_user)) -> Trainer:
    if not isinstance(current_user, Trainer):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not a trainer.")
    return current_user

def get_current_couple(current_user: Union[Trainer, Couple, Admin] = Depends(get_current_user)) -> Couple:
    if not isinstance(current_user, Couple):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not a couple.")
    return current_user

def get_current_admin(current_user: Union[Trainer, Couple, Admin] = Depends(get_current_user)) -> Admin:
    if not isinstance(current_user, Admin):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not an admin.")
    return current_user

def get_current_trainer_or_admin(
    current_user: Union[Trainer, Couple, Admin] = Depends(get_current_user)
) -> Union[Trainer, Admin]:
    """
    Dependency to get the current user and check if they are a Trainer or an Admin.
    Allows access for both roles.
    """
    if not (isinstance(current_user, Trainer) or isinstance(current_user, Admin)):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="The user doesn't have enough privileges (requires Trainer or Admin)",
        )
    return current_user