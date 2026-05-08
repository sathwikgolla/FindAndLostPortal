# 🚀 FindAndLost – Smart Campus Lost & Found Platform

A modern full-stack Lost & Found web application built for colleges and communities.

Users can:
- Report lost items
- Report found items
- Search listings
- Chat securely
- Claim items
- Mark reports as solved

Built with a premium UI, smooth animations, secure authentication, and production-ready backend architecture.

---

# ✨ Features

## 🔐 Authentication & Security
- JWT Authentication
- Refresh Token Rotation
- HttpOnly Secure Cookies
- Password Strength Validation
- Email Validation
- Protected Routes
- Rate Limiting
- Helmet Security
- CORS Protection
- bcrypt Password Hashing

---

## 📦 Lost & Found System
- Report Lost Items
- Report Found Items
- Mandatory Image Upload
- Advanced Item Details:
  - Color
  - Exact Location
  - Category
  - Description
  - Contact Information
- Public Search & Browse
- Dynamic Filters
- Item Detail Pages

---

## 💬 Messaging System
- User-to-user messaging
- Finder ↔ Owner communication
- Claim request workflow
- “Problem Solved” confirmation
- Automatic solved reports section

---

## 📊 Dashboard
- Personal activity stats
- Notifications
- Reports history
- Claims management
- Real database-driven data
- No fake/demo placeholders

---

# 🎨 Premium UI/UX
- Glassmorphism UI
- Framer Motion animations
- Smooth page transitions
- Responsive design
- Dark premium gradient theme
- Skeleton loading states
- Optimized navigation flow

---

# 🛠️ Tech Stack

## Frontend
- Next.js 14
- React.js
- Tailwind CSS
- Framer Motion
- Axios

## Backend
- Node.js
- Express.js
- MongoDB
- Mongoose

## Authentication
- JWT
- Refresh Tokens
- HttpOnly Cookies

## Media Uploads
- Multer
- Cloudinary

## Deployment
- Vercel (Frontend)
- Render (Backend)
- MongoDB Atlas

---

# 📂 Project Structure

```bash
FindAndLost/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── seed/
│   └── server.js
│
├── components/
├── hooks/
├── pages/
├── styles/
├── utils/
└── public/
```

---

# ⚙️ Installation

## 1️⃣ Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/findandlost.git
cd findandlost
```

---

# 🔧 Backend Setup

## Navigate to backend

```bash
cd backend
```

## Install dependencies

```bash
npm install
```

## Create `.env`

```env
NODE_ENV=development
PORT=5000

MONGO_URI=YOUR_MONGODB_URI

JWT_SECRET=YOUR_SECRET
REFRESH_TOKEN_SECRET=YOUR_REFRESH_SECRET

CLIENT_URL=http://localhost:3000

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

## Run backend

```bash
npm run dev
```

Backend runs on:

```bash
http://localhost:5000
```

---

# 💻 Frontend Setup

## Install dependencies

```bash
npm install
```

## Create `.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Run frontend

```bash
npm run dev
```

Frontend runs on:

```bash
http://localhost:3000
```

---

# 🧪 API Testing

## Health Check

```bash
GET /api/health
```

## Register

```bash
POST /api/auth/register
```

## Login

```bash
POST /api/auth/login
```

## Fetch Items

```bash
GET /api/items
```

## Create Lost Report

```bash
POST /api/items/lost
```

---

# 🌍 Deployment

## Frontend → Vercel

### Build Command

```bash
npm run build
```

### Environment Variable

```env
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api
```

---

## Backend → Render

### Build Command

```bash
npm install
```

### Start Command

```bash
npm start
```

### Environment Variables

```env
NODE_ENV=production
MONGO_URI=
JWT_SECRET=
REFRESH_TOKEN_SECRET=
CLIENT_URL=https://your-frontend.vercel.app
```

---

# ✅ Production Checklist

- [x] Frontend connected to backend
- [x] MongoDB connected
- [x] Authentication working
- [x] Protected routes working
- [x] File uploads working
- [x] Messaging system working
- [x] Responsive design
- [x] Production build successful

---

# 🔒 Security Features

- Secure JWT Authentication
- Refresh Token Rotation
- HttpOnly Cookies
- Password Validation
- Input Sanitization
- MongoDB Injection Protection
- Rate Limiting
- CORS Allowlist
- Helmet Middleware

---

# 📈 Future Improvements

- Real-time notifications
- AI-powered item matching
- OCR for ID cards/documents
- Email verification
- Google OAuth
- Mobile App

---

# 👨‍💻 Author

## Sathwik Golla

B.Tech CSE Student  
Full Stack Developer  
Passionate about modern UI/UX and scalable web applications.

GitHub:
https://github.com/sathwikgolla

---

# ⭐ Support

If you like this project:

⭐ Star the repository  
🍴 Fork the project  
🛠️ Contribute improvements
