# /DaSpCoRate/backend/app/crud/trainer.py

from sqlalchemy.orm import Session
from app.models import trainer as models_trainer
from app.schemas import trainer as schemas_trainer
from app.core.security import get_password_hash

# Funktion zum Abrufen eines Trainers anhand seiner ID
def get_trainer(self, db: Session, trainer_id: int):
    return db.query(models_trainer.Trainer).filter(models_trainer.Trainer.id == trainer_id).first()

# Funktion zum Abrufen eines Trainers anhand seiner E-Mail-Adresse
def get_trainer_by_email(self, db: Session, email: str):
    return db.query(models_trainer.Trainer).filter(models_trainer.Trainer.email == email).first()

# Funktion zum Abrufen mehrerer Trainer (mit Pagination)
def get_trainers(self, db: Session, skip: int = 0, limit: int = 100):
    return db.query(models_trainer.Trainer).offset(skip).limit(limit).all()

# Funktion zum Erstellen eines neuen Trainers
def create_trainer(self, db: Session, trainer: schemas_trainer.TrainerCreate):
    """
    Erstellt einen neuen Trainer. Das Passwort wird innerhalb dieser Funktion gehasht.
    """
    hashed_password = get_password_hash(trainer.password) # Passwort hashen
    db_trainer = models_trainer.Trainer(
        email=trainer.email,
        first_name=trainer.first_name,
        last_name=trainer.last_name,
        phone_number=trainer.phone_number,
        password_hash=hashed_password,  # Gehashten Wert speichern
        role='trainer'  # Setze die Rolle auf 'trainer'
    )
    db.add(db_trainer)
    db.commit()
    db.refresh(db_trainer)
    return db_trainer

# Funktion zum Aktualisieren eines Trainers
def update_trainer(self, db: Session, trainer_id: int, trainer_in: schemas_trainer.TrainerUpdate):
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
def delete_trainer(self, db: Session, trainer_id: int):
    db_trainer = db.query(models_trainer.Trainer).filter(models_trainer.Trainer.id == trainer_id).first()
    if db_trainer:
        db.delete(db_trainer)
        db.commit()
        return True
    return False

# Funktion zum Aktualisieren des Passworts eines Trainers
def update_trainer_password(self, db: Session, trainer_id: int, new_password_hash: str):
    db_trainer = db.query(models_trainer.Trainer).filter(models_trainer.Trainer.id == trainer_id).first()
    if db_trainer:
        db_trainer.password_hash = new_password_hash
        db.add(db_trainer)
        db.commit()
        db.refresh(db_trainer)
    return db_trainer

def count_all_trainers(self, db: Session) -> int: # <-- self hinzufügen
    return db.query(models_trainer.Trainer).count()

trainer = type('CRUDTrainer', (), {
    'get': get_trainer,
    'get_by_email': get_trainer_by_email,
    'get_multi': get_trainers,
    'create': create_trainer,
    'update': update_trainer,
    'delete': delete_trainer,
    'update_password': update_trainer_password,
    'count_all': count_all_trainers
})()