# /DaSpCoRate/backend/app/api/v1/endpoints/auth.py

from datetime import timedelta
from typing import Union
from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from fastapi_mail import MessageSchema, FastMail

from app import crud
from app.core import security
from app.core.config import settings, conf  # 'conf' für FastMail importieren
from app.core.database import get_db
from app.dependencies.dependencies import get_current_admin
from app.models.admin import Admin
from app.models.trainer import Trainer
from app.models.couple import Couple

from app.schemas import token as schemas_token
from app.schemas import trainer as schemas_trainer
from app.schemas import admin as schemas_admin
from app.crud import admin as crud_admin
from app.crud import trainer as crud_trainer
from app.crud import couple as crud_couple

router = APIRouter()

# --- HELPER: User in allen Tabellen suchen ---
def find_user_by_email(db: Session, email: str) -> Union[Admin, Trainer, Couple, None]:
    """
    Durchsucht alle Benutzertabellen (Admin, Trainer, Couple) nach einer E-Mail-Adresse.
    """
    
    # 1. Admin prüfen
    admin = crud_admin.get_admin_by_email(db, email=email)
    if admin: return admin

    # 2. Trainer prüfen
    trainer = crud_trainer.get_by_email(db, email=email)
    if trainer: return trainer

    # 3. Couple prüfen
    couple = crud_couple.get_by_email(db, email=email)
    if couple: return couple

    return None


# --- BESTEHENDE ENDPUNKTE ---

@router.post("/token", response_model=schemas_token.Token, tags=["Auth"])
def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)
):
    user = crud.user.authenticate(db, email=form_data.username, password=form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Falscher Benutzername oder Passwort",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user_role = user.role

    token_payload = {"sub": user.email, "role": user_role}
    access_token = security.create_access_token(data=token_payload)
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/register/trainer", response_model=schemas_trainer.TrainerInDB, status_code=status.HTTP_201_CREATED, tags=["Admins"])
def create_trainer_by_admin(
    trainer_in: schemas_trainer.TrainerCreate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    db_trainer = crud_trainer.get_by_email(db, email=trainer_in.email)
    if db_trainer:
        raise HTTPException(status_code=400, detail="Ein Trainer mit dieser E-Mail existiert bereits.")
    return crud_trainer.create(db=db, trainer=trainer_in)

@router.post("/register-initial-admin", response_model=schemas_admin.Admin, tags=["Auth"])
def register_initial_admin(admin_in: schemas_admin.AdminCreate, db: Session = Depends(get_db)):
    if db.query(Admin).first():
        raise HTTPException(status_code=403, detail="Ein Admin-Account existiert bereits.")
    return crud_admin.create_admin(db=db, admin=admin_in)


# --- NEUE ENDPUNKTE: PASSWORT VERGESSEN & RESET ---

@router.post("/password-recovery/{email}", tags=["Auth"])
async def recover_password(email: str, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    """
    Schritt 1: Benutzer fordert Passwort-Reset an.
    Sendet eine E-Mail mit einem Reset-Token, falls die E-Mail existiert.
    """
    user = find_user_by_email(db, email=email)

    # Sicherheit: Wir geben immer 200 OK zurück, auch wenn die E-Mail nicht existiert,
    # um "User Enumeration" (Ausprobieren von E-Mails) zu verhindern.
    if not user:
        # Optional: Hier könnte man loggen, dass eine ungültige E-Mail angefragt wurde
        return {"message": "Falls diese E-Mail registriert ist, wurde ein Link gesendet."}

    # Token generieren (gültig für 15 Min, spezieller Typ 'reset')
    reset_token = security.create_password_reset_token(email)
    
    # Link zusammenbauen (Frontend-Route)
    reset_link = f"{settings.FRONTEND_URL}/reset-password?token={reset_token}"

    # E-Mail Inhalt (HTML)
    html_content = f"""
    <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h3>Passwort zurücksetzen - DaSpCoRate</h3>
            <p>Hallo,</p>
            <p>du hast angefordert, dein Passwort zurückzusetzen.</p>
            <p>Bitte klicke auf den folgenden Link, um ein neues Passwort zu vergeben:</p>
            <p>
                <a href="{reset_link}" style="padding: 10px 20px; background-color: #2563EB; color: white; text-decoration: none; border-radius: 5px; display: inline-block;">
                    Passwort ändern
                </a>
            </p>
            <p><small>Dieser Link ist 15 Minuten gültig.</small></p>
            <p>Falls du das nicht warst, ignoriere diese E-Mail einfach.</p>
            <hr>
            <p><small>DaSpCoRate Team</small></p>
        </body>
    </html>
    """

    message = MessageSchema(
        subject="Passwort zurücksetzen - DaSpCoRate",
        recipients=[email],
        body=html_content,
        subtype="html"
    )

    fm = FastMail(conf)
    background_tasks.add_task(fm.send_message, message)

    return {"message": "Falls diese E-Mail registriert ist, wurde ein Link gesendet."}


@router.post("/reset-password", tags=["Auth"])
def reset_password(
    token_data: schemas_token.PasswordResetConfirm, # Benötigt {token: "...", new_password: "..."}
    db: Session = Depends(get_db)
):
    """
    Schritt 2: Benutzer sendet Token und neues Passwort.
    Wir validieren das Token und setzen das Passwort neu.
    """
    # 1. Token validieren
    payload = security.decode_access_token(token_data.token)
    
    # Prüfen, ob Payload existiert und ob es ein spezielles Reset-Token ist
    if not payload or payload.get("type") != "reset":
        raise HTTPException(status_code=400, detail="Ungültiges oder abgelaufenes Token.")
    
    email = payload.get("sub")
    if not email:
        raise HTTPException(status_code=400, detail="Ungültiges Token (keine E-Mail enthalten).")

    # 2. User suchen
    user = find_user_by_email(db, email=email)
    if not user:
        raise HTTPException(status_code=404, detail="Benutzer nicht gefunden.")

    # 3. Neues Passwort hashen und speichern
    hashed_password = security.get_password_hash(token_data.new_password)
    user.hashed_password = hashed_password
    db.add(user)
    db.commit()

    return {"message": "Passwort erfolgreich geändert. Du kannst dich jetzt einloggen."}