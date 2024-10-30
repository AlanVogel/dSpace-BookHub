from fastapi import status
from sqlalchemy.orm import Session
from app.database.model.book import Book, Status
from app.database.model.user import UserBook
from app.database.providers.user import UserProvider
from app.database.schemas import book
from router.helper.router_msg import error_exception

class BookProvider:

    @staticmethod
    def get_book_by_id(book_id: int, db: Session):
        return db.query(Book).filter(Book.id == book_id).first()

    @staticmethod
    def get_book_by_title(book_title: str, db: Session):
        return db.query(Book).filter(Book.title == book_title).first()
    
    @staticmethod
    def get_books_by_author(author: str, db: Session):
        return db.query(Book).filter(Book.author == author).all()
    
    @staticmethod
    def get_books_by_category(book_category: str, db: Session):
        return db.query(Book).filter(Book.category == 
                                     book_category).all()
    
    @staticmethod
    def add_book(data: dict, db: Session):
        new_book = Book(author = data.author, 
                        title = data.title,
                        topic = data.topic,
                        category = data.category,
                        link = data.link)
        db.add(new_book)
        db.commit()
        db.refresh(new_book)
        return new_book
    #:TODO: Status model is changed so this need to be refactored
    @staticmethod
    def add_status(data: dict, db:Session):
        new_status = Status(borrowed = data.borrowed,
                            time_taken = data.time_taken,
                            time_returned = data.time_taken,
                            location_taken= data.location_taken,
                            location_returned = data.location_taken)
        db.add(new_status)
        db.commit()
        db.refresh(new_status)
        return new_status

    @staticmethod
    def update_book(title: str, db: Session, book: book.Book):
        db_book = BookProvider.get_book_by_title(book_title = title, db = db)
        if not db_book:
            raise error_exception(status_code = status.HTTP_404_NOT_FOUND,
                                  details = "Book not found",
                                  headers = {"WWW-Authenticate":"Bearer"})
        update_data = book.model_dump(exclude_unset=True)
        book_data_to_update = ["author", "title", "topic", "category", "link",
                               "quantity"]
        
        for data in book_data_to_update:
            if data in update_data:
                update_data[data] = book[data]
                del update_data[data]
        
        for key, value in update_data.items():
            setattr(db_book, key, value)
        
        db.add(db_book)
        db.commit()
        db.refresh(db_book)
        return db_book

    @staticmethod
    def delete_book(book_title: str, db: Session):
        db_book = BookProvider.get_book_by_title(book_title = book_title, db=db)
        if not db_book:
            raise error_exception(status_code = status.HTTP_404_NOT_FOUND,
                                  details = "Book not found",
                                  headers = {"WWW-Authenticate":"Bearer"})
        db.delete(db_book)
        db.commit()
        return db_book

    @staticmethod
    def borrow_book(user_id: int, book_title: str, borrow_status: book.Borrowed,
                    db: Session):
        db_book = BookProvider.get_book_by_title(book_title = book_title, db=db)
        if not db_book:
            raise error_exception(status_code = status.HTTP_404_NOT_FOUND,
                                  details = "Book not found",
                                  headers = {"WWW-Authenticate":"Bearer"})
        user = UserProvider.get_user_by_id(user_id = user_id, db = db)
        if not user:
            raise error_exception(status_code = status.HTTP_404_NOT_FOUND,
                                  details = "User not found",
                                  headers = {"WWW-Authenticate":"Bearer"})
        
        db_book_status = db.query(Status).filter(Status.id == 
                                                 db_book.status_id).first()
        if db_book.quantity == 0 and db_book_status.borrowed:
            raise error_exception(status_code = status.HTTP_409_CONFLICT,
                                  details = f"Book is already borrowed. Please\
                                  contact the {db_book_status.borrowed} when \ 
                                  the book will be returned",
                                  headers = {"WWW-Authenticate":"Bearer"})
        else:
            db_book.quantity -= 1
            db.add(db_book)
            db.commit()
            db.refresh(db_book)

        db.add(borrow_status)
        db.commit()
        db.refresh(borrow_status)
        #:TODO: try using user_book model for queries testing
        return borrow_status
            
    @staticmethod
    def return_book(user_id: int, book_title: str, return_status: book.Returned,
                    db = Session):
        db_book = BookProvider.get_book_by_title(book_title = book_title, db=db)
        if not db_book:
            raise error_exception(status_code = status.HTTP_404_NOT_FOUND,
                                  details = "Book not found",
                                  headers = {"WWW-Authenticate":"Bearer"})
        user = UserProvider.get_user_by_id(user_id = user_id, db = db)
        if not user:
            raise error_exception(status_code = status.HTTP_404_NOT_FOUND,
                                  details = "User not found",
                                  headers = {"WWW-Authenticate":"Bearer"})
        
        new_returned_status = BookProvider.add_status(data=return_status, db=db)

        return new_returned_status
        