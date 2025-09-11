# /DaSpCoRate/backend/app/api/v1/api.py

from fastapi import APIRouter

from app.api.v1.endpoints import auth, users, couple_ops, sessions, enrollment_ops, ratings
from .endpoints import contact

# Erstelle einen Haupt-Router für die Version v1 der API
api_router = APIRouter()

# Binde die einzelnen Router in den Haupt-Router ein.
# Jeder bekommt ein "prefix" (das in der URL vorangestellt wird)
# und "tags" (für die automatische API-Dokumentation).
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(couple_ops.router, prefix="/couples", tags=["couples"])
api_router.include_router(sessions.router, prefix="/sessions", tags=["sessions"])
api_router.include_router(enrollment_ops.router, prefix="/enrollments", tags=["enrollments"])
api_router.include_router(ratings.router, prefix="/ratings", tags=["ratings"])
api_router.include_router(contact.router, prefix="/contact", tags=["contact"])