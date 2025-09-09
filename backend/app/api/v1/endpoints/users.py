# /DaSpCoRate/backend/app/api/v1/endpoints/users.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core import security
from app.crud import trainer as crud_trainer
from app.crud import couple as crud_couple
from typing import Union
from app.models.trainer import Trainer
from app.models.couple import Couple
from app.schemas.user import PasswordChange
from app.schemas import trainer as schemas_trainer
from app.schemas import couple as schemas_couple
from app.dependencies.dependencies import get_current_user # Kann Trainer ODER Couple sein

router = APIRouter()

@router.get("/me", response_model=Union[schemas_trainer.TrainerInDB, schemas_couple.CoupleInDB])
def read_users_me(current_user: Union[Trainer, Couple] = Depends(get_current_user)):
    """
    Gibt die Daten des aktuell eingeloggten Benutzers (Trainer oder Paar) zurück.
    """
    return current_user

# Endpunkt zum Ändern des Passworts für den aktuell angemeldeten Benutzer (Trainer oder Paar)
@router.put("/me/password", status_code=status.HTTP_200_OK)
def change_my_password(
    password_change_in: PasswordChange,
    db: Session = Depends(get_db),
    current_user: Union[Trainer, Couple] = Depends(get_current_user) # Entweder Trainer oder Couple
):
    # 1. Überprüfen, ob das neue Passwort und die Bestätigung übereinstimmen
    if password_change_in.new_password != password_change_in.confirm_new_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New password and confirmation do not match."
        )
    
    # 2. Aktuelles Passwort überprüfen
    if not security.verify_password(password_change_in.current_password, current_user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect current password."
        )
    
    # 3. Passwort aktualisieren
    new_password_hash = security.get_password_hash(password_change_in.new_password)
    
    if isinstance(current_user, Trainer):
        crud_trainer.update_trainer_password(db, current_user.id, new_password_hash)
    elif isinstance(current_user, Couple):
        crud_couple.update_couple_password(db, current_user.id, new_password_hash)
    else:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Unknown user type.")

    return {"message": "Password updated successfully."}