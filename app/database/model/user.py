from database.config import Base
from sqlalchemy.orm import relationship
from database.model.book import BookCopy
from sqlalchemy import (
    Column,
    Integer,
    Unicode,
    ForeignKey,
    Boolean,
    DateTime,
    func
)


class User(Base):
    __tablename__ = "user"

    id = Column(Integer, primary_key=True)
    user_name = Column(Unicode(255), nullable=False)
    email = Column(Unicode(255), nullable=False)
    hashed_password = Column(Unicode(255), nullable=False)
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)

    borrowed_books = relationship("UserBook", back_populates="user")

    def __repr__(self):
        return "{0} {1}".format(self.user_name, self.email)
    
class UserBook(Base):
    __tablename__ = "user_book"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("user.id", ondelete="CASCADE"))
    book_copy_id = Column(Integer, ForeignKey("book_copy.id", ondelete="CASCADE"))
    time_taken = Column(DateTime(timezone=True), nullable=True)
    time_returned = Column(DateTime(timezone=True), nullable=True)

    user = relationship("User", back_populates="borrowed_books")
    book_copy = relationship("BookCopy", back_populates= "borrow_logs")

    def __repr__(self):
        return "{0} {1}".format(self.user_id, self.book_copy_id)
