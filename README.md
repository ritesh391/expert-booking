# Expert Session Booking System

A real-time expert session booking system built with React, Node.js, Express, and Socket.io.

## 🔗 Live Links

- 🌐 **Live App:** https://expert-booking-95v4.vercel.app/
- 💻 **GitHub:** https://github.com/ritesh391/expert-booking
- 🔧 **Backend API:** https://expert-booking-in8u.onrender.com

## 🚀 Features

- **Expert Listing** — Browse experts with search, filter by category, and pagination
- **Expert Detail** — View expert profile and available time slots
- **Real-time Slots** — Slots update in real-time using Socket.io
- **Booking System** — Book a session with form validation
- **Double Booking Prevention** — Same slot cannot be booked twice
- **My Bookings** — View all bookings by email with status

## 🛠️ Tech Stack

**Frontend:**
- React.js
- React Router DOM
- Axios
- Socket.io Client

**Backend:**
- Node.js
- Express.js
- Socket.io
- Lowdb (JSON database)

## 📁 Project Structure

```
expert-booking/
├── backend/
│   ├── routes/
│   │   ├── experts.js
│   │   └── bookings.js
│   ├── server.js
│   ├── seedData.js
│   └── package.json
└── frontend/
    └── src/
        ├── pages/
        │   ├── ExpertList.js
        │   ├── ExpertDetail.js
        │   ├── BookingForm.js
        │   └── MyBookings.js
        ├── components/
        │   └── Navbar.js
        ├── App.js
        └── App.css
```

## ⚙️ Installation & Setup

### Backend

```bash
cd backend
npm install
node server.js
```

Server runs on: http://localhost:5000

### Frontend

```bash
cd frontend
npm install
npm start
```

App runs on: http://localhost:3000

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /experts | Get all experts (with pagination & filter) |
| GET | /experts/:id | Get single expert |
| POST | /bookings | Create a booking |
| PATCH | /bookings/:id/status | Update booking status |
| GET | /bookings?email= | Get bookings by email |

## 📱 Screens

1. **Home** — Expert listing with search and filter
2. **Expert Detail** — Profile and available slots
3. **Booking Form** — Book a session
4. **My Bookings** — View your bookings by email

## 🔄 Real-time Feature

Socket.io is used to update available slots in real-time. When a slot is booked by one user, it is immediately marked as unavailable for all other users.

## 👨‍💻 Developer

**Ritesh Rathore**
- GitHub: [ritesh391](https://github.com/ritesh391)
- Live App: [expert-booking-95v4.vercel.app](https://expert-booking-95v4.vercel.app/)
