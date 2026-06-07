from sqlalchemy import Column, Integer, String, Text, Enum, TIMESTAMP, func

from app.database import Base


class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    phone = Column(String(15), nullable=False)
    address = Column(Text, nullable=True)
    role = Column(Enum("customer", "admin"), default="customer")
    created_at = Column(TIMESTAMP, server_default=func.now())
