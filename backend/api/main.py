# /DaSpCoRate/backend/api/main.py

# Importiere die FastAPI-App-Instanz direkt aus dem 'app'-Paket
from app.main import app 

# Für Uvicorn wird der Startbefehl dann 'uvicorn main:app --reload' sein.
# Da Sie 'uvicorn main:application --reload' verwendet haben,
# werden wir hier einen Alias setzen, damit der Befehl weiterhin funktioniert.
application = app