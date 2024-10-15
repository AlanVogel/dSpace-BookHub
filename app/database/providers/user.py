from fastapi import Depends
from sqlalchemy.orm import Session
from database.model.user import User

class UserProvider:
    
    @classmethod
    def get_user_by_id(cls, user_id: int):
        return User.query.filter(User.id == user_id).first()

    @classmethod
    def get_user_by_name(cls, name: str):
        return User.query.filter(User.user_name == name).first()
    
    @classmethod
    def get_user_by_email(cls, email: str, db: Session):
        return db.query(User).filter(User.email == email).first()

    @classmethod
    def delete_user_by_email(cls,  email: str):
        user = User.query.filter(User.email == email).first()
        return User.delete(user) 
    
    @classmethod
    def add_user(cls, data: dict, db: Session):
        new_user = User(user_name = data.get("username"), 
                        password = data.get("password"),
                        email = data.get("email"))
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        