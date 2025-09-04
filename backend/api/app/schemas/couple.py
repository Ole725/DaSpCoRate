# /DaSpCoRate/backend/api/app/schemas/couple.py

from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional
from datetime import datetime

# Basis-Schema für die Attribute eines Paares
class CoupleBase(BaseModel):
    mr_first_name: str
    mrs_first_name: str
    start_group: str
    start_class: str
    dance_style: str
    email: EmailStr
    phone_number: Optional[str] = None

# Schema für die Erstellung eines neuen Paares (inkl. Passwort)
class CoupleCreate(CoupleBase):
    password: str

# Schema für die Aktualisierung eines Paares
class CoupleUpdate(BaseModel): # Ändere die Basisklasse zu BaseModel, um flexibler zu sein
    mr_first_name: Optional[str] = None
    mrs_first_name: Optional[str] = None
    start_group: Optional[str] = None
    start_class: Optional[str] = None
    dance_style: Optional[str] = None
    email: Optional[EmailStr] = None
    phone_number: Optional[str] = None
    # Passwort-Aktualisierung wird in einem separaten Endpunkt behandelt
    # Rolle wird normalerweise nicht vom Benutzer selbst geändert

# Schema für das Lesen eines Paares aus der Datenbank
# 'password_hash' wird hier NICHT zurückgegeben.
class CoupleInDB(CoupleBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True) # Pydantic V2 Anpassung