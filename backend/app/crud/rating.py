# /DaSpCoRate/backend/app/crud/rating.py

from sqlalchemy.orm import Session, joinedload
from typing import List, Optional

from app.models import rating as models_rating
from app.models import session as models_session # Benötigt für Trainer-Sicht
from app.schemas import rating as schemas_rating

# Funktion zum Abrufen einer Bewertung anhand ihrer ID
def get_rating(self, db: Session, rating_id: int):
    return db.query(models_rating.Rating).filter(models_rating.Rating.id == rating_id).first()

# Funktion zum Abrufen von Bewertungen für ein spezifisches Paar
def get_ratings_by_couple(self, db: Session, couple_id: int, skip: int = 0, limit: int = 100) -> List[models_rating.Rating]:
    return db.query(models_rating.Rating).filter(
        models_rating.Rating.couple_id == couple_id
    ).order_by(models_rating.Rating.created_at.desc()).offset(skip).limit(limit).all()

# Funktion zum Abrufen von Bewertungen für eine spezifische Session
def get_ratings_by_session(self, db: Session, session_id: int, skip: int = 0, limit: int = 100) -> List[models_rating.Rating]:
    return db.query(models_rating.Rating).filter(
        models_rating.Rating.session_id == session_id
    ).order_by(models_rating.Rating.round, models_rating.Rating.category).offset(skip).limit(limit).all()

# Funktion zum Abrufen von Bewertungen, die ein Trainer in seinen Sessions vorgenommen hat
def get_ratings_for_trainer_sessions(self, db: Session, trainer_id: int, skip: int = 0, limit: int = 100) -> List[models_rating.Rating]:
    return db.query(models_rating.Rating).join(models_session.Session).filter(
        models_session.Session.trainer_id == trainer_id
    ).order_by(models_rating.Rating.created_at.desc()).offset(skip).limit(limit).all()

# Funktion zum Erstellen einer neuen Bewertung
def create_rating(self, db: Session, rating_in: schemas_rating.RatingCreate):
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

# Funktion zum Aktualisieren einer Bewertung
def update_rating(self, db: Session, rating_id: int, rating_in: schemas_rating.RatingUpdate):
    db_rating = db.query(models_rating.Rating).filter(models_rating.Rating.id == rating_id).first()
    if db_rating:
        update_data = rating_in.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_rating, key, value)
        db.add(db_rating)
        db.commit()
        db.refresh(db_rating)
    return db_rating

# Funktion zum Löschen einer Bewertung
def delete_rating(self, db: Session, rating_id: int):
    db_rating = db.query(models_rating.Rating).filter(models_rating.Rating.id == rating_id).first()
    if db_rating:
        db.delete(db_rating)
        db.commit()
        return True
    return False

rating = type('CRUDRating', (), {
    'get': get_rating,
    'get_by_couple': get_ratings_by_couple,
    'get_by_session': get_ratings_by_session,
    'get_for_trainer': get_ratings_for_trainer_sessions,
    'create': create_rating,
    'update': update_rating,
    'delete': delete_rating,
})()