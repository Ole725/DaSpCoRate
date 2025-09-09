# /DaSpCoRate/backend/app/generate_hash.py
from app.core.security import get_password_hash
import sys

if len(sys.argv) > 1:
    password = sys.argv[1]
    hashed_password = get_password_hash(password)
    print("--- NEUER KORREKTER HASH ---")
    print(hashed_password)
    print("----------------------------")
else:
    print("Bitte ein Passwort als Argument übergeben.")
    print("Beispiel: python -m app.generate_hash DEIN_PASSWORT")