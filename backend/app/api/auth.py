
from fastapi import APIRouter, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from typing import Dict
from ...core.security import create_access_token, verify_password
from ...core.config import settings
from motor.motor_asyncio import AsyncIOMotorClient

router = APIRouter(tags=["auth"])

client = AsyncIOMotorClient(settings.MONGODB_URL)
db = client.feedback_system

@router.post("/login", response_model=Dict[str, str])
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await db.users.find_one({"email": form_data.username})
    if not user or not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    access_token = create_access_token(data={"sub": user["email"]})
    return {"access_token": access_token, "token_type": "bearer"}