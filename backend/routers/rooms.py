from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import crud, schemas, database

router = APIRouter()

@router.post("/rooms", response_model=schemas.Room)
def create_room(db: Session = Depends(database.get_db)):
    return crud.create_room(db)

@router.get("/rooms/{room_id}", response_model=schemas.Room)
def read_room(room_id: str, db: Session = Depends(database.get_db)):
    db_room = crud.get_room(db, room_id=room_id)
    if db_room is None:
        raise HTTPException(status_code=404, detail="Room not found")
    return db_room
