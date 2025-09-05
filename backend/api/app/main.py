# /DaSpCoRate/backend/api/app/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.endpoints import auth, couple_ops, sessions, enrollments, ratings, users # Importiert Auth- und Couples-Router

app = FastAPI(
    title="Tanzsport-App API",
    description="API für die Bewertung und das Feedback im Tanzsport.",
    version="0.1.0",
    debug=True,
)

# Erlaubte Origins (Domains, von denen Anfragen kommen dürfen)
origins = [
    "http://localhost:5173", # Ihre React-App
    "http://localhost:3000", # Manchmal laufen React-Apps auch hier
    "http://127.0.0.1:5173", # Alternative Schreibweise für localhost
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, # Erlaubt die oben definierten Origins
    allow_credentials=True, # Erlaubt Cookies (wichtig für spätere Features)
    allow_methods=["*"],    # Erlaubt alle HTTP-Methoden (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],    # Erlaubt alle HTTP-Header (inkl. Authorization)
)

# Router für Authentifizierung hinzufügen
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])

# Router für Paarverwaltung hinzufügen (geschützt durch Authentifizierung)
app.include_router(couple_ops.router, prefix="/api/v1/couples", tags=["Couples"]) 

# Router für Sessionverwaltung hinzufügen (geschützt durch Trainer-Authentifizierung)
app.include_router(sessions.router, prefix="/api/v1/sessions", tags=["Sessions"])

# Router für Session-Anmeldung hinzufügen
app.include_router(enrollments.router, prefix="/api/v1/enrollments", tags=["Enrollments"])

# Router für Bewertungen hinzufügen
app.include_router(ratings.router, prefix="/api/v1/ratings", tags=["Ratings"])

# Router für allgemeine Benutzeraktionen (Passwort ändern etc.)
app.include_router(users.router, prefix="/api/v1/users", tags=["Users"])

@app.get("/")
async def read_root():
    return {"message": "Welcome to the Tanzsport-App API!"}

@app.get("/health")
async def health_check():
    return {"status": "ok", "timestamp": app.version}