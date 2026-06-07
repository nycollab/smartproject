from typing import Optional, List

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import asc, desc
from sqlalchemy.orm import Session

from app.utils.deps import get_db
from app.models.product import Product
from app.schemas.product import ProductListResponse, ProductResponse

router = APIRouter(prefix="/products", tags=["products"])


@router.get("", response_model=List[ProductListResponse])
def list_products(
    search: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    sort: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    query = db.query(Product).filter(Product.is_active == True)

    if search:
        query = query.filter(Product.name.like(f"%{search}%"))
    if category:
        query = query.filter(Product.category == category)

    if sort == "price_asc":
        query = query.order_by(asc(Product.price))
    elif sort == "price_desc":
        query = query.order_by(desc(Product.price))
    elif sort == "name":
        query = query.order_by(asc(Product.name))

    return query.all()


@router.get("/{product_id}", response_model=ProductResponse)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.product_id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product
