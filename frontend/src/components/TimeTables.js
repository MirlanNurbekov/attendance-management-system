import React, { useEffect, useState } from 'react';
import axios from 'axios';

const groupNames = [
  "CS-11-24",
  "CS-12-24",
  "CS-13-24",
  "CS-14-24",
  "CS-15-24",
  "CS-16-24"
];

const periodNumbers = [1, 2];
const studentsPerGroup = 6;

const TimeTables = () => {
  const [attendanceData, setAttendanceData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:5000/attendance/record', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then((response) => {
        const { attendanceData } = response.data;
        setAttendanceData(attendanceData || {});
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching attendance:", err);
        setLoading(false);
      });
  }, []);

  const rows = [];
  for (const key in attendanceData) {
    const [periodIndexStr, groupIndexStr] = key.split('-');
    const periodIndex = parseInt(periodIndexStr, 10);
    const groupIndex = parseInt(groupIndexStr, 10);
    const attendanceString = attendanceData[key];
    if (attendanceString.length === studentsPerGroup) {
      for (let i = 0; i < studentsPerGroup; i++) {
        rows.push({
          periodIndex,
          groupIndex,
          studentIndex: i,
          present: attendanceString[i] === '1'
        });
      }
    }
  }

  rows.sort((a, b) => {
    if (a.periodIndex !== b.periodIndex) return a.periodIndex - b.periodIndex;
    return a.groupIndex - b.groupIndex;
  });

  return (
    <div className="timetables-container">
      <h2 className="timetables-title">Taken Attendance Overview</h2>
      {loading ? (
        <p>Loading attendance data...</p>
      ) : (
        rows.length === 0 ? (
          <p>No attendance records found.</p>
        ) : (
          <table className="timetables-table">
            <thead>
              <tr>
                <th>Day</th>
                <th>Period</th>
                <th>Group</th>
                <th>Student #</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr key={idx}>
                  <td>Monday</td>
                  <td>{periodNumbers[row.periodIndex]}</td>
                  <td>{groupNames[row.groupIndex]}</td>
                  <td>{`Student ${row.studentIndex+1}`}</td>
                  <td>{row.present ? "Present" : "Absent"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      )}
    </div>
  );
};

export default TimeTables;
