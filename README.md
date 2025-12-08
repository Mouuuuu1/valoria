# Valorina E-Commerce Platform

![Valorina Logo](https://via.placeholder.com/150x50/ec4899/ffffff?text=Valorina)

A full-stack e-commerce platform for women's bags built with modern web technologies and following clean **Layered Architecture** principles.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [Environment Configuration](#environment-configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Deployment Guide](#deployment-guide)
- [For Your College Course](#for-your-college-course)

## 🎯 Project Overview

**Valorina** is a production-ready e-commerce platform designed for selling premium women's bags. It demonstrates professional software architecture patterns and modern web development best practices.

### Key Highlights

- **Architecture Pattern**: 3-Tier Layered Architecture (Presentation, Business Logic, Data Access)
- **Full-Stack**: Separate frontend and backend with RESTful API
- **Authentication**: Secure JWT-based authentication
- **Payment Integration**: Stripe payment processing
- **Admin Dashboard**: Complete product and order management
- **Responsive Design**: Mobile-first, modern UI
- **Production Ready**: Deployment-ready configuration

## 🏗️ Architecture

This project implements a **Layered Architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────┐
│     PRESENTATION LAYER (Frontend)       │
│         Next.js + React                 │
│  - UI Components                        │
│  - State Management (Context API)       │
│  - API Client                           │
└──────────────────┬──────────────────────┘
                   │ REST API (HTTP/JSON)
                   ▼
┌─────────────────────────────────────────┐
│     APPLICATION LAYER (Backend)         │
│         Express.js + TypeScript         │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │   Controllers (Request Handling)  │ │
│  └────────────┬──────────────────────┘ │
│               ▼                         │
│  ┌───────────────────────────────────┐ │
│  │   Services (Business Logic)       │ │
│  └────────────┬──────────────────────┘ │
│               ▼                         │
│  ┌───────────────────────────────────┐ │
│  │   Models (Data Access)            │ │
│  └───────────────────────────────────┘ │
└──────────────────┬──────────────────────┘
                   │ Mongoose ODM
                   ▼
┌─────────────────────────────────────────┐
│       DATA LAYER (Database)             │
│          MongoDB                        │
└─────────────────────────────────────────┘
```

### Benefits of This Architecture

1. **Separation of Concerns**: Each layer has a single responsibility
2. **Maintainability**: Easy to update or replace components
3. **Testability**: Layers can be tested independently
4. **Scalability**: Components can scale independently

## 🚀 Technology Stack

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Axios**: HTTP client for API calls
- **React Context API**: State management
- **React Toastify**: Toast notifications
- **React Icons**: Icon library

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework
- **TypeScript**: Type-safe backend code
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **JWT**: JSON Web Tokens for authentication
- **bcryptjs**: Password hashing
- **Stripe**: Payment processing
- **express-validator**: Request validation

## ✨ Features

### Customer Features
- ✅ User registration and authentication
- ✅ Browse products with filters and search
- ✅ View product details with image gallery
- ✅ Add products to shopping cart
- ✅ Secure checkout process
- ✅ Stripe payment integration
- ✅ Order history and tracking
- ✅ User profile management

### Admin Features
- ✅ Product management (CRUD operations)
- ✅ Order management and status updates
- ✅ User management
- ✅ Sales analytics and statistics
- ✅ Inventory tracking

### Technical Features
- ✅ RESTful API architecture
- ✅ JWT authentication with protected routes
- ✅ Input validation and error handling
- ✅ Password hashing with bcrypt
- ✅ CORS configuration
- ✅ Environment-based configuration
- ✅ TypeScript for type safety

## 📁 Project Structure

```
valorina/
├── ARCHITECTURE.md          # Detailed architecture documentation
├── README.md               # This file
├── backend/                # Backend API
│   ├── src/
│   │   ├── config/        # Database and app configuration
│   │   ├── controllers/   # Request handlers (Presentation)
│   │   ├── middleware/    # Auth, validation, error handling
│   │   ├── models/        # Mongoose models (Data Access)
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   └── server.ts      # Application entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
└── frontend/              # Frontend application
    ├── src/
    │   ├── app/          # Next.js pages (App Router)
    │   ├── components/   # React components
    │   ├── context/      # State management
    │   ├── lib/          # API client and utilities
    │   └── types/        # TypeScript type definitions
    ├── public/           # Static assets
    ├── package.json
    ├── next.config.js
    ├── tailwind.config.js
    └── .env.example
```

## 🛠️ Setup Instructions

### Prerequisites

Before you begin, ensure you have installed:
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **MongoDB** - [Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (cloud)
- **npm** or **yarn** package manager
- A **Stripe account** (for payment processing) - [Sign up](https://stripe.com/)

### Step 1: Clone or Navigate to the Project

```bash
cd /Users/moustafakhalid/Desktop/architecture
```

### Step 2: Setup Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env file with your configuration
nano .env  # or use any text editor
```

**Configure your `.env` file:**

```env
PORT=5000
NODE_ENV=development

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/valorina
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/valorina

# JWT Secret (generate a secure random string)
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRE=7d

# Stripe Keys
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

### Step 3: Setup Frontend

```bash
# Navigate to frontend directory (from project root)
cd ../frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Edit .env.local file
nano .env.local  # or use any text editor
```

**Configure your `.env.local` file:**

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

### Step 4: Setup MongoDB

**Option A: Local MongoDB**
```bash
# Start MongoDB service
# macOS (with Homebrew)
brew services start mongodb-community

# Windows
net start MongoDB

# Linux
sudo systemctl start mongod
```

**Option B: MongoDB Atlas (Cloud)**
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string
4. Replace `MONGODB_URI` in backend `.env` file

### Step 5: Get Stripe API Keys

1. Sign up at [Stripe](https://stripe.com/)
2. Go to Developers → API keys
3. Copy your **Publishable key** and **Secret key**
4. Add them to your environment files
5. Use test keys (starting with `pk_test_` and `sk_test_`) for development

## ▶️ Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Backend will run on `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Frontend will run on `http://localhost:3000`

### Production Build

**Backend:**
```bash
cd backend
npm run build
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm start
```

## 🔑 Default Admin Account

To create an admin account, you need to either:

1. **Register a user through the UI**, then manually update the role in MongoDB:
```bash
# Connect to MongoDB
mongosh

# Use the database
use valorina

# Update user role to admin
db.users.updateOne(
  { email: "your@email.com" },
  { $set: { role: "admin" } }
)
```

2. **Or create directly in MongoDB**:
```javascript
db.users.insertOne({
  name: "Admin User",
  email: "admin@valorina.com",
  password: "$2a$10$...", // Hash your password first
  role: "admin",
  createdAt: new Date(),
  updatedAt: new Date()
})
```

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | Login user | No |
| GET | `/auth/me` | Get current user | Yes |
| PUT | `/auth/profile` | Update profile | Yes |

### Product Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/products` | Get all products | No |
| GET | `/products/:id` | Get product by ID | No |
| GET | `/products/featured` | Get featured products | No |
| POST | `/products` | Create product | Admin |
| PUT | `/products/:id` | Update product | Admin |
| DELETE | `/products/:id` | Delete product | Admin |

### Cart Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/cart` | Get user cart | Yes |
| POST | `/cart` | Add to cart | Yes |
| PUT | `/cart/:productId` | Update cart item | Yes |
| DELETE | `/cart/:productId` | Remove from cart | Yes |

### Order Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/orders` | Create order | Yes |
| GET | `/orders` | Get user orders | Yes |
| GET | `/orders/:id` | Get order details | Yes |
| POST | `/orders/payment/create-intent` | Create payment | Yes |
| GET | `/orders/admin/all` | Get all orders | Admin |
| PUT | `/orders/:id/status` | Update order status | Admin |

### Example Request

```bash
# Register a new user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

## 🚀 Deployment Guide

### Frontend Deployment (Vercel)

1. **Push code to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin your-repo-url
git push -u origin main
```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Select the `frontend` directory
   - Add environment variables:
     - `NEXT_PUBLIC_API_URL`: Your backend URL
     - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Your Stripe key
   - Deploy!

### Backend Deployment (Railway/Render)

**Option A: Railway**
1. Go to [railway.app](https://railway.app)
2. Create new project
3. Connect GitHub repository
4. Select `backend` directory
5. Add environment variables from `.env`
6. Deploy

**Option B: Render**
1. Go to [render.com](https://render.com)
2. New → Web Service
3. Connect GitHub repository
4. Root directory: `backend`
5. Build command: `npm install && npm run build`
6. Start command: `npm start`
7. Add environment variables
8. Deploy

### Database Deployment (MongoDB Atlas)

1. Create cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create database user
3. Whitelist IP addresses (or use 0.0.0.0/0 for all)
4. Get connection string
5. Update `MONGODB_URI` in your backend environment

## 🎓 For Your College Course

### Architecture Explanation

This project demonstrates a **3-Tier Layered Architecture**:

1. **Presentation Layer** (Frontend - Next.js)
   - Handles user interface and interactions
   - Communicates with backend via REST API
   - Manages client-side state

2. **Business Logic Layer** (Backend - Express.js)
   - **Controllers**: Handle HTTP requests/responses
   - **Services**: Contain business logic and rules
   - **Middleware**: Authentication, validation, error handling

3. **Data Access Layer** (Models + Database)
   - **Models**: Define data structure with Mongoose
   - **Database**: MongoDB for data persistence

### Key Architectural Concepts Demonstrated

✅ **Separation of Concerns**: Each layer has distinct responsibilities  
✅ **Dependency Inversion**: Layers depend on abstractions  
✅ **Single Responsibility**: Each module has one job  
✅ **RESTful API Design**: Standard HTTP methods and status codes  
✅ **Authentication & Authorization**: JWT tokens, role-based access  
✅ **Input Validation**: Middleware validates all inputs  
✅ **Error Handling**: Centralized error handling middleware  
✅ **Database Design**: Normalized schema with relationships  

### Presentation Tips

1. **Start with the architecture diagram** (in ARCHITECTURE.md)
2. **Explain the flow**: User → Frontend → API → Service → Model → Database
3. **Show code examples**:
   - A controller method
   - A service with business logic
   - A model schema
4. **Demonstrate the app**: Register → Browse → Add to Cart → Checkout
5. **Discuss scalability**: How each layer can scale independently

### Questions You Might Get

**Q: Why separate frontend and backend?**  
A: Allows independent development, scaling, and technology choices. Frontend can be replaced without touching backend.

**Q: Why use services instead of putting logic in controllers?**  
A: Controllers handle HTTP concerns, services handle business logic. This makes code reusable and testable.

**Q: How does authentication work?**  
A: JWT tokens are issued on login, stored client-side, sent with each request, and verified by middleware.

**Q: Can this scale?**  
A: Yes! Frontend (Vercel) and backend (Railway) can scale independently. MongoDB Atlas handles database scaling.

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Built for **Principles of Software Architecture** course  
Date: December 2025

## 🤝 Contributing

This is a course project, but suggestions are welcome!

## 📞 Support

For questions about this project:
- Review the `ARCHITECTURE.md` for detailed architecture
- Check API endpoints in this README
- Ensure environment variables are correctly set

---

**Happy Coding! 🚀**

Build something amazing with Valorina!
