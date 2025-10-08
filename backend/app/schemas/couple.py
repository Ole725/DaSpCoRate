# /DaSpCoRate/backend/app/schemas/couple.py

from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional
from datetime import datetime

# Basis-Schema für die Attribute eines Paares
class CoupleBase(BaseModel):
    email: EmailStr
    mr_first_name: str
    mrs_first_name: str
    start_group: str
    start_class: str
    dance_style: str
    phone_number: Optional[str] = None

# Schema für die Erstellung eines neuen Paares (inkl. Passwort)
class CoupleCreate(CoupleBase):
    password: str

# Schema für die Aktualisierung eines Paares
class CoupleUpdate(BaseModel):
    email: Optional[EmailStr] = None
    mr_first_name: Optional[str] = None
    mrs_first_name: Optional[str] = None
    start_group: Optional[str] = None
    start_class: Optional[str] = None
    dance_style: Optional[str] = None
    phone_number: Optional[str] = None
    password: Optional[str] = None

# Schema für das Lesen eines Paares aus der Datenbank
class CoupleInDB(CoupleBase):
    id: int
    role: str
    created_at: datetime
    consent_given_at: Optional[datetime] = None
    consent_token: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)