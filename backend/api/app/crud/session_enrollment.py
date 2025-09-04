# /DaSpCoRate/backend/api/app/crud/session_enrollment.py

from sqlalchemy.orm import Session, joinedload
from typing import List, Optional

from app.models import session_enrollment as models_enrollment
from app.models import session as models_session # Import für spätere Joins
from app.models import couple as models_couple   # Import für spätere Joins
from app.schemas import session_enrollment as schemas_enrollment

# Funktion zum Abrufen einer Anmeldung anhand ihrer ID
def get_enrollment(db: Session, enrollment_id: int):
    return db.query(models_enrollment.SessionEnrollment).filter(models_enrollment.SessionEnrollment.id == enrollment_id).first()

# Funktion zum Abrufen einer spezifischen Anmeldung eines Paares für eine Session
def get_enrollment_by_couple_and_session(db: Session, couple_id: int, session_id: int):
    return db.query(models_enrollment.SessionEnrollment).filter(
        models_enrollment.SessionEnrollment.couple_id == couple_id,
        models_enrollment.SessionEnrollment.session_id == session_id
    ).first()

# Funktion zum Abrufen aller Anmeldungen für ein bestimmtes Paar
def get_enrollments_by_couple(db: Session, couple_id: int, skip: int = 0, limit: int = 100) -> List[models_enrollment.SessionEnrollment]:
    return db.query(models_enrollment.SessionEnrollment).filter(
        models_enrollment.SessionEnrollment.couple_id == couple_id
    ).offset(skip).limit(limit).all()

# Funktion zum Abrufen aller Anmeldungen für eine bestimmte Session (z.B. für Trainer)
def get_enrollments_by_session(db: Session, session_id: int, skip: int = 0, limit: int = 100) -> List[models_enrollment.SessionEnrollment]:
    return db.query(models_enrollment.SessionEnrollment).filter(
        models_enrollment.SessionEnrollment.session_id == session_id
    ).offset(skip).limit(limit).all()

# Funktion zum Abrufen aller Anmeldungen für Sessions eines bestimmten Trainers
def get_enrollments_for_trainer_sessions(db: Session, trainer_id: int, skip: int = 0, limit: int = 100) -> List[models_enrollment.SessionEnrollment]:
    return db.query(models_enrollment.SessionEnrollment).join(models_session.Session).filter(
        models_session.Session.trainer_id == trainer_id
    ).offset(skip).limit(limit).all()

# Funktion zum Erstellen einer neuen Session-Anmeldung
def create_session_enrollment(db: Session, session_id: int, couple_id: int):
    db_enrollment = models_enrollment.SessionEnrollment(
        session_id=session_id,
        couple_id=couple_id
    )
    db.add(db_enrollment)
    db.commit()
    db.refresh(db_enrollment)
    return db_enrollment

# Funktion zum Löschen einer Session-Anmeldung
def delete_enrollment(db: Session, enrollment_id: int):
    db_enrollment = db.query(models_enrollment.SessionEnrollment).filter(models_enrollment.SessionEnrollment.id == enrollment_id).first()
    if db_enrollment:
        db.delete(db_enrollment)
        db.commit()
        return True
    return False