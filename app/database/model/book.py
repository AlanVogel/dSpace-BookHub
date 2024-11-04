from database.config import Base
from sqlalchemy.orm import relationship
from sqlalchemy import (
    Column,
    Integer,
    Unicode,
    DateTime,
    ForeignKey,
    func
)

class Book(Base):
    __tablename__ = "book"

    id = Column(Integer, primary_key=True)
    author = Column(Unicode(255), nullable=False)
    title = Column(Unicode(255), nullable=False)
    topic = Column(Unicode(255), nullable=False)
    category = Column(Unicode(255), nullable=False)
    link = Column(Unicode(255), nullable=False)
    #One-to-Many relationship with BookCopy
    copies = relationship("BookCopy", back_populates="book")

    def __repr__(self):
        return "{0} {1} {2} {3} {4}".format(self.author, self.title, 
                                            self.topic, self.category,
                                            self.link)

class BookCopy(Base):
    __tablename__ = "book_copy"

    id = Column(Integer, primary_key=True)
    book_id = Column(Integer, ForeignKey("book.id", ondelete="CASCADE"))
    borrowed = Column(Integer, ForeignKey("user.id", ondelete="CASCADE"), nullable=True)
    location= Column(Unicode(255), nullable=True)

    book = relationship("Book", back_populates="copies")
    borrow_logs = relationship("UserBook", back_populates="book_copy")

    def __repr__(self):
        return "{0}".format(self.borrowed)
    