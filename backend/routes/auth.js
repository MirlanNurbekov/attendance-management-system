const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();
const USERNAME = "lecturer";
const PASSWORD = "1234";
const JWT_SECRET = "your_jwt_secret_key";

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === USERNAME && password === PASSWORD) {
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
    return res.json({ success: true, token });
  } else {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

module.exports = router;
