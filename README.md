# 🔨 Live Bidding Platform

A real-time auction platform where multiple users can place bids on items and see updates instantly. This project demonstrates real-time system design, concurrency handling, and production-ready cloud deployment.

---

## 🚀 Features

### **Backend (Node.js + Socket.io)**
* **REST API:** Used to fetch initial auction item data.
* **Real-time Updates:** Utilizes WebSockets for instantaneous bid broadcasting.
* **Server-side Validation:** Validates every bid against the current state.
* **Race Condition Handling:** Logic ensures only the first valid bid is accepted.
* **Synced Timers:** Prevents client-side clock drift by using server-authoritative time.
* **Cloud Optimized:** Specifically configured for Node.js environment on Render.
* **Docker Ready:** Local containerization support for development parity.

### **Frontend (React)**
* **Live Dashboard:** Displaying all active auction items in a responsive grid.
* **Instant Price Updates:** Visual updates occur without page refreshes.
* **Synced Countdown:** Timers are perfectly aligned with the server's clock.
* **Visual Feedback:**
    * Dynamic price highlights when new bids arrive.
    * **Winning** indicator badge for the highest bidder.
    * **Outbid** state alerts when the user is no longer in the lead.
* **Static Deployment:** Optimized for Vercel’s global CDN.

---

## 🧠 System Design Overview



* **Communication Flow:**
    * **React (Vercel)** ↔ **Node.js (Render)** ↔ **In-memory State**.
* **Initial Load:** REST API hydrates the UI with current item states.
* **Live Bidding:** Socket.io manages the bidirectional stream.
* **Single Source of Truth:** The backend manages the authoritative auction state.
* **Fairness:** Server-side timestamps synchronize all client timers.

---

## 🔁 Concurrency Handling (Race Conditions)

When multiple users attempt to bid at the exact same millisecond:

1.  **Sequential Processing:** The backend processes incoming socket events in order.
2.  **First-to-Arrive:** The first valid bid that meets price criteria is committed to memory.
3.  **Conflict Rejection:** Subsequent bids arriving for the same "current price" are rejected.
4.  **Global Sync:** An "Outbid" status is sent to losers, and the new high bid is broadcast to everyone else.

---

## 📦 Tech Stack

* **Backend:** Node.js, Express, Socket.io
* **Frontend:** React, Socket.io Client
* **Deployment:** Render (Backend), Vercel (Frontend)
* **Tooling:** Docker & Docker Compose (Local use only)

---

## 🛠 Environment Variables

### **Backend (Render Dashboard)**
Set these directly in the Render environment settings:
* `PORT=4000`
* `NODE_ENV=production`

> **Note:** Do not wrap values in quotes. Render automatically assigns a dynamic port; ensure your code uses `process.env.PORT`.

### **Frontend (Vercel Dashboard)**
Set via *Project Settings -> Environment Variables*:
* `REACT_APP_BACKEND_URL=https://your-backend-url.onrender.com`

---

## 🐳 Docker Usage

This repository includes a `Dockerfile` for both services and a root `docker-compose.yml`.

* **Local Development:** Run the entire stack with a single command.
* **Purpose:** Included for containerization demonstration and environment parity.
* **Cloud Status:** **Not used for production** (Render/Vercel use native runtimes).

---

## 📂 Project Structure

```
live-bidding-platform/
├── backend/
│   ├── src/
│   ├── package.json
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   ├── package.json
│   └── Dockerfile
│
├── docker-compose.yml
└── README.md
```


## 🌍 Deployment

Backend (Render):
- GitHub repo connected
- Dockerfile detected automatically
- Environment variables set in Render dashboard

Frontend (Vercel):
- Same GitHub repo imported
- Root directory set to frontend
- Environment variables added
- Auto-deploy on every push

---

## ✅ Key Engineering Highlights

- Real-time communication using WebSockets
- Server-authoritative bidding logic
- Clean separation of frontend and backend
- Dockerized backend for portability
- Production-style environment configuration
- Fully deployed and accessible

---

## 📌 Future Improvements

- Persistent database (PostgreSQL / MongoDB)
- User authentication
- Bid history tracking
- Admin dashboard
- Horizontal scaling with Redis

---

## 👤 Author

Abhiram Paturi  
Full Stack Developer | Real-Time Systems


