# ChocoRush: Production Deployment Guide

This guide ensures your ChocoRush application is live and ready for real chocolate orders!

---

## 🚀 Option 1: One-Click Deployment on Railway (Recommended)

Railway allows you to host both your frontend and backend on a single server, which simplifies deployment and avoids CORS issues.

### Deployment Steps:
1. **GitHub Push**: Push your entire `ChocoRush` folder to a new GitHub repository.
2. **Railway Project**: Log in to [Railway.app](https://railway.app) and click **"New Project"**.
3. **Select Method**: Choose **"Deploy from GitHub"**.
4. **Select Repository**: Pick your ChocoRush repository from the list.
5. **Variables**: Go to the **Variables** tab and add your MongoDB connection string as `MONGODB_URI`.

Railway will automatically run `npm install`, `npm run build`, and `npm start` to launch your site.

---

## 🌐 Option 2: Render (Backend) + Vercel/Netlify (Frontend)

If you prefer hosting them separately:

### Backend (Render/Railway)
- **Root Directory**: `.`
- **Build Command**: `npm run install-all`
- **Start Command**: `npm start`
- **Variables**: `MONGODB_URI`, `JWT_SECRET`, `PORT`.

### Frontend (Vercel/Netlify)
- **Root Directory**: `frontend`
- **Build Command**: `vite build`
- **Output Directory**: `dist`
- **API URL**: In `frontend/.env.production`, set `VITE_API_BASE_URL` to your backend URL.

---

## 📂 Database: MongoDB Atlas (Required for Production)

Don't use `localhost` for a live site! Use a free cloud database:
1. Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a **Shared Cluster** (Free).
3. Under **Network Access**, allow IP Address `0.0.0.0/0` (or your platform's specific IPs).
4. Get your connection string (looks like `mongodb+srv://user:pass@cluster.mongodb.net/chocorush`).
5. Use this string in your `MONGODB_URI` environment variable.

---

## 🛠️ Unified Commands (Local & Production)

You can run these from the project root:
- `npm run install-all`: Install all dependencies for both frontend and backend.
- `npm run build`: Build the frontend production assets.
- `npm start`: Start the production server (serves the frontend build from `dist`).
- `npm run dev`: Start both frontend and backend for local development.

**Note on Pricing**: The application is configured to use **Indian Rupee (₹)** globally. All orders placed through the demo payment gateway are securely stored in your MongoDB database.

---

**Congratulations! Your luxury Chocolate e-commerce store is now ready for the world! 🎉**
