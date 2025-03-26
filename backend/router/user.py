import os
from datetime import timedelta
from dotenv import load_dotenv
from fastapi import (
    Depends, 
    status,
    APIRouter,
    Request,
    Response
)
from fastapi.security import OAuth2PasswordRequestForm
from database.config import get_db
from database.schemas.helper.utils import make_dependable
from database.schemas.user import RegisterUser, UserEdit, UserResponse, VerifyPassword
from database.providers.user import UserProvider
from .helper.router_msg import (
    error_exception,
    ok_response
)
from .helper.utils import (
    authenticate_user, 
    create_access_token,
    get_current_active_superuser,
    get_current_active_user,
    verify_access_token,
    verify_password
)

load_dotenv()
router = APIRouter(prefix="/api")


@router.post("/signup")
async def signup(response: Response,
                 form_data: RegisterUser, 
                 db = Depends(get_db)):
    user = UserProvider.get_user_by_email(db = db, 
                                          email= form_data.email["email"])
    if user:
        raise error_exception(
            status_code = status.HTTP_409_CONFLICT,
            details = "Account already exist",
            headers = {"WWW-Authenticate":"Bearer"}
        )
    db_name = UserProvider.get_user_by_username(username = form_data.user_name,
                                                db = db)
    if db_name:
        if db_name.user_name == form_data.user_name:
            raise error_exception(
                status_code= status.HTTP_409_CONFLICT,
                details= "Name already taken",
                headers= {"WWW-Authenticate":"Bearer"}
            )

    new_user = UserProvider.add_user(db = db, data = form_data)
    if new_user.is_superuser:
        permission = "admin"
    else:
        permission = "employee"
    access_token_expire = timedelta(minutes = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES")))
    access_token = create_access_token(
        data = {"sub": new_user.email, "permission": permission},
                expires_delta= access_token_expire)
    #:TODO: secure=True for ensuring the JWT is only sent over HTTPS in production!!!!
    response.set_cookie(key="access_token", value=f"Bearer {access_token}", 
                        httponly=True, samesite="lax", secure=False)
    return ok_response(status_code = status.HTTP_201_CREATED,
                       details = "Account successfully created.",
                       **{"User_info": {"Username": new_user.user_name, 
                                        "Email": new_user.email}})

@router.post("/login")
async def login(response: Response, db = Depends(get_db), 
                form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(db= db, email= form_data.username, 
                             password= form_data.password)
    if not user:
        raise error_exception(
            status_code = status.HTTP_404_NOT_FOUND,
            details = "Incorrect username/password or account doesn't exist!",
            headers = {"WWW-Authenticate":"Bearer"})
    if user.is_superuser:
        permission = "admin"
    else:
        permission = "employee"
    access_token_expires = timedelta(minutes = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES")))
    access_token = create_access_token(
        data = {"sub": user.email, "permission": permission}, 
                expires_delta = access_token_expires)
    #:TODO: secure=True for ensuring the JWT is only sent over HTTPS in the production!!!!
    response.set_cookie(key="access_token", value=f"Bearer {access_token}", 
                        httponly=True, samesite="lax", secure=False)
    return ok_response(status_code=status.HTTP_200_OK,
                       details="Login succefully")

@router.post("/logout")
async def logout(response: Response):
    response.delete_cookie(key="access_token")
    return ok_response(status_code=status.HTTP_204_NO_CONTENT,
                       details="Successfully logged out")

@router.get("/user_info")
async def get_user_info(request: Request):
    token = request.cookies.get("access_token")
    if not token:
        return {"error": "Unauthorized"}

    try:
        token = token.replace("Bearer ", "")
        payload = verify_access_token(token)
        return {"permission": payload.get("permission", "unknown"),
                "email": payload.get("sub", "unknown")}
    except Exception as e:
        return {"error": "Invalid token"}

@router.get("/get_user", response_model = dict)
async def user_details(current_user = Depends(get_current_active_user)):
    user = {
        "id": current_user.id,
        "user_name": current_user.user_name,
        "email": current_user.email,
        "password": current_user.hashed_password,
        "is_active": current_user.is_active,
        "is_superuser": current_user.is_superuser
    }
    return user

@router.post("/verify_password")
async def verify_user_password(form_data: VerifyPassword, db = Depends(get_db)):
    user = UserProvider.get_user_by_email(email = form_data.email, db = db)
    if not user:
        raise error_exception(
            status_code= status.HTTP_404_NOT_FOUND,
            details = "Users doesn't exist",
            headers = {"WWW-Authenticate": "Bearer"}
        )

    if verify_password(plain_password = form_data.password, 
                       hashed_password = user.hashed_password):
        return ok_response(status_code = 200, 
                           details = "Password is correct!")
    else:
        raise error_exception(
            status_code= status.HTTP_400_BAD_REQUEST,
            details = "Incorrect password!",
            headers = {"WWW-Authenticate": "Bearer"}
        )

@router.get("/get_users", response_model=list[UserResponse])
async def get_users(db = Depends(get_db), 
                    current_user = Depends(get_current_active_superuser)):
    users = UserProvider.get_all_users(db = db)
    if not users:
        raise error_exception(
            status_code= status.HTTP_404_NOT_FOUND,
            details = "Users doesn't exist",
            headers = {"WWW-Authenticate": "Bearer"}
        )
    return users

@router.patch("/update_user")
async def update_used_account(user_id: int, user: UserEdit, db = Depends(get_db),
                              current_user = Depends(get_current_active_superuser)):
    updated_user = UserProvider.update_user_by_id(user_id = user_id, db = db, 
                                                  user = user)
    return ok_response(status_code= status.HTTP_200_OK,
                       details = "User account has been updated",
                       **{"Updated_user": updated_user.user_name,
                          "Updated_by": current_user.email})

@router.patch("/update_account")
async def update_own_account(user_id: int, user: UserEdit, db = Depends(get_db),
                              current_user = Depends(get_current_active_user)):
    updated_user = UserProvider.update_user_by_id(user_id = user_id, db = db, 
                                                  user = user)
    return ok_response(status_code= status.HTTP_200_OK,
                       details = "User account has been updated",
                       **{"Updated_user": updated_user.user_name,
                          "Updated_by": current_user.email})
    
@router.delete("/delete_user")
async def delete_unused_account(user_id: int, db = Depends(get_db),
                                current_user = Depends(get_current_active_superuser)):
    deleted_user = UserProvider.delete_user_by_id(user_id = user_id, db = db)
    return ok_response(status_code= status.HTTP_200_OK,
                       details= "User has been deleted",
                       **{"Deleted_user": deleted_user.user_name,
                          "Deleted_by": current_user.email})
