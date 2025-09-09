# /DaSpCoRate/backend/app/api/v1/endpoints/sessions.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Union
from datetime import date

from app.core.database import get_db
from app.schemas import session as schemas_session
from app.crud import session as crud_session
from app.dependencies.dependencies import get_trainer_from_token, get_current_user
from app.models.trainer import Trainer
from app.models.couple import Couple

router = APIRouter()

# Endpunkt zum Erstellen einer neuen Session (nur für Trainer)
@router.post("/", response_model=schemas_session.SessionInDB, status_code=status.HTTP_201_CREATED)
def create_new_session(
    session_in: schemas_session.SessionCreate,
    db: Session = Depends(get_db),
    current_trainer: Trainer = Depends(get_trainer_from_token)
):
    session = crud_session.create_session(db=db, session=session_in, trainer_id=current_trainer.id)
    return session

# EIN Endpunkt zum Abrufen von Sessions
@router.get("/", response_model=List[schemas_session.SessionInDB])
def read_sessions(
    db: Session = Depends(get_db),
    # Akzeptiere jeden eingeloggten Benutzer (Trainer oder Paar)
    current_user: Union[Trainer, Couple] = Depends(get_current_user)
):
    # Wenn der Benutzer ein Trainer ist, gib nur seine Sessions zurück
    if isinstance(current_user, Trainer):
        sessions = crud_session.get_sessions(db, trainer_id=current_user.id)
        return sessions
    
    # Wenn der Benutzer ein Paar ist (oder ein anderer Typ), gib alle Sessions zurück
    # Paare brauchen alle Sessions, um die Titel/Daten für ihre Bewertungen zu finden.
    sessions = crud_session.get_sessions(db, limit=1000)
    return sessions

# Endpunkt zum Abrufen der Details EINER einzelnen Session nach ID
@router.get("/{session_id}", response_model=schemas_session.SessionInDB)
def read_session_details(
    session_id: int,
    db: Session = Depends(get_db),
    current_user: Union[Trainer, Couple] = Depends(get_current_user)
):
    db_session = crud_session.get_session(db, session_id=session_id)
    if db_session is None:
        raise HTTPException(status_code=404, detail="Session not found")
    
    # Optional: Zusätzliche Sicherheitsprüfung, wenn nur der eigene Trainer die Details sehen darf
    # if isinstance(current_user, Trainer) and db_session.trainer_id != current_user.id:
    #     raise HTTPException(status_code=403, detail="Not authorized to view this session's details")
        
    return db_session

# Endpunkt zum Aktualisieren einer Session (nur für Trainer)
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

# Endpunkt zum Löschen einer Session (nur für Trainer)
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