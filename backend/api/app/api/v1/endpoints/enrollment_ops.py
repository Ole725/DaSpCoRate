# /DaSpCoRate/backend/api/app/api/v1/endpoints/enrollment_ops.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Union

from app.core.database import get_db
from app.schemas import session_enrollment as schemas_enrollment
from app.crud import session_enrollment as crud_enrollment
from app.crud import session as crud_session
from app.crud import couple as crud_couple
from app.dependencies.dependencies import get_trainer_from_token, get_couple_from_token, get_current_user
from app.models.trainer import Trainer
from app.models.couple import Couple
from app.models import rating as models_rating

router = APIRouter()

@router.post("/", response_model=schemas_enrollment.SessionEnrollmentInDB, status_code=status.HTTP_201_CREATED)
def enroll_couple_in_session(
    enrollment_in: schemas_enrollment.SessionEnrollmentCreate,
    db: Session = Depends(get_db),
    current_couple: Couple = Depends(get_couple_from_token)
):
    session = crud_session.get_session(db, session_id=enrollment_in.session_id)
    if not session:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found.")

    existing_enrollment = crud_enrollment.get_enrollment_by_couple_and_session(
        db, couple_id=current_couple.id, session_id=enrollment_in.session_id
    )
    if existing_enrollment:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Couple already enrolled in this session.")

    enrollment = crud_enrollment.create_session_enrollment(
        db, session_id=enrollment_in.session_id, couple_id=current_couple.id
    )
    return enrollment

@router.get("/me", response_model=List[schemas_enrollment.SessionEnrollmentInDB])
def read_my_enrollments(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_couple: Couple = Depends(get_couple_from_token)
):
    enrollments = crud_enrollment.get_enrollments_by_couple(db, couple_id=current_couple.id, skip=skip, limit=limit)
    return enrollments

@router.get("/my-sessions", response_model=List[schemas_enrollment.SessionEnrollmentInDB])
def read_enrollments_for_my_sessions(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_trainer: Trainer = Depends(get_trainer_from_token)
):
    enrollments = crud_enrollment.get_enrollments_for_trainer_sessions(db, trainer_id=current_trainer.id, skip=skip, limit=limit)
    return enrollments

@router.delete("/{enrollment_id}", status_code=status.HTTP_204_NO_CONTENT)
def unenroll_couple_from_session(
    enrollment_id: int,
    db: Session = Depends(get_db),
    current_user: Union[Trainer, Couple] = Depends(get_current_user)
):
    db_enrollment = crud_enrollment.get_enrollment(db, enrollment_id=enrollment_id)
    if not db_enrollment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Enrollment not found.")

    is_authorized = False
    
    if isinstance(current_user, Couple) and db_enrollment.couple_id == current_user.id:
        is_authorized = True
    
    if isinstance(current_user, Trainer):
        session = crud_session.get_session(db, session_id=db_enrollment.session_id)
        if session and session.trainer_id == current_user.id:
            is_authorized = True

    if not is_authorized:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to delete this enrollment.")
    
    db.query(models_rating.Rating).filter(
        models_rating.Rating.session_id == db_enrollment.session_id,
        models_rating.Rating.couple_id == db_enrollment.couple_id
    ).delete(synchronize_session=False)

    success = crud_enrollment.delete_enrollment(db, enrollment_id=enrollment_id)
    if not success:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to unenroll.")
    
    return {"message": "Successfully unenrolled."}

@router.get("/session/{session_id}", response_model=List[schemas_enrollment.SessionEnrollmentInDB])
def read_enrollments_for_specific_session(
    session_id: int,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_trainer: Trainer = Depends(get_trainer_from_token)
):
    session = crud_session.get_session(db, session_id=session_id)
    if not session or session.trainer_id != current_trainer.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found or not authorized.")

    enrollments = crud_enrollment.get_enrollments_by_session(db, session_id=session_id, skip=skip, limit=limit)
    return enrollments