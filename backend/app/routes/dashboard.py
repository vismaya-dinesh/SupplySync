from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app.models.order import Order
from app.models.product import Product
from app.models.customer import Customer
from app import db

dashboard_bp = Blueprint("dashboard", __name__)

# DashBoard Overview

@dashboard_bp.route("/overview", methods=["GET"])
@jwt_required()
def dashboard_overview():

    orders = Order.query.all()
    products = Product.query.all()
    customers = Customer.query.all()

    # revenue
    total_revenue = sum(order.total_amount for order in orders)

    # counts
    total_orders = len(orders)
    total_products = len(products)
    total_customers = len(customers)

    # low stock products
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

from app.models.order import OrderItem

# top sellling products

@dashboard_bp.route("/top-products", methods=["GET"])
@jwt_required()
def top_products():

    results = (
        db.session.query(
            Product.id,
            Product.name,
            db.func.sum(OrderItem.quantity).label("total_sold")
        )
        .join(OrderItem, Product.id == OrderItem.product_id)
        .group_by(Product.id)
        .order_by(db.func.sum(OrderItem.quantity).desc())
        .limit(5)
        .all()
    )

    top_products = []

    for r in results:
        top_products.append({
            "product_id": r.id,
            "name": r.name,
            "total_sold": int(r.total_sold)
        })

    return jsonify(top_products), 200
