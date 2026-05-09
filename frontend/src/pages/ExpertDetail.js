import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';

const API = 'https://expert-booking-in8u.onrender.com';
const socket = io(API);

function ExpertDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [expert, setExpert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);

  const fetchExpert = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/experts/${id}`);
      setExpert(res.data.data);
    } catch (err) {
      setError('Expert not found.');
    }
    setLoading(false);
  }, [id]);

  useEffect(() => {
    fetchExpert();

    socket.on('slotBooked', (data) => {
      if (data.expertId === id) {
        fetchExpert();
      }
    });

    return () => socket.off('slotBooked');
  }, [fetchExpert, id]);

  const groupedSlots = expert?.slots.reduce((acc, slot) => {
    if (!acc[slot.date]) acc[slot.date] = [];
    acc[slot.date].push(slot);
    return acc;
  }, {});

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div>
      <button className="btn btn-primary" style={{marginBottom: '20px'}} onClick={() => navigate('/')}>
        ← Back
      </button>

      <div className="expert-detail-card">
        <span className="badge">{expert.category}</span>
        <h1 style={{margin: '10px 0'}}>{expert.name}</h1>
        <p>⭐ <span className="rating">{expert.rating}</span> rating</p>
        <p>💼 {expert.experience} years experience</p>
        <p style={{marginTop: '10px', color: '#555'}}>{expert.bio}</p>
      </div>

      <h2 style={{marginBottom: '15px'}}>Available Slots</h2>
      <div className="slots-container">
        {Object.entries(groupedSlots).map(([date, slots]) => (
          <div key={date} className="date-group">
            <h4>📅 {date}</h4>
            <div className="slots-grid">
              {slots.map((slot, idx) => (
                <div
                  key={idx}
                  className={`slot ${slot.booked ? 'booked' : ''} ${selectedSlot?.date === date && selectedSlot?.time === slot.time ? 'selected' : ''}`}
                  onClick={() => {
                    if (!slot.booked) setSelectedSlot({ date, time: slot.time });
                  }}
                >
                  {slot.time} {slot.booked ? '(Booked)' : ''}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {selectedSlot && (
        <div style={{marginTop: '20px'}}>
          <p style={{marginBottom: '10px'}}>
            Selected: <strong>{selectedSlot.date} at {selectedSlot.time}</strong>
          </p>
          <button
            className="btn btn-success"
            onClick={() => navigate(`/book/${expert.id}`, { state: { selectedSlot, expert } })}
          >
            Book This Slot →
          </button>
        </div>
      )}
    </div>
  );
}

export default ExpertDetail;