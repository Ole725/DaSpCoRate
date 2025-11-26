# /DaSpCoRate/backend/app/core/config.py

import os
from typing import List, Optional
from pydantic_settings import BaseSettings # Pydantic v2 Standard
from fastapi_mail import ConnectionConfig

# Prüfen, ob wir in der Google Cloud laufen
IS_CLOUD_RUN = "K_SERVICE" in os.environ

class Settings(BaseSettings):
    PROJECT_NAME: str = "DaSpCoRate"
    API_V1_STR: str = "/api/v1"

    # WICHTIG: Deine CORS-Origins behalten!
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://localhost",
        "https://daspcorate-frontend-139554468209.europe-west3.run.app",
        "https://danscor.app",
        "https://www.danscor.app"
    ]

    # Diese Variablen werden aus der .env oder den Cloud-Env-Vars geladen
    FRONTEND_URL: str = "http://localhost:5173" # Fallback für lokal
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 180

    # E-Mail Settings
    MAIL_USERNAME: str
    MAIL_PASSWORD: str
    MAIL_FROM: str
    MAIL_PORT: int = 587
    MAIL_SERVER: str
    MAIL_STARTTLS: bool = True
    MAIL_SSL_TLS: bool = False

    class Config:
        # Nur wenn wir NICHT in Cloud Run sind, laden wir die .env-Datei.
        if not IS_CLOUD_RUN:
            env_file = ".env"
            env_file_encoding = 'utf-8'
            extra = "ignore" # Ignoriert extra Variablen in der .env, verhindert Fehler

settings = Settings()

# --- MAIL KONFIGURATION ---
# Wir versuchen, die Konfiguration zu erstellen.
# Wenn Variablen fehlen (z.B. lokal ohne Internet), wird conf auf None gesetzt.
try:
    if settings.MAIL_USERNAME and settings.MAIL_PASSWORD:
        conf = ConnectionConfig(
            MAIL_USERNAME=settings.MAIL_USERNAME,
            MAIL_PASSWORD=settings.MAIL_PASSWORD,
            MAIL_FROM=settings.MAIL_FROM,
            MAIL_PORT=settings.MAIL_PORT,
            MAIL_SERVER=settings.MAIL_SERVER,
            MAIL_STARTTLS=settings.MAIL_STARTTLS,
            MAIL_SSL_TLS=settings.MAIL_SSL_TLS,
            USE_CREDENTIALS=True,
            VALIDATE_CERTS=True
        )
    else:
        print("WARNUNG: Keine E-Mail-Zugangsdaten gefunden. E-Mail-Versand deaktiviert.")
        conf = None
except Exception as e:
    print(f"WARNUNG: Fehler bei der E-Mail-Konfiguration: {e}")
    conf = None