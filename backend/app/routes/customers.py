from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app import db
from app.models.customer import Customer

customers_bp = Blueprint("customers", __name__)

# Create Customers

@customers_bp.route("/", methods=["POST"])
@jwt_required()
def create_customers():
    data = request.get_json()

    name = data.get("name")
    email = data.get("email")
    phone = data.get("phone")
    address = data.get("address")

    if not name:
        return jsonify({"message": "Customer name is required"}), 400
    
    if email and Customer.query.filter_by(email=email).first():
        return jsonify({"message": "Customer with this email already exists"}), 401
    
    new_customer = Customer(
        name=name,
        email=email,
        phone=phone,
        address=address
    )

    db.session.add(new_customer)
    db.session.commit()

    return jsonify({
        "message": "Customer created successfully",
        "customer": new_customer.to_dict()
    }), 201

# Get All Customers

@customers_bp.route("/", methods=["GET"])
@jwt_required()
def get_customers():
    customers = Customer.query.all()
    return jsonify([
        customer.to_dict() for customer in customers
    ]), 200

# Get a single customer

@customers_bp.route("/<int:customer_id>", methods=["GET"])
@jwt_required()
def get_customer(customer_id):
    customer = Customer.query.get(customer_id)

    if not customer:
        return jsonify({"message": "Customer not found"}), 404
    
    return jsonify(customer.to_dict()), 200

# Update Customer

@customers_bp.route("/<int:customer_id>", methods=["PUT"])
@jwt_required()
def update_customer(customer_id):
    customer = Customer.query.get(customer_id)

    if not customer:
        return jsonify({"message": "Customer not found"}), 404
    
    data = request.get_json()

    customer.name = data.get("name", customer.name)
    customer.email = data.get("email", customer.email)
    customer.phone = data.get("phone", customer.phone)
    customer.address = data.get("address", customer.address)

    db.session.commit()

    return jsonify({
        "message": "Customer updated successfully",
        "customer": customer.to_dict()
    }), 200

# Delete Customer

@customers_bp.route("/<int:customer_id>", methods=["DELETE"])
@jwt_required()
def delete_customer(customer_id):
    customer = Customer.query.get(customer_id)

    if not customer:
        return jsonify({"message": "Customer not found"}), 404
    
    db.session.delete(customer)
    db.session.commit()

    return jsonify({"message": "Customer deleted successfully"}), 200
