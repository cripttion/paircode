from sqlalchemy import Column, String, Text, DateTime
from sqlalchemy.sql import func
from database import Base

class Room(Base):
    __tablename__ = "rooms"

    id = Column(String, primary_key=True, index=True)
    code = Column(Text, default="")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
