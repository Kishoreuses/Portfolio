# Deployment Guide: Vercel (Frontend) & Render (Backend)

Since you've split your deployment, follow these specific settings to ensure everything connects correctly.

## 1. Render Dashboard (Backend)

To fix the `MODULE_NOT_FOUND` error, update your Render service settings:

| Setting | Value |
| :--- | :--- |
| **Root Directory** | `.` (or leave blank) |
| **Build Command** | `npm install` |
| **Start Command** | `node server/index.js` (or `npm start`) |

### Environment Variables on Render
Add these to your Render Dashboard under the **Environment** tab:
- `MONGODB_URI`: *Your MongoDB connection string*
- `JWT_SECRET`: *Your secret key* (Keep this private)
- `FRONTEND_URL`: `https://kishoreportfolio-fawn.vercel.app`
- `PORT`: `5000`

---

## 2. Vercel Dashboard (Frontend)

### Environment Variables on Vercel
Add this to your Vercel Project Settings under **Environment Variables**:
- `REACT_APP_API_URL`: `https://your-backend-render-url.onrender.com/api`

> [!TIP]
> After setting `REACT_APP_API_URL`, Vercel will automatically redeploy (or you should trigger a new deployment) to apply the change. Once applied, your portfolio will connect to the live backend instead of `localhost`.

---

## Why did it fail before?
Render was configured with the **Root Directory** set to `client`. This meant Render only "saw" the client folder and couldn't find the `server` folder or the root `package.json`. By setting the Root Directory to the project root (`.`), Render can now find and run your backend server correctly.
