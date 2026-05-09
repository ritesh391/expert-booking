import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="logo">ExpertBook</Link>
      <div>
        <Link to="/">Home</Link>
        <Link to="/my-bookings">My Bookings</Link>
      </div>
    </nav>
  );
}

export default Navbar;