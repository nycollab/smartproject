from sqlalchemy import (
    Column, Integer, String, Text, DECIMAL, Enum, TIMESTAMP, ForeignKey, func
)

from app.database import Base


class Order(Base):
    __tablename__ = "orders"

    order_id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    total_amount = Column(DECIMAL(10, 2), nullable=False)
    status = Column(
        Enum("pending", "confirmed", "shipped", "delivered", "cancelled"),
        default="pending",
    )
    payment_method = Column(String(20), default="COD")
    shipping_address = Column(Text, nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now())


class OrderItem(Base):
    __tablename__ = "order_items"

    item_id = Column(Integer, primary_key=True, autoincrement=True)
    order_id = Column(Integer, ForeignKey("orders.order_id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.product_id"), nullable=False)
    quantity = Column(Integer, nullable=False)
    unit_price = Column(DECIMAL(10, 2), nullable=False)
