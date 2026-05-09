const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const { v4: uuidv4 } = require('uuid');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

app.use(cors());
app.use(express.json());

// Setup lowdb
const adapter = new FileSync('db.json');
const db = low(adapter);

// Set default data
db.defaults({ experts: [], bookings: [] }).write();

// Seed data if empty
if (db.get('experts').value().length === 0) {
  const experts = [
    {
      id: uuidv4(),
      name: "Dr. Ananya Sharma",
      category: "Technology",
      experience: 8,
      rating: 4.8,
      bio: "Full stack developer with expertise in React and Node.js",
      slots: [
        { date: "2026-05-15", time: "10:00 AM", booked: false },
        { date: "2026-05-15", time: "11:00 AM", booked: false },
        { date: "2026-05-15", time: "02:00 PM", booked: false },
        { date: "2026-05-16", time: "09:00 AM", booked: false },
        { date: "2026-05-16", time: "03:00 PM", booked: false },
      ]
    },
    {
      id: uuidv4(),
      name: "Rahul Verma",
      category: "Finance",
      experience: 12,
      rating: 4.6,
      bio: "Certified financial advisor with experience in stock markets",
      slots: [
        { date: "2026-05-15", time: "09:00 AM", booked: false },
        { date: "2026-05-15", time: "01:00 PM", booked: false },
        { date: "2026-05-16", time: "10:00 AM", booked: false },
        { date: "2026-05-16", time: "04:00 PM", booked: false },
      ]
    },
    {
      id: uuidv4(),
      name: "Priya Mehta",
      category: "Health",
      experience: 6,
      rating: 4.9,
      bio: "Nutritionist and wellness coach helping people live healthier lives",
      slots: [
        { date: "2026-05-15", time: "08:00 AM", booked: false },
        { date: "2026-05-15", time: "12:00 PM", booked: false },
        { date: "2026-05-16", time: "11:00 AM", booked: false },
        { date: "2026-05-16", time: "05:00 PM", booked: false },
      ]
    },
    {
      id: uuidv4(),
      name: "Amit Patel",
      category: "Legal",
      experience: 15,
      rating: 4.7,
      bio: "Senior lawyer specializing in corporate and business law",
      slots: [
        { date: "2026-05-15", time: "11:00 AM", booked: false },
        { date: "2026-05-15", time: "03:00 PM", booked: false },
        { date: "2026-05-16", time: "09:00 AM", booked: false },
        { date: "2026-05-16", time: "02:00 PM", booked: false },
      ]
    },
    {
      id: uuidv4(),
      name: "Sneha Gupta",
      category: "Technology",
      experience: 5,
      rating: 4.5,
      bio: "AI/ML engineer with expertise in Python and deep learning",
      slots: [
        { date: "2026-05-15", time: "10:00 AM", booked: false },
        { date: "2026-05-15", time: "04:00 PM", booked: false },
        { date: "2026-05-16", time: "01:00 PM", booked: false },
        { date: "2026-05-16", time: "03:00 PM", booked: false },
      ]
    }
  ];
  db.set('experts', experts).write();
  console.log('✅ Sample data seeded!');
}

// Make db and io accessible in routes
app.set('io', io);
app.set('db', db);

// Routes
app.get('/', (req, res) => {
  res.send('Expert Booking API is running!');
});

app.use('/experts', require('./routes/experts'));
app.use('/bookings', require('./routes/bookings'));

// Socket.io
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Start server
server.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
  console.log('Database ready!');
});