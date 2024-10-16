import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import (
    scoped_session, 
    sessionmaker,
)

load_dotenv()
engine = create_engine(os.getenv("DATABASE_URL"))
db_session = scoped_session(sessionmaker(autocommit=False,
                                         autoflush=False,
                                         bind=engine))

Base = declarative_base()
Base.query = db_session.query_property()

def ini_db():
    Base.metadata.create_all(engine)

#:TODO: drop it and update this part (just for testing)
def drop_db():
    Base.metadata.drop_all(engine)

def get_db():
    db = db_session()
    try:
        yield db
    finally:
        db.close()
