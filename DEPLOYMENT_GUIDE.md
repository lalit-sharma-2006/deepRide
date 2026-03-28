# 🚀 QuickRide Deployment Guide for Admin System

## Overview
This guide covers deploying QuickRide with the Admin Management System to production.

---

## 📋 Prerequisites

- Backend deployed (Node.js hosting)
- Frontend deployed (Vercel, Netlify, or similar)
- MongoDB Atlas cluster (already configured)
- Environment variables configured on both services

---

## 🔧 Backend Deployment

### Step 1: Prepare Backend for Production

1. **Update Backend `.env` file:**
   ```
   PORT = 3000
   MONGODB_PROD_URL = mongodb+srv://deepRide_db:lalit2023@deepride.bbahvga.mongodb.net/quickRide?retryWrites=true&w=majority
   JWT_SECRET = your-secure-secret-key-here
   GOOGLE_MAPS_API = AIzaSyCW83U6HpGg2rWO98vuqy8Q-0W1FAZHBao
   ENVIRONMENT = production
   ```

2. **Key settings:**
   - Set `ENVIRONMENT = production`
   - Use MongoDB Atlas connection string (PROD_URL)
   - Keep JWT_SECRET secure and long

### Step 2: Deploy Backend

#### Option A: Deploy to Heroku
```bash
# Install Heroku CLI
# Login to Heroku
heroku login

# Create Heroku app
heroku create your-app-name-backend

# Set environment variables
heroku config:set MONGODB_PROD_URL="your-connection-string"
heroku config:set JWT_SECRET="your-secret"
heroku config:set GOOGLE_MAPS_API="your-api-key"
heroku config:set ENVIRONMENT="production"

# Deploy
git push heroku main
```

#### Option B: Deploy to Railway, Render, or similar
Follow their documentation and set the same environment variables.

#### Option C: Deploy to your own server
```bash
# SSH into your server
ssh user@your-server.com

# Clone repository
git clone https://github.com/yourusername/quickride.git
cd quickride/Backend

# Install dependencies
npm install

# Create .env file with production settings
nano .env  # Add production variables

# Run as background process
pm2 start server.js --name "quickride-backend"
pm2 save
pm2 startup
```

### Step 3: Verify Backend

Test your backend:
```bash
curl https://your-backend-url.com/admin/register
```

You should see the server responding with a message.

---

## 🎨 Frontend Deployment

### Step 1: Update Frontend Environment

1. **Update `Frontend/.env` for production:**
   ```
   VITE_API_URL=https://your-backend-url.com
   VITE_ENVIRONMENT=production
   VITE_RIDE_TIMEOUT=90000
   ```

2. **Replace `your-backend-url.com` with your actual backend URL**

### Step 2: Build Frontend

```bash
cd Frontend
npm run build
```

This creates a `dist` folder with optimized production files.

### Step 3: Deploy Frontend

#### Option A: Vercel (Recommended)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

**Configure in Vercel Dashboard:**
1. Go to Settings → Environment Variables
2. Add `VITE_API_URL=https://your-backend-url.com`
3. Redeploy

#### Option B: Netlify
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

#### Option C: Traditional Web Hosting
```bash
# Upload dist folder contents to your server
scp -r Frontend/dist/* user@your-server.com:/var/www/yoursite/
```

---

## 🔐 Admin Account Setup

### Automatic Setup
The admin account is **automatically created** when the backend starts!

**Default Admin Credentials:**
```
📧 Email: tarunkumar140802@gmail.com
🔑 Password: lalit2023
👤 Name: Tarun Kumar
```

The account is created by the `seed.js` script that runs automatically on backend startup.

### Manual Admin Creation (if needed)

If you want to create additional admin accounts:

```bash
# Method 1: API Request
curl -X POST https://your-backend-url.com/admin/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullname": {"firstname":"Your","lastname":"Name"},
    "email": "youremail@gmail.com",
    "password": "yourpassword",
    "role": "admin"
  }'

# Method 2: Direct Database Insert
# Connect to MongoDB Atlas and insert directly into admin collection
db.admins.insertOne({
  fullname: {firstname: "Name", lastname: "Surname"},
  email: "email@example.com",
  password: "$2b$10$hashedpassword",
  role: "admin"
})
```

---

## 📍 Access Admin Panel

After deployment:

1. **Go to:** `https://your-frontend-url.com/admin/login`
2. **Login with:**
   - Email: `tarunkumar140802@gmail.com`
   - Password: `lalit2023`
3. **You should see the Admin Dashboard**

---

## ✅ Post-Deployment Checklist

- [ ] Backend is running (test with: `curl https://your-backend-url.com`)
- [ ] Frontend is deployed
- [ ] `VITE_API_URL` points to your backend in frontend `.env`
- [ ] Admin login works
- [ ] Can view dashboard
- [ ] Can manage users
- [ ] Can manage captains
- [ ] Can view analytics
- [ ] CORS is properly configured on backend
- [ ] HTTPS is enabled on both frontend and backend

---

## 🐛 Troubleshooting

### Admin Login Returns "Invalid Credentials"
**Solution:** Check if the admin account was created. Look for this in backend logs:
```
✅ Admin account created successfully!
📧 Email: tarunkumar140802@gmail.com
```

If not showing:
1. Check MongoDB connection
2. Restart backend server
3. Check backend logs for errors

### Frontend Can't Connect to Backend
**Solution:**
1. Check Frontend `.env` has correct `VITE_API_URL`
2. Check CORS settings in Backend `server.js`
3. Test backend is accessible: `curl https://your-backend-url.com`
4. Check browser console (F12) for network errors

### 404 Errors on Admin Pages
**Solution:**
1. Verify backend routes are registered in `server.js`
2. Check MongoDB connection
3. Restart backend server

### Slow Performance
**Solution:**
1. Check MongoDB Atlas cluster performance
2. Enable caching on frontend
3. Use CDN for static assets
4. Monitor backend CPU and memory

---

## 🔑 Security Best Practices

1. **Change Default Admin Password**
   - Login to admin panel
   - Create a new admin account
   - Delete the default admin credential from database

2. **Environment Variables**
   - Never commit `.env` files to Git
   - Use hosting provider's secrets manager
   - Rotate JWT_SECRET periodically

3. **CORS Configuration**
   - Only allow requests from your frontend domain
   - Update `server.js` CORS settings

4. **HTTPS**
   - Always use HTTPS in production
   - Use SSL certificates (Let's Encrypt is free)

5. **Database**
   - Enable MongoDB Atlas IP Whitelist
   - Use strong passwords
   - Enable database redundancy

---

## 📞 Support

If issues occur:
1. Check backend logs
2. Check browser console (F12)
3. Verify all environment variables
4. Test API endpoints directly with curl
5. Check MongoDB Atlas connection

---

## 🎯 Next Steps

After successful deployment:
1. Change default admin password
2. Create additional admin accounts if needed
3. Test all admin features
4. Monitor system performance
5. Set up error logging/monitoring

---

**Your Admin System is Production Ready! 🎉**
