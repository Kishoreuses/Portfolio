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

**Email Configuration (Choose ONE option):**

#### Option 1: Resend API (Recommended for Render)
> [!IMPORTANT]
> **Render blocks SMTP connections**, so you MUST use an API-based email service like Resend.

- `RESEND_API_KEY`: Your Resend API key
- `RESEND_FROM_EMAIL`: Your verified sender email (e.g., `contact@yourdomain.com`)
- `RECIPIENT_EMAIL`: Email where you want to receive contact form messages

**How to set up Resend:**
1. Go to [resend.com](https://resend.com) and create a free account
2. Verify your email address
3. Go to **API Keys** and create a new API key
4. Copy the API key and add it as `RESEND_API_KEY` in Render
5. For testing, you can use `onboarding@resend.dev` as `RESEND_FROM_EMAIL`
6. For production, add your own domain in Resend and verify it

#### Option 2: Gmail SMTP (Only for Local Development)
> [!WARNING]
> This will NOT work on Render due to blocked SMTP ports. Only use this locally.

- `EMAIL_USER`: *Your Gmail address*
- `EMAIL_PASSWORD`: *Your Gmail App Password*
- `RECIPIENT_EMAIL`: *Email to receive messages*

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

### ❌ Contact form says "sent" but no email arrives (ETIMEDOUT error)
**Root Cause**: Render blocks outbound SMTP connections on ports 25, 465, and 587.

**Solution**: Use Resend API instead of Gmail SMTP:
1. Sign up at [resend.com](https://resend.com) (free tier available)
2. Get your API key from the dashboard
3. Add `RESEND_API_KEY` to your Render environment variables
4. Remove or keep `EMAIL_USER` and `EMAIL_PASSWORD` (they'll be ignored if `RESEND_API_KEY` is set)
5. Redeploy on Render

Emails will now be sent via Resend's API instead of SMTP.

---

## Why did it fail before?
Render was configured with the **Root Directory** set to `client`. This meant Render only "saw" the client folder and couldn't find the `server` folder or the root `package.json`. By setting the Root Directory to the project root (`.`), Render can now find and run your backend server correctly.
