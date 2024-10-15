from database.config import Base
from sqlalchemy.orm import relationship
from database.model.book import Book
from sqlalchemy import (
    Column,
    Integer,
    Unicode,
    ForeignKey,
)


class User(Base):
    __tablename__ = "user"

    id = Column(Integer, primary_key=True)
    user_name = Column(Unicode(255), nullable=False)
    email = Column(Unicode(255), nullable=False)
    hashed_password = Column(Unicode(255), nullable=False)

    def __repr__(self):
        return "{0} {1}".format(self.user_name, self.email)

class Role(Base):
    __tablename__ = "role"

    id = Column(Integer, primary_key=True)
    role_type = Column(Unicode(255), nullable=False)
    user_id = Column(Integer, ForeignKey("user.id", ondelete="CASCADE"))

    user = relationship("User")

    def __repr__(self):
        return "{0}".format(self.role_name)
    
class UserBook(Base):
    __tablename__ = "user_book"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("user.id", ondelete="CASCADE"))
    book_id = Column(Integer, ForeignKey("book.id", ondelete="CASCADE"))

    user = relationship("User")
    book = relationship("Book")

    def __repr__(self):
        return "{0} {1}".format(self.user_id, self.book_id)
