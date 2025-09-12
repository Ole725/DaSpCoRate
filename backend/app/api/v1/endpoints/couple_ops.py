from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Union

from app.core.database import get_db
from app.schemas import couple as schemas_couple
from app.crud import couple as crud_couple
from app.dependencies import dependencies
from app.models.trainer import Trainer
from app.models.admin import Admin
from app.models.couple import Couple

router = APIRouter()

# --- ENDPUNKT NUR FÜR PAARE (EIGENES PROFIL) ---
@router.put("/me", response_model=schemas_couple.CoupleInDB)
def update_my_own_profile(
    couple_in: schemas_couple.CoupleUpdate,
    db: Session = Depends(get_db),
    current_couple: Couple = Depends(dependencies.get_current_couple)
):
    """Update own couple profile. Accessible only by the logged-in couple."""
    return crud_couple.update(db=db, couple_id=current_couple.id, couple_in=couple_in)


# --- GEMEINSAME LOGIK ZUM LADEN VON PAAREN (FÜR ADMIN & TRAINER) ---
# Diese Funktion enthält die Berechtigungsprüfung und die Datenbankabfrage.
def get_couples_for_management(
    db: Session = Depends(get_db),
    current_user: Union[Trainer, Admin] = Depends(dependencies.get_current_trainer_or_admin)
) -> List[Couple]:
    """Shared logic to retrieve a list of couples for Admins and Trainers."""
    return crud_couple.get_multi(db, skip=0, limit=1000)


# --- ENDPUNKTE FÜR MANAGEMENT (ADMIN & TRAINER) ---

# Endpunkt für Trainer: GET /couples/
@router.get("/", response_model=List[schemas_couple.CoupleInDB])
def get_all_couples_for_trainer(couples: List[Couple] = Depends(get_couples_for_management)):
    """Handles requests from the trainer's couple management page."""
    return couples

# Endpunkt für Admins: GET /couples/all
@router.get("/all", response_model=List[schemas_couple.CoupleInDB])
def get_all_couples_for_admin(couples: List[Couple] = Depends(get_couples_for_management)):
    """Handles requests from the admin's couple management page."""
    return couples

# Endpunkt zum Erstellen für BEIDE Rollen: POST /couples/
@router.post("/", response_model=schemas_couple.CoupleInDB, status_code=status.HTTP_201_CREATED)
def create_couple(
    couple_in: schemas_couple.CoupleCreate,
    db: Session = Depends(get_db),
    current_user: Union[Trainer, Admin] = Depends(dependencies.get_current_trainer_or_admin)
):
    """Create a new couple. Accessible by Admins and Trainers."""
    if crud_couple.get_by_email(db, email=couple_in.email):
        raise HTTPException(status_code=400, detail="A couple with this email already exists.")
    return crud_couple.create(db=db, couple=couple_in)

# Die restlichen Endpunkte für Update/Delete, die ebenfalls für beide Rollen funktionieren
@router.put("/{couple_id}", response_model=schemas_couple.CoupleInDB)
def update_a_couple(
    couple_id: int,
    couple_in: schemas_couple.CoupleUpdate,
    db: Session = Depends(get_db),
    current_user: Union[Trainer, Admin] = Depends(dependencies.get_current_trainer_or_admin)
):
    db_couple = crud_couple.get(db, couple_id=couple_id)
    if not db_couple:
        raise HTTPException(status_code=404, detail="Couple not found.")
    return crud_couple.update(db=db, couple_id=couple_id, couple_in=couple_in)

@router.delete("/{couple_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_a_couple(
    couple_id: int,
    db: Session = Depends(get_db),
    current_user: Union[Trainer, Admin] = Depends(dependencies.get_current_trainer_or_admin)
):
    if not crud_couple.delete(db, couple_id=couple_id):
        raise HTTPException(status_code=404, detail="Couple not found.")
    return