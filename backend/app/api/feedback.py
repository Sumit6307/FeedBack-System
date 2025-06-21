from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from bson import ObjectId
from datetime import datetime
from ...core.security import get_current_user
from ...core.config import settings
from ...schemas.feedback import FeedbackCreate, FeedbackOut, FeedbackUpdate
from ...schemas.user import UserInDB
from motor.motor_asyncio import AsyncIOMotorClient

router = APIRouter(tags=["feedback"])

client = AsyncIOMotorClient(settings.MONGODB_URL)
db = client.feedback_system

@router.post("/", response_model=FeedbackOut)
async def create_feedback(feedback: FeedbackCreate, current_user: UserInDB = Depends(get_current_user)):
    if current_user["role"] != "manager":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    feedback_dict = feedback.dict()
    feedback_dict["manager_id"] = str(current_user["_id"])
    feedback_dict["created_at"] = datetime.utcnow()
    feedback_dict["acknowledged"] = False
    result = await db.feedback.insert_one(feedback_dict)
    feedback_dict["_id"] = str(result.inserted_id)
    return feedback_dict

@router.get("/", response_model=List[FeedbackOut])
async def read_feedback(current_user: UserInDB = Depends(get_current_user)):
    if current_user["role"] == "manager":
        feedback = await db.feedback.find({"manager_id": str(current_user["_id"])}).to_list(100)
    else:
        feedback = await db.feedback.find({"employee_id": str(current_user["_id"])}).to_list(100)
    for fb in feedback:
        fb["_id"] = str(fb["_id"])
    return feedback

@router.put("/{feedback_id}", response_model=FeedbackOut)
async def update_feedback(feedback_id: str, feedback: FeedbackUpdate, current_user: UserInDB = Depends(get_current_user)):
    if current_user["role"] != "manager":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    existing_feedback = await db.feedback.find_one({"_id": ObjectId(feedback_id), "manager_id": str(current_user["_id"])})
    if not existing_feedback:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Feedback not found")
    update_data = feedback.dict(exclude_unset=True)
    await db.feedback.update_one({"_id": ObjectId(feedback_id)}, {"$set": update_data})
    updated_feedback = await db.feedback.find_one({"_id": ObjectId(feedback_id)})
    updated_feedback["_id"] = str(updated_feedback["_id"])
    return updated_feedback

@router.post("/{feedback_id}/acknowledge")
async def acknowledge_feedback(feedback_id: str, current_user: UserInDB = Depends(get_current_user)):
    feedback = await db.feedback.find_one({"_id": ObjectId(feedback_id), "employee_id": str(current_user["_id"])})
    if not feedback:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Feedback not found")
    await db.feedback.update_one({"_id": ObjectId(feedback_id)}, {"$set": {"acknowledged": True}})
    return {"message": "Feedback acknowledged"}