# 📖 How to Run the Portfolio Project

## ✅ Prerequisites

1. **Node.js** (v14+) - [Download](https://nodejs.org/)
2. **MongoDB** - Choose one:
   - **Local:** Install MongoDB locally
   - **Cloud:** MongoDB Atlas (free tier) - [Sign up](https://www.mongodb.com/cloud/atlas)

---

## 🚀 Quick Start (5 Steps)

### 1️⃣ Install Dependencies
```bash
npm run install-all
```
*This installs both backend and frontend dependencies*

### 2️⃣ Create Environment File
Create a file named `.env` in the root directory:

**For Local MongoDB:**
```
MONGODB_URI=mongodb://localhost:27017/portfolio
PORT=5000
```

**For MongoDB Atlas:**
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/portfolio
PORT=5000
```
*Replace `username` and `password` with your MongoDB Atlas credentials*

### 3️⃣ Copy Images (Already Done ✅)
Images have been copied to `client/public/images/`

### 4️⃣ Seed Database
```bash
npm run seed
```
*This populates MongoDB with your portfolio data*

### 5️⃣ Start the Application
```bash
npm run dev
```

**Open your browser:** http://localhost:3000

---

## 📋 What Happens When You Run `npm run dev`?

- ✅ **Backend Server** starts on http://localhost:5000
- ✅ **React App** starts on http://localhost:3000
- ✅ Both run simultaneously using `concurrently`

---

## 🔍 Verify It's Working

1. **Check Backend:** Visit http://localhost:5000/api/profile
   - Should return JSON data

2. **Check Frontend:** Visit http://localhost:3000
   - Should show your portfolio website

3. **Check Console:** Press F12 in browser
   - Should show no errors

---

## 🛠️ Available Commands

| Command | Description |
|---------|-------------|
| `npm run install-all` | Install all dependencies |
| `npm run seed` | Populate database with initial data |
| `npm run dev` | Start both servers (recommended) |
| `npm run server` | Start only backend (port 5000) |
| `npm run client` | Start only frontend (port 3000) |
| `npm run build` | Build React app for production |

---

## ❌ Common Issues & Fixes

### Issue: "MongoDB connection error"
**Fix:**
- **Local MongoDB:** Make sure MongoDB service is running
  - Windows: Check Services app, start "MongoDB"
  - Mac/Linux: `sudo systemctl start mongod`
- **MongoDB Atlas:** 
  - Verify connection string in `.env`
  - Check Network Access → Add your IP address
  - Verify username/password are correct

### Issue: "Port 5000 already in use"
**Fix:** Change port in `.env`:
```
PORT=5001
```

### Issue: "Port 3000 already in use"
**Fix:** React will automatically use port 3001, or set:
```bash
# Create client/.env file
PORT=3001
```

### Issue: "Images not loading"
**Fix:**
- Verify images are in `client/public/images/` folder
- Check filenames match exactly (case-sensitive)
- Open browser DevTools → Network tab to see 404 errors

### Issue: "Cannot find module"
**Fix:**
```bash
# Reinstall dependencies
npm run install-all
```

### Issue: "Database seeded but no data showing"
**Fix:**
- Check MongoDB connection
- Verify seed script ran successfully (check terminal output)
- Visit http://localhost:5000/api/profile to verify data exists
- Check browser console for API errors

---

## 📁 Project Structure

```
portfolio/
├── client/                 # React Frontend
│   ├── public/
│   │   └── images/         # Your images (✅ already copied)
│   └── src/
│       ├── components/     # React components
│       ├── services/       # API calls
│       └── styles/         # CSS files
├── server/                 # Express Backend
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   └── seed.js            # Database seeder
├── images/                # Original images folder
├── .env                   # Environment config (create this)
└── package.json
```

---

## 🎯 Step-by-Step Checklist

- [ ] Node.js installed
- [ ] MongoDB setup (local or Atlas)
- [ ] Dependencies installed (`npm run install-all`)
- [ ] `.env` file created with MongoDB URI
- [ ] Images copied to `client/public/images/` ✅
- [ ] Database seeded (`npm run seed`)
- [ ] Application started (`npm run dev`)
- [ ] Browser opened to http://localhost:3000

---

## 📚 More Information

- **Detailed Setup:** See `SETUP.md`
- **Troubleshooting:** See `RUN.md`
- **Quick Reference:** See `QUICKSTART.md`

---

## 🎉 Success!

If everything is working, you should see:
- ✅ Portfolio website at http://localhost:3000
- ✅ All sections loading with data
- ✅ Images displaying correctly
- ✅ Smooth animations and transitions
- ✅ No errors in browser console

**Happy coding! 🚀**

