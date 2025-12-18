# How to Start the Server

## Step-by-Step Instructions

### 1. Open a Terminal/Command Prompt
Navigate to your project directory:
```bash
cd "D:\RESUME\Cursor portfolio"
```

### 2. Check if MongoDB is Running
The server needs MongoDB to be running. 

**For Local MongoDB:**
- Make sure MongoDB service is running
- Check: `mongodb://localhost:27017/portfolio`

**For MongoDB Atlas:**
- Create a `.env` file in the project root with:
```
MONGODB_URI=your_mongodb_atlas_connection_string
PORT=5000
```

### 3. Install Dependencies (if not already done)
```bash
npm install
```

### 4. Start the Server
```bash
npm run server
```

You should see:
```
MongoDB Connected
Server running on port 5000
```

### 5. Keep the Server Running
**IMPORTANT**: Keep this terminal window open! The server must stay running.

### 6. Start the Client (in a NEW terminal)
Open a new terminal window and run:
```bash
npm run client
```

Or use the combined command:
```bash
npm run dev
```

This will start both server and client together.

## Troubleshooting

### If MongoDB connection fails:
1. Check if MongoDB is installed and running
2. Verify your MONGODB_URI in `.env` file
3. For MongoDB Atlas, check your IP whitelist

### If port 5000 is already in use:
1. Find what's using it: `netstat -ano | findstr :5000`
2. Kill the process or change PORT in `.env`

### If you see "Cannot find module" errors:
Run: `npm install`

## Quick Test

Once server is running, test it:
- Open browser: `http://localhost:5000/api/health`
- Should show: `{"status":"ok","message":"Server is running"}`














