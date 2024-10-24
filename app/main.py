import uvicorn
from fastapi import FastAPI
from starlette.requests import Request
from router import user
from database.config import db_session, ini_db, drop_db

#drop_db()
ini_db()
app = FastAPI()
app.include_router(user.router)

#:TODO: check CORS for middleware
@app.middleware("http")
async def db_session_middleware(request: Request, call_next):
    request.state.db = db_session
    response = await call_next(request)
    request.state.db.close()
    return response


if __name__ == '__main__':
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)