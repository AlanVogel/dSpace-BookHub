import os
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext
from jose import jwt, JWTError
from dotenv import load_dotenv
from .router_msg import error_exception
from database.schemas.token import TokenData
from database.schemas.user import UserInDB
from database.model.user import User
from fastapi import (
    Depends,
    status
)
from datetime import (
    datetime,
    timedelta,
    timezone
)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_sceme = OAuth2PasswordBearer(tokenUrl="token")

load_dotenv()

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def get_user(db, username: str):
    if username in db:
        user_data = db[username]
        return UserInDB(**user_data)

def authenticate_user(db, username: str, password: str):
    user = get_user(db, username)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    
def create_access_token(data: dict, expires_delta: timedelta or None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, os.getenv("SECRET_KEY"), algorithm = os.getenv("ALGORITHM"))
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_sceme)):
    credential_exception = error_exception(status_code=status.HTTP_401_UNAUTHORIZED,
                                           details = "Could not validate credentials",
                                           headers = {"WWW-Authenticate": "Bearer"})
    try:
        payload = jwt.decode(token, os.getenv("SECRET_KEY"),algorithms = [os.getenv("ALGORITHM")])
        user_name: str = payload.get("sub")
        if user_name is None:
            raise credential_exception
        token_data = TokenData(username = user_name)

    except JWTError:
        raise credential_exception
    
    user = get_user(User, username = token_data.username)
    if user is None:
        raise credential_exception
    
    return user

async def get_current_active_user(current_user: UserInDB = Depends(get_current_user)):
    if current_user.disabled:
        raise error_exception(status_code = status.HTTP_400_BAD_REQUEST,
                              details = "Inactive user")
    return current_user
