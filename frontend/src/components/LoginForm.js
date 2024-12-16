import React, { useState } from 'react';
import axios from 'axios';

const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Make sure backend credentials match: username: lecturer, password: 1234
      const response = await axios.post('http://localhost:5000/auth/login', { username, password });
      localStorage.setItem('token', response.data.token);
      onLogin();
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Username:</label>
          <input 
            className="form-input" 
            value={username} 
            onChange={e => setUsername(e.target.value)} 
            placeholder="Enter your username"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Password:</label>
          <input 
            className="form-input" 
            type="password"
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            placeholder="Enter your password"
          />
        </div>
        {error && <p className="error-text">{error}</p>}
        <button className="login-button" type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginForm;
