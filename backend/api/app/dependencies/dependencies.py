# /DaSpCoRate/backend/api/app/dependencies/dependencies.py

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from jose import JWTError
import logging

logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)

from app.core import security
from app.core.database import get_db
from app.crud import trainer as crud_trainer
from app.crud import couple as crud_couple
from app.models.trainer import Trainer # Import für Type Hinting
from app.models.couple import Couple
from app.schemas.token import TokenData

# OAuth2PasswordBearer ist eine FastAPI Utility, die den JWT-Standard in Headern verarbeitet
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/token")

async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    logger.debug(f"Received token in get_current_user: {token}")
    
    try:
        payload = security.decode_access_token(token)
        
        logger.debug(f"Decoded payload: {payload}")
        
        if payload is None:
            logger.warning("Token payload is None after decoding.")
            raise credentials_exception
        
        token_data = TokenData(**payload)
        
        logger.debug(f"TokenData from payload: {token_data}")
        
    except JWTError as e:
        logger.error(f"JWTError during token decoding: {e}")
        raise credentials_exception
    
    if not token_data.email:
        logger.warning("TokenData does not contain an email (sub claim).")
        raise credentials_exception

    # Suche den Benutzer basierend auf der Rolle im Token
    user = None
    if token_data.role == "trainer":
        user = crud_trainer.get_trainer_by_email(db, email=token_data.email)
    elif token_data.role == "couple":
        user = crud_couple.get_couple_by_email(db, email=token_data.email)
    else:
        logger.warning(f"Unknown role '{token_data.role}' in token for email '{token_data.email}'.")
        raise credentials_exception # Unbekannte Rolle

    if user is None:
        logger.warning(f"No user found for email '{token_data.email}' with role '{token_data.role}'.")
        raise credentials_exception
    
    return user

# Eine spezifischere Abhängigkeit, um sicherzustellen, dass der Benutzer ein Trainer ist
async def get_current_trainer(
    current_user: Trainer = Depends(get_current_user) # Erwartet jetzt explizit einen Trainer
) -> Trainer:
    # Zusätzliche Prüfung, um sicherzustellen, dass es auch wirklich ein Trainer ist, falls get_current_user
    # versehentlich ein Couple zurückgeben könnte (obwohl es das in diesem spezifischen Fall nicht sollte).
    if not isinstance(current_user, Trainer):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not a trainer."
        )
    return current_user

async def get_current_couple(
    current_user: Couple = Depends(get_current_user) # Erwartet jetzt explizit ein Couple
) -> Couple:
    # Zusätzliche Prüfung, um sicherzustellen, dass es auch wirklich ein Couple ist
    if not isinstance(current_user, Couple):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not a couple."
        )
    return current_user