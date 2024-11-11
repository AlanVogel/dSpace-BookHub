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
from database.schemas.user import RegisterUser, UserEdit
from database.providers.user import UserProvider
from .helper.router_msg import (
    error_exception,
    ok_response
)
from .helper.utils import (
    authenticate_user, 
    create_access_token,
    get_current_active_superuser
)

load_dotenv()
router = APIRouter()


@router.post("/signup")
def signup(response: Response, 
           form_data: RegisterUser = Depends(make_dependable(RegisterUser)), 
           db = Depends(get_db)):
    user = UserProvider.get_user_by_email(db = db, 
                                          email= form_data.email["email"])
    if user:
        return error_exception(
            status_code = status.HTTP_409_CONFLICT,
            details = "Account already exist",
            headers = {"WWW-Authenticate":"Bearer"}
        )
    db_name = UserProvider.get_user_by_username(username = form_data.user_name,
                                                db = db)
    if db_name:
        if db_name.user_name == form_data.user_name:
            return error_exception(
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
    #:TODO: secure=True for ensuring the JWT is only sent over HTTPS
    response.set_cookie(key="access_token", value=f"Bearer {access_token}", 
                        httponly=True, samesite="lax")
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
        return error_exception(
            status_code = status.HTTP_401_UNAUTHORIZED,
            details = "Incorret username or password",
            headers = {"WWW-Authenticate":"Bearer"})
    if user.is_superuser:
        permission = "admin"
    else:
        permission = "employee"
    access_token_expires = timedelta(minutes = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES")))
    access_token = create_access_token(
        data = {"sub": user.email, "permission": permission}, 
                expires_delta = access_token_expires)
    #:TODO: secure=True for ensuring the JWT is only sent over HTTPS
    response.set_cookie(key="access_token", value=f"Bearer {access_token}", 
                        httponly=True, samesite="lax")
    return ok_response(status_code=status.HTTP_200_OK,
                       details="Login succefully")

@router.post("/logout")
async def logout(response: Response):
    response.delete_cookie(key="access_token")
    return ok_response(status_code=status.HTTP_204_NO_CONTENT,
                       details="Successfully logged out")

@router.get("/get_user/{user_id}")
async def user_details(user_id: int, db = Depends(get_db),
                       current_user = Depends(get_current_active_superuser)):
    user = UserProvider.get_user_by_id(user_id = user_id, db = db)
    if not user:
        return error_exception(
            status_code = status.HTTP_404_NOT_FOUND,
            details = "User doesn't exist",
            headers = {"WWW-Authenticate":"Bearer"}
        )
    return ok_response(status_code= status.HTTP_200_OK,
                       details="Returned user",
                       **{"Returned user:": f"{user}",
                          "Requested by:": f"{current_user.email}"})

@router.put("/update_user/{user_id}")
async def update_used_account(request: Request, user_id: int, user: UserEdit, 
                              current_user = Depends(get_current_active_superuser),
                              db = Depends(get_db)):
    updated_user = UserProvider.update_user_by_id(user_id = user_id, db = db, 
                                                  user = user)
    return ok_response(status_code= status.HTTP_200_OK,
                       details = "User account has been updated",
                       **{"updated_user": updated_user.user_name,
                          "updated_by": current_user.email})
    

@router.delete("/delete_user/{user_id}")
async def delete_unused_account(user_id: int, db = Depends(get_db),
                                current_user = Depends(get_current_active_superuser)):
    deleted_user = UserProvider.delete_user_by_id(user_id = user_id, db = db)
    return ok_response(status_code= status.HTTP_200_OK,
                       details= "User has been deleted",
                       **{"deleted_user": deleted_user.user_name,
                          "deleted_by": current_user.email})
