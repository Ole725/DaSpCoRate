# /DaSpCoRate/backend/app/api/v1/endpoints/couple_ops.py

import logging
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core import security
from app.core.database import get_db
from app.schemas import couple as schemas_couple
from app.crud import couple as crud_couple
# --- KORREKTUR: Importiere die neuen, korrekten Funktionsnamen ---
from app.dependencies.dependencies import get_current_trainer, get_current_couple
# ---------------------------------------------------------------
from app.models.trainer import Trainer
from app.models.couple import Couple

# Initialisiere Logger, falls benötigt
logger = logging.getLogger(__name__)

router = APIRouter()

# --- Endpunkte für Paare (Verwaltung des EIGENEN Profils) ---

@router.put("/me", response_model=schemas_couple.CoupleInDB)
def update_my_couple_profile(
    couple_in: schemas_couple.CoupleUpdate,
    db: Session = Depends(get_db),
    # KORREKTUR: Verwende den neuen Funktionsnamen
    current_couple: Couple = Depends(get_current_couple)
):
    if not isinstance(current_couple, Couple):
         raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Authentication Error: Expected a Couple object, but got {type(current_couple)}."
        )

    if couple_in.email and couple_in.email != current_couple.email:
        existing_couple_with_new_email = crud_couple.get_by_email(db, email=couple_in.email)
        if existing_couple_with_new_email:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="New email already registered.")

    # KORREKTUR: Verwende den Alias 'update'
    couple = crud_couple.update(db=db, couple_id=current_couple.id, couple_in=couple_in)
    return couple

# --- Endpunkte für Trainer (Verwaltung von Paaren) ---

@router.post("/", response_model=schemas_couple.CoupleInDB, status_code=status.HTTP_201_CREATED)
def create_new_couple(
    couple_in: schemas_couple.CoupleCreate,
    db: Session = Depends(get_db),
    # KORREKTUR: Verwende den neuen Funktionsnamen
    current_trainer: Trainer = Depends(get_current_trainer)
):
    # KORREKTUR: Verwende den Alias 'get_by_email'
    db_couple = crud_couple.get_by_email(db, email=couple_in.email)
    if db_couple:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered."
        )
    hashed_password = security.get_password_hash(couple_in.password)
    # KORREKTUR: Verwende den Alias 'create'
    couple = crud_couple.create(db=db, couple=couple_in, password_hash=hashed_password)
    return couple

@router.get("/", response_model=List[schemas_couple.CoupleInDB])
def read_couples(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    # KORREKTUR: Verwende den neuen Funktionsnamen
    current_trainer: Trainer = Depends(get_current_trainer)
):
    # KORREKTUR: Verwende den Alias 'get_multi'
    couples = crud_couple.get_multi(db, skip=skip, limit=limit)
    return couples

@router.get("/{couple_id}", response_model=schemas_couple.CoupleInDB)
def read_couple(
    couple_id: int,
    db: Session = Depends(get_db),
    # KORREKTUR: Verwende den neuen Funktionsnamen
    current_trainer: Trainer = Depends(get_current_trainer)
):
    # KORREKTUR: Verwende den Alias 'get'
    db_couple = crud_couple.get(db, couple_id=couple_id)
    if db_couple is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Couple not found")
    return db_couple

@router.put("/{couple_id}", response_model=schemas_couple.CoupleInDB)
def update_existing_couple(
    couple_id: int,
    couple_in: schemas_couple.CoupleUpdate,
    db: Session = Depends(get_db),
    # KORREKTUR: Verwende den neuen Funktionsnamen
    current_trainer: Trainer = Depends(get_current_trainer)
):
    # KORREKTUR: Verwende den Alias 'get'
    db_couple = crud_couple.get(db, couple_id=couple_id)
    if db_couple is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Couple not found")
    
    if couple_in.email and couple_in.email != db_couple.email:
        # KORREKTUR: Verwende den Alias 'get_by_email'
        existing_couple_with_new_email = crud_couple.get_by_email(db, email=couple_in.email)
        if existing_couple_with_new_email and existing_couple_with_new_email.id != couple_id:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="New email already registered.")

    # KORREKTUR: Verwende den Alias 'update'
    couple = crud_couple.update(db=db, couple_id=couple_id, couple_in=couple_in)
    return couple

@router.delete("/{couple_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_existing_couple(
    couple_id: int,
    db: Session = Depends(get_db),
    # KORREKTUR: Verwende den neuen Funktionsnamen
    current_trainer: Trainer = Depends(get_current_trainer)
):
    # KORREKTUR: Verwende den Alias 'delete'
    success = crud_couple.delete(db, couple_id=couple_id)
    if not success:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Couple not found")
    return {"message": "Couple deleted successfully"}