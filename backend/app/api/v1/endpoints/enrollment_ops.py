# /DaSpCoRate/backend/app/api/v1/endpoints/enrollment_ops.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Union

from app.core.database import get_db
from app.schemas import session_enrollment as schemas_enrollment
from app.crud import session_enrollment as crud_enrollment
from app.crud import session as crud_session
from app.crud import couple as crud_couple
# KORREKTUR: Importiere die neuen, korrekten Abhängigkeiten
from app.dependencies.dependencies import get_current_trainer, get_current_couple, get_current_user
from app.models.trainer import Trainer
from app.models.couple import Couple
from app.models import rating as models_rating

router = APIRouter()

@router.post("/", response_model=schemas_enrollment.SessionEnrollmentInDB, status_code=status.HTTP_201_CREATED)
def enroll_couple_in_session(
    enrollment_in: schemas_enrollment.CoupleEnrollmentCreate,
    db: Session = Depends(get_db),
    # KORREKTUR: Verwende den neuen Funktionsnamen
    current_couple: Couple = Depends(get_current_couple)
):
    session = crud_session.get(db, session_id=enrollment_in.session_id)
    if not session:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found.")

    existing_enrollment = crud_enrollment.get_by_couple_and_session(
        db, couple_id=current_couple.id, session_id=enrollment_in.session_id
    )
    if existing_enrollment:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Couple already enrolled.")

    enrollment = crud_enrollment.create(
        db=db, session_id=enrollment_in.session_id, couple_id=current_couple.id
    )
    return enrollment

@router.get("/me", response_model=List[schemas_enrollment.SessionEnrollmentInDB])
def read_my_enrollments(
    db: Session = Depends(get_db),
    # KORREKTUR: Verwende den neuen Funktionsnamen
    current_couple: Couple = Depends(get_current_couple)
):
    enrollments = crud_enrollment.get_by_couple(db, couple_id=current_couple.id)
    return enrollments

@router.get("/my-sessions", response_model=List[schemas_enrollment.SessionEnrollmentInDB])
def read_enrollments_for_my_sessions(
    db: Session = Depends(get_db),
    # KORREKTUR: Verwende den neuen Funktionsnamen
    current_trainer: Trainer = Depends(get_current_trainer)
):
    enrollments = crud_enrollment.get_for_trainer(db, trainer_id=current_trainer.id)
    return enrollments

@router.post("/by-trainer", response_model=schemas_enrollment.SessionEnrollmentInDB, status_code=status.HTTP_201_CREATED)
def enroll_couple_by_trainer(
    enrollment_in: schemas_enrollment.TrainerEnrollmentCreate,
    db: Session = Depends(get_db),
    # KORREKTUR: Verwende den neuen Funktionsnamen
    current_trainer: Trainer = Depends(get_current_trainer)
):
    session = crud_session.get(db, session_id=enrollment_in.session_id)
    if not session or session.trainer_id != current_trainer.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found or not authorized.")
    
    couple = crud_couple.get(db, couple_id=enrollment_in.couple_id)
    if not couple:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Couple not found.")

    existing_enrollment = crud_enrollment.get_by_couple_and_session(
        db, couple_id=enrollment_in.couple_id, session_id=enrollment_in.session_id
    )
    if existing_enrollment:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Couple already enrolled.")

    enrollment = crud_enrollment.create(
        db=db, 
        session_id=enrollment_in.session_id, 
        couple_id=enrollment_in.couple_id,
        start_number=enrollment_in.start_number
    )
    return enrollment

@router.get("/session/{session_id}", response_model=List[schemas_enrollment.SessionEnrollmentInDB])
def read_enrollments_for_specific_session(
    session_id: int,
    db: Session = Depends(get_db),
    # KORREKTUR: Verwende den neuen Funktionsnamen
    current_trainer: Trainer = Depends(get_current_trainer)
):
    session = crud_session.get(db, session_id=session_id)
    if not session or session.trainer_id != current_trainer.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found or not authorized.")

    enrollments = crud_enrollment.get_by_session(db, session_id=session_id)
    return enrollments

@router.delete("/{enrollment_id}", status_code=status.HTTP_204_NO_CONTENT)
def unenroll_couple_from_session(
    enrollment_id: int,
    db: Session = Depends(get_db),
    current_user: Union[Trainer, Couple] = Depends(get_current_user)
):
    db_enrollment = crud_enrollment.get(db, enrollment_id=enrollment_id)
    if not db_enrollment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Enrollment not found.")

    is_authorized = False
    if isinstance(current_user, Couple) and db_enrollment.couple_id == current_user.id:
        is_authorized = True
    elif isinstance(current_user, Trainer):
        session = crud_session.get(db, session_id=db_enrollment.session_id)
        if session and session.trainer_id == current_user.id:
            is_authorized = True

    if not is_authorized:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized.")
    
    crud_enrollment.delete(db, enrollment_id=enrollment_id)
    return