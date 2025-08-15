# Online Cab Booking System

An end-to-end web application for booking cabs online, featuring real-time ride tracking, user and captain (driver) management, and ride history. Built with a React frontend and a Node.js/Express backend.

---

## Features

- **User & Captain Authentication:** Sign up, log in, and secure session management for both users and captains (drivers).
- **Cab Booking:** Book immediate or pre-scheduled rides.
- **Live Ride Tracking:** Real-time updates for ride status and location.
- **Chat System:** In-app chat between user and captain.
- **Ride History:** Users can view their past rides.
- **Captain Dashboard:** Captains can view and manage assigned rides.
- **Emergency Contacts:** Users can manage emergency contacts.
- **Socket.io Integration:** Real-time communication for ride updates and chat.

---

## Tech Stack

- **Frontend:** React, Vite, Context API, CSS
- **Backend:** Node.js, Express, Socket.io
- **Database:** (Specify here, e.g., MongoDB)
- **Other:** Google Maps API (if used), JWT for authentication

---

## Project Structure

```
Online-Cab-Booking-system/
│
├── frontend/      # React client app
│   └── src/
│       ├── components/   # UI components (chat, ride panels, etc.)
│       ├── context/      # React context for state management
│       └── pages/        # Page components (login, signup, home, etc.)
│
├── Backend/       # Node.js backend API
│   ├── controllers/   # Route controllers
│   ├── models/        # Mongoose models
│   ├── routes/        # Express routes
│   ├── services/      # Business logic
│   └── middlewares/   # Auth and other middleware
│
└── README.md      # Project documentation
```

---

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- npm or yarn
- (If using MongoDB) MongoDB instance running locally or remotely

### 1. Clone the repository

```sh
git clone <repository-url>
cd Online-Cab-Booking-system
```

### 2. Setup Backend

```sh
cd Backend
npm install
# Configure your .env file (see .env.example if present)
npm start
```

### 3. Setup Frontend

```sh
cd ../frontend
npm install
npm run dev
```

### 4. Access the App

- Frontend: [http://localhost:5173](http://localhost:5173) (default Vite port)
- Backend API: [http://localhost:5000](http://localhost:3000) (default Express port)

---

## Environment Variables

Both frontend and backend use `.env` files for configuration.  
Set up your API keys, database URIs, and secrets as needed.

---

## Contributing

Pull requests are welcome! Please open an issue first to discuss major changes.

---
