# /DaSpCoRate/backend/api/app/schemas/token.py

from pydantic import BaseModel, Field
from typing import Optional

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = Field(None, alias="sub") # Das ist der 'sub'-Wert aus dem JWT
    role: Optional[str] = None # Z.B. 'trainer', 'couple'