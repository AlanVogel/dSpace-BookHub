from fastapi import (
    Depends, 
    status,
    APIRouter,
    Request
)
from database.config import get_db
from database.schemas.helper.utils import make_dependable
from database.providers.book import BookProvider
from database.schemas.book import Book
from helper.utils import (
    get_current_active_superuser, 
    get_current_user
)
from .helper.router_msg import (
    error_exception,
    ok_response
)

router = APIRouter()


@router.post("/add_book")
async def add_book(data: Book = Depends(make_dependable(Book)), db = Depends(get_db), 
                   current_user = Depends(get_current_active_superuser)):
    new_book = BookProvider.add_book(data = data, db = db)
    return ok_response(status_code = status.HTTP_201_CREATED,
                       details= "Book has been added",
                       **{"Added by": current_user.email,
                          "Book": new_book.title,
                          "Book quantity": new_book.quantity})
 
@router.delete("/delete_book")
async def delete_book(request = Request, db = Depends(get_db), 
                      current_user = Depends(get_current_active_superuser)):
    pass

@router.patch("/update_book")
async def update_book(request = Request,db = Depends(get_db), 
                      current_user = Depends(get_current_active_superuser)):
    pass

@router.get("/get_book")
async def get_book(request = Request, db = Depends(get_db), 
                   current_user = Depends(get_current_user)):
    pass

@router.post("/borrow_book")
async def borrow_book(request = Request, db = Depends(get_db), 
                      current_user = Depends(get_current_user)):
    pass

@router.post("/return_book")
async def return_book(request = Request, db = Depends(get_db), 
                      current_user = Depends(get_current_user)):
    pass