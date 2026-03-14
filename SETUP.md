# ChocoRush - Ready-to-Run Setup

Premium luxury chocolate brand website - full-stack with React, Node.js, MongoDB.

---

## Quick Start (3 steps)

### 1. Install dependencies

```bash
npm run install:all
```

Or manually:

```bash
npm install
cd frontend && npm install
cd ../backend && npm install
```

### 2. Seed database

```bash
cd backend
npm run seed
```

Creates 5 sample products + admin user:
- **Admin**: `admin@chocorush.com` / `admin123`

### 3. Run

```bash
npm run dev
```

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000

---

## Project Structure

```
chocorush/
├── frontend/                 # React + Vite
│   ├── src/
│   │   ├── components/       # Navbar, Hero, ProductCard, CartSidebar, ChocolateImage
│   │   ├── context/          # CartContext, AuthContext
│   │   ├── api/              # API client
│   │   ├── hooks/            # useOrderStatusSocket
│   │   ├── pages/            # Home, Menu, Orders, Checkout, Booking, Login, Admin
│   │   └── data/             # Fallback products
│   └── public/images/        # Placeholder SVG
├── backend/
│   ├── models/               # User, Product, Order, Booking, Payment
│   ├── routes/               # users, products, orders, bookings, admin, payments
│   ├── middleware/           # auth (JWT), adminOnly
│   └── scripts/seed.js
└── package.json
```

---

## Features

| Feature | Status |
|---------|--------|
| Cinematic hero with floating particles | ✅ |
| Glassmorphism product cards | ✅ |
| Navbar: Logo, Home, Menu, Order, Booking, Contact, Cart | ✅ |
| Footer with brand & social | ✅ |
| Cart & checkout | ✅ |
| Order history page | ✅ |
| Admin: Add / Edit / Delete products (with confirmation) | ✅ |
| Admin: View orders, update status | ✅ |
| JWT auth (Admin, Customer) | ✅ |
| Razorpay payment integration (optional) | ✅ |
| Real-time order status (Socket.io) | ✅ |
| MongoDB database | ✅ |
| Responsive (desktop, tablet, mobile) | ✅ |

---

## Environment Variables

Create `backend/.env`:

```env
MONGO_URI=mongodb://localhost:27017/chocorush
JWT_SECRET=your-secret-key

# Razorpay (optional - demo works without)
RZP_KEY_ID=rzp_test_xxx
RZP_KEY_SECRET=xxx
```

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/products | - | List products |
| POST | /api/products | Admin | Add product |
| PUT | /api/products/:id | Admin | Edit product |
| DELETE | /api/products/:id | Admin | Soft delete product |
| POST | /api/orders | - | Create order |
| GET | /api/users/orders | User | My orders |
| PATCH | /api/orders/:id/status | Admin | Update order status |
| POST | /api/users/signup | - | Register |
| POST | /api/users/login | - | Login |
| POST | /api/bookings | - | Create booking |
| POST | /api/payments/create-order | - | Razorpay order |
| POST | /api/payments/verify | - | Verify payment |
| GET | /api/admin/* | Admin | Stats, orders, products |

---

## Database Collections

- **Users**: id, name, email, password, role, address, wallet
- **Products**: id, name, description, price, image, category, stock
- **Orders**: id, user_id, items[], total_price, status, payment_status
- **Bookings**: id, name, email, phone, guests, date, time, status
- **Payments**: id, order_id, amount, status, method

---

## Admin Panel

1. Login: `admin@chocorush.com` / `admin123`
2. Go to `/admin`
3. **Products**: Add, Edit, Delete (with confirmation popup)
4. **Orders**: View all, update status (pending → confirmed → shipped → delivered)
5. Real-time: when admin changes status, customer's Order page updates live

---

## Prerequisites

- **Node.js** 18+
- **MongoDB** (local or Atlas)

Without MongoDB the app will run but APIs will fail. Use MongoDB for full functionality.
