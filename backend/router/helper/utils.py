import os
from typing import Optional
from fastapi import Depends, status
from passlib.context import CryptContext
from jose import jwt, JWTError
from pydantic import ValidationError
from datetime import datetime, timedelta, timezone
from dotenv import load_dotenv
from .router_msg import error_exception
from .cookie import OAuth2PasswordBearerWithCookie
from database.schemas.token import TokenData
from database.schemas.user import UserInDB
from database.providers import user as provider
from database.config import get_db


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_sceme = OAuth2PasswordBearerWithCookie(tokenUrl="/login")

load_dotenv()

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def get_user(db, email: str):
    user = provider.UserProvider.get_user_by_email(db = db, email = email)
    if user:
        user_data = {"id": user.id,
                     "user_name": user.user_name,
                     "is_active": user.is_active,
                     "email": user.email,
                     "hashed_password": user.hashed_password,
                     "is_superuser": user.is_superuser}
        return UserInDB(**user_data)

def authenticate_user(db, email: str, password: str):
    user = get_user(db, email)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user
    
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, os.getenv("SECRET_KEY"), algorithm = os.getenv("ALGORITHM"))
    return encoded_jwt

def verify_access_token(token: str = Depends(oauth2_sceme)):
    """
    Decodes and verifies the JWT access token.
    Returns the payload if valid, or raises an error if invalid.
    """
    try:
        payload = jwt.decode(token, os.getenv("SECRET_KEY"), algorithms=[os.getenv("ALGORITHM")])
        exp = payload.get("exp")

        if exp and datetime.fromtimestamp(exp, tz=timezone.utc) < datetime.now(timezone.utc):
            raise JWTError("Token has expired")

        return payload
    except JWTError as e:
        raise JWTError(f"Invalid token: {e}")

async def get_current_user(token: str = Depends(oauth2_sceme), db = Depends(get_db)):
    credential_exception = error_exception(status_code=status.HTTP_401_UNAUTHORIZED,
                                           details = "Could not validate credentials",
                                           headers = {"WWW-Authenticate": "Bearer"})
    try:
        payload = verify_access_token(token = token)
        email: str = payload.get("sub")
        permission: str = payload.get("permission")
        if email is None:
            raise credential_exception
        token_data = TokenData(email = email, permission = permission)

    except (JWTError, ValidationError):
        raise credential_exception
    user = get_user(db = db, email = token_data.email)
    if user is None:
        raise credential_exception
    
    return user

async def get_current_active_user(current_user: UserInDB = Depends(get_current_user)):
    if not current_user.is_active:
        raise error_exception(status_code = status.HTTP_400_BAD_REQUEST,
                              details = "Inactive user")
    return current_user

async def get_current_active_superuser(current_user: UserInDB = Depends(get_current_user)):
    if not current_user.is_active:
        raise error_exception(status_code = status.HTTP_400_BAD_REQUEST,
                              details = "Inactive user")
    if not current_user.is_superuser:
        raise error_exception(status_code = status.HTTP_403_FORBIDDEN,
                              details = "You shall not pass!")
    return current_user
