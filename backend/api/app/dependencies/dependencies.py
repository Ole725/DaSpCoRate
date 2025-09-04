# /DaSpCoRate/backend/api/app/dependencies/dependencies.py

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from jose import JWTError
import logging
from typing import Union, Type # Type wird noch in der Hilfsfunktion verwendet, falls wir sie später brauchen, aber Union ist jetzt das Wichtigste

logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)

from app.core import security
from app.core.database import get_db
from app.crud import trainer as crud_trainer
from app.crud import couple as crud_couple
from app.models.trainer import Trainer
from app.models.couple import Couple
from app.schemas.token import TokenData

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/token")

# get_current_user wird jetzt nur den Token dekodieren und TokenData zurückgeben.
# Die eigentliche Benutzerabfrage und Rollenprüfung findet in den spezifischen Abhängigkeiten statt.
async def get_token_data(
    token: str = Depends(oauth2_scheme)
) -> TokenData:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    logger.debug(f"get_token_data: Received token: {token}")
    
    try:
        payload = security.decode_access_token(token)
        logger.debug(f"get_token_data: Decoded payload: {payload}")
        if payload is None:
            logger.warning("get_token_data: Token payload is None.")
            raise credentials_exception
        
        token_data = TokenData(**payload)
        logger.debug(f"get_token_data: TokenData: {token_data}")
            
    except JWTError as e:
        logger.error(f"get_token_data: JWTError during token decoding: {e}")
        raise credentials_exception
    
    if not token_data.email:
        logger.warning("get_token_data: TokenData does not contain an email (sub claim).")
        raise credentials_exception
    
    return token_data


# get_current_trainer wird jetzt direkt den Token dekodieren und den Trainer abrufen.
async def get_trainer_from_token( # <--- NAME GEÄNDERT
    db: Session = Depends(get_db),
    token_data: TokenData = Depends(get_token_data)
) -> Trainer:
    logger.debug(f"get_trainer_from_token: Processing TokenData: {token_data}")
    
    if token_data.role != "trainer":
        logger.warning(f"get_trainer_from_token: Token role '{token_data.role}' is not 'trainer'.")
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not a trainer.")
    
    trainer = crud_trainer.get_trainer_by_email(db, email=token_data.email)
    if not trainer:
        logger.warning(f"get_trainer_from_token: No trainer found for email '{token_data.email}'.")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Trainer not found or inactive.")
    
    logger.debug(f"get_trainer_from_token: Successfully identified Trainer: {trainer.email} (ID: {trainer.id})")
    return trainer


# get_current_couple wird jetzt direkt den Token dekodieren und das Paar abrufen.
async def get_couple_from_token( # <--- NAME GEÄNDERT
    db: Session = Depends(get_db),
    token_data: TokenData = Depends(get_token_data)
) -> Couple:
    logger.debug(f"get_couple_from_token: Processing TokenData: {token_data}")

    if token_data.role != "couple":
        logger.warning(f"get_couple_from_token: Token role '{token_data.role}' is not 'couple'.")
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not a couple.")
    
    couple = crud_couple.get_couple_by_email(db, email=token_data.email)
    if not couple:
        logger.warning(f"get_couple_from_token: No couple found for email '{token_data.email}'.")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Couple not found or inactive.")
    
    logger.debug(f"get_couple_from_token: Successfully identified Couple: {couple.email} (ID: {couple.id})")
    return couple

# Eine generische Abhängigkeit für jeden authentifizierten Benutzer (Trainer oder Couple)
# Nützlich, wenn ein Endpunkt von beiden Typen genutzt werden kann, aber der Typ unterschieden werden muss.
async def get_current_user(
    db: Session = Depends(get_db),
    token_data: TokenData = Depends(get_token_data)
) -> Union[Trainer, Couple]:
    logger.debug(f"get_current_user (generic): Processing TokenData: {token_data}")
    
    user = None
    if token_data.role == "trainer":
        user = crud_trainer.get_trainer_by_email(db, email=token_data.email)
    elif token_data.role == "couple":
        user = crud_couple.get_couple_by_email(db, email=token_data.email)
    
    if not user:
        logger.warning(f"get_current_user (generic): No user found for email '{token_data.email}' with role '{token_data.role}'.")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authenticated user not found or inactive.")
    
    logger.debug(f"get_current_user (generic): Identified user: {user.__class__.__name__} (ID: {user.id})")
    return user