import typing as t
from pydantic import (
    BaseModel,
    EmailStr,
    Field,
    field_validator,
    model_validator,
)
from email_validator import (
    validate_email,
    EmailNotValidError,
)


class User(BaseModel):
    user_name: str
    is_active: t.Optional[bool] = True

    class Config:
        from_attributes = True

class UserEdit(BaseModel):
    user_name: t.Optional[str]  = None
    password: t.Optional[str] = None
    is_superuser: t.Optional[bool] = False

    class Config:
        from_attributes = True

class UserInDB(User):
    email: EmailStr
    hashed_password: str
    is_superuser: bool

    class Config:
        from_attributes = True

class Login(BaseModel):
    email: EmailStr = Field(pattern=r".+@dspace\.hr$")
    password: str = Field(min_length=6, pattern=r"\d.*[A-Z]|[A-Z].*\d")

    class Config:
        from_attributes = True

class RegisterUser(User, Login):
    confirm_password: str = Field(min_length=6, pattern=r"\d.*[A-Z]|[A-Z].*\d")
    is_superuser: bool = False

    class Config:
        from_attributes = True

    @field_validator("email")
    @classmethod
    def is_email_valid(cls, email):
        try:
            return validate_email(email, test_environment=True)
        except EmailNotValidError as e:
            raise ValueError(f"{email} is not valid email: {e}")
    
    @model_validator(mode="after")
    @classmethod
    def check_password_match(cls, values):
        if values.password != values.confirm_password:
            raise ValueError("Password and confirm password don't match!")
        return values
