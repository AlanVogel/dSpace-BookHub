import os
from datetime import timedelta
from dotenv import load_dotenv
from fastapi import (
    Depends, 
    status,
    APIRouter,
    Request
)
from fastapi.security import OAuth2PasswordRequestForm
from database.config import get_db
from database.schemas.token import Token
from database.schemas.user import RegisterUser
from database.model.user import User
from database.providers.user import UserProvider
from .helper.router_msg import (
    error_exception,
    ok_response
)
from .helper.utils import (
    authenticate_user, 
    create_access_token,
)

load_dotenv()
router = APIRouter()

@router.post("/registration")
def registration(user_data: RegisterUser, db = Depends(get_db)):
    user = UserProvider.get_user_by_email(email= user_data.email, db = db)
    if user:
        return error_exception(
            status_code = status.HTTP_409_CONFLICT,
            details = "Email already exist",
            headers = {"WWW-Authenticate":"Bearer"}
        )
    UserProvider.add_user(data = user, db = db)
    return ok_response(status_code = status.HTTP_201_CREATED,
                       details = "Account successfully created",
                       **{"User_info": {"Username": user.user_name, "Email": user.email}})

@router.post("/login", response_model = Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    credential_exception = error_exception(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail = "Incorret username or password",
        headers = {"WWW-Authenticate":"Bearer"})
    user = authenticate_user(User, form_data.username, form_data.password)
    if not user:
        raise credential_exception
    access_token_expires = timedelta(minutes = os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))
    access_token = create_access_token(
        data = {"sub": user.username}, expires_delta = access_token_expires)
    return {"access_token": access_token, "token_type": "bearer"}
