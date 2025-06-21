from pydantic import BaseModel
from typing import Optional

class UserBase(BaseModel):
    email: str
    name: str
    role: str
    manager_id: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserOut(UserBase):
    _id: str

class UserInDB(UserBase):
    _id: str
    hashed_password: str