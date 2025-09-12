# /DaSpCoRate/backend/app/schemas/trainer.py

from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional
from datetime import datetime

# Basis-Schema für Trainer-Attribute
class TrainerBase(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str
    phone_number: Optional[str] = None

# Schema für die Erstellung eines Trainers (inkl. Passwort)
class TrainerCreate(TrainerBase):
    password: str

# Schema für die Aktualisierung eines Trainers (alle Felder optional)
class TrainerUpdate(BaseModel): # <-- Erbt NICHT von TrainerBase, da alle Felder optional sein sollen
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone_number: Optional[str] = None

# Schema für das Lesen eines Trainers aus der Datenbank
class TrainerInDB(TrainerBase):
    id: int
    role: str
    # created_at: datetime <-- Dieses Feld existiert im DB-Modell nicht, daher entfernen

    model_config = ConfigDict(from_attributes=True)