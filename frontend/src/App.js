import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import MondayTimeTable from './components/MondayTimeTable';
import TimeTables from './components/TimeTables';
import Navbar from './components/Navbar';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  const handleLogin = () => {
    setIsLoggedIn(true);
  };
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <div>
      
        {isLoggedIn && <Navbar onLogout={handleLogout} />}
        <Routes>
          <Route path="/" element={isLoggedIn ? <Navigate to="/monday" /> : <LoginForm onLogin={handleLogin} />} />
          <Route path="/monday" element={isLoggedIn ? <MondayTimeTable /> : <Navigate to="/" />} />
          <Route path="/timetables" element={isLoggedIn ? <TimeTables /> : <Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
