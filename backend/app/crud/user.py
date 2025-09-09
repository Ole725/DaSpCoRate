# /DaSpCoRate/backend/app/crud/user.py
from sqlalchemy.orm import Session
from app.core.security import verify_password
# Wir importieren die fertigen, konsistenten CRUD-Objekte
from app.crud.trainer import trainer as crud_trainer
from app.crud.couple import couple as crud_couple

def authenticate(self, db: Session, *, email: str, password: str):
    """
    Authentifiziert einen Benutzer (Trainer oder Paar) synchron.
    """
    # Wir rufen die METHODE auf dem importierten Objekt auf.
    # Python übergibt 'crud_trainer' automatisch als 'self'.
    trainer = crud_trainer.get_by_email(db, email=email)
    if trainer:
        if verify_password(password, trainer.password_hash):
            return trainer

    # Dasselbe für das Paar.
    couple = crud_couple.get_by_email(db, email=email)
    if couple:
        if verify_password(password, couple.password_hash):
            return couple

    return None

user = type('CRUDUser', (), {'authenticate': authenticate})()