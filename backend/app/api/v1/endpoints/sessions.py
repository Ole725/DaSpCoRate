# /DaSpCoRate/backend/app/api/v1/endpoints/sessions.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Union

from app.core.database import get_db
from app.schemas import session as schemas_session
from app.crud import session as crud_session
from app.dependencies import dependencies
from app.models.trainer import Trainer
from app.models.admin import Admin

router = APIRouter()

# --- GEMEINSAME LOGIK ZUM LADEN VON SESSIONS ---
def get_sessions_for_management(
    db: Session = Depends(get_db),
    current_user = Depends(dependencies.get_current_user)
) -> List[schemas_session.SessionInDB]:
    """Shared logic to retrieve sessions for ANY authenticated user."""
    return crud_session.get_multi(db, limit=1000)

# --- ENDPUNKTE ---

# Endpunkt für Trainer: GET /sessions/
@router.get("/", response_model=List[schemas_session.SessionInDB], summary="Get All Sessions (for Trainers)")
def get_all_sessions_for_trainer(sessions: List[schemas_session.SessionInDB] = Depends(get_sessions_for_management)):
    return sessions

# Endpunkt für Admins: GET /sessions/all
@router.get("/all", response_model=List[schemas_session.SessionInDB], summary="Get All Sessions (for Admins)")
def get_all_sessions_for_admin(sessions: List[schemas_session.SessionInDB] = Depends(get_sessions_for_management)):
    return sessions

# Die restlichen Endpunkte bleiben wie sie waren
@router.post("/", response_model=schemas_session.SessionInDB, status_code=status.HTTP_201_CREATED)
def create_new_session(
    session_in: schemas_session.SessionCreate,
    db: Session = Depends(get_db),
    current_trainer: Trainer = Depends(dependencies.get_current_trainer)
):
    return crud_session.create(db=db, session=session_in, trainer_id=current_trainer.id)

@router.delete("/{session_id}", status_code=status.HTTP_204_NO_CONTENT)

@router.get("/{session_id}", response_model=schemas_session.SessionInDB)
def get_single_session(
    session_id: int,
    db: Session = Depends(get_db),
    # Jeder eingeloggte User (Admin, Trainer, Paar) kann Session-Details sehen
    current_user = Depends(dependencies.get_current_user)
):
    db_session = crud_session.get(db, session_id=session_id)
    if not db_session:
        raise HTTPException(status_code=404, detail="Session not found.")
    return db_session

def delete_a_session(
    session_id: int,
    db: Session = Depends(get_db),
    current_trainer: Trainer = Depends(dependencies.get_current_trainer)
):
    db_session = crud_session.get(db, session_id=session_id)
    if not db_session:
        raise HTTPException(status_code=404, detail="Session not found.")
    if db_session.trainer_id != current_trainer.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this session.")
    crud_session.delete(db, session_id=session_id)
    return