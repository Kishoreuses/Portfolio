# 🚀 Quick Start Guide

## Run the Project in 5 Steps

### Step 1: Install Dependencies
```bash
npm run install-all
```

### Step 2: Create .env File
Create a file named `.env` in the root directory with:
```
MONGODB_URI=mongodb://localhost:27017/portfolio
PORT=5000
```

**For MongoDB Atlas (Cloud):**
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/portfolio
PORT=5000
```

### Step 3: Copy Images
Copy your images folder to `client/public/images/`:
```bash
# Windows PowerShell
Copy-Item -Path "images\*" -Destination "client\public\images\" -Recurse

# Or manually copy the images folder to client/public/
```

### Step 4: Seed Database
```bash
npm run seed
```

### Step 5: Start the App
```bash
npm run dev
```

**That's it!** Open http://localhost:3000 in your browser.

---

## What Each Command Does

- `npm run install-all` - Installs all dependencies (backend + frontend)
- `npm run seed` - Populates MongoDB with initial data
- `npm run dev` - Starts both backend (port 5000) and frontend (port 3000)

---

## Troubleshooting

**MongoDB not connecting?**
- Make sure MongoDB is running locally, OR
- Check your MongoDB Atlas connection string in `.env`

**Images not showing?**
- Verify images are in `client/public/images/` folder
- Check filenames match exactly (case-sensitive)

**Port already in use?**
- Change `PORT=5001` in `.env` for backend
- React will prompt to use a different port if 3000 is busy

---

## Need More Details?

See `RUN.md` for detailed step-by-step instructions.

