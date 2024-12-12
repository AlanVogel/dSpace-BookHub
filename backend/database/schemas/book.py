import typing as t
from pydantic import BaseModel

class Book(BaseModel):
    author: str
    title: str
    topic: str
    category: str
    link: str

    class Config:
        from_attributes = True

class BookResponse(Book):
    id: int
    status: str

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

class Returned(Borrowed):
    pass

    class Config:
        from_attributes: True