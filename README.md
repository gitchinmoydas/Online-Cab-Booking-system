# 🚖 Zyber-Cab

Zyber-Cab is a real-time ride-hailing web application built with the MERN stack. It allows users to book cabs, track drivers in real-time on a map, schedule rides in advance, and alert family members in unsafe situations via SMS. It also provides a dedicated interface for captains (drivers).

---

## 🌟 Features

- 👥 User & Captain Registration/Login
- 📍 Real-Time Location Tracking with Google Maps & Socket.IO
- 🚗 Ride Request Broadcasting to Captains
- ✅ Ride Acceptance, Starting & Completion Workflow
- 📅 Pre-Booking & Scheduled Rides
- 🔐 JWT Authentication for Secure Access
- 🚨 SOS Safety Alerts with Twilio (SMS)
- 🧩 Modular Architecture: Controllers, Routes, Services

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Tailwind CSS
- GSAP Animations
- Axios
- Google Maps API

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- Socket.IO
- Twilio API
- JWT (JSON Web Tokens)

---

## 🚀 Getting Started

### 📦 Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Update the .env file with your values
npm run dev 
