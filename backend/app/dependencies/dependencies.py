# /DaSpCoRate/backend/app/dependencies/dependencies.py

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from jose import JWTError
from typing import Union

from app.core import security
from app.core.database import get_db
from app.crud import trainer as crud_trainer
from app.crud import couple as crud_couple
from app.models.trainer import Trainer
from app.models.couple import Couple
from app.schemas.token import TokenData

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/token")

def get_token_data(token: str = Depends(oauth2_scheme)) -> TokenData:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = security.decode_access_token(token)
        if payload is None:
            raise credentials_exception
        
        email = payload.get("sub")
        role = payload.get("role")
        if not email or not role:
            raise credentials_exception
        
        # --- DER FINALE FIX: Eindeutige Zuweisung ---
        # Wir erstellen das Objekt nur mit den Feldern, die es kennt.
        token_data = TokenData(email=email, role=role)
        # ---------------------------------------------

    except JWTError:
        raise credentials_exception
    
    return token_data

def get_current_trainer(
    db: Session = Depends(get_db),
    token_data: TokenData = Depends(get_token_data)
) -> Trainer:
    if token_data.role != "trainer":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not a trainer.")
    
    trainer = crud_trainer.get_by_email(db=db, email=token_data.email)
    if not trainer:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Trainer not found.")
    
    return trainer

def get_current_couple(
    db: Session = Depends(get_db),
    token_data: TokenData = Depends(get_token_data)
) -> Couple:
    if token_data.role != "couple":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not a couple.")
    
    couple = crud_couple.get_by_email(db=db, email=token_data.email)
    if not couple:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Couple not found.")
    
    return couple

def get_current_user(
    db: Session = Depends(get_db),
    token_data: TokenData = Depends(get_token_data)
) -> Union[Trainer, Couple]:
    
    if token_data.role == "trainer":
        user = crud_trainer.get_by_email(db=db, email=token_data.email)
    elif token_data.role == "couple":
        user = crud_couple.get_by_email(db=db, email=token_data.email)
    else:
        user = None

    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found.")
    
    return user