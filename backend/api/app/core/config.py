# /DaSpCoRate/backend/api/app/core/config.py

import os
from dotenv import load_dotenv

# Lade Umgebungsvariablen aus einer .env Datei (falls vorhanden)
load_dotenv()

class Settings:
    PROJECT_NAME: str = "Tanzsport-App API"
    PROJECT_VERSION: str = "0.1.0"

    # Datenbank-Einstellungen
    MYSQL_USER: str = os.getenv("MYSQL_USER", "root") # Standardwert "root", aber besser über .env
    MYSQL_PASSWORD: str = os.getenv("MYSQL_PASSWORD", "password") # Standardwert "password", ABER UNBEDINGT ÄNDERN!
    MYSQL_HOST: str = os.getenv("MYSQL_HOST", "127.0.0.1")
    MYSQL_PORT: str = os.getenv("MYSQL_PORT", "3306")
    MYSQL_DATABASE: str = os.getenv("MYSQL_DATABASE", "daspcorate_db")

    # Generiere die DATABASE_URL basierend auf den Einstellungen
    DATABASE_URL: str = (
        f"mysql+pymysql://{MYSQL_USER}:{MYSQL_PASSWORD}@{MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DATABASE}"
    )

    # JWT-Einstellungen für Authentifizierung
    SECRET_KEY: str = os.getenv("SECRET_KEY", "DEIN_SUPER_GEHEIMER_STANDARD_SCHLUESSEL") # **MUSS GEÄNDERT WERDEN**
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30 # Minuten

settings = Settings()
