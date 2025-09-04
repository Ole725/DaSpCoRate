# /DaSpCoRate/backend/api/app/main.py

from fastapi import FastAPI
from app.api.v1.endpoints import auth, couples, sessions, enrollments, ratings # Importiert Auth- und Couples-Router

app = FastAPI(
    title="Tanzsport-App API",
    description="API für die Bewertung und das Feedback im Tanzsport.",
    version="0.1.0",
)

# Router für Authentifizierung hinzufügen
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])

# Router für Paarverwaltung hinzufügen (geschützt durch Authentifizierung)
app.include_router(couples.router, prefix="/api/v1/couples", tags=["Couples"])

# Router für Sessionverwaltung hinzufügen (geschützt durch Trainer-Authentifizierung)
app.include_router(sessions.router, prefix="/api/v1/sessions", tags=["Sessions"])

# Router für Session-Anmeldung hinzufügen
app.include_router(enrollments.router, prefix="/api/v1/enrollments", tags=["Enrollments"])

# Router für Bewertungen hinzufügen
app.include_router(ratings.router, prefix="/api/v1/ratings", tags=["Ratings"])

@app.get("/")
async def read_root():
    return {"message": "Welcome to the Tanzsport-App API!"}

@app.get("/health")
async def health_check():
    return {"status": "ok", "timestamp": app.version}