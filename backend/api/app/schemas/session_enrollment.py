# /DaSpCoRate/backend/api/app/schemas/session_enrollment.py

from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

# Schema für die Eingabe beim Anmelden zu einer Session
# Das Paar gibt nur die Session-ID an, die couple_id wird vom Token abgeleitet.
class SessionEnrollmentCreate(BaseModel):
    session_id: int
    couple_id: int
    start_number: int

# Schema für das Lesen einer Session-Anmeldung aus der Datenbank
class SessionEnrollmentInDB(BaseModel):
    id: int
    session_id: int
    couple_id: int
    start_number: int
    enrolled_at: datetime

    model_config = ConfigDict(from_attributes=True) # Pydantic V2 Anpassung

# Optional: Ein erweitertes Schema, das die Session- und Couple-Details enthält
# Nützlich, wenn man detailliertere Informationen zurückgeben möchte.
# Hierfür müssten wir die Schemas für SessionInDB und CoupleInDB importieren.
# Wir können das später hinzufügen, wenn nötig.