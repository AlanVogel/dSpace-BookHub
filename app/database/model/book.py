from database.config import Base
from sqlalchemy.orm import relationship
from sqlalchemy import (
    Column,
    Integer,
    Unicode,
    TIMESTAMP,
    ForeignKey,
)

class Book(Base):
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
    location_taken= Column(Unicode(255), nullable=False)
    location_returned = Column(Unicode(255), nullable=False)

    def __repr__(self):
        return "{0}".format(self.borrowed)