from pydantic import BaseModel
from datetime import datetime


class ChatMessageCreate(BaseModel):
    message: str


class ChatHistoryResponse(BaseModel):
    role: str
    content: str
    created_at: datetime
