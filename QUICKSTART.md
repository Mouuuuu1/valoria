# Quick Start Guide for Valorina

This guide will help you get Valorina up and running quickly.

## Prerequisites Checklist

- [ ] Node.js installed (v18+)
- [ ] MongoDB installed or MongoDB Atlas account
- [ ] Stripe account (for payments)
- [ ] Git (optional, for version control)

## Quick Setup (5 minutes)

### 1. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend (in new terminal)
cd frontend
npm install
```

### 2. Configure Environment

**Backend (.env):**
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/valorina
JWT_SECRET=your_super_secret_key_here
STRIPE_SECRET_KEY=sk_test_your_key
FRONTEND_URL=http://localhost:3000
```

**Frontend (.env.local):**
```bash
cd frontend
cp .env.example .env.local
```

Edit `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
```

### 3. Start MongoDB

**macOS:**
```bash
brew services start mongodb-community
```

**Windows:**
```bash
net start MongoDB
```

**Linux:**
```bash
sudo systemctl start mongod
```

**Or use MongoDB Atlas** (cloud, no install needed)

### 4. Seed Database with Sample Data

```bash
cd backend
npm run build
node dist/seed.js
```

This creates:
- Admin user: `admin@valorina.com` / `admin123`
- Customer user: `customer@valorina.com` / `customer123`
- 8 sample products

### 5. Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 6. Open Your Browser

Go to: **http://localhost:3000**

## Testing the App

1. **Browse Products**: Visit homepage, click "Shop Now"
2. **Login**: Use `customer@valorina.com` / `customer123`
3. **Add to Cart**: Click any product, add to cart
4. **View Cart**: Click cart icon in navbar
5. **Admin Panel**: Login as admin, visit `/admin` (you'll need to create this page)

## Common Issues

### MongoDB Connection Error
- Make sure MongoDB is running
- Check `MONGODB_URI` in `.env`
- For Atlas, whitelist your IP address

### Port Already in Use
- Change `PORT` in backend `.env`
- Update `NEXT_PUBLIC_API_URL` in frontend `.env.local`

### JWT Token Error
- Make sure `JWT_SECRET` is set in backend `.env`
- Clear browser localStorage and re-login

### Stripe Error
- Make sure you're using test keys (starting with `sk_test_` and `pk_test_`)
- Keys must match between backend and frontend

## Next Steps

1. **Customize Products**: Add your own products via admin panel
2. **Update Branding**: Change colors in `tailwind.config.js`
3. **Add Features**: Refer to `ARCHITECTURE.md` for structure
4. **Deploy**: Follow deployment guide in `README.md`

## Need Help?

- Check `README.md` for detailed documentation
- Review `ARCHITECTURE.md` for technical details
- Ensure all environment variables are set correctly

---

Happy coding! 🚀
