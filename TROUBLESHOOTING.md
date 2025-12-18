# Troubleshooting Network Error on Login

## Common Causes and Solutions

### 1. Server Not Running
**Problem**: The backend server is not running.

**Solution**: 
```bash
# In the project root directory, run:
npm run server

# Or to run both server and client:
npm run dev
```

You should see:
```
MongoDB Connected
Server running on port 5000
```

### 2. Wrong API URL
**Problem**: The frontend is trying to connect to the wrong URL.

**Check**: 
- Open browser console (F12)
- Look for the API URL being used
- Default should be: `http://localhost:5000/api`

**Solution**: 
- Make sure the server is running on port 5000
- Check if you have a `.env` file in the `client` folder with `REACT_APP_API_URL`

### 3. CORS Issues
**Problem**: Browser blocking requests due to CORS.

**Solution**: 
- The server now has CORS configured for localhost:3000
- Make sure both server and client are running

### 4. Port Already in Use
**Problem**: Port 5000 is already being used by another application.

**Solution**:
```bash
# Windows - Find what's using port 5000:
netstat -ano | findstr :5000

# Kill the process or change the port in server/index.js
```

### 5. MongoDB Connection Issues
**Problem**: Server can't connect to MongoDB.

**Check**: 
- MongoDB service is running
- MONGODB_URI in `.env` is correct
- For local MongoDB: `mongodb://localhost:27017/portfolio`
- For MongoDB Atlas: Check your connection string

## Quick Test

1. **Test Server Health**:
   Open browser and go to: `http://localhost:5000/api/health`
   Should return: `{"status":"ok","message":"Server is running"}`

2. **Test Login Endpoint**:
   Use Postman or curl:
   ```bash
   curl -X POST http://localhost:5000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"your-email@example.com","password":"your-password"}'
   ```

3. **Check Browser Console**:
   - Open DevTools (F12)
   - Go to Network tab
   - Try logging in
   - Check the failed request for details

## Steps to Fix

1. **Start the Server**:
   ```bash
   npm run server
   ```

2. **Start the Client** (in a new terminal):
   ```bash
   npm run client
   ```

3. **Verify Both Are Running**:
   - Server: http://localhost:5000/api/health
   - Client: http://localhost:3000

4. **Try Login Again**














