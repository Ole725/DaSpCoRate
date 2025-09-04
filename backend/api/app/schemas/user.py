# /DaSpCoRate/backend/api/app/schemas/user.py

from pydantic import BaseModel, Field

class PasswordChange(BaseModel):
    current_password: str = Field(..., min_length=6) # Aktuelles Passwort
    new_password: str = Field(..., min_length=6)     # Neues Passwort
    confirm_new_password: str = Field(..., min_length=6) # Bestätigung des neuen Passworts