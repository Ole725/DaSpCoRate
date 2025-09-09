# /DaSpCoRate/backend/app/api/v1/endpoints/ratings.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict

from app.core.database import get_db
from app.schemas import rating as schemas_rating
from app.crud import rating as crud_rating
from app.crud import session as crud_session # Um Session-Existenz/Besitz zu prüfen
from app.crud import couple as crud_couple   # Um Couple-Existenz zu prüfen
from app.dependencies.dependencies import get_trainer_from_token, get_couple_from_token
from app.models.trainer import Trainer
from app.models.couple import Couple

router = APIRouter()

# --- Endpunkte für Trainer (Bewertungen abgeben und verwalten) ---

# Endpunkt zum Abgeben einer neuen Bewertung (nur für authentifizierte Trainer)
@router.post("/", response_model=schemas_rating.RatingInDB, status_code=status.HTTP_201_CREATED)
def create_new_rating(
    rating_in: schemas_rating.RatingCreate,
    db: Session = Depends(get_db),
    current_trainer: Trainer = Depends(get_trainer_from_token) # Nur Trainer dürfen bewerten
):
    # 1. Prüfen, ob die Session existiert und dem Trainer gehört
    session = crud_session.get_session(db, session_id=rating_in.session_id)
    if not session or session.trainer_id != current_trainer.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found or not authorized.")
    
    # 2. Prüfen, ob das Paar existiert
    couple = crud_couple.get_couple(db, couple_id=rating_in.couple_id)
    if not couple:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Couple not found.")

    # Optional: Prüfen, ob für diese Session, dieses Paar, diese Runde und diese Kategorie bereits eine Bewertung existiert
    # Wenn nur eine Bewertung pro Kriterium pro Runde erlaubt ist
    # existing_rating = db.query(models_rating.Rating).filter(
    #     models_rating.Rating.session_id == rating_in.session_id,
    #     models_rating.Rating.couple_id == rating_in.couple_id,
    #     models_rating.Rating.round == rating_in.round,
    #     models_rating.Rating.category == rating_in.category
    # ).first()
    # if existing_rating:
    #     raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Rating for this criteria in this round already exists.")


    rating = crud_rating.create_rating(db=db, rating_in=rating_in)
    return rating

# Endpunkt zum Abrufen aller Bewertungen für Sessions des Trainers
@router.get("/my-sessions", response_model=List[schemas_rating.RatingInDB])
def read_ratings_for_my_sessions(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_trainer: Trainer = Depends(get_trainer_from_token)
):
    ratings = crud_rating.get_ratings_for_trainer_sessions(db, trainer_id=current_trainer.id, skip=skip, limit=limit)
    return ratings

# Endpunkt zum Abrufen aller Bewertungen für eine spezifische Session des Trainers
@router.get("/session/{session_id}", response_model=List[schemas_rating.RatingInDB])
def read_ratings_for_specific_session(
    session_id: int,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_trainer: Trainer = Depends(get_trainer_from_token)
):
    # Prüfen, ob die Session dem aktuellen Trainer gehört
    session = crud_session.get_session(db, session_id=session_id)
    if not session or session.trainer_id != current_trainer.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found or not authorized.")
    
    ratings = crud_rating.get_ratings_by_session(db, session_id=session_id, skip=skip, limit=limit)
    return ratings

# Endpunkt zum Aktualisieren einer Bewertung (nur durch den erstellenden Trainer)
# Beachten Sie, dass RatingUpdate nur 'points' erlaubt zu ändern.
@router.put("/{rating_id}", response_model=schemas_rating.RatingInDB)
def update_existing_rating(
    rating_id: int,
    rating_in: schemas_rating.RatingUpdate,
    db: Session = Depends(get_db),
    current_trainer: Trainer = Depends(get_trainer_from_token)
):
    db_rating = crud_rating.get_rating(db, rating_id=rating_id)
    if not db_rating:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Rating not found.")
    
    # Prüfen, ob der Trainer berechtigt ist (Session gehört ihm)
    session = crud_session.get_session(db, session_id=db_rating.session_id)
    if not session or session.trainer_id != current_trainer.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to update this rating.")

    rating = crud_rating.update_rating(db=db, rating_id=rating_id, rating_in=rating_in)
    return rating

# Endpunkt zum Löschen einer Bewertung (nur durch den erstellenden Trainer)
@router.delete("/{rating_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_existing_rating(
    rating_id: int,
    db: Session = Depends(get_db),
    current_trainer: Trainer = Depends(get_trainer_from_token)
):
    db_rating = crud_rating.get_rating(db, rating_id=rating_id)
    if not db_rating:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Rating not found.")
    
    # Prüfen, ob der Trainer berechtigt ist (Session gehört ihm)
    session = crud_session.get_session(db, session_id=db_rating.session_id)
    if not session or session.trainer_id != current_trainer.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to delete this rating.")

    success = crud_rating.delete_rating(db, rating_id=rating_id)
    if not success:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to delete rating.")
    return {"message": "Rating deleted successfully."}

# --- Endpunkte für Paare (Eigene Bewertungshistorie einsehen) ---

# Endpunkt für Paare: Eigene Bewertungshistorie abrufen
@router.get("/me", response_model=List[schemas_rating.RatingInDB])
def read_my_ratings(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_couple: Couple = Depends(get_couple_from_token) # Nur authentifizierte Paare
):
    ratings = crud_rating.get_ratings_by_couple(db, couple_id=current_couple.id, skip=skip, limit=limit)
    return ratings

# Optional: Aggregierte Bewertung für ein Paar (z.B. Durchschnitt pro Kriterium)
# Dies wäre eine komplexere Logik, die man später hinzufügen könnte.
# @router.get("/me/summary", response_model=Dict)
# def get_my_rating_summary(...):
#     pass