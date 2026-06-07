from decimal import Decimal
from typing import Optional

from pydantic import BaseModel


class ProductListResponse(BaseModel):
    product_id: int
    name: str
    brand: str
    category: str
    price: Decimal
    mrp: Decimal
    image_url: Optional[str] = None
    wattage: Optional[str] = None
    stock: int

    class Config:
        from_attributes = True


class ProductResponse(BaseModel):
    product_id: int
    name: str
    brand: str
    category: str
    price: Decimal
    mrp: Decimal
    description: Optional[str] = None
    image_url: Optional[str] = None
    wattage: Optional[str] = None
    warranty_years: Optional[int] = None
    stock: int
    is_active: bool

    class Config:
        from_attributes = True
