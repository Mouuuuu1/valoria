# Valorina E-Commerce Architecture

## Project Overview
**Valorina** is a full-stack e-commerce platform for women's bags built using modern web technologies and following clean architecture principles.

## Architecture Pattern: Layered Architecture

This project implements a **3-Tier Layered Architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                        │
│              (Next.js Frontend - Port 3000)                  │
│  - React Components (UI)                                     │
│  - Pages & Routing                                           │
│  - State Management (Context API)                            │
│  - API Client (Axios)                                        │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTP/REST API
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                   APPLICATION LAYER                          │
│              (Express.js API - Port 5000)                    │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         CONTROLLER LAYER (Routes & Controllers)      │  │
│  │  - Request validation                                │  │
│  │  - Response formatting                               │  │
│  │  - Error handling                                    │  │
│  └────────────────────┬─────────────────────────────────┘  │
│                       │                                      │
│  ┌────────────────────▼─────────────────────────────────┐  │
│  │         SERVICE LAYER (Business Logic)               │  │
│  │  - Business rules                                    │  │
│  │  - Data transformation                               │  │
│  │  - Complex operations                                │  │
│  └────────────────────┬─────────────────────────────────┘  │
│                       │                                      │
│  ┌────────────────────▼─────────────────────────────────┐  │
│  │    REPOSITORY LAYER (Data Access)                    │  │
│  │  - Database queries                                  │  │
│  │  - Data persistence                                  │  │
│  │  - CRUD operations                                   │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                      DATA LAYER                              │
│                   (MongoDB Database)                         │
│  - Products Collection                                       │
│  - Users Collection                                          │
│  - Orders Collection                                         │
│  - Cart Collection                                           │
└─────────────────────────────────────────────────────────────┘
```

## Key Architectural Benefits

### 1. Separation of Concerns
- **Presentation Layer**: Handles UI and user interactions
- **Business Logic Layer**: Contains core business rules
- **Data Access Layer**: Manages database operations
- **Each layer has a single, well-defined responsibility**

### 2. Maintainability
- Changes in one layer don't affect others
- Easy to update UI without touching business logic
- Database can be swapped without changing business rules

### 3. Testability
- Each layer can be tested independently
- Mock dependencies easily
- Unit tests for business logic, integration tests for API

### 4. Scalability
- Frontend and backend can scale independently
- Can add caching layer without changing business logic
- Easy to add new features following the same pattern

## Technology Stack

### Frontend (Presentation Layer)
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type safety and better developer experience
- **Tailwind CSS**: Utility-first CSS framework
- **Axios**: HTTP client for API calls
- **React Context**: State management

### Backend (Application Layer)
- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **TypeScript**: Type-safe backend code
- **JWT**: Authentication tokens
- **bcrypt**: Password hashing

### Database (Data Layer)
- **MongoDB**: NoSQL database
- **Mongoose**: ODM (Object Data Modeling)

### Additional Services
- **Stripe**: Payment processing
- **Cloudinary**: Image hosting (optional)
- **Vercel**: Frontend deployment
- **Railway/Render**: Backend deployment
- **MongoDB Atlas**: Database hosting

## System Components

### 1. User Management
- User registration with email validation
- Secure authentication (JWT tokens)
- Profile management
- Role-based access (Customer/Admin)

### 2. Product Catalog
- Product listing with pagination
- Category filtering
- Search functionality
- Product details with image gallery
- Inventory management

### 3. Shopping Cart
- Add/remove products
- Update quantities
- Persistent cart storage
- Cart total calculation

### 4. Order Management
- Checkout process
- Shipping information
- Order history
- Order status tracking

### 5. Payment Integration
- Stripe payment gateway
- Secure payment processing
- Payment confirmation

### 6. Admin Dashboard
- Product CRUD operations
- Order management
- User management
- Sales analytics

## API Design

### RESTful API Endpoints

**Authentication**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

**Products**
- `GET /api/products` - List all products
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

**Cart**
- `GET /api/cart` - Get user cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:itemId` - Update cart item
- `DELETE /api/cart/:itemId` - Remove from cart

**Orders**
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order details
- `POST /api/orders` - Create order
- `PUT /api/orders/:id` - Update order status (Admin)

**Payments**
- `POST /api/payments/create-intent` - Create Stripe payment intent
- `POST /api/payments/confirm` - Confirm payment

## Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (customer/admin),
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Products Collection
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  price: Number,
  category: String,
  images: [String],
  stock: Number,
  material: String,
  dimensions: {
    width: Number,
    height: Number,
    depth: Number
  },
  colors: [String],
  featured: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Orders Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  items: [{
    productId: ObjectId,
    name: String,
    price: Number,
    quantity: Number,
    image: String
  }],
  totalAmount: Number,
  shippingAddress: Object,
  paymentStatus: String,
  orderStatus: String,
  paymentIntentId: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Cart Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  items: [{
    productId: ObjectId,
    quantity: Number,
    addedAt: Date
  }],
  updatedAt: Date
}
```

## Security Considerations

1. **Authentication**: JWT tokens with expiration
2. **Password Security**: bcrypt hashing with salt rounds
3. **Input Validation**: Validation middleware on all endpoints
4. **CORS**: Configured for specific origins
5. **Environment Variables**: Sensitive data in .env files
6. **Rate Limiting**: Prevent brute force attacks
7. **HTTPS**: Required in production

## Deployment Strategy

### Development
- Frontend: `npm run dev` on localhost:3000
- Backend: `npm run dev` on localhost:5000
- Database: Local MongoDB or MongoDB Atlas

### Production
- **Frontend**: Vercel (automatic deployments from Git)
- **Backend**: Railway or Render (containerized deployment)
- **Database**: MongoDB Atlas (managed cloud database)
- **CDN**: Vercel Edge Network for static assets
- **SSL**: Automatic HTTPS certificates

## Project Structure

```
valorina/
├── backend/
│   ├── src/
│   │   ├── controllers/      # Request handlers
│   │   ├── services/         # Business logic
│   │   ├── models/           # Database models
│   │   ├── routes/           # API routes
│   │   ├── middleware/       # Auth, validation, error handling
│   │   ├── config/           # Configuration files
│   │   └── utils/            # Helper functions
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── app/              # Next.js pages (App Router)
│   │   ├── components/       # React components
│   │   ├── context/          # State management
│   │   ├── lib/              # Utilities and API client
│   │   └── types/            # TypeScript types
│   ├── public/               # Static assets
│   ├── package.json
│   └── tsconfig.json
└── ARCHITECTURE.md           # This file
```

## Design Patterns Used

1. **MVC Pattern**: Model-View-Controller in backend
2. **Repository Pattern**: Data access abstraction
3. **Dependency Injection**: Services injected into controllers
4. **Middleware Pattern**: Request processing pipeline
5. **Factory Pattern**: Object creation in models
6. **Observer Pattern**: Event handling for orders

## Performance Optimizations

1. **Database Indexing**: On frequently queried fields
2. **Image Optimization**: Next.js Image component
3. **Code Splitting**: Automatic with Next.js
4. **Caching**: API response caching
5. **Lazy Loading**: Components and images
6. **Connection Pooling**: MongoDB connections

## Future Enhancements

1. Wishlist functionality
2. Product reviews and ratings
3. Email notifications
4. Advanced search with filters
5. Inventory alerts
6. Multiple payment methods
7. Multi-language support
8. Mobile app (React Native)

---

**Built for**: Principles of Software Architecture Course
**Architecture**: Layered (3-Tier) Architecture
**Date**: December 2025
