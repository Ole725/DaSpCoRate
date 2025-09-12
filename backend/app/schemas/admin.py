# /backend/app/schemas/admin.py
from pydantic import BaseModel, EmailStr, ConfigDict

# Basis-Schema: Enthält alle Felder, die Admins gemeinsam haben
class AdminBase(BaseModel):
    email: EmailStr

# Schema zum Erstellen eines neuen Admins: Erbt von Base und fügt das Passwort hinzu
class AdminCreate(AdminBase):
    password: str

# Schema zum Lesen eines Admins aus der Datenbank: Enthält die ID und wird vom Modell gelesen
class Admin(AdminBase):
    id: int
    role: str
    
    # Pydantic V2 verwendet model_config anstelle von class Config
    model_config = ConfigDict(from_attributes=True)