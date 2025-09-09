# /DaSpCoRate/backend/app/api/v1/endpoints/sessions.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Union

from app.core.database import get_db
from app.schemas import session as schemas_session
from app.crud import session as crud_session
# KORREKTUR: Importiere die neuen, korrekten Abhängigkeiten
from app.dependencies.dependencies import get_current_trainer, get_current_user
from app.models.trainer import Trainer
from app.models.couple import Couple

router = APIRouter()

@router.post("/", response_model=schemas_session.SessionInDB, status_code=status.HTTP_201_CREATED)
def create_new_session(
    session_in: schemas_session.SessionCreate,
    db: Session = Depends(get_db),
    # KORREKTUR: Verwende den neuen Funktionsnamen
    current_trainer: Trainer = Depends(get_current_trainer)
):
    session = crud_session.create(db=db, session=session_in, trainer_id=current_trainer.id)
    return session

@router.get("/", response_model=List[schemas_session.SessionInDB])
def read_sessions(
    db: Session = Depends(get_db),
    current_user: Union[Trainer, Couple] = Depends(get_current_user)
):
    if isinstance(current_user, Trainer):
        sessions = crud_session.get_multi(db, trainer_id=current_user.id)
        return sessions
    
    sessions = crud_session.get_multi(db, limit=1000)
    return sessions

@router.get("/{session_id}", response_model=schemas_session.SessionInDB)
def read_session_details(
    session_id: int,
    db: Session = Depends(get_db),
    current_user: Union[Trainer, Couple] = Depends(get_current_user)
):
    db_session = crud_session.get(db, session_id=session_id)
    if db_session is None:
        raise HTTPException(status_code=404, detail="Session not found")
        
    return db_session

@router.put("/{session_id}", response_model=schemas_session.SessionInDB)
def update_existing_session(
    session_id: int,
    session_in: schemas_session.SessionUpdate,
    db: Session = Depends(get_db),
    # KORREKTUR: Verwende den neuen Funktionsnamen
    current_trainer: Trainer = Depends(get_current_trainer)
):
    db_session = crud_session.get(db, session_id=session_id)
    if db_session is None or db_session.trainer_id != current_trainer.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found or not authorized")
    
    session = crud_session.update(db=db, session_id=session_id, session_in=session_in)
    return session

@router.delete("/{session_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_existing_session(
    session_id: int,
    db: Session = Depends(get_db),
    # KORREKTUR: Verwende den neuen Funktionsnamen
    current_trainer: Trainer = Depends(get_current_trainer)
):
    db_session = crud_session.get(db, session_id=session_id)
    if db_session is None or db_session.trainer_id != current_trainer.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found or not authorized")
    
    crud_session.delete(db, session_id=session_id)
    return