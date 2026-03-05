from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app import db
from app.models.product import Product

products_bp = Blueprint("products", __name__)

# Create product

@products_bp.route("/", methods=["POST"])
@jwt_required()
def create_product():
    data = request.get_json()

    name = data.get("name")
    sku = data.get("sku")
    price = data.get("price")
    stock_quantity = data.get("stock_quantity")

    if not name or not sku or price is None:
        return jsonify({"message": "Name, SKU and price are required"}), 400

    if Product.query.filter_by(sku=sku).first():
        return jsonify({"message": "Product with this SKU already exists"}), 400

    new_product = Product(
        name=name,
        sku=sku,
        price=price,
        stock_quantity=stock_quantity
    )    

    db.session.add(new_product)
    db.session.commit()

    return jsonify({"message": "Product created successfully", "product": new_product.to_dict()}), 201

# Get all products

@products_bp.route("/", methods=["GET"])
@jwt_required()
def get_products():
    products = Product.query.all()
    return jsonify([product.to_dict() for product in products]), 200

# Get single product
@products_bp.route("<int:product_id>", methods=["GET"])
@jwt_required()
def get_product(product_id):
    product = Product.query.get(product_id)

    if not product:
        return jsonify({"message": "Product not found"}), 404
    
    return jsonify(product.to_dict()), 200

# Update product

@products_bp.route("/<int:product_id>", methods=["PUT"])
@jwt_required()
def update_product(product_id):
    product = Product.query.get(product_id)

    if not product:
        return jsonify({"message": "Product not found"}), 404
    
    data = request.get_json()

    product.name = data.get("name", product.name)
    product.price = data.get("price", product.price)
    product.stock_quantity = data.get("stock_quantity", product.stock_quantity)

    db.session.commit()

    return jsonify({
        "message": "Product updated successfully",
        "product": product.to_dict()
    }), 200

# Delete product

@products_bp.route("/<int:product_id>", methods=["DELETE"])
@jwt_required()
def delete_product(product_id):
    product = Product.query.get(product_id)

    if not product:
        return jsonify({"message": "Product not found"}), 404
    
    db.session.delete(product)
    db.session.commit()

    return jsonify({"message": "Product deleted successfully"}), 201

