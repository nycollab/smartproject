from sqlalchemy import Column, Integer, ForeignKey

from app.database import Base


class CartItem(Base):
    __tablename__ = "cart_items"

    cart_id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.product_id"), nullable=False)
    quantity = Column(Integer, nullable=False, default=1)
