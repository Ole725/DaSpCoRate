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

        # E-Mail-Inhalt
        email_body = f"""
        <html>
        <body>
            <p>Hallo {couple.mrs_first_name} & {couple.mr_first_name},</p>
            <p>um die DanSCor-App nutzen zu können, benötigen ich Eure Zustimmung zur Verarbeitung Eurer Daten gemäß meiner <a href="https://danscor.app/datenschutz">Datenschutzerklärung</a>.</p>
            <p>Bitte klicke auf den folgenden Link, um Eure Zustimmung zu geben:</p>
            <p><a href="{settings.FRONTEND_URL}/consent?token={token}">Zustimmung jetzt geben</a></p>
            <p>Der Link ist einmalig gültig.</p>
            <p>Vielen Dank,<br>Ole</p>
        </body>
        </html>
        """

        message = MessageSchema(
            subject="Ihre Einwilligung zur Datenverarbeitung für DanSCor",
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