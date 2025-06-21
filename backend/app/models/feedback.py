from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class Feedback(BaseModel):
    employee_id: str
    manager_id: str
    strengths: str
    areas_to_improve: str
    sentiment: str
    comments: Optional[str] = None
    created_at: datetime
    acknowledged: bool