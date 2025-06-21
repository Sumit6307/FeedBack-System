from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class FeedbackBase(BaseModel):
    employee_id: str
    strengths: str
    areas_to_improve: str
    sentiment: str
    comments: Optional[str] = None

class FeedbackCreate(FeedbackBase):
    pass

class FeedbackUpdate(BaseModel):
    strengths: Optional[str] = None
    areas_to_improve: Optional[str] = None
    sentiment: Optional[str] = None
    comments: Optional[str] = None

class FeedbackOut(FeedbackBase):
    _id: str
    manager_id: str
    created_at: datetime
    acknowledged: bool