# ChocoRush – Luxury Chocolate Delivery Website
A premium chocolate e-commerce platform with cart, checkout and admin dashboard.
# ChocoRush - Luxury Chocolate Delivery Website

A premium chocolate e-commerce platform (similar to Swiggy/Zomato for chocolates) with luxury dark chocolate aesthetic, JWT auth, full cart & checkout, booking, location tracking, and admin dashboard.

## Features

- **Luxury UI**: Dark chocolate (#1a0f0a), gold (#d4af37), Playfair Display & Poppins
- **Navigation**: Sticky navbar – Logo | Home | Menu | Order | Booking | About | Contact | Cart | Login
- **Hero**: Balanced section with floating cocoa particles, gradient overlay
- **Products**: Responsive grid, lazy-loaded images, fallback placeholders, hover animations
- **Cart**: Add/remove, quantity, total, sidebar, localStorage persistence
- **Checkout**: Name, phone, address, payment method, order summary, **location capture**
- **Booking**: Chocolate tasting reservation form
- **Auth**: JWT + bcrypt – signup, login, protected routes
- **Admin**: Add/edit/delete products (with confirmation), view orders, update delivery status
- **Location**: Browser geolocation API – lat/lng stored for delivery tracking
- **Images**: Unsplash URLs, `onError` fallback, `loading="lazy"`
- **Payments**: Razorpay integration (optional)
- **Real-time**: Socket.io for live order status updates

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Framer Motion, React Router
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Auth**: JWT, bcrypt

## Prerequisites

- Node.js 18+
- MongoDB (required for persistence; app runs but APIs fail without it)

## Quick Start

### 1. Install

```bash
npm run install:all
```

### 2. Seed products & admin user

```bash
cd backend
npm run seed
```

Creates 5 products + admin user: `admin@chocorush.com` / `admin123`

### 3. Run

```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:5000

### 4. Environment (optional)

Create `backend/.env`:

```
MONGO_URI=mongodb://localhost:27017/chocorush
JWT_SECRET=your-secret-key
```

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/users/signup | - | Register |
| POST | /api/users/login | - | Login (JWT) |
| GET | /api/users/me | Bearer | Current user |
| GET | /api/users/orders | Bearer | My orders |
| GET | /api/products | - | List products |
| POST | /api/products | Admin | Add product |
| PUT | /api/products/:id | Admin | Edit product |
| DELETE | /api/products/:id | Admin | Soft delete |
| POST | /api/orders | - | Create order (supports location) |
| GET | /api/orders | Admin | All orders |
| PATCH | /api/orders/:id/status | Admin | Update status |
| POST | /api/bookings | - | Create booking |
| GET | /api/admin/stats | Admin | Dashboard stats |
| GET | /api/admin/orders | Admin | Orders |
| GET | /api/admin/bookings | Admin | Bookings |

## Database Models

- **User**: name, email, password (bcrypt), role (user/admin), address, wallet
- **Product**: name, description, price, image, category, stock, isActive
- **Order**: name, phone, address, items, totalPrice, status, payment_status, location (lat/lng)
- **Payment**: orderId, amount, status, method (razorpay, stripe, paytm)
- **Booking**: name, email, phone, guests, date, time, message
- **Cart**: userId, items (for future backend cart)

## Admin Dashboard

- Login as `admin@chocorush.com` / `admin123`
- Visit `/admin`
- Add/Edit chocolates
- View orders and update status (pending → confirmed → shipped → delivered)

## Location Tracking

On checkout, the app requests `navigator.geolocation.getCurrentPosition()`. Latitude and longitude are stored with the order for delivery tracking.

## Products (Default)

- Dark Truffle Delight – ₹199
- Belgian Milk Bar – ₹249
- Hazelnut Praline Box – ₹299
- Caramel Chocolate Bites – ₹229
- Almond Cocoa Crunch – ₹269

## Build

```bash
cd frontend
npm run build
```

Output in `frontend/dist`.

# chocorush
Chocolate ordering website with cart and payment demo

