import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = 'https://expert-booking-in8u.onrender.com';

function BookingForm() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { selectedSlot, expert } = state || {};

  const [form, setForm] = useState({
    name: '', email: '', phone: '', notes: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (!form.name.trim()) return 'Name is required.';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) return 'Valid email is required.';
    if (!form.phone.trim() || form.phone.length < 10) return 'Valid phone number is required.';
    return null;
  };

  const handleSubmit = async () => {
    const err = validate();
    if (err) { setError(err); return; }

    setLoading(true);
    setError('');
    try {
      await axios.post(`${API}/bookings`, {
        name: form.name,
        email: form.email,
        phone: form.phone,
        notes: form.notes,
        expertId: expert.id,
        date: selectedSlot.date,
        timeSlot: selectedSlot.time,
      });
      setSuccess('🎉 Booking confirmed successfully!');
      setTimeout(() => navigate('/my-bookings'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed. Please try again.');
    }
    setLoading(false);
  };

  if (!state) return (
    <div className="error">
      No slot selected. <button className="btn btn-primary" onClick={() => navigate('/')}>Go Home</button>
    </div>
  );

  return (
    <div>
      <button className="btn btn-primary" style={{marginBottom: '20px'}} onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="form-card">
        <h2 style={{marginBottom: '5px'}}>Book a Session</h2>
        <p style={{color: '#666', marginBottom: '20px'}}>
          with <strong>{expert.name}</strong> on <strong>{selectedSlot.date}</strong> at <strong>{selectedSlot.time}</strong>
        </p>

        {error && <div className="error" style={{marginBottom: '15px', padding: '10px'}}>{error}</div>}
        {success && <div className="success-msg">{success}</div>}

        <div className="form-group">
          <label>Full Name *</label>
          <input name="name" placeholder="Enter your name" value={form.name} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Email *</label>
          <input name="email" type="email" placeholder="Enter your email" value={form.email} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Phone *</label>
          <input name="phone" placeholder="Enter your phone number" value={form.phone} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Notes (optional)</label>
          <textarea name="notes" placeholder="Any specific topics or questions?" value={form.notes} onChange={handleChange} />
        </div>

        <button className="btn btn-success" onClick={handleSubmit} disabled={loading} style={{width: '100%', padding: '12px'}}>
          {loading ? 'Booking...' : 'Confirm Booking'}
        </button>
      </div>
    </div>
  );
}

export default BookingForm;