# /DaSpCoRate/backend/app/crud/couple.py

from sqlalchemy.orm import Session
from app.models import couple as models_couple
from app.schemas import couple as schemas_couple
from app.core import security # Wird benötigt für Passwort-Hashing bei Registrierung
from typing import Optional

# Funktion zum Abrufen eines Paares anhand seiner ID
def get_couple(self, db: Session, couple_id: int):
    return db.query(models_couple.Couple).filter(models_couple.Couple.id == couple_id).first()

# Funktion zum Abrufen eines Paares anhand seiner E-Mail-Adresse
def get_couple_by_email(self, db: Session, email: str):
    return db.query(models_couple.Couple).filter(models_couple.Couple.email == email).first()

# Funktion zum Abrufen mehrerer Paare (mit Pagination)
def get_couples(self, db: Session, skip: int = 0, limit: int = 100):
    return db.query(models_couple.Couple).offset(skip).limit(limit).all()

# Funktion zum Erstellen eines neuen Paares
def create_couple(self, db: Session, couple: schemas_couple.CoupleCreate): # <-- password_hash Argument entfernt
    """
    Erstellt ein neues Paar. Das Passwort wird INNERHALB dieser Funktion gehasht.
    """
    # 1. Das Passwort-Hashing findet jetzt HIER statt
    hashed_password = security.get_password_hash(couple.password)
    
    db_couple = models_couple.Couple(
        email=couple.email,
        password_hash=hashed_password, # Den frisch erstellten Hash verwenden
        mr_first_name=couple.mr_first_name,
        mrs_first_name=couple.mrs_first_name,
        start_group=couple.start_group,
        start_class=couple.start_class,
        dance_style=couple.dance_style,
        phone_number=couple.phone_number,
        role='couple'
    )
    db.add(db_couple)
    db.commit()
    db.refresh(db_couple)
    return db_couple

# Funktion zum Aktualisieren eines Paares
def update_couple(self, db: Session, couple_id: int, couple_in: schemas_couple.CoupleUpdate):
    db_couple = db.query(models_couple.Couple).filter(models_couple.Couple.id == couple_id).first()
    if db_couple:
        # Pydantic V2 verwendet .model_dump() anstelle von .dict()
        update_data = couple_in.model_dump(exclude_unset=True)

        # Prüfen, ob ein neues Passwort zum Aktualisieren gesendet wurde.
        if "password" in update_data and update_data["password"]:
            # Das Klartext-Passwort aus den Daten holen UND ENTFERNEN
            plain_password = update_data.pop("password")
            # Das Passwort hashen
            hashed_password = security.get_password_hash(plain_password)
            # Den Hash in das korrekte Feld des Datenbank-Objekts schreiben
            db_couple.password_hash = hashed_password

        # Die restlichen, "normalen" Felder aktualisieren
        for key, value in update_data.items():
            setattr(db_couple, key, value)
            
        db.add(db_couple)
        db.commit()
        db.refresh(db_couple)
    return db_couple

# Funktion zum Löschen eines Paares
def delete_couple(self, db: Session, couple_id: int):
    db_couple = db.query(models_couple.Couple).filter(models_couple.Couple.id == couple_id).first()
    if db_couple:
        db.delete(db_couple)
        db.commit()
        return True
    return False

# Funktion zum Aktualisieren des Passworts eines Paares
def update_couple_password(self, db: Session, couple_id: int, new_password_hash: str):
    db_couple = db.query(models_couple.Couple).filter(models_couple.Couple.id == couple_id).first()
    if db_couple:
        db_couple.password_hash = new_password_hash
        db.add(db_couple)
        db.commit()
        db.refresh(db_couple)
    return db_couple

def count_all_couples(self, db: Session) -> int:
    return db.query(models_couple.Couple).count()

couple = type('CRUDCouple', (), {
    'get': get_couple,
    'get_by_email': get_couple_by_email,
    'get_multi': get_couples,
    'create': create_couple,
    'update': update_couple,
    'delete': delete_couple,
    'update_password': update_couple_password,
    'count_all': count_all_couples
})()