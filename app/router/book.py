from fastapi import (
    Depends, 
    status,
    APIRouter,
    Request
)
from database.config import get_db
from database.schemas.helper.utils import make_dependable
from database.providers.book import BookProvider
from database.schemas.book import Book, BookEdit, Borrowed, Returned
from .helper.utils import (
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
                          "Book added": new_book.title})
 
@router.delete("/delete_book")
async def delete_book(book_id: int, db = Depends(get_db), 
                      current_user = Depends(get_current_active_superuser)):
    db_book = BookProvider.get_book_by_id(book_id = book_id, db = db)
    if not db_book:
        return error_exception(status_code = status.HTTP_404_NOT_FOUND,
                               details = "Book not found",
                               headers = {"WWW-Authenticate":"Bearer"})
    deleted_book = BookProvider.delete_book(book_id = db_book.id, db = db)
    return ok_response(status_code = status.HTTP_202_ACCEPTED,
                       details = "Book deleted",
                       **{"Book deleted": f"{deleted_book.title}",
                          "Deleted by": f"{current_user.email}"})

@router.put("/update_book")
async def update_book(book_id: int, data_form: BookEdit ,db = Depends(get_db),
                      current_user = Depends(get_current_active_superuser)):
    db_book = BookProvider.get_book_by_id(book_id = book_id, db = db)
    if not db_book:
        return error_exception(status_code = status.HTTP_404_NOT_FOUND,
                               details = "Book not found",
                               headers = {"WWW-Authenticate":"Bearer"})
    updated_book = BookProvider.update_book(title = db_book.title, db = db,
                                            book_data_form= data_form)
    return ok_response(status_code = status.HTTP_200_OK,
                       details = "Book updated",
                       **{"Updated book": f"{updated_book.title}",
                          "Updated by": f"{current_user.email}"})

@router.get("/get_book")
async def get_book(book_id: int, db = Depends(get_db), 
                   current_user = Depends(get_current_user)):
    db_book = BookProvider.get_book_by_id(book_id = book_id, db = db)
    if not db_book:
        return error_exception(status_code = status.HTTP_404_NOT_FOUND,
                               details = "Book not found",
                               headers = {"WWW-Authenticate":"Bearer"})
    return ok_response(status_code = status.HTTP_200_OK,
                       details = "Book found",
                       **{"Book title": f"{db_book.title}",
                          "Requested by": f"{current_user.email}"})

@router.post("/borrow_book")
async def borrow_book(book_id: int, borrow_data_form: Borrowed,
                      db = Depends(get_db), 
                      current_user = Depends(get_current_user)):
    db_book = BookProvider.get_book_by_id(book_id = book_id, db = db)
    if not db_book:
        return error_exception(status_code = status.HTTP_404_NOT_FOUND,
                               details = "Book not found",
                               headers = {"WWW-Authenticate":"Bearer"})
    borrowed_book = BookProvider.borrow_book(user_email = current_user.email,
                                             book_id = book_id, 
                                             borrow_form_data = borrow_data_form,
                                             db = db)
    return ok_response(status_code = status.HTTP_200_OK,
                       details = "Book found",
                       **{"Borrowed book title": f"{borrowed_book.title}",
                          "Borrowed by": f"{current_user.email}"})

@router.post("/return_book")
async def return_book(book_id: int , db = Depends(get_db), 
                      current_user = Depends(get_current_user)):
    db_book = BookProvider.get_book_by_id(book_id = book_id, db = db)
    if not db_book:
        return error_exception(status_code = status.HTTP_404_NOT_FOUND,
                               details = "Book not found",
                               headers = {"WWW-Authenticate":"Bearer"})
    return ok_response(status_code = status.HTTP_200_OK,
                       details = "Book found",
                       **{"Book title": f"{db_book.title}",
                          "Returned by": f"{current_user.email}"})