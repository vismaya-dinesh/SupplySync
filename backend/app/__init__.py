from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from .config import Config

db = SQLAlchemy()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    jwt.init_app(app)

    # Proper CORS configuration
    CORS(
        app,
        resources={r"/api/*": {"origins": "*"}},
        supports_credentials=True
    )

    with app.app_context():
        db.create_all()

    # Import models
    from app.models.user import User
    from app.models.customer import Customer
    from app.models.product import Product
    from app.models.order import Order, OrderItem

    # Register routes
    from app.routes.auth import auth_bp
    app.register_blueprint(auth_bp, url_prefix="/api/auth")

    from app.routes.customers import customers_bp
    app.register_blueprint(customers_bp, url_prefix="/api/customers")

    from app.routes.products import products_bp
    app.register_blueprint(products_bp, url_prefix="/api/products")

    from app.routes.orders import orders_bp
    app.register_blueprint(orders_bp, url_prefix="/api/orders")

    from app.routes.dashboard import dashboard_bp
    app.register_blueprint(dashboard_bp, url_prefix="/api/dashboard")

    return app