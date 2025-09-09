# /DaSpCoRate/backend/app/crud/session.py

from sqlalchemy.orm import Session
from typing import List, Optional

from app.models import session as models_session
from app.schemas import session as schemas_session

# Funktion zum Abrufen einer Session anhand ihrer ID
def get_session(db: Session, session_id: int):
    return db.query(models_session.Session).filter(models_session.Session.id == session_id).first()

# Funktion zum Abrufen mehrerer Sessions (mit Pagination und optional nach Trainer-ID)
def get_sessions(db: Session, trainer_id: Optional[int] = None, skip: int = 0, limit: int = 100) -> List[models_session.Session]:
    query = db.query(models_session.Session)
    if trainer_id:
        query = query.filter(models_session.Session.trainer_id == trainer_id)
    return query.offset(skip).limit(limit).all()

# Funktion zum Erstellen einer neuen Session
def create_session(db: Session, session: schemas_session.SessionCreate, trainer_id: int):
    db_session = models_session.Session(
        session_date=session.session_date,
        title=session.title,
        trainer_id=trainer_id # Die Trainer-ID kommt vom authentifizierten Benutzer
    )
    db.add(db_session)
    db.commit()
    db.refresh(db_session)
    return db_session

# Funktion zum Aktualisieren einer Session
def update_session(db: Session, session_id: int, session_in: schemas_session.SessionUpdate):
    db_session = db.query(models_session.Session).filter(models_session.Session.id == session_id).first()
    if db_session:
        update_data = session_in.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_session, key, value)
        db.add(db_session)
        db.commit()
        db.refresh(db_session)
    return db_session

# Funktion zum Löschen einer Session
def delete_session(db: Session, session_id: int):
    db_session = db.query(models_session.Session).filter(models_session.Session.id == session_id).first()
    if db_session:
        db.delete(db_session)
        db.commit()
        return True
    return False