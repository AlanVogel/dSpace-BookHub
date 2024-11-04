import typing as t
from pydantic import BaseModel
from datetime import datetime

class Book(BaseModel):
    author: t.Optional[str]
    title: t.Optional[str]
    topic: t.Optional[str]
    category: t.Optional[str]
    link: t.Optional[str]

    class Config:
        from_attributes = True

class BookEdit(BaseModel):
    author: t.Optional[str] = None
    title: t.Optional[str] = None
    topic: t.Optional[str] = None
    category: t.Optional[str] = None
    link: t.Optional[str] = None

    class Config:
        from_attributes = True

class Borrowed(BaseModel):
    location: str 

    class Config:
        from_attributes: True

class Returned(BaseModel):
    time_returned: datetime
    location: str

    class Config:
        from_attributes: True