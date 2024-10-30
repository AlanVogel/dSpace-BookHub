from fastapi import status
from sqlalchemy.orm import Session
from database.schemas import user
from database.model.user import User
from router.helper.utils import get_password_hash
from router.helper.router_msg import error_exception

class UserProvider:
    
    @staticmethod
    def get_user_by_id(user_id: int, db: Session):
        return db.query(User).filter(User.id == user_id).first()

    @staticmethod
    def get_user_by_username(username: str, db: Session):
        return db.query(User).filter(User.user_name == username).first()
    
    @staticmethod
    def get_user_by_email(email: str, db: Session):
        return db.query(User).filter(User.email == email).first()
    
    @staticmethod
    def update_user_by_id(user_id: int, db: Session, user: user.UserEdit):
        db_user = UserProvider.get_user_by_id(user_id = user_id, db = db)
        if not db_user:
            raise error_exception(status_code = status.HTTP_404_NOT_FOUND,
                                  details = "User not found",
                                  headers = {"WWW-Authenticate":"Bearer"})
        update_data = user.model_dump(exclude_unset=True)

        if "password" in update_data:
            update_data["hashed_password"] = get_password_hash(user.password)
            del update_data["password"]
        
        for key, value in update_data.items():
            setattr(db_user, key, value)
        
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user

    @staticmethod
    def delete_user_by_id(user_id: int, db: Session):
        db_user = UserProvider.get_user_by_id(user_id = user_id, db = db)
        if not db_user:
            raise error_exception(status_code = status.HTTP_404_NOT_FOUND,
                                  details = "User not found",
                                  headers = {"WWW-Authenticate":"Bearer"})
        db.delete(db_user)
        db.commit()
        return db_user
         
    @staticmethod
    def add_user(data: dict, db: Session):
        new_user = User(user_name = data.user_name, 
                        hashed_password = get_password_hash(data.password),
                        email = data.email["email"],
                        is_active = data.is_active,
                        is_superuser = data.is_superuser)
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        return new_user
        