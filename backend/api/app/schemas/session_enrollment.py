# /DaSpCoRate/backend/api/app/schemas/session_enrollment.py

from pydantic import BaseModel, ConfigDict
from datetime import datetime

# Schema, das Paare verwenden, um sich selbst anzumelden
class CoupleEnrollmentCreate(BaseModel):
    session_id: int

# Schema, das Trainer verwenden
class TrainerEnrollmentCreate(BaseModel):
    session_id: int
    couple_id: int
    start_number: int

class SessionEnrollmentInDB(BaseModel):
    id: int
    session_id: int
    couple_id: int
    start_number: int
    enrolled_at: datetime

    model_config = ConfigDict(from_attributes=True)