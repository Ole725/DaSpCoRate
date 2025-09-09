# /DaSpCoRate/backend/app/schemas/trainer.py

from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional
from datetime import datetime

# Basis-Schema für Trainer-Attribute
class TrainerBase(BaseModel):
    email: EmailStr # EmailStr sorgt für automatische Validierung des E-Mail-Formats
    first_name: str
    last_name: str
    phone_number: Optional[str] = None # Optionaler Wert mit Default None

# Schema für die Erstellung eines Trainers (inkl. Passwort)
class TrainerCreate(TrainerBase):
    password: str # Passwort ist beim Erstellen obligatorisch

# Schema für die Aktualisierung eines Trainers (alle Felder optional)
class TrainerUpdate(TrainerBase):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[EmailStr] = None
    # Passwort-Aktualisierung wird oft in einem separaten Endpunkt behandelt
    # phone_number ist bereits in TrainerBase optional

# Schema für das Lesen eines Trainers aus der Datenbank (inkl. ID und Zeitstempel)
# Hier wird das Passwort NICHT zurückgegeben!
class TrainerInDB(TrainerBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True) # Ermöglicht die direkte Umwandlung von SQLAlchemy-Modellen zu Pydantic