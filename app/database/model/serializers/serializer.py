from enum import Enum
from pydantic import (
    BaseModel,
    EmailStr,
    Field,
    field_validator,
    ValidationError,
    model_validator,
)
from email_validator import (
    validate_email,
    EmailNotValidError,
)

class UserRole(Enum):
    ADMIN = "ADMIN"
    EMPLOYEE = "EMPLOYEE"

class BaseName(BaseModel):
    user_name: str

class Login(BaseModel):
    email: EmailStr = Field(pattern=r".+@dspace\.hr$")
    password: str = Field(min_length=6, pattern=r"\d.*[A-Z]|[A-Z].*\d")

class RegisterUser(BaseName, Login):
    confirm_password: str = Field(min_length=6, pattern=r"\d.*[A-Z]|[A-Z].*\d")

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
    
class Book(BaseModel):
    author: str
    title: str
    topic: str
    category: str
    link: str
    quantity: int

class Role(BaseModel):
    role_type: UserRole

def validation_check(data: dict, checker):
    try:
        checker(**data)
    except ValidationError as e:
        return str(e)
    
#testing
""" data = {
    "user_name": "Alan Vogel",
    "email": "avogel@dspace.hr",
    "password": "1234Aa",
    "confirm_password": "1234Aa",
}

print(validation_check(data=data, checker=RegisterUser)) """
