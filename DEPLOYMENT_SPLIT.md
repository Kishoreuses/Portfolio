# Deployment Guide: Vercel (Frontend) & Render (Backend)

Since you've split your deployment, follow these specific settings to ensure everything connects correctly.

## 1. Render Dashboard (Backend)

To fix the `MODULE_NOT_FOUND` error, update your Render service settings:

| Setting | Value |
| :--- | :--- |
| **Root Directory** | `.` (or leave blank) |
| **Build Command** | `npm install` |
| **Start Command** | `node server/index.js` (or `npm start`) |

### 🔍 How to Verify Render is Working
Before checking Vercel, open your Render URL in the browser:
`https://your-backend-render-url.onrender.com/api/health`

If it shows `{"status":"ok",...}`, your backend is ready. If it fails, check your **Root Directory** setting again.

### Environment Variables on Render
Add these to your Render Dashboard under the **Environment** tab:
- `MONGODB_URI`: *Your MongoDB connection string*
- `JWT_SECRET`: *Your secret key* (Keep this private)
- `FRONTEND_URL`: `https://kishoreportfolio-fawn.vercel.app`
- `PORT`: `5000`
- `EMAIL_USER`: *Your Gmail address* (e.g., `yourname@gmail.com`)
- `EMAIL_PASSWORD`: *Your Gmail App Password* (NOT your regular password - see below)
- `RECIPIENT_EMAIL`: *Email where you want to receive contact form messages* (defaults to `EMAIL_USER` if not set)

> [!IMPORTANT]
> **Gmail App Password Setup**: You MUST use an App Password, not your regular Gmail password.
> 1. Go to [Google Account Security](https://myaccount.google.com/security)
> 2. Enable **2-Step Verification** if not already enabled
> 3. Go to **App Passwords** (search for it in settings)
> 4. Generate a new app password for "Mail"
> 5. Copy the 16-character password and use it as `EMAIL_PASSWORD`

---

## 2. Vercel Dashboard (Frontend)

### Environment Variables on Vercel
Add this to your Vercel Project Settings under **Environment Variables**:
- `REACT_APP_API_URL`: `https://your-backend-render-url.onrender.com/api`

> [!TIP]
> After setting `REACT_APP_API_URL`, Vercel will automatically redeploy (or you should trigger a new deployment) to apply the change. Once applied, your portfolio will connect to the live backend instead of `localhost`.

---

## 3. Common Errors & Fixes

### ❌ Server error: 404 (Login failed)
This happens if your **Vercel** environment variable is pointing to the wrong place.
**Correct Value**: `https://your-backend-name.onrender.com/api`
**Incorrect Value**: `https://your-portfolio-vercel-url.vercel.app/api` (Do NOT point it to itself!)

### ❌ Network Error
- Make sure your Render backend is actually "Live" (check Render dashboard).
- Check that `FRONTEND_URL` in Render matches your Vercel URL exactly.

### ❌ Contact form says "sent" but no email arrives
- Check that `EMAIL_USER`, `EMAIL_PASSWORD`, and `RECIPIENT_EMAIL` are set in Render.
- Make sure you're using a Gmail **App Password**, not your regular password.
- Check Render logs for email errors: Dashboard → Logs tab → Look for "Error sending email".

---

## Why did it fail before?
Render was configured with the **Root Directory** set to `client`. This meant Render only "saw" the client folder and couldn't find the `server` folder or the root `package.json`. By setting the Root Directory to the project root (`.`), Render can now find and run your backend server correctly.
