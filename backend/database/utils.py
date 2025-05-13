from sqlalchemy.orm import Session
from database.config import db_session
from database.model.user import User
from database.model.book import Book

def is_database_empty() -> bool:
    """
    Check if the database is mepty by querying the User and Book tables.

    :return: True if both tables are empty, False otherwise. 
    """
    with db_session() as db:
        user_count = db.query(User).count()
        book_count = db.query(Book).count()
        return user_count == 0 and book_count == 0
    