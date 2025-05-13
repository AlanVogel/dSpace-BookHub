import os
import uvicorn
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.requests import Request
from contextlib import asynccontextmanager
from router import user, book
from database.config import db_session, init_db, drop_db, database_exists, get_db_url
from database.seed_data import seed_db_from_excel, create_sudo_user
from database.utils import is_database_empty

load_dotenv()
ENVIRONMENT = os.getenv("ENVIRONMENT", "PRODUCTION").upper()
print(f"enviroment: {ENVIRONMENT}")
if ENVIRONMENT == "DEVELOPMENT":
    drop_db()
    init_db()
else:
    if not database_exists(url = get_db_url()):
        init_db()

@asynccontextmanager
async def lifespan(app: FastAPI):
    if ENVIRONMENT == "DEVELOPMENT" or is_database_empty():
        seed_db_from_excel()
        create_sudo_user()
    yield

app = FastAPI(lifespan=lifespan)
app.include_router(user.router)
app.include_router(book.router)

"""@app.middleware("http")
async def db_session_middleware(request: Request, call_next):
    request.state.db = db_session
    response = await call_next(request)
    request.state.db.close()
    return response"""

ALLOWED_ORIGINS = [origin.strip() for origin in os.getenv("ORIGINS", "").split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins = ALLOWED_ORIGINS,
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"],
)

if __name__ == '__main__':
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)