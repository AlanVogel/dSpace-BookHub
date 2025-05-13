import os
import re
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.exc import ProgrammingError, OperationalError
from sqlalchemy.sql import text
from sqlalchemy.engine.url import make_url, URL
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import (
    scoped_session, 
    sessionmaker,
)
from typing import Union, Optional

load_dotenv()
engine = create_engine(os.getenv("DATABASE_URL"), isolation_level="SERIALIZABLE")
db_session = scoped_session(sessionmaker(autocommit=False,
                                         autoflush=False,
                                         bind=engine))

Base = declarative_base()
Base.query = db_session.query_property()

def get_db_url() -> URL:
    return engine.url

def init_db():
    Base.metadata.create_all(engine)

def drop_db():
    Base.metadata.drop_all(engine)

def get_db():
    db = db_session()
    try:
        yield db
    finally:
        db.close()

def _set_url_database(url: Union[str, URL], database: Optional[str] = None) -> URL:
    """
    Update the database field in a SQLAlchemy URL, returning a new URL object.

    :param url: A SQLAlchemy URL object or string.
    :param database: The new database name (or None to unset).
    :return: A new SQLAlchemy URL object with the updated database field.
    :raises ValueError: If the database name is invalid.
    """
    url = make_url(url)
    if database:
        if not re.match(r'^[a-zA-Z_][a-zA-Z0-9_]*$', database):
            raise ValueError(f"Invalid database name: '{database}'. Must start" 
                             f"with a letter or underscore and contain only "
                             f"letters, numbers, or underscores.")
    
    return URL.create(
        drivername=url.drivername,
        username=url.username,
        password=url.password,
        host=url.host,
        port=url.port,
        database=database,
        query=url.query
    )

def database_exists(url: Union[str, URL]) -> bool:
    """
    Check if database already exist to avoid unnecessary creation.

    :param url: A SQLAlchemy engine URL object or string.
    :return: bool
    """
    url = make_url(url)
    database = url.database
    dialect_name = url.get_dialect().name

    if dialect_name != "postgresql":
        raise ValueError(f"Function only support PostgreSQL, got dialect: {dialect_name}")
    if not database:
        raise ValueError("Database name must be provided")
    if not re.match(r'^[a-zA-Z_][a-zA-Z0-9_]*$', database):
        raise ValueError(f"Invalid database name: '{database}'. Must start"
                         f"with a letter or underscore and contain only letters," 
                         f"numbers, or underscores.")

    check_url = _set_url_database(url, database="postgres")
    engine = None
    try:
        engine = create_engine(check_url)
        with engine.connect() as conn:
            result = conn.execute(
                text("SELECT 1 FROM pg_database WHERE datname = :db_name"),
                {"db_name": database}
            )
            if result.scalar():
                return True
            return False
    except (ProgrammingError, OperationalError) as e:
        raise OperationalError(f"Failed to check database existence: {str(e)}", None, None)
    finally:
        if engine:
            engine.dispose()
