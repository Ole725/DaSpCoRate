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

    # E-Mail Inhalt (HTML) - Design angepasst an Consent-Mail
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Passwort zurücksetzen DanSCoR</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333;">
        
        <!-- Haupt-Container -->
        <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            
            <!-- Header -->
            <div style="background-color: #2563eb; padding: 30px 20px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: bold;">DanSCoR</h1>
                <p style="color: #e0e7ff; margin: 5px 0 0 0; font-size: 14px;">Passwort Wiederherstellung</p>
            </div>

            <!-- Inhalt -->
            <div style="padding: 40px 30px;">
                <h2 style="color: #1f2937; font-size: 20px; margin-top: 0;">Hallo,</h2>
                
                <p style="font-size: 16px; line-height: 1.6; color: #4b5563; margin-bottom: 25px;">
                    wir haben eine Anfrage erhalten, dein Passwort zurückzusetzen. Falls du das warst, kannst du dir über den Button unten ein neues Passwort erstellen.
                </p>

                <!-- Button -->
                <div style="text-align: center; margin: 35px 0;">
                    <a href="{reset_link}" style="background-color: #2563eb; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; display: inline-block;">
                        Passwort ändern
                    </a>
                </div>

                <div style="background-color: #fff7ed; border-left: 4px solid #f97316; padding: 10px 15px; margin-bottom: 20px;">
                    <p style="margin: 0; font-size: 14px; color: #9a3412;">
                        <strong>Hinweis:</strong> Dieser Link ist nur <strong>15 Minuten</strong> gültig.
                    </p>
                </div>

                <p style="font-size: 14px; color: #6b7280;">
                    Falls du kein neues Passwort angefordert hast, kannst du diese E-Mail einfach ignorieren. Dein Account ist sicher.
                </p>

                <!-- Fallback Link -->
                <p style="font-size: 14px; color: #6b7280; margin-top: 30px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
                    Button funktioniert nicht? Kopiere diesen Link in den Browser:<br>
                    <a href="{reset_link}" style="color: #2563eb; word-break: break-all;">{reset_link}</a>
                </p>
            </div>

            <!-- Footer -->
            <div style="background-color: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #9ca3af;">
                <p style="margin: 0;">Herzliche Grüße, Ole</p>
                <p style="margin: 5px 0 0 0;">Diese E-Mail wurde automatisch von DanSCoR versendet.</p>
            </div>
        </div>
    </body>
    </html>
    """

    message = MessageSchema(
        subject="🔐 Passwort zurücksetzen - DanSCoR",
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