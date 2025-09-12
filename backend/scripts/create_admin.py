# /DaSpCoRate/backend/scripts/create_admin.py

import argparse
import os
import sys

# Dies ist ein kleiner Trick, um sicherzustellen, dass das Skript
# die Module Ihrer Anwendung (wie 'app.core.database') finden kann.
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.core.database import SessionLocal, engine
from app.models.admin import Admin
from app.core.security import get_password_hash
from app.core.config import settings

def create_first_admin(email: str, password: str):
    """Erstellt den ersten Admin-Benutzer in der Datenbank."""
    
    # Warten, bis die DATABASE_URL geladen ist
    if not settings.DATABASE_URL:
        print("Fehler: DATABASE_URL ist nicht in der Umgebung gesetzt.")
        sys.exit(1)
    
    db = SessionLocal()
    try:
        # Überprüfen, ob die Tabelle existiert, andernfalls erstellen
        if not engine.dialect.has_table(engine.connect(), "admins"):
            print("Tabelle 'admins' nicht gefunden. Erstelle sie jetzt...")
            Admin.metadata.create_all(bind=engine)
            print("Tabelle 'admins' erfolgreich erstellt.")

        # Überprüfen, ob bereits ein Admin mit dieser E-Mail existiert
        existing_admin = db.query(Admin).filter(Admin.email == email).first()
        if existing_admin:
            print(f"Fehler: Ein Admin mit der E-Mail '{email}' existiert bereits.")
            return

        # Passwort hashen
        hashed_password = get_password_hash(password)

        # Neuen Admin erstellen (passt sich exakt an Ihr Admin-Modell an)
        new_admin = Admin(
            email=email,
            password_hash=hashed_password,
            # 'role' hat einen server_default='admin', wir müssen es nicht setzen
        )

        db.add(new_admin)
        db.commit()
        
        print(f"🎉 Admin-Benutzer '{email}' erfolgreich in der Datenbank erstellt!")

    except Exception as e:
        print(f"Ein unerwarteter Fehler ist aufgetreten: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Erstellt einen Admin-Benutzer für die DaSpCoRate-Anwendung.")
    parser.add_argument("--email", required=True, help="Die E-Mail-Adresse des neuen Admins.")
    parser.add_argument("--password", required=True, help="Das Passwort für den neuen Admin.")
    
    args = parser.parse_args()
    
    create_first_admin(email=args.email, password=args.password)