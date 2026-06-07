from decimal import Decimal

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.utils.deps import get_db, get_current_user
from app.models.user import User
from app.models.product import Product
from app.models.cart import CartItem
from app.schemas.cart import (
    CartItemCreate, CartItemUpdate, CartItemResponse, CartResponse,
)

router = APIRouter(prefix="/cart", tags=["cart"])


def _make_item_response(cart, product):
    return CartItemResponse(
        cart_id=cart.cart_id,
        product_id=product.product_id,
        product_name=product.name,
        product_image=product.image_url,
        price=product.price,
        quantity=cart.quantity,
    )


@router.get("", response_model=CartResponse)
def get_cart(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    rows = (
        db.query(CartItem, Product)
        .join(Product, CartItem.product_id == Product.product_id)
        .filter(CartItem.user_id == user.user_id)
        .all()
    )

    items = []
    total = Decimal("0")
    for cart, product in rows:
        items.append(_make_item_response(cart, product))
        total += product.price * cart.quantity

    return CartResponse(items=items, total=total)


@router.post("", response_model=CartItemResponse)
def add_to_cart(
    payload: CartItemCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    if payload.quantity < 1:
        raise HTTPException(status_code=400, detail="Quantity must be at least 1")

    product = db.query(Product).filter(Product.product_id == payload.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    existing = (
        db.query(CartItem)
        .filter(
            CartItem.user_id == user.user_id,
            CartItem.product_id == payload.product_id,
        )
        .first()
    )

    if existing:
        new_qty = existing.quantity + payload.quantity
        if new_qty > product.stock:
            raise HTTPException(status_code=400, detail="Not enough stock")
        existing.quantity = new_qty
        db.commit()
        db.refresh(existing)
        return _make_item_response(existing, product)

    if payload.quantity > product.stock:
        raise HTTPException(status_code=400, detail="Not enough stock")

    cart = CartItem(
        user_id=user.user_id,
        product_id=payload.product_id,
        quantity=payload.quantity,
    )
    db.add(cart)
    db.commit()
    db.refresh(cart)

    return _make_item_response(cart, product)


@router.put("/{item_id}", response_model=CartItemResponse)
def update_cart_item(
    item_id: int,
    payload: CartItemUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    if payload.quantity < 1:
        raise HTTPException(status_code=400, detail="Quantity must be at least 1")

    cart = (
        db.query(CartItem)
        .filter(CartItem.cart_id == item_id, CartItem.user_id == user.user_id)
        .first()
    )
    if not cart:
        raise HTTPException(status_code=404, detail="Cart item not found")

    product = db.query(Product).filter(Product.product_id == cart.product_id).first()
    if payload.quantity > product.stock:
        raise HTTPException(status_code=400, detail="Not enough stock")

    cart.quantity = payload.quantity
    db.commit()
    db.refresh(cart)

    return _make_item_response(cart, product)


@router.delete("/{item_id}", status_code=204)
def remove_from_cart(
    item_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    cart = (
        db.query(CartItem)
        .filter(CartItem.cart_id == item_id, CartItem.user_id == user.user_id)
        .first()
    )
    if not cart:
        raise HTTPException(status_code=404, detail="Cart item not found")

    db.delete(cart)
    db.commit()
    return None
