const express = require('express');
const router = express.Router();

// In-memory storage for attendance
// Key: "periodIndex-groupIndex" => Value: "010101" etc.
let attendanceData = {};

router.post('/record', (req, res) => {
  const { periodIndex, groupIndex, attendance } = req.body;
  if (periodIndex === undefined || groupIndex === undefined || !attendance || attendance.length !== 6) {
    return res.status(400).json({ message: 'Invalid request data' });
  }

  // Convert [0,1,...] to a string '0101...'
  const attendanceString = attendance.join('');
  const key = `${periodIndex}-${groupIndex}`;
  attendanceData[key] = attendanceString;
  console.log(`Recorded attendance for ${key}: ${attendanceString}`);
  return res.json({ message: 'Attendance recorded', attendance: attendanceString });
});

router.get('/record', (req, res) => {
  res.json({ attendanceData });
});

module.exports = router;
