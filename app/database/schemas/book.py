from pydantic import BaseModel

class Book(BaseModel):
    author: str
    title: str
    topic: str
    category: str
    link: str
    quantity: int