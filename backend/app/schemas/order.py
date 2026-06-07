from datetime import datetime
from decimal import Decimal
from typing import List

from pydantic import BaseModel


class OrderCreate(BaseModel):
    shipping_address: str


class OrderItemResponse(BaseModel):
    item_id: int
    product_id: int
    product_name: str
    quantity: int
    unit_price: Decimal


class OrderResponse(BaseModel):
    order_id: int
    total_amount: Decimal
    status: str
    payment_method: str
    shipping_address: str
    created_at: datetime
    items: List[OrderItemResponse]
