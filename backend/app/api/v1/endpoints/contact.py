# /backend/app/api/v1/endpoints/contact.py

from fastapi import APIRouter, BackgroundTasks
from fastapi_mail import FastMail, MessageSchema
from app.schemas.message import MessageSchema as ContactFormSchema
from app.core.config import conf # Dieser Import ist weiterhin korrekt

router = APIRouter()

@router.post("/")
async def send_contact_form(form_data: ContactFormSchema, background_tasks: BackgroundTasks):
    
    message_with_br = form_data.message.replace('\n', '<br>')

    html = f"""
    <h3>Neue Kontaktanfrage von DaSpCoRate</h3>
    <p><strong>Name:</strong> {form_data.name}</p>
    <p><strong>E-Mail:</strong> {form_data.email}</p>
    <hr>
    <p><strong>Betreff:</strong> {form_data.subject}</p>
    <p><strong>Nachricht:</strong></p>
    <p>{message_with_br}</p>
    """

    message = MessageSchema(
        subject=f"Kontaktanfrage: {form_data.subject}",
        recipients=["daspcorate@gmail.com"],
        body=html,
        subtype="html",
        reply_to=[form_data.email]
    )

    fm = FastMail(conf)
    background_tasks.add_task(fm.send_message, message)
    
    return {"message": "Nachricht wurde erfolgreich versendet"}