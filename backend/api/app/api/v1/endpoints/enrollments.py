# /DaSpCoRate/backend/api/app/api/v1/endpoints/enrollments.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.schemas import session_enrollment as schemas_enrollment
from app.crud import session_enrollment as crud_enrollment
from app.crud import session as crud_session # Benötigt, um zu prüfen, ob Session existiert
from app.crud import couple as crud_couple
from app.dependencies.dependencies import get_trainer_from_token, get_couple_from_token # Trainer UND Paare
from app.models.trainer import Trainer
from app.models.couple import Couple
from app.models import session_enrollment as models_enrollment

router = APIRouter()

# Endpunkt für Paare: Anmeldung zu einer Session
@router.post("/", response_model=schemas_enrollment.SessionEnrollmentInDB, status_code=status.HTTP_201_CREATED)
def enroll_couple_in_session(
    enrollment_in: schemas_enrollment.SessionEnrollmentCreate,
    db: Session = Depends(get_db),
    current_couple: Couple = Depends(get_couple_from_token) # Nur authentifizierte Paare können sich anmelden
):
    # 1. Prüfen, ob die Session existiert
    session = crud_session.get_session(db, session_id=enrollment_in.session_id)
    if not session:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found.")

    # 2. Prüfen, ob das Paar bereits für diese Session angemeldet ist
    existing_enrollment = crud_enrollment.get_enrollment_by_couple_and_session(
        db, couple_id=current_couple.id, session_id=enrollment_in.session_id
    )
    if existing_enrollment:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Couple already enrolled in this session.")

    # 3. Anmeldung erstellen
    enrollment = crud_enrollment.create_session_enrollment(
        db, session_id=enrollment_in.session_id, couple_id=current_couple.id
    )
    return enrollment

# Endpunkt für Paare: Eigene Anmeldungen abrufen
@router.get("/me", response_model=List[schemas_enrollment.SessionEnrollmentInDB])
def read_my_enrollments(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_couple: Couple = Depends(get_couple_from_token) # Nur authentifizierte Paare können ihre eigenen Anmeldungen sehen
):
    enrollments = crud_enrollment.get_enrollments_by_couple(db, couple_id=current_couple.id, skip=skip, limit=limit)
    return enrollments

# Endpunkt für Trainer: Anmeldungen für IHRE Sessions abrufen
@router.get("/my-sessions", response_model=List[schemas_enrollment.SessionEnrollmentInDB])
def read_enrollments_for_my_sessions(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_trainer: Trainer = Depends(get_trainer_from_token) # Nur authentifizierte Trainer
):
    enrollments = crud_enrollment.get_enrollments_for_trainer_sessions(db, trainer_id=current_trainer.id, skip=skip, limit=limit)
    return enrollments

# Endpunkt für Paare: Abmeldung von einer Session
@router.delete("/{enrollment_id}", status_code=status.HTTP_204_NO_CONTENT)
def unenroll_couple_from_session(
    enrollment_id: int,
    db: Session = Depends(get_db),
    current_couple: Couple = Depends(get_couple_from_token) # Nur das angemeldete Paar kann sich abmelden
):
    db_enrollment = crud_enrollment.get_enrollment(db, enrollment_id=enrollment_id)
    if not db_enrollment or db_enrollment.couple_id != current_couple.id:
        # Stelle sicher, dass nur das eigene Paar oder ein berechtigter Admin die Anmeldung löschen kann
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Enrollment not found or not authorized.")
    
    success = crud_enrollment.delete_enrollment(db, enrollment_id=enrollment_id)
    if not success:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to unenroll from session.")
    return {"message": "Successfully unenrolled from session."}

# Optional: Ein Endpunkt für Trainer, um Anmeldungen für EINE spezifische ihrer Sessions abzurufen (Detailansicht)
@router.get("/session/{session_id}", response_model=List[schemas_enrollment.SessionEnrollmentInDB])
def read_enrollments_for_specific_session(
    session_id: int,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_trainer: Trainer = Depends(get_trainer_from_token)
):
    # Prüfen, ob die Session dem aktuellen Trainer gehört
    session = crud_session.get_session(db, session_id=session_id)
    if not session or session.trainer_id != current_trainer.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found or not authorized.")

    enrollments = crud_enrollment.get_enrollments_by_session(db, session_id=session_id, skip=skip, limit=limit)
    return enrollments

# --- ENDPUNKT FÜR TRAINER ---
@router.post("/by-trainer", response_model=schemas_enrollment.SessionEnrollmentInDB, status_code=status.HTTP_201_CREATED)
def enroll_couple_by_trainer(
    enrollment_in: schemas_enrollment.SessionEnrollmentCreate, # Nimmt jetzt das ganze Objekt
    db: Session = Depends(get_db),
    current_trainer: Trainer = Depends(get_trainer_from_token)
):
    # 1. Prüfen, ob die Session existiert und dem Trainer gehört
    session = crud_session.get_session(db, session_id=enrollment_in.session_id)
    if not session or session.trainer_id != current_trainer.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found or not authorized.")
    
    # 2. Prüfen, ob das Paar existiert (HIER DIE KORREKTUR)
    couple = crud_couple.get_couple(db, couple_id=enrollment_in.couple_id)
    if not couple:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Couple not found.")

    # 3. Prüfen, ob das Paar bereits angemeldet ist (HIER DIE KORREKTUR)
    existing_enrollment = crud_enrollment.get_enrollment_by_couple_and_session(
        db, couple_id=enrollment_in.couple_id, session_id=enrollment_in.session_id
    )
    if existing_enrollment:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Couple already enrolled in this session.")

    # 4. Prüfen, ob die Startnummer bereits vergeben ist
    existing_start_number = db.query(models_enrollment.SessionEnrollment).filter(
        models_enrollment.SessionEnrollment.session_id == enrollment_in.session_id,
        models_enrollment.SessionEnrollment.start_number == enrollment_in.start_number
    ).first()
    if existing_start_number:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Start number already assigned in this session.")

    # 5. Anmeldung erstellen (HIER DIE KORREKTUR)
    enrollment = crud_enrollment.create_session_enrollment(
        db, 
        session_id=enrollment_in.session_id, 
        couple_id=enrollment_in.couple_id,
        start_number=enrollment_in.start_number
    )
    return enrollment