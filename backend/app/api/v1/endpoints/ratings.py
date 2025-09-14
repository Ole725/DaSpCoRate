# /DaSpCoRate/backend/app/api/v1/endpoints/ratings.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Union

from app.core.database import get_db
from app.schemas import rating as schemas_rating
from app.crud import rating as crud_rating
from app.crud import session as crud_session
from app.crud import couple as crud_couple
from app.dependencies.dependencies import get_current_trainer, get_current_couple, get_current_trainer_or_admin
from app.models.admin import Admin
from app.models.trainer import Trainer
from app.models.couple import Couple

router = APIRouter()

@router.post("/", response_model=schemas_rating.RatingInDB, status_code=status.HTTP_201_CREATED)
def create_new_rating(
    rating_in: schemas_rating.RatingCreate,
    db: Session = Depends(get_db),
    # KORREKTUR: Verwende den neuen Funktionsnamen
    current_trainer: Trainer = Depends(get_current_trainer)
):
    session = crud_session.get(db, session_id=rating_in.session_id)
    if not session or session.trainer_id != current_trainer.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found or not authorized.")
    
    couple = crud_couple.get(db, couple_id=rating_in.couple_id)
    if not couple:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Couple not found.")

    rating = crud_rating.create(db=db, rating_in=rating_in)
    return rating

@router.get("/my-sessions", response_model=List[schemas_rating.RatingInDB])
def read_ratings_for_my_sessions(
    db: Session = Depends(get_db),
    # KORREKTUR: Verwende den neuen Funktionsnamen
    current_trainer: Trainer = Depends(get_current_trainer)
):
    ratings = crud_rating.get_for_trainer(db, trainer_id=current_trainer.id)
    return ratings

@router.get("/session/{session_id}", response_model=List[schemas_rating.RatingInDB])
def read_ratings_for_specific_session(
    session_id: int,
    db: Session = Depends(get_db),
    # KORREKTUR: Verwende den neuen Funktionsnamen
    current_trainer: Trainer = Depends(get_current_trainer)
):
    session = crud_session.get(db, session_id=session_id)
    if not session or session.trainer_id != current_trainer.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found or not authorized.")
    
    ratings = crud_rating.get_by_session(db, session_id=session_id)
    return ratings

@router.put("/{rating_id}", response_model=schemas_rating.RatingInDB)
def update_existing_rating(
    rating_id: int,
    rating_in: schemas_rating.RatingUpdate,
    db: Session = Depends(get_db),
    # KORREKTUR: Verwende den neuen Funktionsnamen
    current_trainer: Trainer = Depends(get_current_trainer)
):
    db_rating = crud_rating.get(db, rating_id=rating_id)
    if not db_rating:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Rating not found.")
    
    session = crud_session.get(db, session_id=db_rating.session_id)
    if not session or session.trainer_id != current_trainer.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized.")

    rating = crud_rating.update(db=db, rating_id=rating_id, rating_in=rating_in)
    return rating

@router.delete("/{rating_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_existing_rating(
    rating_id: int,
    db: Session = Depends(get_db),
    # KORREKTUR: Verwende den neuen Funktionsnamen
    current_trainer: Trainer = Depends(get_current_trainer)
):
    db_rating = crud_rating.get(db, rating_id=rating_id)
    if not db_rating:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Rating not found.")
    
    session = crud_session.get(db, session_id=db_rating.session_id)
    if not session or session.trainer_id != current_trainer.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized.")

    crud_rating.delete(db, rating_id=rating_id)
    return

@router.get("/me", response_model=List[schemas_rating.RatingInDB])
def read_my_ratings(
    db: Session = Depends(get_db),
    # KORREKTUR: Verwende den neuen Funktionsnamen
    current_couple: Couple = Depends(get_current_couple)
):
    ratings = crud_rating.get_by_couple(db, couple_id=current_couple.id)
    return ratings

@router.get("/couple/{couple_id}", response_model=List[schemas_rating.RatingInDB])
def read_ratings_for_a_couple(
    couple_id: int,
    db: Session = Depends(get_db),
    current_user: Union[Trainer, Admin] = Depends(get_current_trainer_or_admin)
):
    """Get all ratings for a specific couple by ID. Accessible by Admins and Trainers."""
    db_couple = crud_couple.get(db, couple_id=couple_id)
    if not db_couple:
        raise HTTPException(status_code=404, detail="Couple not found.")
        
    ratings = crud_rating.get_by_couple(db, couple_id=couple_id)
    return ratings