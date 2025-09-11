# /backend/app/schemas/message.py
from pydantic import BaseModel, EmailStr

class MessageSchema(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str