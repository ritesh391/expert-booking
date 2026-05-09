import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ExpertList from './pages/ExpertList';
import ExpertDetail from './pages/ExpertDetail';
import BookingForm from './pages/BookingForm';
import MyBookings from './pages/MyBookings';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<ExpertList />} />
          <Route path="/expert/:id" element={<ExpertDetail />} />
          <Route path="/book/:id" element={<BookingForm />} />
          <Route path="/my-bookings" element={<MyBookings />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
