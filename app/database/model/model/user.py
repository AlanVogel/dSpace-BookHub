from config import Base
from sqlalchemy.orm import relationship
from app.database.model.model.book import Book
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
    password = Column(Unicode(255), nullable=False)
    token = Column(Unicode(255), nullable=False)

    def __repr__(self):
        return "{0} {1}".format(self.user_name, self.email)
    
""" class Book(Base):
    __tablename__ = "book"

    id = Column(Integer, primary_key=True)
    author = Column(Unicode(255), nullable=False)
    title = Column(Unicode(255), nullable=False)
    topic = Column(Unicode(255), nullable=False)
    category = Column(Unicode(255), nullable=False)
    link = Column(Unicode(255), nullable=False)
    quantity = Column(Integer, nullable=False)
    status_id = Column(Integer, ForeignKey("status.id", ondelete="CASCADE"))

    status = relationship("Status")

    def __repr__(self):
        return "{0} {1} {2} {3} {4}".format(self.author, self.title, 
                                            self.topic, self.category,
                                            self.link)

class Status(Base):
    __tablename__ = "status"

    id = Column(Integer, primary_key=True)
    borrowed = Column(Unicode(255), nullable=True)
    #TODO: check what is better to use timestamp or Column(DateTime, nullable=True/False, default=now())
    time_taken = Column(TIMESTAMP(timezone=True), nullable=True)
    time_returned = Column(TIMESTAMP(timezone=True), nullable=True)
    location= Column(Unicode(255), nullable=True)

    def __repr__(self):
        return "{0}".format(self.borrowed) """

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
