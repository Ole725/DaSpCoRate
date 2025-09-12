# /DaSpCoRate/backend/app/api/v1/endpoints/trainer_ops.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.schemas import trainer as schemas_trainer
from app.crud import trainer as crud_trainer
from app.dependencies import dependencies
from app.models.admin import Admin

router = APIRouter()

@router.post("/", response_model=schemas_trainer.TrainerInDB, status_code=status.HTTP_201_CREATED, tags=["Trainer Management (Admin)"])
def create_new_trainer(
    trainer_in: schemas_trainer.TrainerCreate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(dependencies.get_current_admin)
):
    """
    Create a new trainer. Only accessible by an admin.
    """
    # Prüfen, ob die E-Mail bereits existiert
    if crud_trainer.get_by_email(db, email=trainer_in.email):
        raise HTTPException(status_code=400, detail="A trainer with this email already exists.")
    
    # Die create-Methode aus dem CRUD-Modul aufrufen
    return crud_trainer.create(db=db, trainer=trainer_in)

@router.get("/", response_model=List[schemas_trainer.TrainerInDB], tags=["Trainer Management (Admin)"])
def get_all_trainers(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(dependencies.get_current_admin)
):
    """
    Retrieve a list of all trainers. Only accessible by an admin.
    """
    trainers = crud_trainer.get_multi(db, skip=skip, limit=limit)
    return trainers

@router.put("/{trainer_id}", response_model=schemas_trainer.TrainerInDB, tags=["Trainer Management (Admin)"])
def update_a_trainer(
    trainer_id: int,
    trainer_in: schemas_trainer.TrainerUpdate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(dependencies.get_current_admin)
):
    """
    Update a trainer's information. Only accessible by an admin.
    """
    db_trainer = crud_trainer.get(db, trainer_id=trainer_id)
    if not db_trainer:
        raise HTTPException(status_code=404, detail="Trainer not found.")
    
    # Prüfen, ob die neue E-Mail bereits von einem anderen Trainer verwendet wird
    if trainer_in.email and crud_trainer.get_by_email(db, email=trainer_in.email):
        if db_trainer.email != trainer_in.email:
            raise HTTPException(status_code=400, detail="This email is already registered to another trainer.")

    return crud_trainer.update(db=db, trainer_id=trainer_id, trainer_in=trainer_in)

@router.delete("/{trainer_id}", status_code=status.HTTP_204_NO_CONTENT, tags=["Trainer Management (Admin)"])
def delete_a_trainer(
    trainer_id: int,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(dependencies.get_current_admin)
):
    """
    Delete a trainer. Only accessible by an admin.
    """
    if not crud_trainer.delete(db, trainer_id=trainer_id):
        raise HTTPException(status_code=404, detail="Trainer not found.")
    return