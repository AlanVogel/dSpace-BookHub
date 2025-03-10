import os
import uvicorn
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.requests import Request
from contextlib import asynccontextmanager
from router import user, book
from database.config import db_session, ini_db, drop_db
from database.seed_data import seed_db_from_excel, create_sudo_user

load_dotenv()
drop_db()
ini_db()

@asynccontextmanager
async def lifespan(app: FastAPI):
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