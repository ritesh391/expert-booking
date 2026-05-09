const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const { v4: uuidv4 } = require('uuid');

const adapter = new FileSync('db.json');
const db = low(adapter);

db.defaults({ experts: [], bookings: [] }).write();

const experts = [
  {
    id: uuidv4(),
    name: "Dr. Ananya Sharma",
    category: "Technology",
    experience: 8,
    rating: 4.8,
    bio: "Full stack developer with expertise in React and Node.js",
    slots: [
      { date: "2026-05-10", time: "10:00 AM", booked: false },
      { date: "2026-05-10", time: "11:00 AM", booked: false },
      { date: "2026-05-10", time: "02:00 PM", booked: false },
      { date: "2026-05-11", time: "09:00 AM", booked: false },
      { date: "2026-05-11", time: "03:00 PM", booked: false },
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
      { date: "2026-05-10", time: "09:00 AM", booked: false },
      { date: "2026-05-10", time: "01:00 PM", booked: false },
      { date: "2026-05-11", time: "10:00 AM", booked: false },
      { date: "2026-05-11", time: "04:00 PM", booked: false },
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
      { date: "2026-05-10", time: "08:00 AM", booked: false },
      { date: "2026-05-10", time: "12:00 PM", booked: false },
      { date: "2026-05-11", time: "11:00 AM", booked: false },
      { date: "2026-05-11", time: "05:00 PM", booked: false },
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
      { date: "2026-05-10", time: "11:00 AM", booked: false },
      { date: "2026-05-10", time: "03:00 PM", booked: false },
      { date: "2026-05-11", time: "09:00 AM", booked: false },
      { date: "2026-05-11", time: "02:00 PM", booked: false },
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
      { date: "2026-05-10", time: "10:00 AM", booked: false },
      { date: "2026-05-10", time: "04:00 PM", booked: false },
      { date: "2026-05-11", time: "01:00 PM", booked: false },
      { date: "2026-05-11", time: "03:00 PM", booked: false },
    ]
  }
];

db.set('experts', experts).write();
console.log('✅ Sample data added successfully!');
console.log(`Added ${experts.length} experts to the database.`);