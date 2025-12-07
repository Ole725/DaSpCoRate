# /DaSpCoRate/backend/app/api/v1/endpoints/consent.py

import secrets
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi_mail import MessageSchema, FastMail
from datetime import datetime

from app.core.database import get_db
from app.models.couple import Couple
from app.dependencies.dependencies import get_current_admin
from app.core.config import conf, settings
from typing import List
from app.schemas.couple import CoupleInDB as CoupleSchema

router = APIRouter()

@router.post("/admin/send-consent-emails", status_code=200)
async def send_consent_emails(
    db: Session = Depends(get_db),
    current_admin: dict = Depends(get_current_admin) # Schützt den Endpunkt
):
    """
    Sendet Einwilligungs-E-Mails an alle Paare, die noch nicht zugestimmt haben.
    Nur für Admins zugänglich.
    """
    if not conf:
        raise HTTPException(status_code=500, detail="E-Mail-Dienst ist nicht konfiguriert.")

    couples_to_notify = db.query(Couple).filter(Couple.consent_given_at == None).all()
    
    if not couples_to_notify:
        return {"message": "Alle Paare haben bereits ihre Einwilligung gegeben."}

    sent_count = 0
    for couple in couples_to_notify:
        # Einzigartiges, sicheres Token generieren und speichern
        token = secrets.token_urlsafe(32)
        couple.consent_token = token
        db.commit()

        # Generierter Link
        consent_link = f"{settings.FRONTEND_URL}/consent?token={token}"
        privacy_link = "https://danscor.app/datenschutz"

        # Design-Upgrade: Responsive HTML E-Mail
        # Wir nutzen Inline-CSS, da E-Mail-Programme (Outlook, Gmail) das am besten verstehen.
        email_body = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Datenschutz Einwilligung DanSCoR</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333;">
            
            <!-- Haupt-Container -->
            <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                
                <!-- Header mit App Farbe -->
                <div style="background-color: #2563eb; padding: 30px 20px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: bold;">DanSCoR</h1>
                    <p style="color: #e0e7ff; margin: 5px 0 0 0; font-size: 14px;">Dance Sport Rating App</p>
                </div>

                <!-- Inhalt -->
                <div style="padding: 40px 30px;">
                    <h2 style="color: #1f2937; font-size: 20px; margin-top: 0;">Liebe {couple.mrs_first_name}, lieber {couple.mr_first_name},</h2>
                    
                    <p style="font-size: 16px; line-height: 1.6; color: #4b5563; margin-bottom: 25px;">
                        vielen Dank für eure Anmeldung. Damit ihr <strong>DanSCoR</strong> vollumfänglich nutzen könnt, benötige ich noch kurz eure formale Zustimmung zur Datenverarbeitung. 
                        Dies dient meiner Absicherung und erfolgt gemäß meiner <a href="{privacy_link}" style="color: #2563eb; text-decoration: underline;">Datenschutzerklärung</a>.
                    </p>

                    <!-- Button -->
                    <div style="text-align: center; margin: 35px 0;">
                        <a href="{consent_link}" style="background-color: #2563eb; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; display: inline-block;">
                            Jetzt Zustimmung geben
                        </a>
                    </div>

                    <p style="font-size: 14px; color: #6b7280; margin-top: 30px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
                        Falls der Button nicht funktioniert, kopiert bitte diesen Link in euren Browser:<br>
                        <a href="{consent_link}" style="color: #2563eb; word-break: break-all;">{consent_link}</a>
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
            subject="Noch ausstehend: Einwilligung zur Datenverarbeitung 🔒",
            recipients=[couple.email],
            body=email_body,
            subtype="html"
        )

        fm = FastMail(conf)
        await fm.send_message(message)
        sent_count += 1

    return {"message": f"{sent_count} Einwilligungs-E-Mails wurden erfolgreich versendet."}


@router.get("/verify/{token}", status_code=200)
def verify_consent_token(token: str, db: Session = Depends(get_db)):
    """Überprüft, ob ein Token gültig und noch nicht verwendet ist."""
    couple = db.query(Couple).filter(Couple.consent_token == token).first()
    if not couple:
        raise HTTPException(status_code=404, detail="Ungültiger oder bereits verwendeter Link.")
    
    return {"message": "Token ist gültig.", "couple_name": f"{couple.mrs_first_name} & {couple.mr_first_name}"}


@router.post("/confirm/{token}", status_code=200)
def confirm_consent(token: str, db: Session = Depends(get_db)):
    """Bestätigt die Einwilligung und setzt den Zeitstempel."""
    couple = db.query(Couple).filter(Couple.consent_token == token).first()
    if not couple:
        raise HTTPException(status_code=404, detail="Ungültiger oder bereits verwendeter Link.")

    couple.consent_given_at = datetime.utcnow()
    couple.consent_token = None # Token nach Nutzung ungültig machen
    db.commit()

    return {"message": "Vielen Dank! Eure Einwilligung wurde erfolgreich gespeichert."}

@router.get("/admin/pending-consent", response_model=List[CoupleSchema])
def get_couples_pending_consent(
    db: Session = Depends(get_db),
    current_admin: dict = Depends(get_current_admin)
):
    """
    Gibt eine Liste aller Paare zurück, die ihre Einwilligung noch nicht gegeben haben.
    Nur für Admins zugänglich.
    """
    couples = db.query(Couple).filter(Couple.consent_given_at == None).order_by(Couple.created_at).all()
    return couples