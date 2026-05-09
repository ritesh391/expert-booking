import React, { useState } from 'react';
import axios from 'axios';

const API = 'https://expert-booking-in8u.onrender.com';

function MyBookings() {
  const [email, setEmail] = useState('');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const fetchBookings = async () => {
    if (!email.trim()) { setError('Please enter your email.'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`${API}/bookings`, { params: { email } });
      setBookings(res.data.data);
      setSearched(true);
    } catch (err) {
      setError('Failed to fetch bookings.');
    }
    setLoading(false);
  };

  const getStatusClass = status => {
    if (status === 'Pending') return 'status status-pending';
    if (status === 'Confirmed') return 'status status-confirmed';
    if (status === 'Completed') return 'status status-completed';
    return 'status';
  };

  return (
    <div>
      <h1 className="page-title">My Bookings</h1>

      <div className="search-bar" style={{maxWidth: '500px'}}>
        <input
          type="email"
          placeholder="Enter your email to find bookings..."
          value={email}
          onChange={e => setEmail(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && fetchBookings()}
        />
        <button className="btn btn-primary" onClick={fetchBookings}>
          Search
        </button>
      </div>

      {error && <div className="error" style={{marginTop: '10px'}}>{error}</div>}
      {loading && <div className="loading">Searching...</div>}

      {searched && !loading && (
        <div style={{marginTop: '20px'}}>
          {bookings.length === 0 ? (
            <p style={{color: '#666'}}>No bookings found for this email.</p>
          ) : (
            bookings.map(booking => (
              <div className="booking-card" key={booking.id}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <h3>{booking.expertName}</h3>
                  <span className={getStatusClass(booking.status)}>{booking.status}</span>
                </div>
                <p>📅 {booking.date} at {booking.timeSlot}</p>
                <p>👤 {booking.name}</p>
                <p>📧 {booking.email}</p>
                <p>📞 {booking.phone}</p>
                {booking.notes && <p>📝 {booking.notes}</p>}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default MyBookings;