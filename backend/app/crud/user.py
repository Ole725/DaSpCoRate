# /DaSpCoRate/backend/app/crud/user.py
from sqlalchemy.orm import Session
from typing import Union

from app.core.security import verify_password
from app.models.trainer import Trainer
from app.models.couple import Couple
from app.models.admin import Admin
from app.crud import trainer as crud_trainer
from app.crud import couple as crud_couple
from app.crud import admin as crud_admin

def authenticate(self, db: Session, *, email: str, password: str) -> Union[Trainer, Couple, Admin, None]:
    admin = crud_admin.get_admin_by_email(db, email=email)
    if admin and verify_password(password, admin.password_hash):
        return admin

    trainer = crud_trainer.get_by_email(db, email=email)
    if trainer and verify_password(password, trainer.password_hash):
        return trainer

    couple = crud_couple.get_by_email(db, email=email)
    if couple and verify_password(password, couple.password_hash):
        return couple

    return None

user = type('CRUDUser', (), {'authenticate': authenticate})()

def count_by_role(db: Session, *, role: str) -> int:
    return db.query(User).filter(User.role == role).count()