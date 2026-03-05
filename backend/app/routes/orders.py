from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app import db
from app.models.order import Order, OrderItem
from app.models.product import Product
from app.models.customer import Customer

orders_bp = Blueprint("orders", __name__)

# Create order
@orders_bp.route("/", methods=["POST"])
@jwt_required()
def create_order():

    data = request.get_json()

    customer_id = data.get("customer_id")
    items = data.get("items")

    if not customer_id or not items:
        return jsonify({"message": "Customer and items are required"}), 400
    
    customer = Customer.query.get(customer_id)

    if not customer:
        return jsonify({"message": "Customer not found"}), 404
    
    order = Order(customer_id=customer_id)
    total_amount = 0

    for item in items:

        product_id = item.get("product_id")
        quantity = item.get("quantity")

        product = Product.query.get(product_id)

        if not product:
            return jsonify({"message": f"Product {product_id} not found"}), 404
        
        if product.stock_quantity < quantity:
            return jsonify({"message": f"Not enough stock for {product.name}"}), 400
        
        price = product.price

        order_item = OrderItem(
            product_id=product_id,
            quantity=quantity,
            price=price
        )

        product.stock_quantity -= quantity

        total_amount += price * quantity

        order.items.append(order_item)

    order.total_amount = total_amount

    db.session.add(order)
    db.session.commit()

    return jsonify({
        "message": "Order created successfully",
        "order": order.to_dict()
    }), 201

# Get all orders

@orders_bp.route("/", methods=["GET"])
@jwt_required()
def get_orders():
    orders = Order.query.all()
    return jsonify([order.to_dict() for order in orders]), 200

# Get order by ID

@orders_bp.route("/<int:order_id>", methods=["GET"])
@jwt_required()
def get_order(order_id):
    order = Order.query.get(order_id)

    if not order:
        return jsonify({"message": "Order not found"}), 404
    
    return jsonify(order.to_dict()), 200

# Revenue Analytics

@orders_bp.route("/analytics/revenue", methods=["GET"])
@jwt_required()
def revenue_analytics():

    orders = Order.query.all()

    total_revenue = sum(order.total_amount for order in orders)
    total_orders = len(orders)

    avg_order_value = 0
    if total_orders > 0:
        avg_order_value = total_revenue / total_orders

    return jsonify({
        "total_revenue": total_revenue,
        "total_orders": total_orders,
        "average_order_value": avg_order_value
    }), 200
