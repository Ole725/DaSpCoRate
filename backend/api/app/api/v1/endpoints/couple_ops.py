# /DaSpCoRate/backend/api/app/api/v1/endpoints/couple_ops.py <--- Neuer Dateiname!

import logging
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core import security
from app.core.database import get_db
from app.schemas import couple as schemas_couple
from app.crud import couple as crud_couple
# Importiere die Abhängigkeiten unter eindeutigen Aliasen
from app.dependencies.dependencies import get_trainer_from_token, \
                                        get_couple_from_token
from app.models.trainer import Trainer
from app.models.couple import Couple

router = APIRouter()

# --- Endpunkte für Paare (Verwaltung des EIGENEN Profils - DIES MUSS ZUERST KOMMEN) ---

@router.put("/me", response_model=schemas_couple.CoupleInDB)
def update_my_couple_profile(
    couple_in: schemas_couple.CoupleUpdate,
    db: Session = Depends(get_db),
    current_couple: Couple = Depends(get_couple_from_token)
):
    logger.debug(f"update_my_couple_profile (Couple): current_couple object type is {type(current_couple)}")
    if not isinstance(current_couple, Couple):
         raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Authentication Error: Expected a Couple object, but got {type(current_couple)}."
        )

    if couple_in.email and couple_in.email != current_couple.email:
        existing_couple_with_new_email = crud_couple.get_couple_by_email(db, email=couple_in.email)
        if existing_couple_with_new_email:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="New email already registered for another couple.")

    couple = crud_couple.update_couple(db=db, couple_id=current_couple.id, couple_in=couple_in)
    logger.debug(f"update_my_couple_profile (Couple): Successfully updated couple ID {couple.id}")
    return couple

# --- Endpunkte für Trainer (Verwaltung von Paaren) ---

@router.post("/", response_model=schemas_couple.CoupleInDB, status_code=status.HTTP_201_CREATED)
def create_new_couple(
    couple_in: schemas_couple.CoupleCreate,
    db: Session = Depends(get_db),
    current_trainer: Trainer = Depends(get_trainer_from_token)
):
    logger.debug(f"create_new_couple (Trainer): Attempting to create couple with email {couple_in.email}")
    db_couple = crud_couple.get_couple_by_email(db, email=couple_in.email)
    if db_couple:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered for a couple."
        )
    hashed_password = security.get_password_hash(couple_in.password)
    couple = crud_couple.create_couple(db=db, couple=couple_in, password_hash=hashed_password)
    logger.debug(f"create_new_couple (Trainer): Successfully created couple ID {couple.id}")
    return couple

@router.get("/", response_model=List[schemas_couple.CoupleInDB])
def read_couples(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_trainer: Trainer = Depends(get_trainer_from_token)
):
    logger.debug(f"read_couples (Trainer): Fetching all couples.")
    couples = crud_couple.get_couples(db, skip=skip, limit=limit)
    return couples

@router.get("/{couple_id}", response_model=schemas_couple.CoupleInDB)
def read_couple(
    couple_id: int,
    db: Session = Depends(get_db),
    current_trainer: Trainer = Depends(get_trainer_from_token)
):
    logger.debug(f"read_couple (Trainer): Fetching couple ID {couple_id}.")
    db_couple = crud_couple.get_couple(db, couple_id=couple_id)
    if db_couple is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Couple not found")
    return db_couple

@router.put("/{couple_id}", response_model=schemas_couple.CoupleInDB)
def update_existing_couple(
    couple_id: int,
    couple_in: schemas_couple.CoupleUpdate,
    db: Session = Depends(get_db),
    current_trainer: Trainer = Depends(get_trainer_from_token) # <--- Das ist KORREKT
):
    logger.debug(f"update_existing_couple (Trainer): Updating couple ID {couple_id}.")
    db_couple = crud_couple.get_couple(db, couple_id=couple_id)
    if db_couple is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Couple not found")
    
    # Prüfen, ob die neue E-Mail bereits von einem ANDEREN Paar verwendet wird
    if couple_in.email and couple_in.email != db_couple.email:
        existing_couple_with_new_email = crud_couple.get_couple_by_email(db, email=couple_in.email)
        if existing_couple_with_new_email and existing_couple_with_new_email.id != couple_id:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="New email already registered for another couple.")

    couple = crud_couple.update_couple(db=db, couple_id=couple_id, couple_in=couple_in)
    logger.debug(f"update_existing_couple (Trainer): Successfully updated couple ID {couple.id}.")
    return couple

@router.delete("/{couple_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_existing_couple(
    couple_id: int,
    db: Session = Depends(get_db),
    current_trainer: Trainer = Depends(get_trainer_from_token)
):
    logger.debug(f"delete_existing_couple (Trainer): Deleting couple ID {couple_id}.")
    success = crud_couple.delete_couple(db, couple_id=couple_id)
    if not success:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Couple not found")
    logger.debug(f"delete_existing_couple (Trainer): Successfully deleted couple ID {couple_id}.")
    return {"message": "Couple deleted successfully"}