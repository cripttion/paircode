from sqlalchemy.orm import Session
import models, schemas
import uuid

def get_room(db: Session, room_id: str):
    return db.query(models.Room).filter(models.Room.id == room_id).first()

def create_room(db: Session):
    # Generate a short random ID
    room_id = str(uuid.uuid4())[:8]
    db_room = models.Room(id=room_id, code="")
    db.add(db_room)
    db.commit()
    db.refresh(db_room)
    return db_room

def update_room_code(db: Session, room_id: str, code: str):
    db_room = get_room(db, room_id)
    if db_room:
        db_room.code = code
        db.commit()
        db.refresh(db_room)
    return db_room
