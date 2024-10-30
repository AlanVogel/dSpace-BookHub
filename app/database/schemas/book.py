from pydantic import BaseModel
from datetime import datetime

class Book(BaseModel):
    author: str
    title: str
    topic: str
    category: str
    link: str
    quantity: int

    class Config:
        from_attributes = True

class Borrowed(BaseModel):
    borrowed: int
    time_taken: datetime
    location_taken: str 

    class Config:
        from_attributes: True

class Returned(BaseModel):
    time_returned: datetime
    location_returned: str

    class Config:
        from_attributes: True