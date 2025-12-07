# /DaSpCoRate/backend/app/crud/session.py

from sqlalchemy.orm import Session
from datetime import date
from typing import List, Optional
from app.models.session import Session as SessionModel

from app.models import session as models_session
from app.schemas import session as schemas_session

# Funktion zum Abrufen einer Session anhand ihrer ID
def get_session(self, db: Session, session_id: int):
    return db.query(models_session.Session).filter(models_session.Session.id == session_id).first()

# Funktion zum Abrufen mehrerer Sessions (mit Pagination und optional nach Trainer-ID)
def get_sessions(self, db: Session, trainer_id: Optional[int] = None, skip: int = 0, limit: int = 100) -> List[models_session.Session]:
    query = db.query(models_session.Session)
    if trainer_id:
        query = query.filter(models_session.Session.trainer_id == trainer_id)
    return query.offset(skip).limit(limit).all()

# Funktion zum Erstellen einer neuen Session
def create_session(self, db: Session, session: schemas_session.SessionCreate, trainer_id: int):
    db_session = models_session.Session(
        session_date=session.session_date,
        title=session.title,
        video_url=session.video_url,
        trainer_id=trainer_id,  # Die Trainer-ID kommt vom authentifizierten Benutzer
    )
    db.add(db_session)
    db.commit()
    db.refresh(db_session)
    return db_session

# Funktion zum Aktualisieren einer Session
def update_session(self, db: Session, session_id: int, session_in: schemas_session.SessionUpdate):
    db_session = db.query(models_session.Session).filter(models_session.Session.id == session_id).first()
    if db_session:
        update_data = session_in.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_session, key, value)
        db.add(db_session)
        db.commit()
        db.refresh(db_session)
    return db_session

# Funktion zum Löschen einer Session
def delete_session(self, db: Session, session_id: int):
    db_session = db.query(models_session.Session).filter(models_session.Session.id == session_id).first()
    if db_session:
        db.delete(db_session)
        db.commit()
        return True
    return False

def count_upcoming_sessions(self, db: Session, today: date) -> int:
    return db.query(models_session.Session).filter(models_session.Session.session_date >= today).count()

def count_past_sessions(self, db: Session, today: date) -> int:
    return db.query(models_session.Session).filter(models_session.Session.session_date < today).count()

session = type('CRUDSession', (), {
    'get': get_session,
    'get_multi': get_sessions,
    'create': create_session,
    'update': update_session,
    'delete': delete_session,
    'count_upcoming': count_upcoming_sessions,
    'count_past': count_past_sessions
})()