# 🛡️ Admin Panel Setup Guide

## Overview
Your QuickRide application now has a complete admin management system with the following features:

### ✨ Features Included:

1. **Admin Authentication**
   - Secure login with JWT tokens
   - Admin role-based access control
   - Session management with localStorage persistence

2. **Dashboard**
   - Real-time statistics (users, captains, rides)
   - Revenue tracking
   - Ride completion rates
   - Quick action buttons

3. **User Management**
   - View all users with pagination
   - Search users by name, email, or phone
   - View user details and ride history
   - Delete users
   - Edit user information

4. **Captain Management**
   - View all captains with pagination
   - Search captains
   - View captain details, earnings, and ride history
   - Delete captains
   - Edit captain information

5. **Analytics**
   - Ride statistics
   - Revenue metrics
   - Date range filtering
   - Performance analytics

---

## 🚀 How to Access Admin Panel

### Step 1: Start the Backend
```bash
cd Backend
npm start
```
The backend should be running on `http://localhost:3000`

### Step 2: Start the Frontend
```bash
cd Frontend
npm run dev
```
The frontend should be running on `http://localhost:5173`

### Step 3: Go to Admin Login
Navigate to: `http://localhost:5173/admin/login`

---

## 🔑 Admin Credentials

Use these demo credentials to login:

```
Email: admin@quickride.com
Password: admin123
```

### To Create Your Own Admin Account:

Use the backend API directly:

```bash
curl -X POST http://localhost:3000/admin/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullname": {
      "firstname": "Your",
      "lastname": "Name"
    },
    "email": "youremail@example.com",
    "password": "yourpassword",
    "role": "admin"
  }'
```

---

## 📊 Admin Dashboard

After login, you'll see:

- **Total Users** - Click to manage users
- **Total Captains** - Click to manage captains
- **Total Rides** - See completed and cancelled rides
- **Total Revenue** - Platform earnings
- **Completion Rate** - Ride success percentage

---

## 👥 User Management

### Features:
- ✅ View all users with pagination
- ✅ Search by name, email, or phone
- ✅ View detailed user profile
- ✅ See user's ride history
- ✅ Delete user account

### How to Use:
1. Go to Dashboard → Click "Manage Users"
2. Use search box to find specific users
3. Click the eye icon to view details
4. Click trash icon to delete user

---

## 🚗 Captain Management

### Features:
- ✅ View all captains with pagination
- ✅ Search by name, email, or vehicle details
- ✅ View captain profile
- ✅ See total rides, completed rides, and earnings
- ✅ Delete captain account

### How to Use:
1. Go to Dashboard → Click "Manage Captains"
2. Search for specific captains
3. Click eye icon to view captain details (earnings, ride count)
4. Click trash icon to delete captain

---

## 📈 Analytics

### Features:
- ✅ View total rides and statistics
- ✅ See completed vs cancelled rides
- ✅ Track total platform revenue
- ✅ Filter by date range
- ✅ Calculate average fare per ride

### How to Use:
1. Go to Dashboard → Click "View Analytics"
2. Select start and end dates (optional)
3. Click "Apply Filter"
4. View detailed statistics

---

## 🔧 API Endpoints

### Authentication
- `POST /admin/register` - Register new admin
- `POST /admin/login` - Admin login
- `POST /admin/logout` - Admin logout (requires token)

### Dashboard
- `GET /admin/dashboard/stats` - Get dashboard statistics (requires token)

### User Management
- `GET /admin/users` - Get all users with pagination (requires token)
- `GET /admin/users/:userId` - Get user details (requires token)
- `PUT /admin/users/:userId` - Update user (requires token)
- `DELETE /admin/users/:userId` - Delete user (requires token)

### Captain Management
- `GET /admin/captains` - Get all captains (requires token)
- `GET /admin/captains/:captainId` - Get captain details (requires token)
- `PUT /admin/captains/:captainId` - Update captain (requires token)
- `DELETE /admin/captains/:captainId` - Delete captain (requires token)

### Analytics
- `GET /admin/analytics/rides` - Get ride analytics with optional date filtering (requires token)

---

## 📝 Query Parameters

### For User/Captain Management:
```
?page=1         - Page number (default: 1)
&limit=10       - Items per page (default: 10)
&search=text    - Search query (optional)
```

### For Analytics:
```
?startDate=YYYY-MM-DD    - Filter from date
&endDate=YYYY-MM-DD      - Filter to date
```

---

## 💾 Files Created/Modified

### Backend Files:
- ✅ `Backend/models/admin.model.js` - Admin database model
- ✅ `Backend/controllers/admin.controller.js` - Admin controller logic
- ✅ `Backend/middlewares/admin.middleware.js` - Admin authentication middleware
- ✅ `Backend/routes/admin.routes.js` - Admin API routes
- ✅ `Backend/server.js` - Added admin routes

### Frontend Files:
- ✅ `Frontend/src/contexts/AdminContext.jsx` - Admin state management
- ✅ `Frontend/src/screens/AdminLogin.jsx` - Admin login page
- ✅ `Frontend/src/screens/AdminDashboard.jsx` - Admin dashboard
- ✅ `Frontend/src/screens/AdminUserManagement.jsx` - User management page
- ✅ `Frontend/src/screens/AdminCaptainManagement.jsx` - Captain management page
- ✅ `Frontend/src/screens/AdminAnalytics.jsx` - Analytics page
- ✅ `Frontend/src/screens/AdminProtectedWrapper.jsx` - Route protection
- ✅ `Frontend/src/screens/index.js` - Updated exports
- ✅ `Frontend/src/App.jsx` - Added admin routes
- ✅ `Frontend/src/main.jsx` - Added AdminContextProvider

---

## 🔐 Security Features

1. **JWT Authentication** - Secure token-based authentication
2. **Protected Routes** - Admin routes require valid token
3. **Token Expiration** - Tokens expire after 24 hours
4. **Token Blacklisting** - Logout invalidates tokens
5. **Role-Based Access** - Only admins can access admin features

---

## 🐛 Troubleshooting

### Issue: "Unauthorized - No token provided"
**Solution:** You need to login first at `/admin/login`

### Issue: "Invalid credentials"
**Solution:** Check your email and password. Use the demo credentials provided above.

### Issue: Can't create admin account
**Solution:** Use the API endpoint provided above to create a new admin account.

### Issue: Changes not appearing
**Solution:** Refresh the page (Ctrl+R) or clear browser cache.

---

## 📱 Responsive Design

The admin panel is fully responsive:
- ✅ Desktop (1024px+) - Full featured table view
- ✅ Tablet (768px-1023px) - Optimized table with scrolling
- ✅ Mobile (< 768px) - Stacked card layout

---

## 🎯 Next Steps

1. ✅ Create your admin account
2. ✅ Login to the admin panel
3. ✅ Explore the dashboard
4. ✅ Manage users and captains
5. ✅ View analytics and reports
6. ✅ Monitor platform metrics

---

## 📞 Support

If you encounter any issues:
1. Check browser console for errors (F12 → Console tab)
2. Check backend server logs
3. Verify MongoDB Atlas connection
4. Ensure .env variables are correctly set

---

**Your Admin Panel is ready to use! 🎉**
