# /DaSpCoRate/backend/app/core/config.py

import os
from typing import List, Optional
from pydantic_settings import BaseSettings
from fastapi_mail import ConnectionConfig

class Settings(BaseSettings):
    PROJECT_NAME: str = "DaSpCoRate"
    API_V1_STR: str = "/api/v1"

    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost",
        "https://daspcorate-frontend-139554468209.europe-west3.run.app"
        "https://danscor.app",
        "https://www.danscor.app"
    ]

    DATABASE_URL: str = os.getenv("DATABASE_URL")

    SECRET_KEY: str = os.getenv("SECRET_KEY")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 60))

    class Config:
        env_file = None
        extra = 'ignore'

settings = Settings()

try:
    conf = ConnectionConfig(
        MAIL_USERNAME = os.getenv("MAIL_USERNAME"),
        MAIL_PASSWORD = os.getenv("MAIL_PASSWORD"),
        MAIL_FROM = os.getenv("MAIL_FROM"),
        MAIL_PORT = int(os.getenv("MAIL_PORT", 587)),
        MAIL_SERVER = os.getenv("MAIL_SERVER"),
        MAIL_STARTTLS = str(os.getenv("MAIL_STARTTLS", "True")).lower() in ("true", "1", "t"),
        MAIL_SSL_TLS = str(os.getenv("MAIL_SSL_TLS", "False")).lower() in ("true", "1", "t"),
        USE_CREDENTIALS = True,
        VALIDATE_CERTS = True
    )
    if not conf.MAIL_USERNAME:
        print("WARNUNG: Keine E-Mail-Konfiguration gefunden. E-Mail-Versand ist deaktiviert.")
        conf = None
except Exception as e:
    print(f"WARNUNG: Fehler beim Laden der E-Mail-Konfiguration: {e}. E-Mail-Versand ist deaktiviert.")
    conf = None