# /DaSpCoRate/backend/app/api/v1/endpoints/users.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Union

from app.core.database import get_db
from app.core import security
from app.crud import trainer as crud_trainer, couple as crud_couple
from app.models.trainer import Trainer
from app.models.couple import Couple
from app.schemas.user import PasswordChange
from app.schemas import trainer as schemas_trainer, couple as schemas_couple
from app.dependencies.dependencies import get_current_user

router = APIRouter()

@router.get("/me", response_model=Union[schemas_trainer.TrainerInDB, schemas_couple.CoupleInDB])
def read_users_me(current_user: Union[Trainer, Couple] = Depends(get_current_user)):
    return current_user

@router.put("/me/password", status_code=status.HTTP_200_OK)
def change_my_password(
    password_change_in: PasswordChange, db: Session = Depends(get_db), current_user: Union[Trainer, Couple] = Depends(get_current_user)
):
    if password_change_in.new_password != password_change_in.confirm_new_password:
        raise HTTPException(status_code=400, detail="Passwords do not match.")
    
    if not security.verify_password(password_change_in.current_password, current_user.password_hash):
        raise HTTPException(status_code=401, detail="Incorrect current password.")
    
    new_password_hash = security.get_password_hash(password_change_in.new_password)
    
    if isinstance(current_user, Trainer):
        crud_trainer.update_password(db, trainer_id=current_user.id, new_password_hash=new_password_hash)
    elif isinstance(current_user, Couple):
        crud_couple.update_password(db, couple_id=current_user.id, new_password_hash=new_password_hash)
    
    return {"message": "Password updated successfully."}