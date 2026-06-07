from decimal import Decimal
from typing import List, Optional

from pydantic import BaseModel


class CartItemCreate(BaseModel):
    product_id: int
    quantity: int


class CartItemUpdate(BaseModel):
    quantity: int


class CartItemResponse(BaseModel):
    cart_id: int
    product_id: int
    product_name: str
    product_image: Optional[str] = None
    price: Decimal
    quantity: int


class CartResponse(BaseModel):
    items: List[CartItemResponse]
    total: Decimal
