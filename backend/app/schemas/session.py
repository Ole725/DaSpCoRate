# /DaSpCoRate/backend/app/schemas/session.py

from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import date, datetime
from typing import List, Optional

# Basis-Schema für Session-Attribute
class SessionBase(BaseModel):
    session_date: date # Datum der Session
    title: str         # Titel/Beschreibung der Session

# Schema für die Erstellung einer neuen Session
class SessionCreate(SessionBase):
    # Trainer-ID wird vom authentifizierten Benutzer abgeleitet, nicht im Request Body mitgegeben
    criteria: List[str]

# Schema für die Aktualisierung einer Session
class SessionUpdate(SessionBase):
    session_date: Optional[date] = None
    title: Optional[str] = None
    criteria: Optional[List[str]] = None

# Schema für das Lesen einer Session aus der Datenbank
class SessionInDB(SessionBase):
    id: int
    trainer_id: Optional[int] = None # Kann NULL sein, wenn Trainer gelöscht wurde
    created_at: datetime
    criteria: Optional[List[str]] = None

    model_config = ConfigDict(from_attributes=True) # Pydantic V2 Anpassung