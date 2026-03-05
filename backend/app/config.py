import os

class Config:
    SECRET_KEY = "super-secret-key"
    JWT_SECRET_KEY = "jwt-secret-key"
    SQLALCHEMY_DATABASE_URI = "sqlite:///supplysync.db"
    SQLALCHEMY_TRACK_MODIFICATIONS = False