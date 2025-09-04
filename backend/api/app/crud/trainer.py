# /DaSpCoRate/backend/api/app/crud/trainer.py

from sqlalchemy.orm import Session
from app.models import trainer as models_trainer
from app.schemas import trainer as schemas_trainer

# Funktion zum Abrufen eines Trainers anhand seiner ID
def get_trainer(db: Session, trainer_id: int):
    return db.query(models_trainer.Trainer).filter(models_trainer.Trainer.id == trainer_id).first()

# Funktion zum Abrufen eines Trainers anhand seiner E-Mail-Adresse
def get_trainer_by_email(db: Session, email: str):
    return db.query(models_trainer.Trainer).filter(models_trainer.Trainer.email == email).first()

# Funktion zum Abrufen mehrerer Trainer (mit Pagination)
def get_trainers(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models_trainer.Trainer).offset(skip).limit(limit).all()

# Funktion zum Erstellen eines neuen Trainers
def create_trainer(db: Session, trainer: schemas_trainer.TrainerCreate, password_hash: str):
    db_trainer = models_trainer.Trainer(
        email=trainer.email,
        first_name=trainer.first_name,
        last_name=trainer.last_name,
        phone_number=trainer.phone_number,
        password_hash=password_hash # Das gehashte Passwort wird hier gespeichert
    )
    db.add(db_trainer) # Fügt das Objekt der Session hinzu
    db.commit() # Speichert die Änderungen in der Datenbank
    db.refresh(db_trainer) # Aktualisiert das Objekt mit den neu generierten Werten (z.B. ID)
    return db_trainer

# Funktion zum Aktualisieren eines Trainers
def update_trainer(db: Session, trainer_id: int, trainer_in: schemas_trainer.TrainerUpdate):
    db_trainer = db.query(models_trainer.Trainer).filter(models_trainer.Trainer.id == trainer_id).first()
    if db_trainer:
        update_data = trainer_in.dict(exclude_unset=True) # Nur gesetzte Werte aktualisieren
        for key, value in update_data.items():
            setattr(db_trainer, key, value)
        db.add(db_trainer)
        db.commit()
        db.refresh(db_trainer)
    return db_trainer

# Funktion zum Löschen eines Trainers
def delete_trainer(db: Session, trainer_id: int):
    db_trainer = db.query(models_trainer.Trainer).filter(models_trainer.Trainer.id == trainer_id).first()
    if db_trainer:
        db.delete(db_trainer)
        db.commit()
        return True
    return False