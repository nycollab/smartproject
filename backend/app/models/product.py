from sqlalchemy import Column, Integer, String, Text, DECIMAL, Boolean

from app.database import Base


class Product(Base):
    __tablename__ = "products"

    product_id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(200), nullable=False)
    brand = Column(String(100), nullable=False)
    category = Column(String(50), nullable=False)
    price = Column(DECIMAL(10, 2), nullable=False)
    mrp = Column(DECIMAL(10, 2), nullable=False)
    description = Column(Text, nullable=True)
    image_url = Column(String(500), nullable=True)
    wattage = Column(String(50), nullable=True)
    warranty_years = Column(Integer, nullable=True)
    stock = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
