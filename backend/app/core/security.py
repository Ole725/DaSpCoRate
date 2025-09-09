# /DaSpCoRate/backend/app/core/security.py

from datetime import datetime, timedelta
from typing import Optional

from passlib.context import CryptContext
from jose import JWTError, jwt

from app.core.config import settings # Importiert unsere JWT-Einstellungen

# Konfiguration für das Passwort-Hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Vergleicht ein Klartext-Passwort mit einem gehashten Passwort.
    """
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """
    Hasht ein Klartext-Passwort.
    """
    return pwd_context.hash(password)

# Funktionen für JWT (JSON Web Token)
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Erstellt ein JWT Access Token.
    """
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire}) # Ablaufzeitpunkt in das Token aufnehmen
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str) -> Optional[dict]:
    """
    Dekodiert ein JWT Access Token und gibt dessen Payload zurück.
    Gibt None zurück, wenn das Token ungültig oder abgelaufen ist.
    """
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except JWTError:
        return None