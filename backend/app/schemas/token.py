# /DaSpCoRate/backend/app/schemas/token.py

from pydantic import BaseModel, Field
from typing import Optional

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None 
    role: Optional[str] = None