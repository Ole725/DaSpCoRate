# /backend/app/crud/admin.py
from sqlalchemy.orm import Session
from app.models import admin as models_admin
from app.schemas import admin as schemas_admin
from app.core.security import get_password_hash

# Funktion zum Abrufen eines Admins anhand seiner E-Mail-Adresse
def get_admin_by_email(db: Session, email: str):
    return db.query(models_admin.Admin).filter(models_admin.Admin.email == email).first()

# Funktion zum Erstellen eines neuen Admins
def create_admin(db: Session, admin: schemas_admin.AdminCreate):
    # 1. Hashe das Passwort aus dem Schema, bevor es gespeichert wird
    hashed_password = get_password_hash(admin.password)
    
    # 2. Erstelle ein neues SQLAlchemy-Datenbankobjekt
    db_admin = models_admin.Admin(
        email=admin.email,
        password_hash=hashed_password,  # Speichere NUR den Hash
        role='admin'  # Setze die Rolle auf 'admin'
    )
    
    # 3. Füge das Objekt zur Datenbank-Session hinzu
    db.add(db_admin)
    # 4. Bestätige die Transaktion
    db.commit()
    # 5. Lade das Objekt neu, um die von der DB generierte ID zu erhalten
    db.refresh(db_admin)
    
    return db_admin