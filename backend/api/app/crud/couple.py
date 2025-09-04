# /DaSpCoRate/backend/api/app/crud/couple.py

from sqlalchemy.orm import Session
from app.models import couple as models_couple
from app.schemas import couple as schemas_couple
from app.core import security # Wird benötigt für Passwort-Hashing bei Registrierung

# Funktion zum Abrufen eines Paares anhand seiner ID
def get_couple(db: Session, couple_id: int):
    return db.query(models_couple.Couple).filter(models_couple.Couple.id == couple_id).first()

# Funktion zum Abrufen eines Paares anhand seiner E-Mail-Adresse
def get_couple_by_email(db: Session, email: str):
    return db.query(models_couple.Couple).filter(models_couple.Couple.email == email).first()

# Funktion zum Abrufen mehrerer Paare (mit Pagination)
def get_couples(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models_couple.Couple).offset(skip).limit(limit).all()

# Funktion zum Erstellen eines neuen Paares
def create_couple(db: Session, couple: schemas_couple.CoupleCreate, password_hash: str):
    db_couple = models_couple.Couple(
        email=couple.email,
        password_hash=password_hash, # Gehashtes Passwort
        mr_first_name=couple.mr_first_name,
        mrs_first_name=couple.mrs_first_name,
        start_group=couple.start_group,
        start_class=couple.start_class,
        dance_style=couple.dance_style,
        phone_number=couple.phone_number
    )
    db.add(db_couple)
    db.commit()
    db.refresh(db_couple)
    return db_couple

# Funktion zum Aktualisieren eines Paares
def update_couple(db: Session, couple_id: int, couple_in: schemas_couple.CoupleUpdate):
    db_couple = db.query(models_couple.Couple).filter(models_couple.Couple.id == couple_id).first()
    if db_couple:
        # Pydantic-Modell in ein Dictionary umwandeln und None-Werte ausschließen
        update_data = couple_in.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_couple, key, value) # Aktualisiert das SQLAlchemy-Objekt
        db.add(db_couple)
        db.commit()
        db.refresh(db_couple)
    return db_couple

# Funktion zum Löschen eines Paares
def delete_couple(db: Session, couple_id: int):
    db_couple = db.query(models_couple.Couple).filter(models_couple.Couple.id == couple_id).first()
    if db_couple:
        db.delete(db_couple)
        db.commit()
        return True
    return False