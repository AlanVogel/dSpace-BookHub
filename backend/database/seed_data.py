import os
import openpyxl
from dotenv import load_dotenv
from .config import db_session
from .model.book import Book
from .model.user import User
from router.helper.utils import get_password_hash

def extract_hyperlink(file_path: str, sheet_name: str):
    """
    Extracts URLs and titles from an Excel sheet.
    Returns a list of dictionaries with 'url' and 'title' keys.
    """
    wb = openpyxl.load_workbook(file_path, data_only=True)
    ws = wb[sheet_name]
    data = []

    for row in ws.iter_rows(min_row=2, values_only=False):
        book_cell = row[0]
        topic = row[1].value
        author = row[2].value
        category = row[3].value

        if book_cell.value is None:
            break

        if book_cell.hyperlink:
            url = book_cell.hyperlink.target
            title = book_cell.value
        else:
            url = None
            title = book_cell.value

        data.append({
            "title": title,
            "url": url,
            "author": author,
            "topic": topic,
            "category": category
        })

    return data

def seed_db_from_excel():
    file_path = os.path.join(os.path.dirname(__file__), "dS_Library.xlsx")
    if not os.path.exists(file_path):
        print(f"Excel file not found at: {file_path}")
        return

    data = extract_hyperlink(file_path, sheet_name="Sheet1")
    session = db_session()
    try:
        for row in data:
            new_book = Book(
                author=row.get("author"),
                title=row.get("title"),
                topic=row.get("topic"),
                category=row.get("category"),
                link=row.get("url"),
            )
            session.add(new_book)
        session.commit()
    except Exception as e:
        session.rollback()
        print("Error:", str(e))
    finally:
        session.close()

def create_sudo_user():

    load_dotenv()
    user_name = os.getenv("SUDO_USER_NAME")
    email = os.getenv("SUDO_USER_EMAIL")
    password = os.getenv("SUDO_USER_PASSWORD")
    is_superuser = os.getenv("SUDO_USER_IS_SUPERUSER") == "True" 

    if not user_name or not email or not password:
        print("Error: Missing sudo user details in .env")
        return
    
    session = db_session()

    try:
        new_user = User(
            user_name = user_name, 
            hashed_password = get_password_hash(password),
            email = email,
            is_superuser = is_superuser
        )
        session.add(new_user)
        session.commit()
        session.refresh(new_user)
    except Exception as e:
        print("Error:", str(e))
    finally:
        session.close()
