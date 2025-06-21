from pydantic import BaseModel
from typing import Optional

class User(BaseModel):
    email: str
    name: str
    role: str
    manager_id: Optional[str] = None
    hashed_password: str