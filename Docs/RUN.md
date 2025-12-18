# How to Run the Portfolio Project

## Step-by-Step Instructions

### Prerequisites
Before starting, make sure you have:
- ✅ **Node.js** installed (v14 or higher) - [Download here](https://nodejs.org/)
- ✅ **MongoDB** installed locally OR a MongoDB Atlas account (free tier available)

---

## Step 1: Install Dependencies

Open your terminal in the project root directory and run:

```bash
npm run install-all
```

This will install:
- Backend dependencies (Express, Mongoose, etc.)
- Frontend dependencies (React, Axios, etc.)

**Alternative (if the above doesn't work):**
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

---

## Step 2: Setup MongoDB

### Option A: Local MongoDB
1. Install MongoDB on your computer
2. Start MongoDB service:
   - **Windows:** MongoDB should start automatically, or run `mongod` in terminal
   - **Mac/Linux:** `sudo systemctl start mongod` or `brew services start mongodb-community`

### Option B: MongoDB Atlas (Cloud - Recommended)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (free tier)
4. Get your connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/portfolio`)

---

## Step 3: Configure Environment

1. Create a `.env` file in the root directory:
```bash
# Copy the example file
cp .env.example .env
```

2. Edit `.env` file with your MongoDB connection:

**For Local MongoDB:**
```
MONGODB_URI=mongodb://localhost:27017/portfolio
PORT=5000
```

**For MongoDB Atlas:**
```
MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/portfolio
PORT=5000
```

**Important:** Replace `your-username` and `your-password` with your actual MongoDB Atlas credentials.

---

## Step 4: Setup Images

1. Make sure your `images` folder exists with:
   - Profile photo: `WhatsApp Image 2025-09-09 at 18.53.37_49bab88f.jpg`
   - Certificate images:
     - `Oracle Cloud Infrastructure Gen AI_page1.jpg`
     - `Oracle Apex Cloud_page1.jpg`
     - `Fundamentals of Deep Learning_page1.jpg`

2. Copy the `images` folder to `client/public/images/`:
   ```bash
   # If images folder is in root, copy it:
   cp -r images client/public/images
   ```

   Or manually copy the `images` folder to `client/public/` directory.

---

## Step 5: Seed the Database

Populate the database with initial data:

```bash
npm run seed
```

You should see:
```
Connected to MongoDB
Database seeded successfully!
```

This creates:
- Profile information
- Skills (8 items)
- Projects (4 items)
- Certifications (3 items)
- Education (3 entries)
- Interests (3 items)

---

## Step 6: Start the Application

Run both frontend and backend together:

```bash
npm run dev
```

This will start:
- **Backend Server:** http://localhost:5000
- **React App:** http://localhost:3000

The React app will automatically open in your browser at `http://localhost:3000`

---

## Alternative: Run Separately

If you prefer to run them separately:

**Terminal 1 - Backend:**
```bash
npm run server
```

**Terminal 2 - Frontend:**
```bash
npm run client
```

---

## Verify Everything Works

1. ✅ Backend is running: Visit http://localhost:5000/api/profile
   - Should return JSON data or empty object `{}`

2. ✅ Frontend is running: Visit http://localhost:3000
   - Should show your portfolio website

3. ✅ Check browser console (F12) for any errors

---

## Common Issues & Solutions

### ❌ "MongoDB connection error"
**Solution:**
- Make sure MongoDB is running (local) or connection string is correct (Atlas)
- Check `.env` file has correct `MONGODB_URI`
- For Atlas: Make sure your IP is whitelisted in Network Access

### ❌ "Port 5000 already in use"
**Solution:**
- Change `PORT=5001` in `.env` file
- Update `client/src/services/api.js` if needed

### ❌ "Port 3000 already in use"
**Solution:**
- React will ask to use a different port (like 3001)
- Or set `PORT=3001` in `client/.env` file

### ❌ "Images not loading"
**Solution:**
- Verify images are in `client/public/images/` folder
- Check image filenames match exactly (case-sensitive)
- Open browser DevTools → Network tab to see 404 errors

### ❌ "Cannot find module" errors
**Solution:**
- Run `npm run install-all` again
- Delete `node_modules` and reinstall:
  ```bash
  rm -rf node_modules client/node_modules
  npm run install-all
  ```

### ❌ "Database seeded but no data showing"
**Solution:**
- Check MongoDB connection is working
- Verify seed script ran successfully
- Check browser console for API errors
- Visit http://localhost:5000/api/profile to see if data exists

---

## Production Build

To create a production build:

```bash
cd client
npm run build
```

The optimized build will be in `client/build/` folder.

---

## Quick Command Reference

```bash
# Install all dependencies
npm run install-all

# Seed database (first time)
npm run seed

# Start both servers
npm run dev

# Start only backend
npm run server

# Start only frontend
npm run client

# Build for production
cd client && npm run build
```

---

## Need Help?

1. Check the browser console (F12) for errors
2. Check terminal for backend errors
3. Verify MongoDB is connected
4. Verify all dependencies are installed
5. Check that `.env` file is configured correctly

---

**That's it! Your portfolio should now be running! 🚀**

