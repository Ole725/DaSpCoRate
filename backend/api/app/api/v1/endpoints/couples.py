# /DaSpCoRate/backend/api/app/api/v1/endpoints/couples.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core import security # Wird benötigt für Passwort-Hashing bei Registrierung
from app.core.database import get_db
from app.schemas import couple as schemas_couple
from app.crud import couple as crud_couple
from app.dependencies.dependencies import get_current_trainer # Wir brauchen einen Weg, um den authentifizierten Trainer zu bekommen!
from app.models.trainer import Trainer # Importieren, um den Typ für get_current_trainer zu haben

router = APIRouter()

# Endpunkt zum Erstellen eines neuen Paares (nur für authentifizierte Trainer)
@router.post("/", response_model=schemas_couple.CoupleInDB, status_code=status.HTTP_201_CREATED)
def create_new_couple(
    couple_in: schemas_couple.CoupleCreate,
    db: Session = Depends(get_db),
    current_trainer: Trainer = Depends(get_current_trainer) # Abhängigkeit, um Trainer zu authentifizieren
):
    db_couple = crud_couple.get_couple_by_email(db, email=couple_in.email)
    if db_couple:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered for a couple."
        )
    # Für die Paar-Registrierung benötigen wir ein gehashtes Passwort
    hashed_password = security.get_password_hash(couple_in.password)
    couple = crud_couple.create_couple(db=db, couple=couple_in, password_hash=hashed_password)
    return couple

# Endpunkt zum Abrufen aller Paare (nur für authentifizierte Trainer)
@router.get("/", response_model=List[schemas_couple.CoupleInDB])
def read_couples(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_trainer: Trainer = Depends(get_current_trainer)
):
    couples = crud_couple.get_couples(db, skip=skip, limit=limit)
    return couples

# Endpunkt zum Abrufen eines einzelnen Paares nach ID (nur für authentifizierte Trainer)
@router.get("/{couple_id}", response_model=schemas_couple.CoupleInDB)
def read_couple(
    couple_id: int,
    db: Session = Depends(get_db),
    current_trainer: Trainer = Depends(get_current_trainer)
):
    db_couple = crud_couple.get_couple(db, couple_id=couple_id)
    if db_couple is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Couple not found")
    return db_couple

# Endpunkt zum Aktualisieren eines Paares (nur für authentifizierte Trainer)
@router.put("/{couple_id}", response_model=schemas_couple.CoupleInDB)
def update_existing_couple(
    couple_id: int,
    couple_in: schemas_couple.CoupleUpdate,
    db: Session = Depends(get_db),
    current_trainer: Trainer = Depends(get_current_trainer)
):
    db_couple = crud_couple.get_couple(db, couple_id=couple_id)
    if db_couple is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Couple not found")
    
    # Optional: E-Mail-Validierung bei Änderung, falls neue E-Mail bereits existiert
    if couple_in.email and couple_in.email != db_couple.email:
        existing_couple_with_new_email = crud_couple.get_couple_by_email(db, email=couple_in.email)
        if existing_couple_with_new_email:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="New email already registered for another couple.")

    couple = crud_couple.update_couple(db=db, couple_id=couple_id, couple_in=couple_in)
    return couple

# Endpunkt zum Löschen eines Paares (nur für authentifizierte Trainer)
@router.delete("/{couple_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_existing_couple(
    couple_id: int,
    db: Session = Depends(get_db),
    current_trainer: Trainer = Depends(get_current_trainer)
):
    success = crud_couple.delete_couple(db, couple_id=couple_id)
    if not success:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Couple not found")
    return {"message": "Couple deleted successfully"}