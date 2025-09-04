# /DaSpCoRate/backend/api/app/api/v1/endpoints/sessions.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date # Für den Typ Hinting von session_date

from app.core.database import get_db
from app.schemas import session as schemas_session
from app.crud import session as crud_session
from app.dependencies.dependencies import get_trainer_from_token # Nur Trainer dürfen Sessions verwalten
from app.models.trainer import Trainer # Für Type Hinting

router = APIRouter()

# Endpunkt zum Erstellen einer neuen Session (nur für authentifizierte Trainer)
@router.post("/", response_model=schemas_session.SessionInDB, status_code=status.HTTP_201_CREATED)
def create_new_session(
    session_in: schemas_session.SessionCreate,
    db: Session = Depends(get_db),
    current_trainer: Trainer = Depends(get_trainer_from_token)
):
    session = crud_session.create_session(db=db, session=session_in, trainer_id=current_trainer.id)
    return session

# Endpunkt zum Abrufen aller Sessions (optional nach Trainer-ID filtern)
# Ein Trainer sieht standardmäßig nur seine eigenen Sessions.
# Für einen Admin (später) könnte man alle Sessions erlauben.
@router.get("/", response_model=List[schemas_session.SessionInDB])
def read_sessions(
    only_my_sessions: bool = True, # Parameter, um nur eigene Sessions zu sehen
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_trainer: Trainer = Depends(get_trainer_from_token) # Authentifizierung als Trainer
):
    trainer_id_filter = current_trainer.id if only_my_sessions else None
    # Wenn only_my_sessions False ist, könnte ein Admin alle Sessions sehen.
    # Für den Moment lassen wir trainer_id_filter immer auf current_trainer.id,
    # da nur Trainer diesen Endpunkt nutzen und nur ihre Sessions sehen sollen.
    # Ein "Admin"-Konzept müsste hier erst noch implementiert werden.
    sessions = crud_session.get_sessions(db, trainer_id=current_trainer.id, skip=skip, limit=limit)
    return sessions

# Endpunkt zum Abrufen einer einzelnen Session nach ID
@router.get("/{session_id}", response_model=schemas_session.SessionInDB)
def read_session(
    session_id: int,
    db: Session = Depends(get_db),
    current_trainer: Trainer = Depends(get_trainer_from_token)
):
    db_session = crud_session.get_session(db, session_id=session_id)
    if db_session is None or db_session.trainer_id != current_trainer.id:
        # Stelle sicher, dass nur der eigene Trainer oder ein berechtigter Admin auf die Session zugreifen kann
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found or not authorized")
    return db_session

# Endpunkt zum Aktualisieren einer Session (nur für den erstellenden Trainer)
@router.put("/{session_id}", response_model=schemas_session.SessionInDB)
def update_existing_session(
    session_id: int,
    session_in: schemas_session.SessionUpdate,
    db: Session = Depends(get_db),
    current_trainer: Trainer = Depends(get_trainer_from_token)
):
    db_session = crud_session.get_session(db, session_id=session_id)
    if db_session is None or db_session.trainer_id != current_trainer.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found or not authorized")
    
    session = crud_session.update_session(db=db, session_id=session_id, session_in=session_in)
    return session

# Endpunkt zum Löschen einer Session (nur für den erstellenden Trainer)
@router.delete("/{session_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_existing_session(
    session_id: int,
    db: Session = Depends(get_db),
    current_trainer: Trainer = Depends(get_trainer_from_token)
):
    db_session = crud_session.get_session(db, session_id=session_id)
    if db_session is None or db_session.trainer_id != current_trainer.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found or not authorized")
    
    success = crud_session.delete_session(db, session_id=session_id)
    if not success:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to delete session")
    return {"message": "Session deleted successfully"}