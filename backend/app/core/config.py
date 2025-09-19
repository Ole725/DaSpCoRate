# /DaSpCoRate/backend/app/core/config.py

import os
from typing import List, Optional
from pydantic_settings import BaseSettings
from fastapi_mail import ConnectionConfig

IS_CLOUD_RUN = "K_SERVICE" in os.environ

class Settings(BaseSettings):
    PROJECT_NAME: str = "DaSpCoRate"
    API_V1_STR: str = "/api/v1"

    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost",
        "https://daspcorate-frontend-139554468209.europe-west3.run.app",
        "https://danscor.app",
        "https://www.danscor.app"
    ]

    # Pydantic lädt diese automatisch aus der Umgebung/.env
    FRONTEND_URL: str
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    # Pydantic lädt auch diese automatisch
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

settings = Settings()

# Der untere Teil war schon perfekt und bleibt gleich.
try:
    conf = ConnectionConfig(
        MAIL_USERNAME = settings.MAIL_USERNAME,
        MAIL_PASSWORD = settings.MAIL_PASSWORD,
        MAIL_FROM = settings.MAIL_FROM,
        MAIL_PORT = settings.MAIL_PORT,
        MAIL_SERVER = settings.MAIL_SERVER,
        MAIL_STARTTLS = settings.MAIL_STARTTLS,
        MAIL_SSL_TLS = settings.MAIL_SSL_TLS,
        USE_CREDENTIALS = True,
        VALIDATE_CERTS = True
    )
    if not settings.MAIL_USERNAME: # Prüfe gegen 'settings'
        conf = None
except Exception:
    conf = None