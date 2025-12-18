# Setup Guide

## Quick Start

1. **Install Dependencies:**
```bash
npm run install-all
```

2. **Setup MongoDB:**
   - Install MongoDB locally, OR
   - Use MongoDB Atlas (free tier available)
   - Update `.env` with your connection string

3. **Configure Environment:**
```bash
cp .env.example .env
```
Edit `.env`:
```
MONGODB_URI=mongodb://localhost:27017/portfolio
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/portfolio
PORT=5000
```

4. **Setup Images:**
   - Copy your `images` folder to `client/public/images/`
   - This makes images accessible at `/images/...` in React
   - The backend also serves images from root `images/` folder (for API responses)

5. **Seed Database:**
```bash
npm run seed
```

6. **Start Development:**
```bash
npm run dev
```

This starts:
- Backend: http://localhost:5000
- Frontend: http://localhost:3000

## Image Paths

- **React (Frontend):** Images should be in `client/public/images/`
  - Accessible as: `/images/filename.jpg`
  
- **Backend API:** Images can be in root `images/` folder
  - Served at: `http://localhost:5000/images/filename.jpg`

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running locally, OR
- Check your MongoDB Atlas connection string
- Verify network access for MongoDB Atlas

### Images Not Loading
- Check that images are in `client/public/images/`
- Verify image filenames match exactly (case-sensitive)
- Check browser console for 404 errors

### Port Already in Use
- Change `PORT` in `.env` for backend
- React uses port 3000 by default (change in `client/package.json` if needed)

## Production Build

1. Build React app:
```bash
cd client
npm run build
```

2. Serve:
   - Backend serves API at `/api/*`
   - Serve `client/build` as static files
   - Or deploy separately (backend + frontend)

