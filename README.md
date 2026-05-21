<div align="center">

# 🔍 FindAndLost  
### Smart Campus Lost & Found Platform 🚀

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-Next.js-black?style=for-the-badge&logo=next.js" />
  <img src="https://img.shields.io/badge/Backend-Node.js-green?style=for-the-badge&logo=node.js" />
  <img src="https://img.shields.io/badge/Database-MongoDB-brightgreen?style=for-the-badge&logo=mongodb" />
  <img src="https://img.shields.io/badge/UI-TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css" />
  <img src="https://img.shields.io/badge/Animations-FramerMotion-pink?style=for-the-badge" />
</p>

### 📦 A Modern Smart Lost & Found Platform for Colleges & Communities

---

# 🌐 Live Website  
## 👉 https://find-and-lost-portal.vercel.app/

# 💻 GitHub Repository  
## 👉 https://github.com/sathwikgolla/FindAndLostPortal

</div>

---

# 📌 Overview

**FindAndLost** is a modern full-stack Lost & Found platform designed for colleges and communities.

Users can:

✅ Report Lost Items  
✅ Report Found Items  
✅ Search Listings  
✅ Chat Securely  
✅ Claim Items  
✅ Mark Reports as Solved  

The platform is built with:

✨ Premium UI/UX  
⚡ Smooth Animations  
🔐 Secure Authentication  
📱 Responsive Design  
🚀 Production-Ready Architecture  

---

# 🚀 Live Links

| Platform | URL |
|---|---|
| 🌐 Live Website | https://find-and-lost-portal.vercel.app/ |
| 💻 GitHub Repository | https://github.com/sathwikgolla/FindAndLostPortal |
| 👨‍💻 Portfolio | https://sathwikgolla-portfolio.vercel.app/ |

---

# ✨ Features

# 🔐 Authentication & Security

✅ JWT Authentication  
✅ Refresh Token Rotation  
✅ HttpOnly Secure Cookies  
✅ Password Strength Validation  
✅ Email Validation  
✅ Protected Routes  
✅ Rate Limiting  
✅ Helmet Security  
✅ CORS Protection  
✅ bcrypt Password Hashing  

---

# 📦 Lost & Found System

✅ Report Lost Items  
✅ Report Found Items  
✅ Mandatory Image Upload  
✅ Dynamic Search & Filters  
✅ Public Browse System  
✅ Item Detail Pages  

### Advanced Item Details

- 🎨 Color
- 📍 Exact Location
- 🗂️ Category
- 📝 Description
- 📞 Contact Information

---

# 💬 Messaging System

✅ User-to-User Messaging  
✅ Finder ↔ Owner Communication  
✅ Claim Request Workflow  
✅ Problem Solved Confirmation  
✅ Automatic Solved Reports Section  

---

# 📊 Dashboard

✅ Personal Activity Stats  
✅ Notifications System  
✅ Reports History  
✅ Claims Management  
✅ Real Database-Driven Data  
✅ No Fake/Demo Placeholders  

---

# 🎨 Premium UI / UX

✨ Glassmorphism Design  
✨ Framer Motion Animations  
✨ Smooth Page Transitions  
✨ Responsive Design  
✨ Dark Premium Gradient Theme  
✨ Skeleton Loading States  
✨ Optimized Navigation Flow  

---

# 🛠️ Tech Stack

# 🎨 Frontend

- Next.js 14
- React.js
- Tailwind CSS
- Framer Motion
- Axios

---

# ⚙️ Backend

- Node.js
- Express.js
- MongoDB
- Mongoose

---

# 🔐 Authentication

- JWT
- Refresh Tokens
- HttpOnly Cookies

---

# 📂 Media Uploads

- Multer
- Cloudinary

---

# ☁️ Deployment

| Service | Platform |
|---|---|
| Frontend | Vercel |
| Backend | Render |
| Database | MongoDB Atlas |

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

# 1️⃣ Clone Repository

```bash
git clone https://github.com/sathwikgolla/FindAndLostPortal.git
cd FindAndLostPortal
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

# 🩺 Health Check

```bash
GET /api/health
```

# 🔐 Register

```bash
POST /api/auth/register
```

# 🔑 Login

```bash
POST /api/auth/login
```

# 📦 Fetch Items

```bash
GET /api/items
```

# 🚨 Create Lost Report

```bash
POST /api/items/lost
```

---

# 🌍 Deployment

# ⚫ Frontend → Vercel

## Build Command

```bash
npm run build
```

## Environment Variable

```env
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api
```

---

# 🟣 Backend → Render

## Build Command

```bash
npm install
```

## Start Command

```bash
npm start
```

## Environment Variables

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

🔐 Secure JWT Authentication  
🔐 Refresh Token Rotation  
🔐 HttpOnly Cookies  
🔐 Password Validation  
🔐 Input Sanitization  
🔐 MongoDB Injection Protection  
🔐 Rate Limiting  
🔐 CORS Allowlist  
🔐 Helmet Middleware  

---

# 📸 Screenshots

```md
![Home Page](./screenshots/home.png)

![Lost Items](./screenshots/lost-items.png)

![Found Items](./screenshots/found-items.png)

![Dashboard](./screenshots/dashboard.png)
```

---

# 📈 Future Improvements

🚀 Real-Time Notifications  
🚀 AI-Powered Item Matching  
🚀 OCR for ID Cards/Documents  
🚀 Google OAuth  
🚀 Mobile App  
🚀 Push Notifications  

---

# 👨‍💻 Developer

<div align="center">

# Sathwik Golla

### 🌐 Portfolio
https://sathwikgolla-portfolio.vercel.app/

### 💻 GitHub
https://github.com/sathwikgolla

### 🚀 Live Website
https://find-and-lost-portal.vercel.app/

</div>

---

# ⭐ Support

If you like this project:

⭐ Star the Repository  
🍴 Fork the Project  
🚀 Contribute Improvements  

---

# 📜 License

This project is built for educational, portfolio, and campus innovation purposes.

---

<div align="center">

# 🚀 FindAndLost — Smart Campus Lost & Found Platform

### Built with ❤️ by Sathwik Golla

</div>
