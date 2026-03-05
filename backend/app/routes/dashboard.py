from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from sqlalchemy import func

from app.models.order import Order
from app.models.product import Product
from app.models.customer import Customer
from app.models.order import OrderItem
from app import db


dashboard_bp = Blueprint("dashboard", __name__, url_prefix="/dashboard")


# -------------------------
# Dashboard Overview
# -------------------------

@dashboard_bp.route("/overview", methods=["GET"])
@jwt_required()
def dashboard_overview():

    orders = Order.query.all()
    products = Product.query.all()
    customers = Customer.query.all()

    total_revenue = sum(order.total_amount for order in orders)

    total_orders = len(orders)
    total_products = len(products)
    total_customers = len(customers)

    low_stock_products = []

    for product in products:
        if product.stock_quantity < 10:
            low_stock_products.append({
                "id": product.id,
                "name": product.name,
                "stock_quantity": product.stock_quantity
            })

    return jsonify({
        "total_revenue": total_revenue,
        "total_orders": total_orders,
        "total_products": total_products,
        "total_customers": total_customers,
        "low_stock_products": low_stock_products
    }), 200


# -------------------------
# Top Selling Products
# -------------------------

@dashboard_bp.route("/top-products", methods=["GET"])
@jwt_required()
def top_products():

    results = (
        db.session.query(
            Product.id,
            Product.name,
            func.coalesce(func.sum(OrderItem.quantity), 0).label("quantity")
        )
        .outerjoin(OrderItem, Product.id == OrderItem.product_id)
        .group_by(Product.id, Product.name)
        .order_by(func.sum(OrderItem.quantity).desc())
        .limit(5)
        .all()
    )

    products = []

    for r in results:
        products.append({
            "product_id": r.id,
            "name": r.name,
            "quantity": int(r.quantity)
        })

    return jsonify(products), 200

# -------------------------
# Recent Orders
# -------------------------

@dashboard_bp.route("/recent-orders", methods=["GET"])
@jwt_required()
def recent_orders():

    orders = (
        Order.query
        .order_by(Order.created_at.desc())
        .limit(5)
        .all()
    )

    result = []

    for order in orders:

        items = []

        for item in order.items:

            product = Product.query.get(item.product_id)

            items.append({
                "product_name": product.name if product else "Unknown Product",
                "quantity": item.quantity
            })

        result.append({
            "order_id": order.id,
            "products": items,
            "total_amount": order.total_amount,
            "created_at": order.created_at.strftime("%Y-%m-%d %H:%M")
        })

    return jsonify(result), 200