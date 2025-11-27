from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class RoomBase(BaseModel):
    pass

class RoomCreate(RoomBase):
    pass

class Room(RoomBase):
    id: str
    code: str
    created_at: datetime

    class Config:
        orm_mode = True

class AutocompleteRequest(BaseModel):
    code: str
    cursorPosition: int
    language: str

class AutocompleteResponse(BaseModel):
    suggestion: str
