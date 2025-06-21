from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from ...core.security import get_current_user, get_password_hash
from ...core.config import settings
from ...schemas.user import UserCreate, UserOut, UserInDB
from motor.motor_asyncio import AsyncIOMotorClient

router = APIRouter(tags=["users"])

client = AsyncIOMotorClient(settings.MONGODB_URL)
db = client.feedback_system

@router.post("/", response_model=UserOut)
async def create_user(user: UserCreate):
    hashed_password = get_password_hash(user.password)
    user_dict = user.dict()
    user_dict["hashed_password"] = hashed_password
    user_dict.pop("password")
    try:
        result = await db.users.insert_one(user_dict)
        user_dict["_id"] = str(result.inserted_id)
        return user_dict
    except:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

@router.get("/me", response_model=UserOut)
async def read_users_me(current_user: UserInDB = Depends(get_current_user)):
    return current_user

@router.get("/team", response_model=List[UserOut])
async def get_team(current_user: UserInDB = Depends(get_current_user)):
    if current_user["role"] != "manager":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    team = await db.users.find({"manager_id": str(current_user["_id"])}).to_list(100)
    for member in team:
        member["_id"] = str(member["_id"])
    return team