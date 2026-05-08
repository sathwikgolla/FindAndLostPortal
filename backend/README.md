# FindAndLost Backend (Express + MongoDB)

Production-ready API for the FindAndLost mossy-green Lost & Found frontend.

## Tech

- Node.js + Express
- MongoDB + Mongoose
- JWT auth + bcrypt
- Multer + Cloudinary (optional; will skip uploads if Cloudinary env vars are not set)
- Nodemailer (optional; will skip emails if SMTP env vars are not set)
- Helmet, CORS, rate limiting, express-validator

## Setup

1. Create env:
   - Copy `backend/.env.example` → `backend/.env`
2. Install deps:
   - `cd backend`
   - `npm install`
3. Run:
   - `npm run dev`

Health check:
- `GET /api/health`

## Seed demo data

From `backend/`:
- `npm run seed`

Seeded accounts:
- Admin: `admin@findandlost.dev` / `Admin123!`
- User: `user@findandlost.dev` / `User123!`

## Auth

Use Bearer token:

`Authorization: Bearer <token>`

## Response format

Success:
```json
{ "success": true, "message": "OK", "data": {}, "meta": {} }
```

Error:
```json
{ "success": false, "message": "Validation failed", "errors": [{ "field": "email", "message": "Valid email required" }] }
```

## Core endpoints

Auth:
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `PUT /api/auth/update-profile`
- `PUT /api/auth/change-password`

Items:
- `POST /api/items/lost` (protected, multipart with `images`)
- `POST /api/items/found` (protected, multipart with `images`)
- `GET /api/items` (public; defaults to `status=active`; supports pagination)
- `GET /api/items/:id` (public for active; protected for non-active)
- `PUT /api/items/:id` (protected; owner/admin; owner edits set back to pending when moderation is enabled)
- `DELETE /api/items/:id` (protected; owner/admin)
- `GET /api/items/user/my-reports` (protected)

## Moderation mode

By default, newly reported items become publicly visible immediately (`status="active"`). To require admin approval for new/edited items, set:

- `MODERATION_ENABLED=true` in `backend/.env`

Claims:
- `POST /api/claims/:itemId` (protected)
- `GET /api/claims/my-claims` (protected)
- `GET /api/claims/received` (protected)
- `PUT /api/claims/:id/approve` (protected; owner/admin)
- `PUT /api/claims/:id/reject` (protected; owner/admin)

Notifications:
- `GET /api/notifications` (protected; pagination)
- `PUT /api/notifications/:id/read` (protected)
- `PUT /api/notifications/read-all` (protected)
- `DELETE /api/notifications/:id` (protected)

Conversations (protected):
- `POST /api/conversations/start/:itemId`
- `GET /api/conversations`
- `GET /api/conversations/:id`
- `POST /api/conversations/:id/messages`
- `PUT /api/conversations/:id/read`
- `PUT /api/conversations/:id/solve` (item becomes `solved` only after both users confirm)

Admin (admin only):
- `GET /api/admin/stats`
- `GET /api/admin/users`
- `GET /api/admin/items`
- `PUT /api/admin/items/:id/approve`
- `PUT /api/admin/items/:id/reject`
- `DELETE /api/admin/items/:id`
- `GET /api/admin/claims`
- `GET /api/admin/logs`

Dashboard (protected):
- `GET /api/dashboard/stats`
- `GET /api/dashboard/recent-items`
- `GET /api/dashboard/my-activity`

## Search & filters

`GET /api/items?query=&category=&type=&location=&status=&sort=&page=&limit=`

Sort:
- `newest` (default)
- `oldest`
- `date_desc`
- `date_asc`

## Deployment checklist (Vercel + Render + Atlas + Cloudinary)

### 1) MongoDB Atlas
- Create a cluster and database user.
- Add your Render outbound IPs to Atlas Network Access (or temporarily allow `0.0.0.0/0` during setup).
- Copy the connection string into `MONGO_URI` on Render.

### 2) Cloudinary (images)
- Create a Cloudinary account and grab:
  - `CLOUDINARY_CLOUD_NAME`
  - `CLOUDINARY_API_KEY`
  - `CLOUDINARY_API_SECRET`
- Set them on Render.
- If Cloudinary is not set, item image upload will fail (by design, for real image URLs).

### 3) Render backend (Environment Variables)
Set these in Render → Service → Environment:
- `NODE_ENV=production`
- `PORT=5000` (Render may inject `PORT`; keep consistent with your service config)
- `MONGO_URI=<atlas-connection-string>`
- `JWT_SECRET=<long-random-secret>`
- `JWT_EXPIRES_IN=7d` (or shorter if desired)
- `REFRESH_TOKEN_SECRET=<long-random-secret>`
- `REFRESH_TOKEN_EXPIRES_IN=30d`
- `CLIENT_URL=<comma-separated allowlist>`
  - Example:
    - `http://localhost:3000,http://localhost:5173,http://localhost:5174,https://findandlost.vercel.app,https://findandlost.com,https://www.findandlost.com`
  - Notes:
    - Exact origins are allowed.
    - Vercel preview subdomains are automatically allowed when `https://findandlost.vercel.app` is present.
- Optional:
  - `MODERATION_ENABLED=false`
  - `EMAIL_VERIFICATION_REQUIRED=false`
  - `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS`, `EMAIL_FROM` (only if you want OTP verification)

### 4) Vercel frontend (Environment Variables)
Set this in Vercel → Project → Settings → Environment Variables:
- `NEXT_PUBLIC_API_URL=https://findandlost-api.onrender.com/api`

### 5) CORS + cookies (important for separate domains)
- Backend uses CORS allowlist from `CLIENT_URL` and sets `credentials=true`.
- Refresh tokens are stored as **httpOnly cookies**.
- In production, the refresh cookie is sent with:
  - `SameSite=None; Secure; HttpOnly`
- This is required for cross-domain auth (Vercel ↔ Render).

### 6) Build / start commands
- Render (recommended):
  - Build: `npm install`
  - Start: `npm start`
- Vercel:
  - Build: `next build` (default)
  - Start: handled by Vercel

### 7) Final testing steps after deployment
1. Open the deployed frontend URL.
2. Register a new account with a valid email + strong password.
3. Login and confirm:
   - `/api/auth/login` returns an access token
   - browser has the refresh cookie set (httpOnly)
4. Refresh the page and confirm you stay logged in (`/api/auth/me` works).
5. Wait for the access token to expire (or temporarily reduce `JWT_EXPIRES_IN`) and confirm:
   - API calls auto-refresh via `/api/auth/refresh`
   - the original request retries successfully
6. Logout and confirm:
   - `/api/auth/logout` clears refresh cookie
   - frontend token is removed and protected routes redirect to `/auth`
7. Upload an item image and confirm it renders on Browse + Item Details.
