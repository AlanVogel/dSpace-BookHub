from fastapi import (
    Depends, 
    status,
    APIRouter,
)
from database.config import get_db
from database.schemas.helper.utils import make_dependable
from database.providers.book import BookProvider
from database.providers.user import UserProvider
from database.schemas.book import Book, BookEdit, Borrowed, Returned, BookResponse
from .helper.utils import (
    get_current_active_superuser, 
    get_current_active_user
)
from .helper.router_msg import (
    error_exception,
    ok_response
)

router = APIRouter()


@router.post("/add_book")
async def add_book(data:Book, db = Depends(get_db), #data: Book= Depends(make_dependable(Book)), db = Depends(get_db), 
                   current_user = Depends(get_current_active_superuser)):
    new_book = BookProvider.add_book(data = data, db = db)
    return ok_response(status_code = status.HTTP_201_CREATED,
                       details= "Book has been added",
                       **{"Added_by": current_user.email,
                          "Book_added": new_book.title})
 
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
                       **{"Book_deleted": f"{deleted_book.title}",
                          "Deleted_by": f"{current_user.email}"})

@router.patch("/update_book")
async def update_book(book_id: int, data_form: BookEdit, db = Depends(get_db),
                      current_user = Depends(get_current_active_superuser)):
    db_book = BookProvider.get_book_by_id(book_id = book_id, db = db)
    if not db_book:
        return error_exception(status_code = status.HTTP_404_NOT_FOUND,
                               details = "Book not found",
                               headers = {"WWW-Authenticate":"Bearer"})
    updated_book = BookProvider.update_book(book_id = db_book.id, db = db,
                                            book_data_form= data_form)
    return ok_response(status_code = status.HTTP_200_OK,
                       details = "Book updated",
                       **{"Book_ID": f"{updated_book.id}",
                          "Updated_book": f"{updated_book.title}",
                          "Updated_by": f"{current_user.email}"})

@router.get("/get_book")
async def get_book(book_id: int, db = Depends(get_db), 
                   current_user = Depends(get_current_active_user)):
    db_book = BookProvider.get_book_by_id(book_id = book_id, db = db)
    if not db_book:
        return error_exception(status_code = status.HTTP_404_NOT_FOUND,
                               details = "Book not found",
                               headers = {"WWW-Authenticate":"Bearer"})
    return ok_response(status_code = status.HTTP_200_OK,
                       details = "Book found",
                       **{"Book_title": f"{db_book.title}",
                          "Requested_by": f"{current_user.email}"})

@router.get("/get_books", response_model=list[BookResponse])
async def get_books(db = Depends(get_db), 
                   current_user = Depends(get_current_active_user)):
    db_books = BookProvider.get_all_books(db = db)
    if not db_books:
        raise error_exception(status_code = status.HTTP_404_NOT_FOUND,
                               details = "Book not found",
                               headers = {"WWW-Authenticate":"Bearer"})
    return db_books

@router.get("/borrowed_books")
def get_borrowed_books(db = Depends(get_db),
                       current_user = Depends(get_current_active_user)):
    user = UserProvider.get_user_by_email(email = current_user.email, db = db)
    if not user:
        raise error_exception(status_code = status.HTTP_404_NOT_FOUND,
                              details = "User doesn't exist",
                              headers = {"WWW-Authenticate":"Bearer"})
    borrowed_books = BookProvider.get_borrowed_books_by_user_id(borrowed_by = 
                                                                user.id, 
                                                                db = db)
    if not borrowed_books:
        raise error_exception(status_code = status.HTTP_404_NOT_FOUND,
                              details = "No borrowed books found",
                              headers = {"WWW-Authenticate":"Bearer"})
    return [
        {
            "book_id": book.book_id,
            "author": book.book.author,
            "title": book.book.title,
            "topic": book.book.topic,
            "category": book.book.category,
            "location": book.location
        }
        for book in borrowed_books
    ]

@router.post("/borrow_book")
async def borrow_book(book_id: int, borrow_data_form: Borrowed,
                      db = Depends(get_db), 
                      current_user = Depends(get_current_active_user)):
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
                       details = "Book borrowed",
                       **{"Book_title": f"{borrowed_book.book.title}",
                          "Borrowed_by": f"{current_user.email}",
                          "Location": f"{borrowed_book.location}"})

@router.post("/return_book")
async def return_book(book_id: int, return_data_form: Returned, 
                      db = Depends(get_db), 
                      current_user = Depends(get_current_active_user)):
    db_book = BookProvider.get_book_by_id(book_id = book_id, db = db)
    if not db_book:
        return error_exception(status_code = status.HTTP_404_NOT_FOUND,
                               details = "Book not found",
                               headers = {"WWW-Authenticate":"Bearer"})
    returned_book = BookProvider.return_book(user_email=current_user.email,
                                             book_id=book_id,
                                             return_form_data= return_data_form,
                                             db=db)
    return ok_response(status_code = status.HTTP_200_OK,
                       details = "Book returned",
                       **{"Book_title": f"{returned_book.book.title}",
                          "Returned_by": f"{current_user.email}",
                          "Location":f"{returned_book.location}"})