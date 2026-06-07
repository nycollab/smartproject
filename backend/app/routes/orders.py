from decimal import Decimal

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.utils.deps import get_db, get_current_user
from app.models.user import User
from app.models.product import Product
from app.models.cart import CartItem
from app.models.order import Order, OrderItem
from app.schemas.order import OrderCreate, OrderResponse, OrderItemResponse

router = APIRouter(prefix="/orders", tags=["orders"])


@router.post("", response_model=OrderResponse)
def place_order(
    payload: OrderCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    cart_rows = (
        db.query(CartItem, Product)
        .join(Product, CartItem.product_id == Product.product_id)
        .filter(CartItem.user_id == user.user_id)
        .all()
    )
    if not cart_rows:
        raise HTTPException(status_code=400, detail="Cart is empty")

    # stock check before doing anything destructive
    for cart, product in cart_rows:
        if cart.quantity > product.stock:
            raise HTTPException(
                status_code=400,
                detail=f"Not enough stock for {product.name}",
            )

    total = Decimal("0")
    for cart, product in cart_rows:
        total += product.price * cart.quantity

    order = Order(
        user_id=user.user_id,
        total_amount=total,
        status="pending",
        payment_method="COD",
        shipping_address=payload.shipping_address,
    )
    db.add(order)
    db.flush()  # need order_id for the items

    item_responses = []
    for cart, product in cart_rows:
        oi = OrderItem(
            order_id=order.order_id,
            product_id=product.product_id,
            quantity=cart.quantity,
            unit_price=product.price,
        )
        db.add(oi)
        product.stock -= cart.quantity
        db.flush()

        item_responses.append(OrderItemResponse(
            item_id=oi.item_id,
            product_id=product.product_id,
            product_name=product.name,
            quantity=oi.quantity,
            unit_price=oi.unit_price,
        ))

    db.query(CartItem).filter(CartItem.user_id == user.user_id).delete()

    db.commit()
    db.refresh(order)

    return OrderResponse(
        order_id=order.order_id,
        total_amount=order.total_amount,
        status=order.status,
        payment_method=order.payment_method,
        shipping_address=order.shipping_address,
        created_at=order.created_at,
        items=item_responses,
    )
