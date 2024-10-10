from app.database.model.book import Book

class BookProvider:

    @classmethod
    def get_book_by_id(cls, book_id: int):
        return Book.query.filter(Book.id == book_id).first()

    @classmethod
    def get_book_by_name(cls, book_name: str):
        return Book.query.filter(Book.title == book_name).first()
    
    @classmethod
    def get_books_by_author(cls, author: str):
        return Book.query.filter(Book.author == author).all()
    
    @classmethod
    def get_books_by_category(cls, book_category: str):
        return Book.query.filter(Book.category == book_category).all()
