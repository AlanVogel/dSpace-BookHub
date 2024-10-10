from enum import Enum
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

class UserRole(Enum):
    ADMIN = "ADMIN"
    EMPLOYEE = "EMPLOYEE"

class User(BaseModel):
    user_name: str
    disabled: bool | None = None

class UserInDB(User):
    hashed_password: str

class Login(BaseModel):
    email: EmailStr = Field(pattern=r".+@dspace\.hr$")
    password: str = Field(min_length=6, pattern=r"\d.*[A-Z]|[A-Z].*\d")

class RegisterUser(User, Login):
    confirm_password: str = Field(min_length=6, pattern=r"\d.*[A-Z]|[A-Z].*\d")
    role_type: UserRole

    @field_validator("email")
    @classmethod
    def is_email_valid(cls, email):
        try:
            return validate_email(email)
        except EmailNotValidError as e:
            raise ValueError(f"{email} is not valid emaild: {e}")
    
    @model_validator(mode="after")
    @classmethod
    def check_password_match(cls, values):
        if values.get("password") != values.get("confirm_password"):
            raise ValueError("Password and confirm password don't match!")
        return values
