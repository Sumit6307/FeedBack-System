from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from typing import List
from datetime import datetime
from .core.config import settings
from .core.security import create_access_token, verify_password, get_password_hash, get_current_user
from .schemas.user import UserCreate, UserOut, UserInDB
from .schemas.feedback import FeedbackCreate, FeedbackOut, FeedbackUpdate
from .models.user import User
from .models.feedback import Feedback
from bson import ObjectId

app = FastAPI(title="Feedback System API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

client = AsyncIOMotorClient(settings.MONGODB_URL)
db = client.feedback_system

@app.on_event("startup")
async def startup_db_client():
    await db.users.create_index("email", unique=True)

@app.post("/register", response_model=UserOut)
async def register_user(user: UserCreate):
    hashed_password = get_password_hash(user.password)
    user_dict = user.dict()
    user_dict["hashed_password"] = hashed_password
    user_dict.pop("password")
    try:
        result = await db.users.insert_one(user_dict)
        user_dict["_id"] = str(result.inserted_id)
        return user_dict
    except:
        raise HTTPException(status_code=400, detail="Email already registered")

@app.post("/token")
async def login(email: str, password: str):
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    access_token = create_access_token(data={"sub": user["email"]})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me", response_model=UserOut)
async def read_users_me(current_user: UserInDB = Depends(get_current_user)):
    return current_user

@app.get("/team", response_model=List[UserOut])
async def get_team(current_user: UserInDB = Depends(get_current_user)):
    if current_user["role"] != "manager":
        raise HTTPException(status_code=403, detail="Not authorized")
    team = await db.users.find({"manager_id": str(current_user["_id"])}).to_list(100)
    for member in team:
        member["_id"] = str(member["_id"])
    return team

@app.post("/feedback", response_model=FeedbackOut)
async def submit_feedback(feedback: FeedbackCreate, current_user: UserInDB = Depends(get_current_user)):
    if current_user["role"] != "manager":
        raise HTTPException(status_code=403, detail="Not authorized")
    feedback_dict = feedback.dict()
    feedback_dict["manager_id"] = str(current_user["_id"])
    feedback_dict["created_at"] = datetime.utcnow()
    feedback_dict["acknowledged"] = False
    result = await db.feedback.insert_one(feedback_dict)
    feedback_dict["_id"] = str(result.inserted_id)
    return feedback_dict

@app.get("/feedback", response_model=List[FeedbackOut])
async def get_feedback(current_user: UserInDB = Depends(get_current_user)):
    if current_user["role"] == "manager":
        feedback = await db.feedback.find({"manager_id": str(current_user["_id"])}).to_list(100)
    else:
        feedback = await db.feedback.find({"employee_id": str(current_user["_id"])}).to_list(100)
    for fb in feedback:
        fb["_id"] = str(fb["_id"])
    return feedback

@app.put("/feedback/{feedback_id}", response_model=FeedbackOut)
async def update_feedback(feedback_id: str, feedback: FeedbackUpdate, current_user: UserInDB = Depends(get_current_user)):
    if current_user["role"] != "manager":
        raise HTTPException(status_code=403, detail="Not authorized")
    existing_feedback = await db.feedback.find_one({"_id": ObjectId(feedback_id), "manager_id": str(current_user["_id"])})
    if not existing_feedback:
        raise HTTPException(status_code=404, detail="Feedback not found")
    update_data = feedback.dict(exclude_unset=True)
    await db.feedback.update_one({"_id": ObjectId(feedback_id)}, {"$set": update_data})
    updated_feedback = await db.feedback.find_one({"_id": ObjectId(feedback_id)})
    updated_feedback["_id"] = str(updated_feedback["_id"])
    return updated_feedback

@app.post("/feedback/{feedback_id}/acknowledge")
async def acknowledge_feedback(feedback_id: str, current_user: UserInDB = Depends(get_current_user)):
    feedback = await db.feedback.find_one({"_id": ObjectId(feedback_id), "employee_id": str(current_user["_id"])})
    if not feedback:
        raise HTTPException(status_code=404, detail="Feedback not found")
    await db.feedback.update_one({"_id": ObjectId(feedback_id)}, {"$set": {"acknowledged": True}})
    return {"message": "Feedback acknowledged"}