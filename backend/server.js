const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

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

// Make db and io accessible in routes
app.set('io', io);
app.set('db', db);

// Test route
app.get('/', (req, res) => {
  res.send('Expert Booking API is running!');
});

// Routes
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