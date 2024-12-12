from fastapi import status
from sqlalchemy import case, asc
from sqlalchemy.orm import Session
from datetime import datetime
from database.model.book import Book, BookCopy
from database.model.user import UserBook
from database.providers.user import UserProvider
from database.schemas import book
from router.helper.router_msg import error_exception

class BookProvider:

    @staticmethod
    def get_all_books(db:Session):
        books_with_status = db.query(
            Book,
            case(
                (BookCopy.borrowed_by != None, "UNAVAILABLE"),
                else_="AVAILABLE"
            ).label("status")
        ).outerjoin(BookCopy, Book.id == BookCopy.book_id).order_by(asc(Book.id)).all()

        books = []
        for book, status in books_with_status:
            books.append({
                "id": book.id,
                "author": book.author,
                "title": book.title,
                "topic": book.topic,
                "category": book.category,
                "link": book.link,
                "status": status
            })
        return books
        #return db.query(Book).all()

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
    def get_borrowed_book_by_user_id(borrowed_by: int, db: Session):
        return db.query(BookCopy).filter(BookCopy.borrowed_by == 
                                         borrowed_by).first()
    
    @staticmethod
    def get_returned_book_by_user_id(returned_by: int, db: Session):
        return db.query(BookCopy).filter(BookCopy.returned_by == 
                                         returned_by).first()
    
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
        
    @staticmethod
    def add_status(data: dict, db:Session):
        new_status = BookCopy(borrowed = data.borrowed,
                            time_taken = data.time_taken,
                            time_returned = data.time_taken,
                            location_taken= data.location_taken,
                            location_returned = data.location_taken)
        db.add(new_status)
        db.commit()
        db.refresh(new_status)
        return new_status

    @staticmethod
    def update_book(title: str, db: Session, book_data_form: book.BookEdit):
        db_book = BookProvider.get_book_by_title(book_title = title, db = db)
        if not db_book:
            raise error_exception(status_code = status.HTTP_404_NOT_FOUND,
                                  details = "Book not found",
                                  headers = {"WWW-Authenticate":"Bearer"})
        update_data = book_data_form.model_dump(exclude_unset=True)
        #book_data_to_update = ["author", "title", "topic", "category", "link"]
        
        #for data in book_data_to_update:
        #    if data in update_data:
        #        update_data[data] = book_data_form.data
        #        del update_data[data]
        
        for key, value in update_data.items():
            setattr(db_book, key, value)
        
        db.add(db_book)
        db.commit()
        db.refresh(db_book)
        return db_book

    @staticmethod
    def delete_book(book_id: int, db: Session):
        db_book = BookProvider.get_book_by_id(book_id = book_id, db=db)
        if not db_book:
            raise error_exception(status_code = status.HTTP_404_NOT_FOUND,
                                  details = "Book not found",
                                  headers = {"WWW-Authenticate":"Bearer"})
        db.delete(db_book)
        db.commit()
        return db_book

    @staticmethod
    def borrow_book(user_email: str, book_id: str, 
                    borrow_form_data: book.Borrowed, db: Session):
        db_book = BookProvider.get_book_by_id(book_id = book_id, db = db)
        if not db_book:
            raise error_exception(status_code = status.HTTP_404_NOT_FOUND,
                                  details = "Book not found",
                                  headers = {"WWW-Authenticate":"Bearer"})
        user = UserProvider.get_user_by_email(email = user_email, db = db)
        if not user:
            raise error_exception(status_code = status.HTTP_404_NOT_FOUND,
                                  details = "User not found",
                                  headers = {"WWW-Authenticate":"Bearer"})
        
        db_book_status = db.query(BookCopy).filter(BookCopy.book_id == 
                                                   db_book.id).first() 
        if db_book_status:
            if not db_book_status.returned_by and db_book_status.borrowed_by:
                raise error_exception(status_code = status.HTTP_409_CONFLICT,
                                      details = f"Book is already borrowed."
                                      f"Please contact the {user.email}" 
                                      f"when the book will be returned.",
                                      headers = {"WWW-Authenticate":"Bearer"})
            else:
                db_user_book = db.query(UserBook).filter(UserBook.book_copy_id 
                                                         == db_book_status.id
                                                         ).first()
                if db_user_book:
                    db.delete(db_user_book)
                    db.commit()
                db.delete(db_book_status)
                db.commit()

        book_copy = BookCopy(book_id = db_book.id, 
                             borrowed_by = user.id,
                             location = borrow_form_data.location
                            )
        db.add(book_copy)
        db.commit()
        db.refresh(book_copy)

        user_book = UserBook(user_id = user.id,
                             book_copy_id = book_copy.id,
                             time_taken = datetime.now().replace(microsecond=0),
                             time_returned = None)
        db.add(user_book)
        db.commit()
        db.refresh(user_book)

        return book_copy
            
    @staticmethod
    def return_book(user_email: str, book_id: int, 
                    return_form_data: book.Returned, db = Session):
        db_book = BookProvider.get_book_by_id(book_id = book_id, db=db)
        if not db_book:
            raise error_exception(status_code = status.HTTP_404_NOT_FOUND,
                                  details = "Book not found",
                                  headers = {"WWW-Authenticate":"Bearer"})
        user = UserProvider.get_user_by_email(email = user_email, db = db)
        if not user:
            raise error_exception(status_code = status.HTTP_404_NOT_FOUND,
                                  details = "User not found",
                                  headers = {"WWW-Authenticate":"Bearer"})
        
        db_book_status = db.query(BookCopy).filter(BookCopy.book_id == 
                                                   db_book.id).first()
        if db_book_status:
            if not db_book_status.borrowed_by and db_book_status.returned_by:
                raise error_exception(status_code = status.HTTP_409_CONFLICT,
                                      details = f"Book is already available for"
                                      f"borrowing. Please check the book status."
                                      f"Status: {db_book_status.borrowed_by}",
                                      headers = {"WWW-Authenticate":"Bearer"})
            else:
                db_user_book = db.query(UserBook).filter(UserBook.book_copy_id 
                                                         == db_book_status.id
                                                         ).first()
                if db_user_book:
                    db.delete(db_user_book)
                    db.commit()
                db.delete(db_book_status)
                db.commit()
        
        book_copy = BookCopy(book_id = db_book.id, 
                             returned_by = user.id,
                             location = return_form_data.location
                            )
        db.add(book_copy)
        db.commit()
        db.refresh(book_copy)

        user_book = UserBook(user_id = user.id,
                             book_copy_id = book_copy.id,
                             time_taken = None,
                             time_returned = datetime.now().replace(microsecond=0))
        db.add(user_book)
        db.commit()
        db.refresh(user_book)
        return book_copy
        