from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()

# Default to SQLite for prototype simplicity if Postgres URL not set, 
# but ready for Postgres as requested.
#sqlite:///./sql_app.db
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL","sqlite:///./sql_app.db")
# For Postgres, it would look like: "postgresql://user:password@postgresserver/db"

check_same_thread = False
if "sqlite" in SQLALCHEMY_DATABASE_URL:
    check_same_thread = True
    connect_args = {"check_same_thread": False}
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL, connect_args=connect_args
    )
else:
    engine = create_engine(SQLALCHEMY_DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
