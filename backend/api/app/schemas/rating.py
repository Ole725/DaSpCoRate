# /DaSpCoRate/backend/api/app/schemas/rating.py

from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, Literal
from datetime import datetime

# Definition der erlaubten Bewertungskategorien und Punktzahlen
# Dies kann man auch als Enums definieren, aber für den Anfang ist Literal gut.
RATING_CATEGORIES = Literal[
    "Technical Quality", "Movement to Music", "Partnering Skill",
    "Choreography and Presentation", "Posture & Balance", "Start/Ending",
    "Floorcraft", "Stamina", "Appearance"
]
RATING_POINTS = Literal[1, 2, 3] # Punktzahlen von 1 bis 3

# Basis-Schema für Rating-Attribute
class RatingBase(BaseModel):
    session_id: int
    couple_id: int
    round: int
    category: RATING_CATEGORIES # Nur erlaubte Kategorien
    points: RATING_POINTS       # Nur erlaubte Punktzahlen

# Schema für die Erstellung einer neuen Bewertung
class RatingCreate(RatingBase):
    # couple_id und session_id kommen vom Frontend / Kontext, aber werden hier direkt übergeben
    pass

# Schema für die Aktualisierung einer Bewertung
# Normalerweise möchte man eine Bewertung nicht einfach aktualisieren,
# sondern eher eine neue für dieselbe Runde/Kategorie hinzufügen oder die alte löschen.
# Falls Aktualisierung doch gewünscht:
class RatingUpdate(BaseModel):
    # Nur Punkte können aktualisiert werden
    points: RATING_POINTS

# Schema für das Lesen einer Bewertung aus der Datenbank
class RatingInDB(RatingBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True) # Pydantic V2 Anpassung