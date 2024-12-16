import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ onLogout }) => {
  return (
    <nav className="navbar">
      <ul className="navbar-list">
        <li><Link to="/monday" className="navbar-link">Monday</Link></li>
        <li><Link to="/timetables" className="navbar-link">Time Tables</Link></li>
        <li><button onClick={onLogout} className="navbar-button">Logout</button></li>
      </ul>
    </nav>
  );
};

export default Navbar;
