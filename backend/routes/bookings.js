const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// POST /bookings - create a booking
router.post('/', (req, res) => {
  try {
    const db = req.app.get('db');
    const io = req.app.get('io');
    const { name, email, phone, expertId, date, timeSlot, notes } = req.body;

    // Validation
    if (!name || !email || !phone || !expertId || !date || !timeSlot) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required: name, email, phone, expertId, date, timeSlot' 
      });
    }

    // Find expert
    const expert = db.get('experts').find({ id: expertId }).value();
    if (!expert) {
      return res.status(404).json({ success: false, message: 'Expert not found' });
    }

    // Check if slot is already booked (prevent double booking)
    const existingBooking = db.get('bookings').find({
      expertId,
      date,
      timeSlot,
    }).value();

    if (existingBooking) {
      return res.status(400).json({ 
        success: false, 
        message: 'This slot is already booked. Please choose another slot.' 
      });
    }

    // Check slot availability in expert
    const slotIndex = expert.slots.findIndex(
      s => s.date === date && s.time === timeSlot && !s.booked
    );

    if (slotIndex === -1) {
      return res.status(400).json({ 
        success: false, 
        message: 'This slot is not available.' 
      });
    }

    // Create booking
    const booking = {
      id: uuidv4(),
      name,
      email,
      phone,
      expertId,
      expertName: expert.name,
      date,
      timeSlot,
      notes: notes || '',
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    // Save booking
    db.get('bookings').push(booking).write();

    // Mark slot as booked
    db.get('experts')
      .find({ id: expertId })
      .get('slots')
      .find({ date, time: timeSlot })
      .assign({ booked: true })
      .write();

    // Emit real-time update
    io.emit('slotBooked', { expertId, date, timeSlot });

    res.status(201).json({ 
      success: true, 
      message: 'Booking confirmed successfully!', 
      data: booking 
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /bookings?email= - get bookings by email
router.get('/', (req, res) => {
  try {
    const db = req.app.get('db');
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const bookings = db.get('bookings')
      .filter(b => b.email.toLowerCase() === email.toLowerCase())
      .value();

    res.json({ success: true, data: bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /bookings/:id/status - update booking status
router.patch('/:id/status', (req, res) => {
  try {
    const db = req.app.get('db');
    const { status } = req.body;

    const validStatuses = ['Pending', 'Confirmed', 'Completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Status must be Pending, Confirmed, or Completed' 
      });
    }

    const booking = db.get('bookings').find({ id: req.params.id }).value();
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    db.get('bookings')
      .find({ id: req.params.id })
      .assign({ status })
      .write();

    res.json({ success: true, message: 'Status updated!', data: { ...booking, status } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;