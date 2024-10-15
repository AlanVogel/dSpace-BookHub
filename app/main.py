import uvicorn
from fastapi import FastAPI
from router import user

app = FastAPI()
app.include_router(user.router)

""" @app.middleware("http")
async def db_session_middleware(request: Request, call_next):
    request.state.db = db_session
    response = await call_next(request)
    request.state.db.close()
    return response """


if __name__ == '__main__':
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)