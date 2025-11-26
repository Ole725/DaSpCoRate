# /DaSpCoRate/backend/app/crud/rating.py

from sqlalchemy.orm import Session
from typing import List, Optional

from app.models import rating as models_rating
from app.models import session as models_session  # Benötigt für Trainer-Sicht
from app.schemas import rating as schemas_rating

# -------------------------------------------------------------------------
# KONFIGURATION
# -------------------------------------------------------------------------
# Standard-Limit für Datenbankabfragen.
# Berechnung: 20 Paare * 9 Kriterien * 5 Runden = 900 Einträge pro Session.
# Puffer: Wir setzen das Limit auf 5000, um sicherzustellen, dass niemals
# Daten im Frontend fehlen.
DEFAULT_LIMIT = 5000


# -------------------------------------------------------------------------
# LESEN (READ)
# -------------------------------------------------------------------------

def get_rating(self, db: Session, rating_id: int):
    """
    Ruft eine einzelne Bewertung anhand ihrer ID ab.
    """
    return db.query(models_rating.Rating).filter(models_rating.Rating.id == rating_id).first()


def get_ratings_by_couple(self, db: Session, couple_id: int, skip: int = 0, limit: int = DEFAULT_LIMIT) -> List[models_rating.Rating]:
    """
    Ruft alle Bewertungen für ein spezifisches Paar ab (Historie).
    Sortiert nach Erstellungsdatum (neueste zuerst).
    """
    return db.query(models_rating.Rating).filter(
        models_rating.Rating.couple_id == couple_id
    ).order_by(models_rating.Rating.created_at.desc()).offset(skip).limit(limit).all()


def get_ratings_by_session(self, db: Session, session_id: int, skip: int = 0, limit: int = DEFAULT_LIMIT) -> List[models_rating.Rating]:
    """
    Ruft alle Bewertungen einer spezifischen Session ab.
    
    WICHTIG FÜR DAS FRONTEND:
    Die Sortierung erfolgt strikt nach:
    1. Runde (round)
    2. Kategorie (category)
    3. Paar-ID (couple_id) -> Verhindert das "Verschieben/Springen" der Zeilen im UI!
    """
    return db.query(models_rating.Rating).filter(
        models_rating.Rating.session_id == session_id
    ).order_by(
        models_rating.Rating.round,
        models_rating.Rating.category,
        models_rating.Rating.couple_id  # Stabilisiert die Reihenfolge
    ).offset(skip).limit(limit).all()


def get_ratings_for_trainer_sessions(self, db: Session, trainer_id: int, skip: int = 0, limit: int = DEFAULT_LIMIT) -> List[models_rating.Rating]:
    """
    Ruft Bewertungen ab, die ein Trainer in seinen Sessions vorgenommen hat.
    """
    return db.query(models_rating.Rating).join(models_session.Session).filter(
        models_session.Session.trainer_id == trainer_id
    ).order_by(models_rating.Rating.created_at.desc()).offset(skip).limit(limit).all()


# -------------------------------------------------------------------------
# SCHREIBEN (CREATE / UPDATE / DELETE)
# -------------------------------------------------------------------------

def create_rating(self, db: Session, rating_in: schemas_rating.RatingCreate):
    """
    Erstellt eine neue Bewertung in der Datenbank.
    """
    db_rating = models_rating.Rating(
        session_id=rating_in.session_id,
        couple_id=rating_in.couple_id,
        round=rating_in.round,
        category=rating_in.category,
        points=rating_in.points
    )
    db.add(db_rating)
    db.commit()
    db.refresh(db_rating)
    return db_rating


def update_rating(self, db: Session, rating_id: int, rating_in: schemas_rating.RatingUpdate):
    """
    Aktualisiert eine bestehende Bewertung.
    """
    db_rating = db.query(models_rating.Rating).filter(models_rating.Rating.id == rating_id).first()
    if db_rating:
        update_data = rating_in.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_rating, key, value)
        db.add(db_rating)
        db.commit()
        db.refresh(db_rating)
    return db_rating


def delete_rating(self, db: Session, rating_id: int):
    """
    Löscht eine Bewertung anhand ihrer ID.
    """
    db_rating = db.query(models_rating.Rating).filter(models_rating.Rating.id == rating_id).first()
    if db_rating:
        db.delete(db_rating)
        db.commit()
        return True
    return False


# -------------------------------------------------------------------------
# EXPORT
# -------------------------------------------------------------------------

# Zusammenfassen aller Funktionen in einem Objekt, damit sie als 
# crud_rating.get_by_session() aufgerufen werden können.
rating = type('CRUDRating', (), {
    'get': get_rating,
    'get_by_couple': get_ratings_by_couple,
    'get_by_session': get_ratings_by_session,
    'get_for_trainer': get_ratings_for_trainer_sessions,
    'create': create_rating,
    'update': update_rating,
    'delete': delete_rating,
})()