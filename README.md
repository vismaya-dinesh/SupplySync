# SupplySync

SupplySync is a full-stack inventory and order management system designed for small businesses to manage customers, products, and orders efficiently.

## Features

- JWT Authentication
- Customer Management
- Product Inventory Management
- Order Creation with Multiple Items
- Automatic Stock Deduction
- Dashboard Analytics
- Low Stock Alerts
- Top Selling Products

## Tech Stack

Frontend:
- React
- Vite
- Axios
- React Router

Backend:
- Flask
- SQLAlchemy
- JWT Authentication

Database:
- SQLite

## System Architecture

React Frontend → Flask REST API → SQLAlchemy → SQLite Database

## API Endpoints

Authentication:
POST /api/auth/login  
POST /api/auth/register

Products:
GET /api/products  
POST /api/products  

Customers:
GET /api/customers  
POST /api/customers  

Orders:
POST /api/orders  
GET /api/orders  

Dashboard:
GET /api/dashboard/overview  
GET /api/dashboard/top-products  

## Running the Project

Backend:

cd backend
python run.py


Frontend:

cd frontend
npm install
npm run dev

Open:
http://localhost:5173